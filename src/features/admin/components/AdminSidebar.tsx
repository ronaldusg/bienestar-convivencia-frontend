import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export const AdminSidebar = () => {
  const location = useLocation();

  const navItems = [
    { label: 'Usuarios', href: '/admin/users', icon: Users },
    { label: 'Eventos', href: '/admin/events', icon: Calendar },
    { label: 'Recursos', href: '/admin/resources', icon: Heart },
  ];

  return (
    <aside className="hidden md:flex w-64 border-r bg-card">
      <nav className="flex flex-col gap-2 p-4 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
