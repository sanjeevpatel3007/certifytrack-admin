//sign in action    

import { supabase } from "@/lib/supabase";

export type UserRole = 'admin' | 'user';

interface AuthResponse {
    user: {
        id: string;
        email: string;
        role?: UserRole;
    } | null;
    error: Error | null;
}

export async function signInAction(email: string, password: string): Promise<AuthResponse> {
    try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) throw authError;

        // Fetch user role from public.users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user?.id)
            .single();

        if (userError) throw userError;

        return {
            user: authData.user ? {
                id: authData.user.id,
                email: authData.user.email!,
                role: userData?.role as UserRole
            } : null,
            error: null
        };
    } catch (error) {
        return {
            user: null,
            error: error as Error
        };
    }
}

//sign up action

export async function signUpAction(email: string, password: string): Promise<AuthResponse> {
    try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) throw authError;

        if (authData.user) {
            // Insert into public.users table with admin role
            const { error: insertError } = await supabase
                .from('users')
                .insert([
                    {
                        id: authData.user.id,
                        full_name: email.split('@')[0], // Default name from email
                        role: 'admin'
                    }
                ]);

            if (insertError) throw insertError;
        }

        return {
            user: authData.user ? {
                id: authData.user.id,
                email: authData.user.email!,
                role: 'admin'
            } : null,
            error: null
        };
    } catch (error) {
        return {
            user: null,
            error: error as Error
        };
    }
}

//sign out action

export async function signOutAction() {
    return await supabase.auth.signOut();
}

//get user action

export async function getCurrentUser(): Promise<AuthResponse> {
    try {
        const { data: authData, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!authData.user) {
            return { user: null, error: null };
        }

        // Fetch user role from public.users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single();

        if (userError) throw userError;

        return {
            user: {
                id: authData.user.id,
                email: authData.user.email!,
                role: userData?.role as UserRole
            },
            error: null
        };
    } catch (error) {
        return {
            user: null,
            error: error as Error
        };
    }
}





