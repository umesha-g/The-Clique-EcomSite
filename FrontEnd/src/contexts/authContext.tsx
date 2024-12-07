"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserResponse } from '@/api/admin/admin-user-api';
import {api} from "@/utils/apiConfig";
import { logout as logoutApi } from '@/api/auth-api';
import {useRouter} from "next/navigation";

interface AuthContextType {
    user: UserResponse | null;
    userLoading: boolean;
    updateUserContext: (updates: Partial<UserResponse>) => void;
    error: Error | null;
    logout: () => Promise<void>;
    isGuest: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserResponse | null>(null);
    const [userLoading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isGuest, setIsGuest] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    const checkAuthentication = () => {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith('isAuthenticated='))
            ?.split('=')[1] === 'true';
    };

    const updateUserContext = (updates: Partial<UserResponse>) => {
        if (user) {
            setUser(prevUser => ({
                ...prevUser!,
                ...updates
            }));
        }
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const isAuthenticated = checkAuthentication();
                console.log("Authentication status:", isAuthenticated);

                if (!isAuthenticated) {
                    console.log("No authentication detected");
                    setIsGuest(true);
                    setIsAdmin(false);
                    setLoading(false);
                    return;
                }

                const response = await api.get('/users');
                const userData = response.data;

                if (userData) {
                    setUser(userData);
                    setIsGuest(false);
                    setIsAdmin(userData.role === 'ADMIN');
                } else {
                    setIsGuest(true);
                    setIsAdmin(false);
                }
            } catch (err) {
                console.error("Error loading user:", err);
                setError(err as Error);
                setIsGuest(true);
                setIsAdmin(false);

                if ((err as any)?.response?.status === 401) {
                    await logout();
                }
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const logout = async () => {
        try {
            await logoutApi();
            setUser(null);
            setIsGuest(true);
            setIsAdmin(false);
            if(window.location.href.includes("/admin") || window.location.href.includes("/user")) {
                router.push('/home');
            }
        } catch (err) {
            console.error("Error during logout:", err);
            setError(err as Error);
        }
    };

    return (
        <AuthContext.Provider value={{updateUserContext, user, userLoading, error, logout, isGuest, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};