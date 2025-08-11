'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { FormControl, FormLabel, Select, MenuItem, TextField, Box, Stack, Typography, Alert, Snackbar } from '@mui/material';
import { UserProfile, fitnessLevelOptions, fitnessGoalOptions } from '@/types/profile';
import { profileService } from '@/services/profileService';

interface User {
  id: number;
  username: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileError, setProfileError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [profile, setProfile] = useState<UserProfile>({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }

    fetchUserProfile(token);
    fetchFitnessProfile(token);
  }, [router]);

  const fetchUserProfile = async (_token: string) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser({
        id: 1,
        username: 'demouser',
        email: 'demo@example.com',
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching profile');
      console.error('Error fetching profile:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchFitnessProfile = async (token: string) => {
    setProfileLoading(true);
    try {
      const userProfile = await profileService.getProfile(token);
      setProfile(userProfile);
    } catch (err: unknown) {
      if (!(err instanceof Error && err.message.includes('404'))) {
        setProfileError(err instanceof Error ? err.message : 'An error occurred while fetching fitness profile');
        console.error('Error fetching fitness profile:', err);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const name = e.target.name as string;
    const value = e.target.value as string;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setProfileLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/auth/login');
        return;
      }
      
      await profileService.saveProfile(token, profile);
      setProfileSuccess('Fitness profile updated successfully');
      setSnackbarOpen(true);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'An error occurred while updating fitness profile');
      console.error('Error updating fitness profile:', err);
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
      setSuccessMessage('Password changed successfully');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while changing password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Profile</h1>

        {isLoading && !user ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error && !user ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-error">{error}</div>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Username
                    </label>
                    <Input
                      type="text"
                      value={user?.username || ''}
                      disabled
                      className="bg-neutral-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Email
                    </label>
                    <Input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-neutral-50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fitness Profile</CardTitle>
                <CardDescription>Update your fitness information for personalized workout and diet plans</CardDescription>
              </CardHeader>
              <CardContent>
                {profileError && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {profileError}
                  </Alert>
                )}
                {profileSuccess && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {profileSuccess}
                  </Alert>
                )}
                <form onSubmit={handleProfileSubmit}>
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Physical Information</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                      <TextField
                        label="Height (cm)"
                        name="height"
                        type="number"
                        value={profile.height || ''}
                        onChange={handleProfileChange}
                        fullWidth
                      />
                      <TextField
                        label="Weight (kg)"
                        name="weight"
                        type="number"
                        value={profile.weight || ''}
                        onChange={handleProfileChange}
                        fullWidth
                      />
                      <TextField
                        label="Age"
                        name="age"
                        type="number"
                        value={profile.age || ''}
                        onChange={handleProfileChange}
                        fullWidth
                      />
                    </Stack>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Fitness Information</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                      <FormControl fullWidth>
                        <FormLabel>Fitness Level</FormLabel>
                        <Select
                          name="fitness_level"
                          value={profile.fitness_level || ''}
                          onChange={(e) => handleSelectChange(e as any)}
                        >
                          <MenuItem value="">Select a fitness level</MenuItem>
                          {fitnessLevelOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      
                      <FormControl fullWidth>
                        <FormLabel>Fitness Goal</FormLabel>
                        <Select
                          name="fitness_goal"
                          value={profile.fitness_goal || ''}
                          onChange={(e) => handleSelectChange(e as any)}
                        >
                          <MenuItem value="">Select a fitness goal</MenuItem>
                          {fitnessGoalOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </Box>
                  
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Preferences & Equipment</Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Dietary Preferences"
                        name="dietary_preferences"
                        value={profile.dietary_preferences || ''}
                        onChange={handleProfileChange}
                        fullWidth
                        placeholder="e.g., vegetarian, vegan, keto, etc. (comma-separated)"
                      />
                      <TextField
                        label="Workout Preferences"
                        name="workout_preferences"
                        value={profile.workout_preferences || ''}
                        onChange={handleProfileChange}
                        fullWidth
                        placeholder="e.g., cardio, strength, yoga, etc. (comma-separated)"
                      />
                      <TextField
                        label="Available Equipment"
                        name="available_equipment"
                        value={profile.available_equipment || ''}
                        onChange={handleProfileChange}
                        fullWidth
                        placeholder="e.g., dumbbells, barbell, resistance bands, etc. (comma-separated)"
                      />
                    </Stack>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Health Considerations</Typography>
                    <TextField
                      label="Health Conditions"
                      name="health_conditions"
                      value={profile.health_conditions || ''}
                      onChange={handleProfileChange}
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="e.g., back pain, knee issues, etc. (comma-separated)"
                    />
                  </Box>
                  
                  <Button type="submit" isLoading={profileLoading}>
                    Save Fitness Profile
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
                    {successMessage}
                  </div>
                )}
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-md text-sm">
                    {error}
                  </div>
                )}
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    placeholder="Enter your current password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmNewPassword"
                    placeholder="Confirm your new password"
                    value={formData.confirmNewPassword}
                    onChange={handleChange}
                    required
                  />
                  <Button type="submit" isLoading={isLoading}>
                    Change Password
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </CardContent>
            </Card>
            
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={6000}
              onClose={() => setSnackbarOpen(false)}
              message="Fitness profile updated successfully"
            />
          </>
        )}
      </div>
    </MainLayout>
  );
}
