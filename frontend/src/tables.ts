import { deleteRegistrationById, fetchRegistrations, fetchSchools, patchRegistrationStatus } from './api';
import { Registration, School } from './types';

function createCell(text: string | number): HTMLTableCellElement {
    const td = document.createElement('td');
    td.textContent = String(text);
    return td;
}

function createActionButton(
    label: string,
    className: string,
    dataset: Record<string, string>
): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = label;
    Object.assign(btn.dataset, dataset);
    return btn;
}

function buildSchoolRow(school: School): HTMLTableRowElement {
    const tr = document.createElement('tr');

    const websiteTd = document.createElement('td');
    if (school.website) {
        const link = document.createElement('a');
        link.href = school.website;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = school.website;
        websiteTd.appendChild(link);
    }

    tr.append(
        createCell(school.id),
        createCell(school.name),
        createCell(school.city || ''),
        createCell(school.adress || school.address || ''),
        websiteTd,
        createCell(school.approved ? 'Ano' : 'Ne')
    );

    return tr;
}

function buildRegistrationRow(reg: Registration): HTMLTableRowElement {
    const tr = document.createElement('tr');

    const teamName = reg.team?.name || reg.teamName || 'Neznámý tým';
    const schoolName = reg.team?.school?.name || reg.schoolName || 'Neznámá škola';
    const teacherDisplay = reg.teacherName
        ? `${reg.teacherName}${reg.teacherEmail ? ` (${reg.teacherEmail})` : ''}`
        : (reg.team?.teacherName || reg.teacherEmail || '-');

    const statusBadge = document.createElement('span');
    const statusText = reg.status || 'N/A';
    statusBadge.className = `badge ${reg.status?.toLowerCase() ?? ''}`.trim();
    statusBadge.textContent = statusText;
    const statusTd = document.createElement('td');
    statusTd.appendChild(statusBadge);

    const dateText = reg.registeredAt ? new Date(reg.registeredAt).toLocaleString() : 'N/A';

    const actionsTd = document.createElement('td');
    actionsTd.append(
        createActionButton('Schválit', 'btn-sm btn-success', {
            action: 'status',
            id: String(reg.id),
            status: 'VALID'
        }),
        createActionButton('Zamítnout', 'btn-sm btn-danger', {
            action: 'status',
            id: String(reg.id),
            status: 'EXPIRED'
        }),
        createActionButton('Smazat', 'btn-sm btn-danger', {
            action: 'delete',
            id: String(reg.id)
        })
    );

    tr.append(
        createCell(reg.id),
        createCell(teamName),
        createCell(schoolName),
        createCell(teacherDisplay),
        statusTd,
        createCell(dateText),
        actionsTd
    );

    return tr;
}

export async function loadSchoolsTable(): Promise<void> {
    const schoolTableBody = document.querySelector<HTMLTableSectionElement>('#schoolTable tbody');
    if (!schoolTableBody) return;

    try {
        const schools = await fetchSchools();
        schoolTableBody.replaceChildren(...schools.map(buildSchoolRow));
    } catch (err) {
        console.error('Chyba fetchování škol:', err);
    }
}

export async function loadRegistrations(): Promise<void> {
    const regTableBody = document.querySelector<HTMLTableSectionElement>('#regTable tbody');
    if (!regTableBody) return;

    try {
        const registrations = await fetchRegistrations();
        regTableBody.replaceChildren(...registrations.map(buildRegistrationRow));
    } catch (err) {
        console.error('Chyba fetchování registrací:', err);
    }
}

export function initRegistrationTableActions(): void {
    const regTableBody = document.querySelector<HTMLTableSectionElement>('#regTable tbody');
    if (!regTableBody) return;

    regTableBody.addEventListener('click', async (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-action]');
        if (!btn) return;

        const id = Number(btn.dataset.id);
        const action = btn.dataset.action;

        if (action === 'status') {
            const status = btn.dataset.status;
            if (!status) return;
            try {
                const res = await patchRegistrationStatus(id, status);
                if (res.ok) {
                    await loadRegistrations();
                } else {
                    alert('Chyba při změně stavu.');
                }
            } catch (err) {
                console.error(err);
            }
        } else if (action === 'delete') {
            if (!confirm('Opravdu chcete tuto registraci smazat?')) return;
            try {
                const res = await deleteRegistrationById(id);
                if (res.ok) {
                    await loadRegistrations();
                } else {
                    alert('Chyba při mazání registrace.');
                }
            } catch (err) {
                console.error(err);
            }
        }
    });
}