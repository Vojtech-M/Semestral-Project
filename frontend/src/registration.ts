import { createRegistration, fetchSchools } from './api';
import {
    allSchools,
    normalizeText,
    schoolMatchesMode,
    selectedSchoolObj,
    setAllSchools,
    setSelectedSchool,
    SHIRT_SIZES,
    systemMode,
    TERMS
} from './state';
import { School, TeamPayload } from './types';

function updateSchoolCountText(): void {
    // Keep hook for future counter updates
    void document.querySelector<HTMLElement>('#schoolCountInfo');
}

export async function loadSchools(): Promise<void> {
    try {
        const schools = await fetchSchools();
        setAllSchools(schools);
        updateSchoolCountText();
    } catch (err) {
        console.error('Chyba fetchování škol:', err);
        const info = document.querySelector<HTMLElement>('#schoolCountInfo');
        if (info) info.textContent = 'Nepodařilo se načíst seznam škol.';
    }
}

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

export function initRegistrationForm(): void {
    const form = document.querySelector<HTMLFormElement>('#regForm');
    const step1 = document.querySelector<HTMLElement>('#step1');
    const step2 = document.querySelector<HTMLElement>('#step2');
    const step3 = document.querySelector<HTMLElement>('#step3');

    const teamCountInput = document.querySelector<HTMLInputElement>('#teamCount');
    const summaryText = document.querySelector<HTMLElement>('#summaryText');
    const teamsContainer = document.querySelector<HTMLElement>('#teamsContainer');

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

    function getTeamCount(): number {
        const raw = Number(teamCountInput?.value) || 1;
        return Math.min(Math.max(raw, 1), 10);
    }

    function renderTeamForms(): void {
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

    function updateSummary(): void {
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

    function openNewSchoolForm(): void {
        schoolSearchContainer?.classList.add('hidden');
        newSchoolBox?.classList.remove('hidden');
    }

    function closeNewSchoolForm(): void {
        newSchoolBox?.classList.add('hidden');
        schoolSearchContainer?.classList.remove('hidden');
    }

    function selectSchool(school: School): void {
        setSelectedSchool(school);
        if (selectedSchoolIdInput) selectedSchoolIdInput.value = school.id.toString();
        if (schoolSearchInput) schoolSearchInput.value = school.name;
        schoolDropdownList?.classList.add('hidden');
        updateSummary();
    }

    function renderSchoolDropdown(filterQuery = ''): void {
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
                item.addEventListener('click', () => selectSchool(school));
                schoolDropdownList.appendChild(item);
            });
        }

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

    // Combobox & new school listeners
    schoolSearchInput?.addEventListener('focus', () => renderSchoolDropdown(schoolSearchInput.value));
    schoolSearchInput?.addEventListener('input', () => {
        setSelectedSchool(null);
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

    document.addEventListener('click', (e) => {
        if (schoolCombobox && !schoolCombobox.contains(e.target as Node)) {
            schoolDropdownList?.classList.add('hidden');
        }
    });

    openNewSchoolBtn?.addEventListener('click', openNewSchoolForm);
    cancelNewSchoolBtn?.addEventListener('click', closeNewSchoolForm);

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

        const createdSchool: School = {
            id: 0,
            name: nameEl.value.trim(),
            website: webEl?.value.trim() || '',
            adress: addrEl.value.trim(),
            city: cityEl.value.trim(),
            zip: zipEl.value.trim(),
            approved: false,
            schoolLevel: systemMode
        };

        setSelectedSchool(createdSchool);
        if (selectedSchoolIdInput) selectedSchoolIdInput.value = 'new';
        if (schoolSearchInput) schoolSearchInput.value = createdSchool.name;

        closeNewSchoolForm();
        updateSummary();
    });

    // Summary live updates & step navigation
    form?.addEventListener('input', updateSummary);
    form?.addEventListener('change', updateSummary);

    document.querySelector<HTMLButtonElement>('#toStep2Btn')?.addEventListener('click', () => {
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

    document.querySelector<HTMLButtonElement>('#backToStep1Btn')?.addEventListener('click', () => {
        step2?.classList.add('hidden');
        step1?.classList.remove('hidden');
        updateSummary();
    });

    document.querySelector<HTMLButtonElement>('#toStep3Btn')?.addEventListener('click', () => {
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

    document.querySelector<HTMLButtonElement>('#backToStep2Btn')?.addEventListener('click', () => {
        step3?.classList.add('hidden');
        step2?.classList.remove('hidden');
        updateSummary();
    });

    // Submit: one registration per team
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedSchoolObj) return;

        const school = selectedSchoolObj;
        const teacherName = document.querySelector<HTMLInputElement>('#teacherName')?.value.trim() || null;
        const teacherEmail = document.querySelector<HTMLInputElement>('#teacherEmail')?.value.trim() || null;
        const teacherPhone = document.querySelector<HTMLInputElement>('#teacherPhone')?.value.trim() || null;

        const teams: TeamPayload[] = Array.from(document.querySelectorAll<HTMLElement>('.team-card')).map(card => ({
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
                const response = await createRegistration({
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
                });

                if (!response.ok) {
                    failed++;
                    console.error('Chyba serveru:', response.status, await response.text());
                    continue;
                }

                if (schoolId === null) {
                    await loadSchools();
                    const found = allSchools.find(s => normalizeText(s.name) === normalizeText(school.name));
                    if (found) schoolId = found.id;
                }
            }

            if (failed === 0) {
                alert(`Registrace byla úspěšně odeslána (týmů: ${teams.length})!`);
                form.reset();
                setSelectedSchool(null);
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