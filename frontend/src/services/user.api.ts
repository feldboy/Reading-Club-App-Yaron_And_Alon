import api from './api';

/**
 * User Profile interface
 */
export interface UserProfile {
    id: string;
    username: string;
    email: string;
    profileImage: string;
    bio?: string;
    favoriteGenres?: string[];
    authProvider: 'local' | 'google';
    createdAt: string;
    updatedAt: string;
}

/**
 * Get Profile Response
 */
export interface GetProfileResponse {
    status: string;
    success: boolean;
    data: {
        user: UserProfile;
    };
}

/**
 * Update Profile Request
 */
export interface UpdateProfileRequest {
    username?: string;
    bio?: string;
    favoriteGenres?: string[];
}

/**
 * Update Profile Response
 */
export interface UpdateProfileResponse {
    status: string;
    message: string;
    data: {
        user: UserProfile;
    };
}

/**
 * Upload Image Response
 */
export interface UploadImageResponse {
    status: string;
    message: string;
    data: {
        user: UserProfile;
        imageUrl: string;
    };
}

/**
 * Get current user profile
 */
export const getProfile = async (): Promise<UserProfile> => {
    const response = await api.get<GetProfileResponse>('/users/profile');
    return response.data.data.user;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.put<UpdateProfileResponse>('/users/profile', data);
    return response.data.data.user;
};

/**
 * Upload profile image
 */
export const uploadImage = async (file: File): Promise<UploadImageResponse['data']> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<UploadImageResponse>('/users/profile/image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.data;
};
