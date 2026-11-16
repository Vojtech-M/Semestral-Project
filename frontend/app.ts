interface School {
    id: number;
    name: string;
    city?: string;
    adress?: string;
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

    loadSchools();

    // 2. Elementy pro vícekrokový formulář a živý souhrn
    const form = document.querySelector<HTMLFormElement>('#regForm');
    const step1 = document.querySelector<HTMLElement>('#step1');
    const step2 = document.querySelector<HTMLElement>('#step2');
    const step3 = document.querySelector<HTMLElement>('#step3');

    const schoolSelect = document.querySelector<HTMLSelectElement>('#schoolSelect');
    const teamCountInput = document.querySelector<HTMLInputElement>('#teamCount');
    const summaryText = document.querySelector<HTMLElement>('#summaryText');

    const toStep2Btn = document.querySelector<HTMLButtonElement>('#toStep2Btn');
    const backToStep1Btn = document.querySelector<HTMLButtonElement>('#backToStep1Btn');
    const toStep3Btn = document.querySelector<HTMLButtonElement>('#toStep3Btn');
    const backToStep2Btn = document.querySelector<HTMLButtonElement>('#backToStep2Btn');

    // Funkce pro aktualizaci boční karty "Vaše přihláška"
    function updateSummary() {
        if (!summaryText) return;

        // 1. Škola a počet týmů
        const selectedSchool = (schoolSelect && schoolSelect.value)
            ? schoolSelect.options[schoolSelect.selectedIndex].text
            : '–';

        const teamCount = (teamCountInput && teamCountInput.value)
            ? teamCountInput.value
            : '1';

        // 2. Učitel
        const teacherName = document.querySelector<HTMLInputElement>('#teacherName')?.value.trim();
        const teacherEmail = document.querySelector<HTMLInputElement>('#teacherEmail')?.value.trim();
        const teacherPhone = document.querySelector<HTMLInputElement>('#teacherPhone')?.value.trim();

        let teacherDisplay = '–';
        if (teacherName) {
            teacherDisplay = teacherName;
            if (teacherEmail) teacherDisplay += `<span class="summary-sub">${teacherEmail}</span>`;
            if (teacherPhone) teacherDisplay += `<span class="summary-sub">${teacherPhone}</span>`;
        }

        // 3. Tým, členové a termín
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

    // Živá aktualizace souhrnu při jakémkoliv psaní nebo změně výběru
    form?.addEventListener('input', updateSummary);
    form?.addEventListener('change', updateSummary);

    // Krok 1 -> Krok 2
    toStep2Btn?.addEventListener('click', () => {
        if (!schoolSelect || !teamCountInput) return;

        if (!schoolSelect.checkValidity()) {
            schoolSelect.reportValidity();
            return;
        }
        if (!teamCountInput.checkValidity()) {
            teamCountInput.reportValidity();
            return;
        }

        step1?.classList.add('hidden');
        step2?.classList.remove('hidden');
        updateSummary();
    });

    // Krok 2 -> Krok 1
    backToStep1Btn?.addEventListener('click', () => {
        step2?.classList.add('hidden');
        step1?.classList.remove('hidden');
        updateSummary();
    });

    // Krok 2 -> Krok 3
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

    // Krok 3 -> Krok 2
    backToStep2Btn?.addEventListener('click', () => {
        step3?.classList.add('hidden');
        step2?.classList.remove('hidden');
        updateSummary();
    });

    // 3. Odeslání formuláře
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const teamNameInput = document.querySelector<HTMLInputElement>('#teamName');
            const teacherNameInput = document.querySelector<HTMLInputElement>('#teacherName');
            const teacherEmailInput = document.querySelector<HTMLInputElement>('#teacherEmail');
            const teacherPhoneInput = document.querySelector<HTMLInputElement>('#teacherPhone');
            const member1Input = document.querySelector<HTMLInputElement>('#member1');
            const member2Input = document.querySelector<HTMLInputElement>('#member2');
            const member3Input = document.querySelector<HTMLInputElement>('#member3');
            const termSelect = document.querySelector<HTMLSelectElement>('#termSelect');

            if (!schoolSelect || !teamNameInput) return;

            const teamMembers = [
                member1Input?.value.trim(),
                member2Input?.value.trim(),
                member3Input?.value.trim()
            ].filter(Boolean);

            const data = {
                schoolId: schoolSelect.value ? Number(schoolSelect.value) : null,
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
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    alert('Registrace byla úspěšně odeslána!');
                    form.reset();
                    // Vrátit formulář zpět na Krok 1 a resetovat boční přehled
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

async function loadSchools() {
    const schoolSelect = document.querySelector<HTMLSelectElement>('#schoolSelect');
    if (!schoolSelect) return;

    try {
        const res = await fetch(`${API_BASE}/api/schools`);
        if (!res.ok) throw new Error('Chyba při načítání škol: ' + res.status);
        const schools: School[] = await res.json();

        schoolSelect.innerHTML = '<option value="">Vyberte školu z databáze...</option>';
        schools.forEach(s => {
            const opt = document.createElement('option');
            opt.value = s.id.toString();
            opt.textContent = s.city ? `${s.name} (${s.city})` : s.name;
            schoolSelect.appendChild(opt);
        });
    } catch (err) {
        console.error('Chyba fetchování škol:', err);
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
                <td>${s.adress || ''}</td>
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
            headers: {'Content-Type': 'application/json'},
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