import { API_BASE } from './state';
import { Registration, School, TeamPayload } from './types';

export interface SettingsDto {
    activeMode?: string;
    currentYear?: number;
}

export interface ApiTermDto {
    id: number;
    name: string;
}

export interface CreateRegistrationPayload extends TeamPayload {
    schoolId: number | null;
    schoolName: string;
    schoolAddress: string | null;
    schoolCity: string | null;
    schoolZip: string | null;
    schoolWebsite: string | null;
    teacherName: string | null;
    teacherEmail: string | null;
    teacherPhone: string | null;
}

export async function fetchSettings(): Promise<SettingsDto> {
    const res = await fetch(`${API_BASE}/api/admin/settings`);
    if (!res.ok) throw new Error('Chyba při načítání nastavení: ' + res.status);
    return res.json();
}

export async function updateSettings(activeMode: string | undefined): Promise<SettingsDto> {
    const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeMode })
    });
    if (!res.ok) throw new Error('Chyba ukládání: ' + res.status);
    return res.json();
}

export async function fetchTerms(): Promise<ApiTermDto[]> {
    const res = await fetch(`${API_BASE}/api/admin/terms`);
    if (!res.ok) throw new Error(String(res.status));
    return res.json();
}

export async function createTerm(name: string): Promise<Response> {
    return fetch(`${API_BASE}/api/admin/terms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
}

export async function deleteTermById(id: number): Promise<Response> {
    return fetch(`${API_BASE}/api/admin/terms/${id}`, { method: 'DELETE' });
}

export async function fetchSchools(): Promise<School[]> {
    const res = await fetch(`${API_BASE}/api/schools`);
    if (!res.ok) throw new Error('Chyba při načítání škol: ' + res.status);
    return res.json();
}

export async function fetchRegistrations(): Promise<Registration[]> {
    const res = await fetch(`${API_BASE}/api/registrations`);
    if (!res.ok) throw new Error('Chyba při načítání registrací: ' + res.status);
    return res.json();
}

export async function createRegistration(payload: CreateRegistrationPayload): Promise<Response> {
    return fetch(`${API_BASE}/api/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}

export async function patchRegistrationStatus(id: number, status: string): Promise<Response> {
    return fetch(`${API_BASE}/api/registrations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
}

export async function deleteRegistrationById(id: number): Promise<Response> {
    return fetch(`${API_BASE}/api/registrations/${id}`, { method: 'DELETE' });
}