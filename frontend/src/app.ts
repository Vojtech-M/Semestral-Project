import { initAdminEvents, loadSettings, loadTerms } from './admin';
import { initRegistrationForm, loadSchools } from './registration';
import { initRegistrationTableActions, loadRegistrations, loadSchoolsTable } from './tables';

function initTabs(): void {
    const tabButtons = document.querySelectorAll<HTMLElement>('.tabs button');
    const sections = document.querySelectorAll<HTMLElement>('.app-section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            sections.forEach(sec => {
                const isTarget = sec.id === targetId;
                sec.style.display = isTarget ? 'block' : 'none';

                if (isTarget) {
                    if (targetId === 'section-regs') loadRegistrations();
                    if (targetId === 'section-schools') loadSchoolsTable();
                    if (targetId === 'section-admin') {
                        loadSettings();
                        loadTerms();
                    }
                }
            });
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initRegistrationForm();
    initAdminEvents();
    initRegistrationTableActions();

    loadSettings();
    loadTerms();
    loadSchools();
});