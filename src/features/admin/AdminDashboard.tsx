import { Link } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Heart, TrendingUp } from 'lucide-react';

import { useEffect, useState } from 'react';
import { usersService } from '@/shared/services/users.service';
import { eventsService } from '@/shared/services/events.service';
import { resourcesService } from '@/shared/services/resources.service';

async function fetchCount(url: string, signal?: AbortSignal): Promise<number> {

  const token = localStorage.getItem('token'); 
  const headers: any = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, { signal, headers });

  if (!res.ok) throw new Error(`Error ${res.status} en ${url}`);

  const ct = res.headers.get('content-type') || '';
  if (!ct.includes('application/json')) return 0;

  const totalHeader = res.headers.get('X-Total-Count');
  if (totalHeader) return Number(totalHeader);

  const data = await res.json();
  if (Array.isArray(data)) return data.length;
  if (typeof data?.total === 'number') return data.total;
  if (Array.isArray(data?.data)) return data.data.length;
  if (Array.isArray(data?.items)) return data.items.length;
  if (Array.isArray(data?.docs)) return data.docs.length;
  if (typeof data?.count === 'number') return data.count;

  return 0;
}

function countFromResp(resp: unknown): number {
  const r = resp as any;
  if (Array.isArray(r)) return r.length;
  if (typeof r?.total === 'number') return r.total;
  if (typeof r?.totalDocs === 'number') return r.totalDocs;
  if (Array.isArray(r?.data)) return r.data.length;
  if (Array.isArray(r?.items)) return r.items.length;
  if (Array.isArray(r?.docs)) return r.docs.length;
  return 0;
}

export const AdminDashboard = () => {

  const [stats, setStats] = useState([
    { label: 'Total Usuarios', value: '—', icon: Users, href: '/admin/users' },
    { label: 'Eventos Activos', value: '—', icon: Calendar, href: '/admin/events' },
    { label: 'Recursos', value: '—', icon: Heart, href: '/admin/resources' },
    { label: 'Actividad Mensual', value: '+23%', icon: TrendingUp, href: '#' },
  ]);

  useEffect(() => {
    const load = async () => {
      try {

        const [usersResp, eventsResp, resourcesResp] = await Promise.all([
          usersService.getAll(),
          eventsService.getAll(),
          resourcesService.getAll(),
        ]);

        const users = countFromResp(usersResp);
        const events = countFromResp(eventsResp);
        const resources = countFromResp(resourcesResp);

        setStats((prev) =>
          prev.map((s) => {
            if (s.label === 'Total Usuarios') return { ...s, value: users.toLocaleString() };
            if (s.label === 'Eventos Activos') return { ...s, value: events.toLocaleString() };
            if (s.label === 'Recursos') return { ...s, value: resources.toLocaleString() };
            return s;
          })
        );
      } catch (err) {
        console.error('Error cargando métricas:', err);
      }
    };
    load();
  }, []);

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
