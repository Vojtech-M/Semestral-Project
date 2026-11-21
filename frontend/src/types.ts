export interface School {
    id: number;
    name: string;
    city?: string;
    adress?: string;
    address?: string;
    zip?: string;
    zipCode?: string;
    postalCode?: string;
    website?: string;
    approved?: boolean;
    schoolLevel?: string; // 'PRIMARY' | 'HIGH' | 'BOTH'
}

export interface Registration {
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

export interface TournamentTerm {
    id: number;
    label: string;
}

export interface TeamMemberPayload {
    userName: string;
    tshirtSize: string | null;
}

export interface TeamPayload {
    teamName: string;
    tournamentTermId: number;
    teamMembers: TeamMemberPayload[];
}