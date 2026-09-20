'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get('redirect');

  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const result = await login(email, password);
    if (result.success) {
      const user = useAuthStore.getState().user;
      const target = redirectParam || (user?.role === 'admin' ? '/admin' : '/orders');
      router.push(target);
    } else {
      setFormError(result.error);
    }
  };

  return (
    <Card elevated className="w-full max-w-md border border-border shadow-2xl p-6 sm:p-8">
      <CardHeader className="text-center pb-4 border-b border-border/50">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded bg-cyan/10 border border-cyan/30 text-cyan font-mono font-bold text-sm mx-auto mb-3">
          Os
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">ACCOUNT SIGN IN</CardTitle>
        <CardDescription className="text-xs text-secondary mt-1">
          Access your orders, saved addresses, and profile
        </CardDescription>
      </CardHeader>

      <CardContent className="py-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {formError && (
            <div className="p-3 bg-error/10 border border-error/30 rounded text-xs font-mono text-error">
              {formError}
            </div>
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} icon={ArrowRight} className="mt-2">
            SIGN IN
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 pt-4 border-t border-border/50 text-center">
        <p className="text-xs text-secondary font-mono">
          Don't have an OSMIUM account?{' '}
          <Link href="/register" className="text-cyan font-semibold hover:underline">
            CREATE ONE
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[75vh] py-8 px-4">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-cyan animate-spin" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
