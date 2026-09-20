'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { Lock, Mail, User as UserIcon } from 'lucide-react';

export const AuthModal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  const { login, register, isLoading } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (mode === 'login') {
      const result = await login(email, password);
      if (result.success) {
        onClose();
      } else {
        setFormError(result.error);
      }
    } else {
      const result = await register(name, email, password);
      if (result.success) {
        onClose();
      } else {
        setFormError(result.error);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'login' ? 'ACCOUNT LOGIN' : 'CREATE OSMIUM ACCOUNT'}
      subtitle={mode === 'login' ? 'Access your orders, addresses, and wishlist' : 'Join OSMIUM for curated commerce'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
        {formError && (
          <div className="p-3 bg-error/10 border border-error/30 rounded text-xs font-mono text-error">
            {formError}
          </div>
        )}

        {mode === 'register' && (
          <Input
            label="Full Name"
            placeholder="Enoch Abolude"
            icon={UserIcon}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

        <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="mt-2">
          {mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}
        </Button>

        <div className="pt-3 border-t border-border flex items-center justify-between text-xs font-mono text-secondary">
          <span>
            {mode === 'login' ? "Don't have an account?" : 'Already registered?'}
          </span>
          <button
            type="button"
            onClick={() => {
              setFormError('');
              setMode(mode === 'login' ? 'register' : 'login');
            }}
            className="text-cyan hover:underline"
          >
            {mode === 'login' ? 'CREATE ONE' : 'SIGN IN'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
