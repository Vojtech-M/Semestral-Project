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

const API_BASE = 'http://localhost:8080';

document.addEventListener('DOMContentLoaded', () => {
    // Tab Switching
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

    const form = document.querySelector<HTMLFormElement>('#regForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const schoolSelect = document.querySelector<HTMLSelectElement>('#schoolSelect');
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
                } else {
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
