'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isSignin = mode === 'signin';

  return (
    <div
      className="login-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="nepkits-login-title"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section className="login-card">
        <button type="button" className="login-close" onClick={onClose} aria-label="Close login">
          ×
        </button>

        <div className="login-brand">
          <span aria-hidden="true">N</span>
          <div>
            <b>NEPKITS</b>
            <small>HUB / FOOTBALL NEPAL</small>
          </div>
        </div>

        <div className="login-kicker">
          {isSignin ? 'WELCOME BACK' : 'JOIN THE MATCHDAY'}
        </div>

        <h2 id="nepkits-login-title">
          {isSignin ? 'Sign in to NEPKITS' : 'Create your NEPKITS account'}
        </h2>

        <p className="login-sub">
          {isSignin
            ? 'Access your orders and keep checkout details ready for matchday.'
            : 'Create a profile to save checkout details and follow your orders.'}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label>
            Email address
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete={isSignin ? 'current-password' : 'new-password'}
              required
            />
          </label>

          <button className="login-submit" type="submit">
            {isSignin ? 'SIGN IN' : 'CREATE ACCOUNT'} →
          </button>
        </form>

        <div className="login-switch">
          {isSignin ? (
            <>
              <span>New to NEPKITS?</span>
              <button type="button" onClick={() => setMode('signup')}>
                Create account
              </button>
            </>
          ) : (
            <>
              <span>Already registered?</span>
              <button type="button" onClick={() => setMode('signin')}>
                Sign in
              </button>
            </>
          )}
        </div>

        <Link href="/shop" onClick={onClose} className="login-shop">
          Continue shopping →
        </Link>
      </section>
    </div>
  );
}
