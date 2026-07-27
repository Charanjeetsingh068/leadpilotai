import { DashboardLayout } from '@/layouts/DashboardLayout';

export default function DashboardLayoutGroup({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
