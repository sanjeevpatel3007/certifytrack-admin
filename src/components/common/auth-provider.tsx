'use client'
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, type UserRole } from '@/action/auth.action';
import { useRouter, usePathname } from 'next/navigation';

interface User {
    id: string;
    email: string;
    role?: UserRole;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkUser = async () => {
            try {
                const { user } = await getCurrentUser();
                setUser(user);
                
                // Handle redirections based on auth state and current path
                if (user) {
                    // If user is not admin, redirect to home
                    if (user.role !== 'admin') {
                        router.push('/');
                    } 
                    // If admin is on home page, redirect to dashboard
                    else if (pathname === '/') {
                        router.push('/dashboard');
                    }
                } else {
                    // If no user and trying to access dashboard, redirect to home
                    if (pathname.startsWith('/dashboard')) {
                        router.push('/');
                    }
                }
            } catch (error) {
                console.error('Error checking auth state:', error);
                // On error, clear user state and redirect to home
                setUser(null);
                if (pathname.startsWith('/dashboard')) {
                    router.push('/');
                }
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, [pathname, router]);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 