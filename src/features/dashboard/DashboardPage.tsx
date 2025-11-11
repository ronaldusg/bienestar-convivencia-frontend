import { Link } from 'react-router-dom';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Container } from '@/shared/components/Container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Users, MapPin, Heart, TrendingUp } from 'lucide-react';

import { useEffect, useState } from 'react';
import { eventsService } from '@/shared/services/events.service';
import { resourcesService } from '@/shared/services/resources.service';

import { usersService } from '@/shared/services/users.service';
import { routesService } from '@/shared/services/routes.service';

function toText(v: any, fallback = '—') {
  if (!v) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object') {
    return v.name ?? v.label ?? v.title ?? fallback;
  }
  return fallback;
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

export const DashboardPage = () => {
  const { user } = useAuth();

  // const upcomingEvents = [
  //   {
  //     id: '1',
  //     title: 'Torneo de Fútbol Interfacultades',
  //     date: '2025-11-05',
  //     location: 'Cancha Principal',
  //   },
  //   {
  //     id: '2',
  //     title: 'Charla: Salud Mental Universitaria',
  //     date: '2025-11-08',
  //     location: 'Auditorio Central',
  //   },
  //   {
  //     id: '3',
  //     title: 'Festival Cultural Internacional',
  //     date: '2025-11-12',
  //     location: 'Plaza Central',
  //   },
  // ];

  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [featuredResources, setFeaturedResources] = useState<any[]>([]);

  const [statsValues, setStatsValues] = useState({
    events: 0,
    users: 0,
    routes: 0,
    resources: 0,
  });

  // const stats = [
  //   { label: 'Eventos Activos', value: '24', icon: Calendar, color: 'text-primary' },
  //   { label: 'Miembros Comunidad', value: '1,250', icon: Users, color: 'text-primary' },
  //   { label: 'Rutas Disponibles', value: '18', icon: MapPin, color: 'text-primary' },
  //   { label: 'Recursos', value: '42', icon: Heart, color: 'text-primary' },
  // ];

  const stats = [
    { label: 'Eventos Activos', value: statsValues.events.toLocaleString(), icon: Calendar, color: 'text-primary' },
    { label: 'Miembros Comunidad', value: statsValues.users.toLocaleString(), icon: Users, color: 'text-primary' },
    { label: 'Rutas Disponibles', value: statsValues.routes.toLocaleString(), icon: MapPin, color: 'text-primary' },
    { label: 'Recursos', value: statsValues.resources.toLocaleString(), icon: Heart, color: 'text-primary' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const [evResp, resResp] = await Promise.all([
          // ajusta los nombres de filtros si tu API usa otros
          //eventsService.getAll?.({ visible: true, sort: 'date:asc', limit: 3 }) ?? eventsService.getAll(),
          eventsService.getAll?.({ visible: true, sort: 'date:asc', limit: 3 } as any) ?? eventsService.getAll(),
          //resourcesService.getAll?.({ visible: true, limit: 3 }) ?? resourcesService.getAll(),
          resourcesService.getAll?.({ visible: true, limit: 3 } as any) ?? resourcesService.getAll(),
        ]);

        const arr = (r: any) => Array.isArray(r) ? r : (r?.data ?? r?.items ?? r?.docs ?? []);
        setUpcomingEvents(arr(evResp));
        setFeaturedResources(arr(resResp));

        const [usersResp, eventsAllResp, resourcesAllResp, routesResp] = await Promise.all([
          usersService?.getAll?.() ?? Promise.resolve([]),
          eventsService?.getAll?.() ?? Promise.resolve([]),
          resourcesService?.getAll?.() ?? Promise.resolve([]),
          routesService?.getAll?.().catch(() => []) ?? Promise.resolve([]), // si no tienes rutas, quedará 0
        ]);
          setStatsValues({
          users: countFromResp(usersResp),
          events: countFromResp(eventsAllResp),
          resources: countFromResp(resourcesAllResp),
          routes: countFromResp(routesResp), // 0 si no hay service/ruta
        });
      } catch (e) {
        console.error('Error cargando inicio:', e);
      }
    })();
  }, []);

  return (
    <Container>
      {/* Welcome Section */}
      <Card className="mb-8 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">
            ¡Hola, {user?.name}! 👋
          </CardTitle>
          <p className="text-muted-foreground">
            Bienvenido a tu espacio de bienestar y convivencia universitaria
          </p>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Próximos Eventos
            </CardTitle>
            <Link to="/events">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h4 className="font-medium">{event.title}</h4>
                  {/* <p className="text-sm text-muted-foreground mt-1">{event.location}</p> */}
                  <p className="text-sm text-muted-foreground mt-1">{toText(event.location, 'Por definir')}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {/* {new Date(event.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                    })} */}
                    {new Date(event.date ?? event.startDate ?? event.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Featured Resources */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Recursos Destacados
            </CardTitle>
            <Link to="/resources">
              <Button variant="ghost" size="sm">
                Ver todos
              </Button>
            </Link>
          </CardHeader>
          {/* <CardContent className="space-y-4">
            <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Centro de Salud Universitario</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Atención médica y psicológica para estudiantes
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Asesoría Académica</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Apoyo en tu proceso de aprendizaje
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <h4 className="font-medium">Apoyo Financiero</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Becas y ayudas económicas disponibles
              </p>
            </div>
          </CardContent> */}
          <CardContent className="space-y-4">
            {featuredResources.map((r) => (
              <div key={r.id ?? r._id} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <h4 className="font-medium">{r.title}</h4>
                {/* <p className="text-sm text-muted-foreground mt-1">{r.description ?? r.content}</p> */}
                <p className="text-sm text-muted-foreground mt-1">
                  {toText(r.description ?? r.content, 'Sin descripción')}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/events">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm">Explorar Eventos</span>
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Conectar</span>
                </Button>
              </Link>
              <Link to="/routes">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <MapPin className="h-6 w-6" />
                  <span className="text-sm">Buscar Rutas</span>
                </Button>
              </Link>
              <Link to="/resources">
                <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
                  <Heart className="h-6 w-6" />
                  <span className="text-sm">Recursos</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
