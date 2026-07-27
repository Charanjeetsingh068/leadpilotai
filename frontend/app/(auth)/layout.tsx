import { AuthLayout } from '@/layouts/AuthLayout';

export default function AuthLayoutGroup({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
