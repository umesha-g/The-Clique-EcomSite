import React, { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import { ProfileSchema, PasswordSchema } from "./userValidationSchema";
import { updateUser } from '@/api/user-api';
import { useAuth } from '@/contexts/authContext';
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff } from 'lucide-react';
import ProfilePictureUploader from "./userProfileUpdater";

export const UserProfile: React.FC = () => {
    const { user, userLoading,updateUserContext } = useAuth();
    const [editProfile, setEditProfile] = useState(false);
    const [editPassword, setEditPassword] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        currentPassword: false,
        newPassword: false,
        confirmNewPassword: false
    });
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        userDPUrl: user?.userDPUrl || ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [profileErrors, setProfileErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        phoneNumber?: string;
    }>({});
    const [passwordErrors, setPasswordErrors] = useState<{
        currentPassword?: string;
        newPassword?: string;
        confirmNewPassword?: string;
    }>({});

    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber || '',
                userDPUrl: user.userDPUrl || ''
            });
        }
    }, [user]);

    const handleProfilePictureUpdate = (newPictureUrl: string) => {
        setProfileData(prev => ({
            ...prev,
            userDPUrl: newPictureUrl
        }));
        updateUserContext({ userDPUrl: newPictureUrl });
    };

    const validateProfile = () => {
        try {
            ProfileSchema.parse(profileData);
            setProfileErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMap: any = {};
                error.errors.forEach((err) => {
                    errorMap[err.path[0]] = err.message;
                });
                setProfileErrors(errorMap);
            }
            return false;
        }
    };

    const validatePassword = () => {
        try {
            PasswordSchema.parse(passwordData);
            setPasswordErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errorMap: any = {};
                error.errors.forEach((err) => {
                    errorMap[err.path[0]] = err.message;
                });
                setPasswordErrors(errorMap);
            }
            return false;
        }
    };

    const handleProfileUpdate = async () => {
        if (!validateProfile()) {
            toast({
                title: "Validation Error",
                description: "Please check your profile details",
                variant: "destructive"
            });
            return;
        }

        try {
            await updateUser(profileData);
            setEditProfile(false);
            toast({
                title: "Success",
                description: "Profile updated successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile"+error,
                variant: "destructive"
            });
        }
    };

    const handlePasswordUpdate = async () => {
        if (!validatePassword()) {
            toast({
                title: "Validation Error",
                description: "Please check your password details",
                variant: "destructive"
            });
            return;
        }

        try {
            await updateUser({
                ...profileData,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });
            setEditPassword(false);

            toast({
                title: "Success",
                description: "Password updated successfully"
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update password"+error,
                variant: "destructive"
            });
        }
    };

    const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const renderPasswordInput = (
        label: string,
        value: string,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
        error?: string,
        fieldName: keyof typeof passwordData = 'currentPassword'
    ) => (
        <div>
            <Label>{label}</Label>
            <div className="relative">
                <Input
                    type={showPasswords[fieldName] ? 'text' : 'password'}
                    value={value}
                    autoComplete={""}
                    onChange={onChange}
                    className={`rounded-none ${error ? 'border-red-500' : ''}`}
                />
                <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    onClick={() => togglePasswordVisibility(fieldName)}
                >
                    {showPasswords[fieldName] ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                </Button>
            </div>
            {error && (
                <p className="text-red-500 text-sm mt-1">
                    {error}
                </p>
            )}
        </div>
    );

    if (userLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <Card className="w-full rounded-none">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                        Manage your personal details
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className={"my-10 ml-5 justify-start flex"}>
                    <ProfilePictureUploader
                        currentPictureUrl={profileData.userDPUrl}
                        onPictureUpdate={handleProfilePictureUpdate}
                    />
                    </div>
                    {!editProfile ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>First Name</Label>
                                    <Input
                                        value={profileData.firstName}
                                        readOnly
                                        className="rounded-none bg-muted"
                                    />
                                </div>
                                <div>
                                    <Label>Last Name</Label>
                                    <Input
                                        value={profileData.lastName}
                                        readOnly
                                        className="rounded-none bg-muted"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    value={profileData.email}
                                    readOnly
                                    className="rounded-none bg-muted"
                                />
                            </div>
                            <div>
                                <Label>Phone Number</Label>
                                <Input
                                    value={profileData.phoneNumber}
                                    readOnly
                                    className="rounded-none bg-muted"
                                />
                            </div>
                            <Button
                                onClick={() => setEditProfile(true)}
                                className="rounded-none"
                            >
                                Edit Profile
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>First Name</Label>
                                    <Input
                                        value={profileData.firstName}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            firstName: e.target.value
                                        })}
                                        className={`rounded-none ${profileErrors.firstName ? 'border-red-500' : ''}`}
                                    />
                                    {profileErrors.firstName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.firstName}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <Label>Last Name</Label>
                                    <Input
                                        value={profileData.lastName}
                                        onChange={(e) => setProfileData({
                                            ...profileData,
                                            lastName: e.target.value
                                        })}
                                        className={`rounded-none ${profileErrors.lastName ? 'border-red-500' : ''}`}
                                    />
                                    {profileErrors.lastName && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {profileErrors.lastName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        email: e.target.value
                                    })}
                                    className={`rounded-none ${profileErrors.email ? 'border-red-500' : ''}`}
                                />
                                {profileErrors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {profileErrors.email}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label>Phone Number</Label>
                                <Input
                                    value={profileData.phoneNumber}
                                    onChange={(e) => setProfileData({
                                        ...profileData,
                                        phoneNumber: e.target.value
                                    })}
                                    className={`rounded-none ${profileErrors.phoneNumber ? 'border-red-500' : ''}`}
                                />
                                {profileErrors.phoneNumber && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {profileErrors.phoneNumber}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleProfileUpdate}
                                    className="rounded-none"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setEditProfile(false)}
                                    className="rounded-none"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="w-full rounded-none">
                <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>
                        Update your account password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!editPassword ? (
                        <Button
                            onClick={() => setEditPassword(true)}
                            className="rounded-none"
                        >
                            Change Password
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            {renderPasswordInput(
                                'Current Password',
                                passwordData.currentPassword,
                                (e) => setPasswordData({
                                    ...passwordData,
                                    currentPassword: e.target.value
                                }),
                                passwordErrors.currentPassword,
                                'currentPassword'
                            )}

                            {renderPasswordInput(
                                'New Password',
                                passwordData.newPassword,
                                (e) => setPasswordData({
                                    ...passwordData,
                                    newPassword: e.target.value
                                }),
                                passwordErrors.newPassword,
                                'newPassword'
                            )}

                            {renderPasswordInput(
                                'Confirm New Password',
                                passwordData.confirmNewPassword,
                                (e) => setPasswordData({
                                    ...passwordData,
                                    confirmNewPassword: e.target.value
                                }),
                                passwordErrors.confirmNewPassword,
                                'confirmNewPassword'
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handlePasswordUpdate}
                                    className="rounded-none"
                                >
                                    Update Password
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEditPassword(false);
                                        setPasswordData({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmNewPassword: ''
                                        });
                                    }}
                                    className="rounded-none"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};