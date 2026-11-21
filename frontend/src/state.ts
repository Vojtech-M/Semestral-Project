import { School, TournamentTerm } from './types';

export const API_BASE = '';
export const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const MODE_LABELS: Record<string, { subtitle: string; option: string }> = {
    HIGH: { subtitle: 'Přihláška pro střední školy', option: 'Střední školy' },
    PRIMARY: { subtitle: 'Přihláška pro základní školy', option: 'Základní školy' }
};

export let allSchools: School[] = [];
export let selectedSchoolObj: School | null = null;
export let systemMode = 'HIGH';
export let currentYear = new Date().getFullYear();

// Výchozí termíny – po načtení z API se přepíšou
export let TERMS: TournamentTerm[] = [
    { id: 1, label: '1. kolo 24.11.2026' },
    { id: 2, label: '2. kolo 25.11.2026' },
    { id: 3, label: '3. kolo 26.11.2026' },
    { id: 4, label: '4. kolo 27.11.2026' }
];

export function setAllSchools(schools: School[]): void {
    allSchools = schools;
}

export function setSelectedSchool(school: School | null): void {
    selectedSchoolObj = school;
}

export function setSystemMode(mode: string): void {
    systemMode = mode;
}

export function setCurrentYear(year: number): void {
    currentYear = year;
}

export function setTerms(terms: TournamentTerm[]): void {
    TERMS = terms;
}

// Vyhledávání bez ohledu na diakritiku a velikost písmen
export function normalizeText(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

// Sjednotí různé zápisy úrovně školy na 'HIGH' / 'PRIMARY' / 'BOTH'
export function normalizeLevel(level?: string | null): string | null {
    if (!level) return null;
    const l = level.toUpperCase();
    if (l.includes('BOTH')) return 'BOTH';
    if (l.includes('PRIMARY') || l.includes('ELEMENTARY') || l.includes('ZAKLAD')) return 'PRIMARY';
    if (l.includes('HIGH') || l.includes('SECONDARY') || l.includes('STRED')) return 'HIGH';
    return null;
}

export function schoolMatchesMode(s: School): boolean {
    const level = normalizeLevel(s.schoolLevel);
    const mode = normalizeLevel(systemMode);
    return !level || level === 'BOTH' || !mode || level === mode;
}