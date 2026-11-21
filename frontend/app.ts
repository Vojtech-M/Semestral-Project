interface School {
    id: number;
    name: string;
    city?: string;
    adress?: string;
    address?: string;
    zip?: string;
    zipCode?: string;
    postalCode?: string;
    website?: string;
    approved?: boolean;
    schoolLevel?: string; // 'PRIMARY' | 'HIGH' | 'BOTH'
}

interface Registration {
    id: number;
    team?: {
        name?: string;
        teacherName?: string;
        school?: {
            name?: string;
        };
    };
    teamName?: string;
    schoolName?: string;
    teacherName?: string;
    teacherEmail?: string;
    teacherPhone?: string;
    status?: string;
    registeredAt?: string;
}

const API_BASE = '';
let allSchools: School[] = [];
let selectedSchoolObj: School | null = null;
const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// Výchozí termíny – po načtení z API se přepíšou
let TERMS: { id: number; label: string }[] = [
    { id: 1, label: '1. kolo 24.11.2026' },
    { id: 2, label: '2. kolo 25.11.2026' },
    { id: 3, label: '3. kolo 26.11.2026' },
    { id: 4, label: '4. kolo 27.11.2026' }
];

let systemMode = 'HIGH';
let currentYear = new Date().getFullYear();

const MODE_LABELS: Record<string, { subtitle: string; option: string }> = {
    HIGH:    { subtitle: 'Přihláška pro střední školy', option: 'Střední školy' },
    PRIMARY: { subtitle: 'Přihláška pro základní školy', option: 'Základní školy' }
};

// Pomocná funkce pro vyhledávání bez ohledu na diakritiku a velikost písmen
function normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Sjednotí různé zápisy úrovně školy na 'HIGH' / 'PRIMARY' / 'BOTH'
function normalizeLevel(level?: string | null): string | null {
    if (!level) return null;
    const l = level.toUpperCase();
    if (l.includes('BOTH')) return 'BOTH';
    if (l.includes('PRIMARY') || l.includes('ELEMENTARY') || l.includes('ZAKLAD')) return 'PRIMARY';
    if (l.includes('HIGH') || l.includes('SECONDARY') || l.includes('STRED')) return 'HIGH';
    return null;
}

function schoolMatchesMode(s: School): boolean {
    const level = normalizeLevel(s.schoolLevel);
    const mode = normalizeLevel(systemMode);
    return !level || level === 'BOTH' || !mode || level === mode;
}

// ===== Nastavení systému (režim, rok) =====

// Propíše aktuální režim a rok do UI (žlutý podtitul + admin formulář)
function applyModeToUi() {
    const subtitle = document.querySelector<HTMLElement>('#appTitleSubtitle');
    if (subtitle) {
        subtitle.textContent = (MODE_LABELS[systemMode] || MODE_LABELS.HIGH).subtitle;
    }
    const modeSelect = document.querySelector<HTMLSelectElement>('#adminModeSelect');
    if (modeSelect) modeSelect.value = systemMode;
    const yearInput = document.querySelector<HTMLInputElement>('#adminYearInput');
    if (yearInput) yearInput.value = String(currentYear);
}

async function loadSettings() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/settings`);
        if (!res.ok) throw new Error('Chyba při načítání nastavení: ' + res.status);
        const s = await res.json();
        if (s.activeMode) systemMode = normalizeLevel(s.activeMode) || s.activeMode;
        if (s.currentYear) currentYear = s.currentYear;
        applyModeToUi();
    } catch (err) {
        console.error('Chyba fetchování nastavení:', err);
    }
}

async function saveSettings() {
    const modeSelect = document.querySelector<HTMLSelectElement>('#adminModeSelect');
    try {
        const res = await fetch(`${API_BASE}/api/admin/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                activeMode: modeSelect?.value,
            })
        });
        if (!res.ok) throw new Error('Chyba ukládání: ' + res.status);
        const s = await res.json();
        systemMode = normalizeLevel(s.activeMode) || s.activeMode;
        applyModeToUi();
        alert('Nastavení bylo uloženo.');
    } catch (err) {
        console.error(err);
        alert('Nastavení se nepodařilo uložit.');
    }
}

// ===== Turnajové termíny =====

