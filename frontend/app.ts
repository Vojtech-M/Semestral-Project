interface School {
    id: number;
    name: string;
    city?: string;
    adress?: string;
    address?: string;
    zip?: string;
    postalCode?: string;
    website?: string;
    approved?: boolean;
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
// Na začátek app.ts (vedle API_BASE)
const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

// Pomocná funkce pro vyhledávání bez ohledu na diakritiku a velikost písmen
function normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
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
            const addr = s.adress || s.address || '';
            const zip = s.zip || s.postalCode || '';
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
                const zip = school.zip || school.postalCode || '';
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
            approved: false
        };

        if (selectedSchoolIdInput) selectedSchoolIdInput.value = 'new';
        if (schoolSearchInput) schoolSearchInput.value = selectedSchoolObj.name;

        closeNewSchoolForm();
        updateSummary();
    });

    // Načtení škol při startu
    loadSchools();


    function initShirtSelects() {
        const selects = document.querySelectorAll<HTMLSelectElement>('.shirt-select');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Bez trička</option>';
            SHIRT_SIZES.forEach(size => {
                const opt = document.createElement('option');
                opt.value = size;
                opt.textContent = size;
                select.appendChild(opt);
            });
        });
    }
    initShirtSelects();

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

        const teamName = document.querySelector<HTMLInputElement>('#teamName')?.value.trim() || '–';

        const members = [
            document.querySelector<HTMLInputElement>('#member1')?.value.trim(),
            document.querySelector<HTMLInputElement>('#member2')?.value.trim(),
            document.querySelector<HTMLInputElement>('#member3')?.value.trim()
        ].filter(Boolean);

        const membersHtml = members.length > 0
            ? `<span class="summary-sub">Členové: ${members.join(', ')}</span>`
            : '';

        const termSelect = document.querySelector<HTMLSelectElement>('#termSelect');
        const termDisplay = (termSelect && !step3?.classList.contains('hidden'))
            ? termSelect.options[termSelect.selectedIndex].text
            : 'bez termínu';

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
            <div class="summary-item">
                <span class="summary-label">Tým 1</span>
                <span class="summary-value">${teamName}</span>
                ${membersHtml}
                <span class="summary-sub">${termDisplay}</span>
            </div>
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
        updateSummary();
    });

    backToStep2Btn?.addEventListener('click', () => {
        step3?.classList.add('hidden');
        step2?.classList.remove('hidden');
        updateSummary();
    });

    // 5. Odeslání formuláře (jednotný request pro školu z DB i novou školu)
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const teamNameInput = document.querySelector<HTMLInputElement>('#teamName');
            const teacherNameInput = document.querySelector<HTMLInputElement>('#teacherName');
            const teacherEmailInput = document.querySelector<HTMLInputElement>('#teacherEmail');
            const teacherPhoneInput = document.querySelector<HTMLInputElement>('#teacherPhone');
            const member1Input = document.querySelector<HTMLInputElement>('#member1');
            const shirt1Select = document.querySelector<HTMLSelectElement>('#shirt1');
            const member2Input = document.querySelector<HTMLInputElement>('#member2');
            const shirt2Select = document.querySelector<HTMLSelectElement>('#shirt2');
            const member3Input = document.querySelector<HTMLInputElement>('#member3');
            const shirt3Select = document.querySelector<HTMLSelectElement>('#shirt3');
            const termSelect = document.querySelector<HTMLSelectElement>('#termSelect');

            if (!selectedSchoolObj || !teamNameInput) return;

            const teamMembers = [
                { userName: member1Input?.value.trim(), tshirtSize: shirt1Select?.value || null },
                { userName: member2Input?.value.trim(), tshirtSize: shirt2Select?.value || null },
                { userName: member3Input?.value.trim(), tshirtSize: shirt3Select?.value || null }
            ].filter(m => m.userName);

            const isExistingSchool = selectedSchoolObj.id > 0;

            const data = {
                schoolId: isExistingSchool ? selectedSchoolObj.id : null,
                schoolName: selectedSchoolObj.name,
                schoolAddress: selectedSchoolObj.adress || selectedSchoolObj.address || null,
                schoolCity: selectedSchoolObj.city || null,
                schoolZip: selectedSchoolObj.zip || selectedSchoolObj.postalCode || null,
                schoolWebsite: selectedSchoolObj.website || null,

                teamName: teamNameInput.value.trim(),
                teacherName: teacherNameInput ? teacherNameInput.value.trim() : null,
                teacherEmail: teacherEmailInput ? teacherEmailInput.value.trim() : null,
                teacherPhone: teacherPhoneInput ? teacherPhoneInput.value.trim() : null,
                teamMembers: teamMembers,
                tournamentTermId: termSelect ? Number(termSelect.value) : 1
            };

            try {
                const response = await fetch(`${API_BASE}/api/registrations`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Registrace byla úspěšně odeslána!');
                    form.reset();
                    selectedSchoolObj = null;
                    if (selectedSchoolIdInput) selectedSchoolIdInput.value = '';
                    closeNewSchoolForm();
                    step3?.classList.add('hidden');
                    step2?.classList.add('hidden');
                    step1?.classList.remove('hidden');
                    updateSummary();
                } else {
                    const errText = await response.text();
                    console.error('Chyba serveru:', response.status, errText);
                    alert('Chyba při registraci.');
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
    if (info) {
        info.textContent = `V seznamu je ${allSchools.length} škol. Klikněte do pole nebo na šipku.`;
    }
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