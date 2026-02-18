'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Search, Shield, User, UserCheck, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import { MotionWrapper, StaggerContainer, FadeItem } from '@/components/MotionWrapper';
import { Input } from '@/components/ui/input';

interface UserData {
    id: string;
    email: string;
    role: 'user' | 'authenticator' | 'admin';
    created_at: string;
    last_sign_in_at: string | null;
}

export default function AdminPage() {
    const { user, role, loading: authLoading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    // Redirect if not admin
    useEffect(() => {
        if (!authLoading && role !== 'admin') {
            router.push('/dashboard');
        }
    }, [role, authLoading, router]);

    useEffect(() => {
        if (role === 'admin') {
            fetchUsers();
        }
    }, [role]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleUpdate = async (userId: string, newRole: 'user' | 'authenticator' | 'admin') => {
        if (!confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

        setUpdatingId(userId);
        try {
            const res = await fetch(`/api/admin/users/${userId}/role`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });

            const data = await res.json();

            if (data.success) {
                // Update local state and refetch to ensure consistency
                setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
                fetchUsers();
            } else {
                alert(`Failed: ${data.error}`);
            }
        } catch (err: any) {
            alert(`Error: ${err.message}`);
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.id.includes(search)
    );

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Shield className="w-3 h-3" /> Admin</span>;
            case 'authenticator':
                return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><UserCheck className="w-3 h-3" /> Authenticator</span>;
            default:
                return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><User className="w-3 h-3" /> User</span>;
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 pt-24">
            <div className="container mx-auto px-6">
                <MotionWrapper>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">User Management</h1>
                            <p className="text-slate-500">Manage user roles and permissions.</p>
                        </div>

                        <div className="relative w-full md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by email..."
                                className="pl-10 bg-white"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
                            {error}
                        </div>
                    )}

                    <GlassCard className="overflow-hidden border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-6 py-4 font-medium">User</th>
                                        <th className="px-6 py-4 font-medium">Role</th>
                                        <th className="px-6 py-4 font-medium">Joined</th>
                                        <th className="px-6 py-4 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-slate-900">{u.email}</div>
                                                    <div className="text-xs text-slate-400 font-mono mt-0.5">{u.id}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getRoleBadge(u.role)}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {new Date(u.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-end gap-2">
                                                        {u.id === user?.id ? (
                                                            <span className="text-xs text-slate-400 italic py-1 px-2">Current User</span>
                                                        ) : (
                                                            <>
                                                                {u.role !== 'user' && (
                                                                    <Button
                                                                        size="sm" variant="outline"
                                                                        className="h-8 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                                        onClick={() => handleRoleUpdate(u.id, 'user')}
                                                                        disabled={updatingId === u.id}
                                                                    >
                                                                        Demote
                                                                    </Button>
                                                                )}
                                                                {u.role !== 'authenticator' && (
                                                                    <Button
                                                                        size="sm" variant="outline"
                                                                        className="h-8 text-xs hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200"
                                                                        onClick={() => handleRoleUpdate(u.id, 'authenticator')}
                                                                        disabled={updatingId === u.id}
                                                                    >
                                                                        Make Authenticator
                                                                    </Button>
                                                                )}
                                                                {u.role !== 'admin' && (
                                                                    <Button
                                                                        size="sm" variant="outline"
                                                                        className="h-8 text-xs hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                                        onClick={() => handleRoleUpdate(u.id, 'admin')}
                                                                        disabled={updatingId === u.id}
                                                                    >
                                                                        Make Admin
                                                                    </Button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                </MotionWrapper>
            </div>
        </div>
    );
}
