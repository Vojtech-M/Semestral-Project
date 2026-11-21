import { createTerm, deleteTermById, fetchSettings, fetchTerms, updateSettings } from './api';
import {
    currentYear,
    MODE_LABELS,
    normalizeLevel,
    setCurrentYear,
    setSystemMode,
    setTerms,
    systemMode
} from './state';

export function applyModeToUi(): void {
    const subtitle = document.querySelector<HTMLElement>('#appTitleSubtitle');
    if (subtitle) {
        subtitle.textContent = (MODE_LABELS[systemMode] || MODE_LABELS.HIGH).subtitle;
    }
    const modeSelect = document.querySelector<HTMLSelectElement>('#adminModeSelect');
    if (modeSelect) modeSelect.value = systemMode;

    const yearInput = document.querySelector<HTMLInputElement>('#adminYearInput');
    if (yearInput) yearInput.value = String(currentYear);
}

export async function loadSettings(): Promise<void> {
    try {
        const s = await fetchSettings();
        if (s.activeMode) setSystemMode(normalizeLevel(s.activeMode) || s.activeMode);
        if (s.currentYear) setCurrentYear(s.currentYear);
        applyModeToUi();
    } catch (err) {
        console.error('Chyba fetchování nastavení:', err);
    }
}

export async function saveSettings(): Promise<void> {
    const modeSelect = document.querySelector<HTMLSelectElement>('#adminModeSelect');
    try {
        const s = await updateSettings(modeSelect?.value);
        if (s.activeMode) {
            setSystemMode(normalizeLevel(s.activeMode) || s.activeMode);
        }
        applyModeToUi();
        alert('Nastavení bylo uloženo.');
    } catch (err) {
        console.error(err);
        alert('Nastavení se nepodařilo uložit.');
    }
}

export async function loadTerms(): Promise<void> {
    try {
        const terms = await fetchTerms();
        setTerms(terms.map(t => ({ id: t.id, label: t.name })));

        const tbody = document.querySelector<HTMLTableSectionElement>('#adminTermsTable tbody');
        if (tbody) {
            tbody.innerHTML = terms.map(t => `
                <tr>
                    <td style="padding:0.5rem">${t.id}</td>
                    <td style="padding:0.5rem">${t.name}</td>
                    <td style="padding:0.5rem">
                        <button class="btn-sm btn-danger" data-delete-term="${t.id}">Smazat</button>
                    </td>
                </tr>`).join('');
        }
    } catch (err) {
        console.error('Chyba fetchování termínů:', err);
    }
}

export async function addTerm(): Promise<void> {
    const input = document.querySelector<HTMLInputElement>('#newTermNameInput');
    const name = input?.value.trim();
    if (!name) return;

    try {
        const res = await createTerm(name);
        if (res.ok) {
            if (input) input.value = '';
            await loadTerms();
        } else {
            alert('Termín se nepodařilo přidat.');
        }
    } catch (e) {
        console.error(e);
        alert('Termín se nepodařilo přidat.');
    }
}

export function initAdminEvents(): void {
    document.querySelector('#saveAdminSettingsBtn')?.addEventListener('click', saveSettings);
    document.querySelector('#addNewTermBtn')?.addEventListener('click', addTerm);

    // Event delegation instead of inline onclick + window global
    document.querySelector('#adminTermsTable tbody')?.addEventListener('click', async (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-delete-term]');
        if (!btn) return;

        const id = Number(btn.dataset.deleteTerm);
        if (!confirm('Smazat termín?')) return;

        try {
            const res = await deleteTermById(id);
            if (res.ok) {
                await loadTerms();
            } else {
                alert('Termín nelze smazat.');
            }
        } catch (err) {
            console.error(err);
        }
    });
}