'use client';

import React, { useState, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordSchema, ResetPasswordFormData } from '@/utils/validators/auth.schemas';
import { AuthService } from '@/services/auth.service';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error('Invalid or missing reset token.');
      return;
    }

    setIsLoading(true);
    try {
      await AuthService.resetPassword({
        token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      toast.success('Password reset successfully!');
      router.push('/login');
    } catch {
      toast.error('Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Set New Password" subtitle="Enter your new password below">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="New Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirm New Password"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" variant="primary" isLoading={isLoading} style={{ width: '100%', marginTop: '1rem' }}>
          Reset Password
        </Button>
      </form>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '0 1rem' }}>
      <Suspense fallback={<div>Loading reset token...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
