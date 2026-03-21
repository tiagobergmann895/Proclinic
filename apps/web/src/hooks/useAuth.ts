import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { api } from '@/lib/api';

export function useAuth() {
    const [user, setUser] = useState<any>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get('proclinic.token');
        if (!token) {
            router.push('/');
            return;
        }

        api.get('/auth/me')
            .then(res => setUser(res.data))
            .catch(() => {
                Cookies.remove('proclinic.token');
                router.push('/');
            })
            .finally(() => setAuthLoading(false));
    }, [router]);

    const logout = () => {
        Cookies.remove('proclinic.token');
        router.push('/');
    };

    return { user, authLoading, logout };
}
