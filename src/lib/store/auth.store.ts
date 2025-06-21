import { create } from 'zustand'
import { UserRole } from '@/action/auth.action'

interface User {
    id: string;
    email: string;
    role?: UserRole;
}

interface AuthState {
    user: User | null
    isLoading: boolean
    error: string | null
}

interface AuthActions {
    signIn: (email: string, password: string) => Promise<void>
}       

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
    user: null,
    isLoading: false,
    error: null,
    signIn: async (email, password) => {
        set({ isLoading: true, error: null })
    }
}))