'use client';

'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

import { api } from '@/lib/api';
import { Auth } from '@/lib/auth';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      const res = await api.post('/api/auth/login', { email, password });
      const token = res.data.token;

      Auth.save(token);

      const payload = Auth.decode();

      if (!payload || !payload.role) {
        Auth.clear();
        throw new Error('Invalid session data');
      }

      const role = String(payload.role).toLowerCase();

      if (role === 'admin') {
        router.push('/dashboard/admin');
      } else if (role === 'mentor') {
        router.push('/dashboard/mentor');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrap">
      <div className="card-surface mx-auto max-w-xl">
        <p className="text-xs uppercase tracking-[0.4em] text-tmMauve">Member Login</p>
        <h1 className="mt-2 text-4xl">Welcome back</h1>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full"
            placeholder="you@email.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full"
            placeholder="••••••••"
            required
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" className="btn-primary w-full text-center disabled:opacity-60" disabled={loading}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
        </form>
        <div className="mt-4 rounded-3xl border border-tmDust bg-white/60 p-4 text-sm text-tmCharcoal/80">
          <p className="font-semibold text-tmCharcoal">Testing accounts</p>
          <ul className="mt-2 space-y-1">
            <li>
              Admin → <span className="font-mono">admin@me.com / Karma</span>
            </li>
            <li>
              Mentor → <span className="font-mono">mentor@me.com / Karma</span>
            </li>
            <li>
              Member → <span className="font-mono">member@me.com / Karma</span>
            </li>
          </ul>
        </div>
        <div className="mt-6 text-sm text-tmCharcoal/80">
          <p>
            Need an invite?{' '}
            <Link href="/requestinvite" className="text-tmMauve underline">
              Request one here.
            </Link>
          </p>
          <p className="mt-2">
            Ready to complete onboarding?{' '}
            <Link href="/createprofile" className="text-tmMauve underline">
              Create Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