async function loadTerms() {
    try {
        const res = await fetch(`${API_BASE}/api/admin/terms`);
        if (!res.ok) throw new Error(String(res.status));
        const terms: { id: number; name: string }[] = await res.json();
        TERMS = terms.map(t => ({ id: t.id, label: t.name }));

        const tbody = document.querySelector<HTMLTableSectionElement>('#adminTermsTable tbody');
        if (tbody) {
            tbody.innerHTML = terms.map(t => `
                <tr>
                    <td style="padding:0.5rem">${t.id}</td>
                    <td style="padding:0.5rem">${t.name}</td>
                    <td style="padding:0.5rem">
                        <button class="btn-sm btn-danger" onclick="deleteTerm(${t.id})">Smazat</button>
                    </td>
                </tr>`).join('');
        }
    } catch (err) {
        console.error('Chyba fetchování termínů:', err);
    }
}

(window as any).deleteTerm = async function(id: number) {
    if (!confirm('Smazat termín?')) return;
    try {
        const res = await fetch(`${API_BASE}/api/admin/terms/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadTerms();
        } else {
            alert('Termín nelze smazat.');
        }
    } catch (e) {
        console.error(e);
    }
};

async function addTerm() {
    const input = document.querySelector<HTMLInputElement>('#newTermNameInput');
    const name = input?.value.trim();
    if (!name) return;
    try {
        const res = await fetch(`${API_BASE}/api/admin/terms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            if (input) input.value = '';
            loadTerms();
        } else {
            alert('Termín se nepodařilo přidat.');
        }
    } catch (e) {
        console.error(e);
        alert('Termín se nepodařilo přidat.');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Přepínání záložek (Tab Switching)
    const tabButtons = document.querySelectorAll('.tabs button');
    const sections = document.querySelectorAll('.app-section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    (sec as HTMLElement).style.display = 'block';
                    if (targetId === 'section-regs') loadRegistrations();
                    if (targetId === 'section-schools') loadSchoolsTable();
                    if (targetId === 'section-admin') {
                        loadSettings();
                        loadTerms();
                    }
                } else {
                    (sec as HTMLElement).style.display = 'none';
                }
            });
        });
    });

    // 2. Elementy formuláře
    const form = document.querySelector<HTMLFormElement>('#regForm');
    const step1 = document.querySelector<HTMLElement>('#step1');
    const step2 = document.querySelector<HTMLElement>('#step2');
    const step3 = document.querySelector<HTMLElement>('#step3');

    const teamCountInput = document.querySelector<HTMLInputElement>('#teamCount');
    const summaryText = document.querySelector<HTMLElement>('#summaryText');
    const teamsContainer = document.querySelector<HTMLElement>('#teamsContainer');

    // Elementy pro vyhledávání školy a přidání nové
    const schoolSearchContainer = document.querySelector<HTMLElement>('#schoolSearchContainer');
    const schoolSearchInput = document.querySelector<HTMLInputElement>('#schoolSearchInput');
    const selectedSchoolIdInput = document.querySelector<HTMLInputElement>('#selectedSchoolId');
    const schoolDropdownToggle = document.querySelector<HTMLButtonElement>('#schoolDropdownToggle');
    const schoolDropdownList = document.querySelector<HTMLElement>('#schoolDropdownList');
    const schoolCombobox = document.querySelector<HTMLElement>('#schoolCombobox');

    const newSchoolBox = document.querySelector<HTMLElement>('#newSchoolBox');
    const openNewSchoolBtn = document.querySelector<HTMLButtonElement>('#openNewSchoolBtn');
    const saveNewSchoolBtn = document.querySelector<HTMLButtonElement>('#saveNewSchoolBtn');
    const cancelNewSchoolBtn = document.querySelector<HTMLButtonElement>('#cancelNewSchoolBtn');

    // Vykreslení výsledků v dropdownu
    function renderSchoolDropdown(filterQuery: string = '') {
        if (!schoolDropdownList) return;

        const q = normalizeText(filterQuery.trim());
        const filtered = allSchools.filter(s => {
            if (!schoolMatchesMode(s)) return false;

            const addr = s.adress || s.address || '';
            const zip = s.zipCode || s.zip || s.postalCode || '';
            const city = s.city || '';
            const fullString = normalizeText(`${s.name} ${addr} ${zip} ${city}`);
            return fullString.includes(q);
        });

        schoolDropdownList.innerHTML = '';

        if (filtered.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'combobox-item';
            emptyDiv.innerHTML = `<span class="combobox-item-sub">Žádná škola neodpovídá hledání „${filterQuery}“.</span>`;
            schoolDropdownList.appendChild(emptyDiv);
        } else {
            filtered.forEach(school => {
                const item = document.createElement('div');
                item.className = 'combobox-item';

                const addr = school.adress || school.address || '';
                const zip = school.zipCode || school.zip || school.postalCode || '';
                const city = school.city || '';
                const subLine = [addr, [zip, city].filter(Boolean).join(' ')].filter(Boolean).join(', ');

                item.innerHTML = `
                    <div class="combobox-item-title">${school.name}</div>
                    ${subLine ? `<div class="combobox-item-sub">${subLine}</div>` : ''}
                `;

                item.addEventListener('click', () => {
                    selectSchool(school);
                });

                schoolDropdownList.appendChild(item);
            });
        }

        // Tlačítko pro přidání nové školy přímo na konci seznamu
        const addAction = document.createElement('div');
        addAction.className = 'combobox-add-action';
        addAction.textContent = '+ Škola není v seznamu? Přidat novou školu';
        addAction.addEventListener('click', () => {
            schoolDropdownList.classList.add('hidden');
            openNewSchoolForm();
        });
        schoolDropdownList.appendChild(addAction);

        schoolDropdownList.classList.remove('hidden');
    }

    function selectSchool(school: School) {
        selectedSchoolObj = school;
        if (selectedSchoolIdInput) selectedSchoolIdInput.value = school.id.toString();
        if (schoolSearchInput) schoolSearchInput.value = school.name;
        schoolDropdownList?.classList.add('hidden');
        updateSummary();
    }

    // Otevře čistý, nepředvyplněný formulář pro novou školu
    function openNewSchoolForm() {
        schoolSearchContainer?.classList.add('hidden');
        newSchoolBox?.classList.remove('hidden');
    }

    function closeNewSchoolForm() {
        newSchoolBox?.classList.add('hidden');
        schoolSearchContainer?.classList.remove('hidden');
    }

    // Události pro vyhledávací combobox
    schoolSearchInput?.addEventListener('focus', () => {
        renderSchoolDropdown(schoolSearchInput.value);
    });

    schoolSearchInput?.addEventListener('input', () => {
        selectedSchoolObj = null;
        if (selectedSchoolIdInput) selectedSchoolIdInput.value = '';
        renderSchoolDropdown(schoolSearchInput.value);
        updateSummary();
    });

    schoolDropdownToggle?.addEventListener('click', () => {
        if (schoolDropdownList?.classList.contains('hidden')) {
            renderSchoolDropdown('');
            schoolSearchInput?.focus();
        } else {
            schoolDropdownList?.classList.add('hidden');
        }
    });

    // Zavření dropdownu při kliknutí mimo
    document.addEventListener('click', (e) => {
        if (schoolCombobox && !schoolCombobox.contains(e.target as Node)) {
            schoolDropdownList?.classList.add('hidden');
        }
    });

    // Otevření a zavření podformuláře pro novou školu
    openNewSchoolBtn?.addEventListener('click', () => openNewSchoolForm());
    cancelNewSchoolBtn?.addEventListener('click', closeNewSchoolForm);

    // Uložení nové školy do stavu formuláře ("Použít tuto školu")
    saveNewSchoolBtn?.addEventListener('click', () => {
        const nameEl = document.querySelector<HTMLInputElement>('#newSchoolName');
        const webEl = document.querySelector<HTMLInputElement>('#newSchoolWeb');
        const addrEl = document.querySelector<HTMLInputElement>('#newSchoolAddress');
        const cityEl = document.querySelector<HTMLInputElement>('#newSchoolCity');
        const zipEl = document.querySelector<HTMLInputElement>('#newSchoolZip');

        if (!nameEl?.value.trim() || !addrEl?.value.trim() || !cityEl?.value.trim() || !zipEl?.value.trim()) {
            alert('Vyplňte prosím všechna povinná pole nové školy (Název, Ulice, Město, PSČ).');
            return;
        }

        // id: 0 označuje nově zadanou školu, která ještě není v DB
        selectedSchoolObj = {
            id: 0,
            name: nameEl.value.trim(),
            website: webEl?.value.trim() || '',
            adress: addrEl.value.trim(),
            city: cityEl.value.trim(),
            zip: zipEl.value.trim(),
            approved: false,
            schoolLevel: systemMode
        };

        if (selectedSchoolIdInput) selectedSchoolIdInput.value = 'new';
        if (schoolSearchInput) schoolSearchInput.value = selectedSchoolObj.name;

        closeNewSchoolForm();
        updateSummary();
    });

    // Načtení dat při startu
    loadSettings();
    loadTerms();
    loadSchools();

    // Tlačítka v Admin Dashboardu
    document.querySelector('#saveAdminSettingsBtn')?.addEventListener('click', saveSettings);
    document.querySelector('#addNewTermBtn')?.addEventListener('click', addTerm);

    // ===== Dynamické formuláře týmů (krok 3) =====
    function teamCardHtml(i: number): string {
        const shirtOptions = '<option value="">Bez trička</option>' +
            SHIRT_SIZES.map(s => `<option value="${s}">${s}</option>`).join('');

        const members = [1, 2, 3].map(n => `
            <div class="member-row">
                <input type="text" class="member-name" placeholder="Člen ${n}" required>
                <select class="shirt-select">${shirtOptions}</select>
            </div>`).join('');

        const terms = TERMS.map(t => `<option value="${t.id}">${t.label}</option>`).join('');

        return `
            <div class="team-card" data-team="${i}">
                <h4>Tým ${i + 1}</h4>
                <div class="field">
                    <label>Název týmu:</label>
                    <input type="text" class="team-name" placeholder="Zadejte název týmu (max 24 znaků)" maxlength="24" required>
                </div>
                <div class="field">
                    <label>Členové týmu <span class="opt">(velikost trička je nepovinná)</span></label>
                    ${members}
                </div>
                <div class="field">
                    <label>Termín turnaje:</label>
                    <select class="term-select">${terms}</select>
                </div>
            </div>`;
    }

    function getTeamCount(): number {
        const raw = Number(teamCountInput?.value) || 1;
        return Math.min(Math.max(raw, 1), 10);
    }

    // Přidá/odebere karty podle počtu týmů, už vyplněné zůstanou zachované
    function renderTeamForms() {
        if (!teamsContainer) return;
        const count = getTeamCount();

        let current = teamsContainer.querySelectorAll('.team-card').length;
        while (current > count) {
            teamsContainer.lastElementChild?.remove();
            current--;
        }
        while (current < count) {
            teamsContainer.insertAdjacentHTML('beforeend', teamCardHtml(current));
            current++;
        }
    }

    // 3. Aktualizace boční karty "Vaše přihláška"
    function updateSummary() {
        if (!summaryText) return;

        const selectedSchool = selectedSchoolObj ? selectedSchoolObj.name : '–';
        const teamCount = (teamCountInput && teamCountInput.value) ? teamCountInput.value : '1';

        const teacherName = document.querySelector<HTMLInputElement>('#teacherName')?.value.trim();
        const teacherEmail = document.querySelector<HTMLInputElement>('#teacherEmail')?.value.trim();
        const teacherPhone = document.querySelector<HTMLInputElement>('#teacherPhone')?.value.trim();

        let teacherDisplay = '–';
        if (teacherName) {
            teacherDisplay = teacherName;
            if (teacherEmail) teacherDisplay += `<span class="summary-sub">${teacherEmail}</span>`;
            if (teacherPhone) teacherDisplay += `<span class="summary-sub">${teacherPhone}</span>`;
        }

        const step3Visible = !step3?.classList.contains('hidden');
        const count = getTeamCount();
        const cards = document.querySelectorAll<HTMLElement>('.team-card');

        let teamsHtml = '';
        for (let i = 0; i < count; i++) {
            const card = cards[i];
            const name = card?.querySelector<HTMLInputElement>('.team-name')?.value.trim() || '–';
            const members = card
                ? Array.from(card.querySelectorAll<HTMLInputElement>('.member-name'))
                    .map(m => m.value.trim()).filter(Boolean)
                : [];
            const termSel = card?.querySelector<HTMLSelectElement>('.term-select');
            const term = (card && step3Visible && termSel && termSel.options.length > 0)
                ? termSel.options[termSel.selectedIndex].text
                : 'bez termínu';

            teamsHtml += `
                <div class="summary-item">
                    <span class="summary-label">Tým ${i + 1}</span>
                    <span class="summary-value">${name}</span>
                    ${members.length ? `<span class="summary-sub">Členové: ${members.join(', ')}</span>` : ''}
                    <span class="summary-sub">${term}</span>
                </div>`;
        }

        summaryText.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">Škola</span>
                <span class="summary-value">${selectedSchool}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Počet týmů</span>
                <span class="summary-value">${teamCount}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Učitel</span>
                <span class="summary-value">${teacherDisplay}</span>
            </div>
            ${teamsHtml}
        `;
    }

    form?.addEventListener('input', updateSummary);
    form?.addEventListener('change', updateSummary);

    // 4. Navigace mezi kroky
    const toStep2Btn = document.querySelector<HTMLButtonElement>('#toStep2Btn');
    const backToStep1Btn = document.querySelector<HTMLButtonElement>('#backToStep1Btn');
    const toStep3Btn = document.querySelector<HTMLButtonElement>('#toStep3Btn');
    const backToStep2Btn = document.querySelector<HTMLButtonElement>('#backToStep2Btn');

    toStep2Btn?.addEventListener('click', () => {
        if (!selectedSchoolObj || !selectedSchoolIdInput?.value) {
            alert('Vyberte prosím školu ze seznamu nebo přidejte novou.');
            schoolSearchInput?.focus();
            return;
        }
        if (teamCountInput && !teamCountInput.checkValidity()) {
            teamCountInput.reportValidity();
            return;
        }

        step1?.classList.add('hidden');
        step2?.classList.remove('hidden');
        updateSummary();
    });

    backToStep1Btn?.addEventListener('click', () => {
        step2?.classList.add('hidden');
        step1?.classList.remove('hidden');
        updateSummary();
    });

    toStep3Btn?.addEventListener('click', () => {
        const teacherName = document.querySelector<HTMLInputElement>('#teacherName');
        const teacherEmail = document.querySelector<HTMLInputElement>('#teacherEmail');

        if (teacherName && !teacherName.checkValidity()) {
            teacherName.reportValidity();
            return;
        }
        if (teacherEmail && !teacherEmail.checkValidity()) {
            teacherEmail.reportValidity();
            return;
        }

        step2?.classList.add('hidden');
        step3?.classList.remove('hidden');
        renderTeamForms();
        updateSummary();
    });

    backToStep2Btn?.addEventListener('click', () => {
        step3?.classList.add('hidden');
        step2?.classList.remove('hidden');
        updateSummary();
    });

    // 5. Odeslání formuláře – jedna registrace za každý tým
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const teacherName = document.querySelector<HTMLInputElement>('#teacherName')?.value.trim() || null;
            const teacherEmail = document.querySelector<HTMLInputElement>('#teacherEmail')?.value.trim() || null;
            const teacherPhone = document.querySelector<HTMLInputElement>('#teacherPhone')?.value.trim() || null;

            if (!selectedSchoolObj) return;
            const school = selectedSchoolObj;

            const teams = Array.from(document.querySelectorAll<HTMLElement>('.team-card')).map(card => ({
                teamName: card.querySelector<HTMLInputElement>('.team-name')!.value.trim(),
                tournamentTermId: Number(card.querySelector<HTMLSelectElement>('.term-select')!.value),
                teamMembers: Array.from(card.querySelectorAll<HTMLElement>('.member-row'))
                    .map(row => ({
                        userName: row.querySelector<HTMLInputElement>('.member-name')!.value.trim(),
                        tshirtSize: row.querySelector<HTMLSelectElement>('.shirt-select')!.value || null
                    }))
                    .filter(m => m.userName)
            }));

            let schoolId: number | null = school.id > 0 ? school.id : null;
            let failed = 0;

            try {
                for (const team of teams) {
                    const data = {
                        schoolId,
                        schoolName: school.name,
                        schoolAddress: school.adress || school.address || null,
                        schoolCity: school.city || null,
                        schoolZip: school.zipCode || school.zip || school.postalCode || null,
                        schoolWebsite: school.website || null,
                        teacherName,
                        teacherEmail,
                        teacherPhone,
                        ...team
                    };

                    const response = await fetch(`${API_BASE}/api/registrations`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                    });

                    if (!response.ok) {
                        failed++;
                        console.error('Chyba serveru:', response.status, await response.text());
                        continue;
                    }

                    // Nová škola se vytvořila první registrací – další týmy ji mají použít z DB
                    if (schoolId === null) {
                        await loadSchools();
                        const found = allSchools.find(s => normalizeText(s.name) === normalizeText(school.name));
                        if (found) schoolId = found.id;
                    }
                }

                if (failed === 0) {
                    alert(`Registrace byla úspěšně odeslána (týmů: ${teams.length})!`);
                    form.reset();
                    selectedSchoolObj = null;
                    if (selectedSchoolIdInput) selectedSchoolIdInput.value = '';
                    if (teamsContainer) teamsContainer.innerHTML = '';
                    closeNewSchoolForm();
                    step3?.classList.add('hidden');
                    step2?.classList.add('hidden');
                    step1?.classList.remove('hidden');
                    updateSummary();
                } else {
                    alert(`Některé registrace se nepodařilo odeslat (${failed} z ${teams.length}).`);
                }
            } catch (error) {
                console.error('Chyba sítě:', error);
                alert('Nepodařilo se připojit k serveru.');
            }
        });
    }
});

function updateSchoolCountText() {
    const info = document.querySelector<HTMLElement>('#schoolCountInfo');
    //if (info) {
    //    info.textContent = `V seznamu je ${allSchools.length} škol. Klikněte do pole nebo na šipku.`;
    //}
}

async function loadSchools() {
    try {
        const res = await fetch(`${API_BASE}/api/schools`);
        if (!res.ok) throw new Error('Chyba při načítání škol: ' + res.status);
        allSchools = await res.json();
        updateSchoolCountText();
    } catch (err) {
        console.error('Chyba fetchování škol:', err);
        const info = document.querySelector<HTMLElement>('#schoolCountInfo');
        if (info) info.textContent = 'Nepodařilo se načíst seznam škol.';
    }
}

async function loadSchoolsTable() {
    const schoolTableBody = document.querySelector<HTMLTableSectionElement>('#schoolTable tbody');
    if (!schoolTableBody) return;

    try {
        const res = await fetch(`${API_BASE}/api/schools`);
        if (!res.ok) throw new Error('Chyba při načítání škol: ' + res.status);
        const schools: School[] = await res.json();

        schoolTableBody.innerHTML = '';
        schools.forEach(s => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${s.id}</td>
                <td>${s.name}</td>
                <td>${s.city || ''}</td>
                <td>${s.adress || s.address || ''}</td>
                <td>${s.website ? `<a href="${s.website}" target="_blank">${s.website}</a>` : ''}</td>
                <td>${s.approved ? 'Ano' : 'Ne'}</td>
            `;
            schoolTableBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Chyba fetchování škol:', err);
    }
}

