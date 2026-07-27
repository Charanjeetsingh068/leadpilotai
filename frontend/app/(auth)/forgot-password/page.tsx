'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@/utils/validators/auth.schemas';
import { AuthService } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      await AuthService.forgotPassword(data);
      setIsSubmitted(true);
      toast.success('Password reset instructions sent!');
    } catch {
      toast.error('Failed to process request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '0 1rem' }}>
      <Card title="Reset Password" subtitle="Enter your email to receive reset instructions">
        {isSubmitted ? (
          <div>
            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
              If an account exists for that email, we have sent instructions to reset your password.
            </p>
            <a href="/login" className="btn btn-outline" style={{ display: 'block', textAlign: 'center' }}>
              Return to Login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email Address"
              type="email"
              placeholder="admin@organization.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
              Send Reset Link
            </Button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <a href="/login" style={{ fontSize: '0.875rem', color: 'var(--color-primary-600)' }}>
                Back to Sign In
              </a>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
