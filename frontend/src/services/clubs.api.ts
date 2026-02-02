import api from './api';

export interface Club {
    _id: string; // Mongoose ID
    id?: string; // For frontend compatibility if we map it
    name: string;
    description: string;
    cover: string;
    category: string;
    members: any[];
    currentBook: string;
    nextMeeting: string;
    isPrivate: boolean;
    createdAt: string;
}

export const getClubs = async (): Promise<Club[]> => {
    const response = await api.get('/clubs');
    return response.data;
};

export const createClub = async (data: Partial<Club>) => {
    const response = await api.post('/clubs', data);
    return response.data;
};

export const joinClub = async (id: string) => {
    const response = await api.post(`/clubs/${id}/join`);
    return response.data;
};

export const leaveClub = async (id: string) => {
    const response = await api.post(`/clubs/${id}/leave`);
    return response.data;
};
