import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { signInAction, signUpAction } from '@/action/auth.action';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { user, error } = isLogin
                ? await signInAction(email, password)
                : await signUpAction(email, password);

            if (error) {
                throw error;
            }

            if (user) {
                if (user.role !== 'admin') {
                    toast.error('Access denied. Admin only.');
                    return;
                }
                toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
                onClose();
                // Redirect to dashboard
                router.push('/dashboard');
                // Force a page refresh to ensure all auth states are updated
                router.refresh();
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500/50" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                </Dialog.Title>

                                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button
                                            type="button"
                                            className="text-sm text-indigo-600 hover:text-indigo-500"
                                            onClick={() => setIsLogin(!isLogin)}
                                        >
                                            {isLogin ? 'Need an account?' : 'Already have an account?'}
                                        </button>

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                                        >
                                            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                                        </button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
} 