async function loadRegistrations() {
    const regTableBody = document.querySelector<HTMLTableSectionElement>('#regTable tbody');
    if (!regTableBody) return;

    try {
        const res = await fetch(`${API_BASE}/api/registrations`);
        if (!res.ok) throw new Error('Chyba při načítání registrací: ' + res.status);
        const registrations: Registration[] = await res.json();

        regTableBody.innerHTML = '';
        registrations.forEach(r => {
            const tr = document.createElement('tr');
            const teamName = r.team?.name || r.teamName || 'Neznámý tým';
            const schoolName = r.team?.school?.name || r.schoolName || 'Neznámá škola';
            const teacherDisplay = r.teacherName
                ? `${r.teacherName}${r.teacherEmail ? ' (' + r.teacherEmail + ')' : ''}`
                : (r.team?.teacherName || r.teacherEmail || '-');

            tr.innerHTML = `
                <td>${r.id}</td>
                <td>${teamName}</td>
                <td>${schoolName}</td>
                <td>${teacherDisplay}</td>
                <td><span class="badge ${r.status?.toLowerCase()}">${r.status || 'N/A'}</span></td>
                <td>${r.registeredAt ? new Date(r.registeredAt).toLocaleString() : 'N/A'}</td>
                <td>
                    <button class="btn-sm btn-success" onclick="updateStatus(${r.id}, 'VALID')">Schválit</button>
                    <button class="btn-sm btn-danger" onclick="updateStatus(${r.id}, 'EXPIRED')">Zamítnout</button>
                </td>
            `;
            regTableBody.appendChild(tr);
        });
    } catch (err) {
        console.error('Chyba fetchování registrací:', err);
    }
}

(window as any).updateStatus = async function(id: number, status: string) {
    try {
        const res = await fetch(`${API_BASE}/api/registrations/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if (res.ok) {
            loadRegistrations();
        } else {
            alert('Chyba při změně stavu.');
        }
    } catch (e) {
        console.error(e);
    }
};

(window as any).deleteRegistration = async function(id: number) {
    if (!confirm('Opravdu chcete tuto registraci smazat?')) return;
    try {
        const res = await fetch(`${API_BASE}/api/registrations/${id}`, {
            method: 'DELETE'
        });
        if (res.ok) {
            loadRegistrations();
        } else {
            alert('Chyba při mazání registrace.');
        }
    } catch (e) {
        console.error(e);
    }
};