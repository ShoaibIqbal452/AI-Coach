import { UserProfile } from '@/types/profile';

const API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1`;

export const profileService = {
  async getProfile(token: string): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/profiles/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {};
      }
      throw new Error(`Error fetching profile: ${response.statusText}`);
    }

    return await response.json();
  },

  async createProfile(token: string, profileData: UserProfile): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/profiles/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error(`Error creating profile: ${response.statusText}`);
    }

    return await response.json();
  },

  async updateProfile(token: string, profileData: UserProfile): Promise<UserProfile> {
    const response = await fetch(`${API_URL}/profiles/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Error updating profile: ${errorData.detail || response.statusText}`);
    }

    return await response.json();
  },

  async saveProfile(token: string, profileData: UserProfile): Promise<UserProfile> {
    try {
      await this.getProfile(token);
      return await this.updateProfile(token, profileData);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return await this.createProfile(token, profileData);
      }
      throw error;
    }
  }
};
