// Definice rozhraní podle předpokládané struktury JSONu z API
interface Registration {
    id: number;
    teamName: string;   // upravte název klíče podle vašeho API (např. team, team_name)
    school: string;
    status: string;
    createdAt: string;  // upravte název klíče podle vašeho API (např. date, datum)
}

// @ts-ignore
async function fetchRegistrations(): Promise<void> {
    const tableBody = document.querySelector<HTMLTableSectionElement>('#regTable tbody');
    if (!tableBody) return;

    try {
        const response = await fetch('http://localhost:8080/api/registrations');

        if (!response.ok) {
            throw new Error(`Chyba při načítání: ${response.statusText}`);
        }

        const data: Registration[] = await response.json();

        // Vyčištění stávajícího obsahu tabulky
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5">Zatím neexistují žádné registrace.</td></tr>';
            return;
        }

        // Vložení řádků do tabulky
        data.forEach((reg) => {
            const row = document.createElement('tr');

            // Formátování data do češtiny, pokud přichází jako ISO string
            const formattedDate = new Date(reg.createdAt).toLocaleDateString('cs-CZ');

            row.innerHTML = `
                <td>${reg.id}</td>
                <td>${escapeHtml(reg.teamName)}</td>
                <td>${escapeHtml(reg.school)}</td>
                <td><span class="status-badge status-${reg.status.toLowerCase()}">${escapeHtml(reg.status)}</span></td>
                <td>${formattedDate}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Errror fetching registrations:', error);
        tableBody.innerHTML = '<tr><td colspan="5" class="error">Nepodařilo se načíst data z serveru.</td></tr>';
    }
}

// Pomocná funkce proti XSS útokům při vkládání řetězců
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Spuštění po načtení DOMu
document.addEventListener('DOMContentLoaded', fetchRegistrations);