import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/apiService';

interface User {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: string;
    updatedAt: string;
}

interface AuthContextType {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));

    useEffect(() => {
        const refreshAccessToken = async () => {
            if (!refreshToken) return;
            try {
                const response = await api.post('/sessions/refresh', {}, {
                    headers: {
                        'x-refresh': refreshToken
                    }
                });
                const newAccessToken = response.data.accessToken;
                setAccessToken(newAccessToken);
                localStorage.setItem('accessToken', newAccessToken);
                const userResponse = await api.get('/users/me', {
                    headers: {
                        Authorization: `Bearer ${newAccessToken}`,
                    },
                });
                setUser(userResponse.data);
                localStorage.setItem('user', JSON.stringify(userResponse.data));
            } catch (error) {
                console.error('Failed to refresh access token', error);
                logout();
            }
        };

        const interval = setInterval(refreshAccessToken, 15 * 60 * 1000);
        return () => clearInterval(interval);
    }, [refreshToken]);

    useEffect(() => {
        const fetchUser = async () => {
            if (accessToken) {
                try {
                    const userResponse = await api.get('/users/me', {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    });
                    setUser(userResponse.data);
                    localStorage.setItem('user', JSON.stringify(userResponse.data));
                } catch (error) {
                    console.error('Failed to fetch user', error);
                    logout();
                }
            }
        };

        fetchUser();
    }, [accessToken]);

    const login = async (email: string, password: string) => {
        try {
            const response = await api.post('/sessions', { email, password });
            setAccessToken(response.data.accessToken);
            setRefreshToken(response.data.refreshToken);
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);

            const userResponse = await api.get('/users/me', {
                headers: {
                    Authorization: `Bearer ${response.data.accessToken}`,
                },
            });
            setUser(userResponse.data);
            localStorage.setItem('user', JSON.stringify(userResponse.data));
        } catch (error) {
            throw new Error('Login failed');
        }
    };

    const logout = () => {
        setUser(null);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logout, isAuthenticated: !!accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};
