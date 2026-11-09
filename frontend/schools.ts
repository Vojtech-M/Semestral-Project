// Definice rozhraní podle struktury JSONu z /api/schools
interface School {
    id: number;
    name: string;      // Název školy (upravte podle vašeho API)
    city: string;      // Město, kde se škola nachází
    teamCount?: number; // Volitelné: pokud API vrací počet registrovaných týmů
}

// @ts-ignore
async function fetchSchools(): Promise<void> {
    const tableBody = document.querySelector<HTMLTableSectionElement>('#schoolTable tbody');
    if (!tableBody) return;

    try {
        const response = await fetch('http://localhost:8080/api/schools');

        if (!response.ok) {
            throw new Error(`Chyba při načítání: ${response.statusText}`);
        }

        const data: School[] = await response.json();

        // Vyčištění stávajícího obsahu tabulky
        tableBody.innerHTML = '';

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">Zatím neexistují žádné školy.</td></tr>';
            return;
        }

        // Vložení řádků do tabulky
        data.forEach((school) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${school.id}</td>
                <td>${escapeHtml(school.name)}</td>
                <td>${escapeHtml(school.city)}</td>
                <td>${school.teamCount ?? '-'}</td>
            `;

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error fetching schools:', error);
        tableBody.innerHTML = '<tr><td colspan="4" class="error">Nepodařilo se načíst data ze serveru.</td></tr>';
    }
}

// Pomocná funkce proti XSS útokům
function escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Spuštění po načtení DOMu
document.addEventListener('DOMContentLoaded', fetchSchools);