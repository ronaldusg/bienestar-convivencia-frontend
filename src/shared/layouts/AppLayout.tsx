import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { AdminSidebar } from '@/features/admin/components/AdminSidebar';

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        {isAdminRoute && <AdminSidebar />}
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
};
