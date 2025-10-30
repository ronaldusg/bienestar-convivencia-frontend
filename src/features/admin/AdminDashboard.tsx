import { Link } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Heart, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const stats = [
    { label: 'Total Usuarios', value: '1,250', icon: Users, href: '/admin/users' },
    { label: 'Eventos Activos', value: '24', icon: Calendar, href: '/admin/events' },
    { label: 'Recursos', value: '42', icon: Heart, href: '/admin/resources' },
    { label: 'Actividad Mensual', value: '+23%', icon: TrendingUp, href: '#' },
  ];

  return (
    <Container>
      <SectionHeader
        title="Panel de Administración"
        subtitle="Gestiona usuarios, eventos y recursos de la plataforma"
      />

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                {stat.href !== '#' && (
                  <Link to={stat.href}>
                    <Button variant="ghost" size="sm" className="w-full">
                      Ver detalles
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/admin/users">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Users className="h-8 w-8" />
                <span>Gestionar Usuarios</span>
              </Button>
            </Link>
            <Link to="/admin/events">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Calendar className="h-8 w-8" />
                <span>Gestionar Eventos</span>
              </Button>
            </Link>
            <Link to="/admin/resources">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                <Heart className="h-8 w-8" />
                <span>Gestionar Recursos</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};
