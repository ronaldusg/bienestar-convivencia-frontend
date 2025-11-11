import { useEffect, useMemo, useState } from 'react';
import { routesService } from '@/shared/services/routes.service';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock, Users } from 'lucide-react';
import { toast } from 'sonner';
import { usersService } from '@/shared/services/users.service';
import { Car } from 'lucide-react';
import { CreateRouteDialog } from './CreateRouteDialog';

type User = {
  _id: string;
  id?: string;
  name: string;
  email?: string;
  avatar?: string;
  rating?: number;
};

type UiRoute = {
  id: string;
  title: string;
  driverId: string;
  driverName: string;
  driverAvatar?: string;
  driverRating?: number;
  origin: string;
  destination: string;
  time: string;
  date: string;
  availableSeats: number;
  totalSeats: number;
  price?: string;
  isJoined?: boolean;
  passengersIds?: string[];
};

// Normaliza el objeto del backend a la UI
function toUiRoute(r: any): UiRoute {
  const dt = r?.dateTime ? new Date(r.dateTime) : undefined;
  // Si tu backend no trae totalSeats/price, ponemos valores razonables
  // const totalSeats = Number(r?.totalSeats ?? r?.capacity ?? r?.availableSeats ?? 0);
  // const availableSeats = Number(r?.availableSeats ?? 0);
  // const availableSeats = Number(r?.availableSeats ?? 0);
  // const totalSeats = Number(r?.totalSeats ?? availableSeats + (r?.passengers?.length ?? 0));
  const totalSeats = Number(r?.totalSeats ?? (r?.availableSeats ?? 0) + (r?.passengers?.length ?? 0));
  const usedSeats = (r?.passengers?.length ?? 0);
  const availableSeats = totalSeats > 0 ? Math.max(totalSeats - usedSeats, 0) : Number(r?.availableSeats ?? 0);
  
  const driverName =
    ((r?.driverName || r?.driver?.name || r?.driverId?.name || '').toString().trim()) ||
    'Conductor asignado';
  
  return {
    id: r?.id ?? r?._id ?? crypto.randomUUID(),
    title: r?.title ?? `${r?.origin?.address ?? 'Origen'} → ${r?.destination ?? 'Destino'}`,
    driverId: r?.driverId ?? r?.driver?._id ?? '',
    driverName,
    driverAvatar: r?.driver?.avatar,
    driverRating: r?.driver?.rating,
    origin: r?.origin?.address ?? r?.origin ?? '—',
    destination: r?.destination ?? '—',
    time: dt ? dt.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : (r?.time ?? '—'),
    date: dt ? dt.toISOString().slice(0,10) : (r?.date ?? '—'),
    availableSeats,
    totalSeats: totalSeats > 0 ? totalSeats : Math.max(availableSeats, 1),
    price: typeof r?.price === 'string' ? r.price : undefined,
    isJoined: Boolean(r?.isJoined),
    passengersIds: Array.isArray(r?.passengers)
      ? r.passengers.map((p: any) => (typeof p === 'string' ? p : (p?._id ?? p?.id)))
      : undefined,
  };
}

const getCurrentUserId = (): string => {
  // 1) Intenta leer un objeto "user" guardado en localStorage
  try {
    const userRaw = localStorage.getItem('user');
    if (userRaw) {
      const u = JSON.parse(userRaw);
      if (u?._id) return String(u._id);
      if (u?.id) return String(u.id);
      if (u?.userId) return String(u.userId);
    }
  } catch {}

  // 2) Keys sueltas comunes
  const k =
    localStorage.getItem('uid') ||
    localStorage.getItem('userId') ||
    localStorage.getItem('_id') ||
    localStorage.getItem('id');
  if (k) return String(k);

  // 3) (Opcional) JWT en localStorage (accessToken)
  try {
    const token = localStorage.getItem('accessToken');
    if (token && token.includes('.')) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return String(payload?.sub ?? payload?._id ?? payload?.id ?? '');
    }
  } catch {}

  return '';
};

export const RoutesPage = () => {
  const [routesRaw, setRoutesRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalById, setTotalById] = useState<Record<string, number>>({});
  const [dialogOpen, setDialogOpen] = useState(false);

  // Estado para usuarios
  const [users, setUsers] = useState<any[]>([]);

  // Lista normalizada para la UI
  // const routes = useMemo(() => routesRaw.map(toUiRoute), [routesRaw]);
  const [routes, setRoutes] = useState<UiRoute[]>([]);  

  // Helpers para normalizar id y nombre (agregar justo antes de refresh)
  const getId = (v: any): string | undefined => {
    if (v == null) return undefined;
    if (typeof v === 'string') return v;
    if (typeof v === 'object') return String(v._id ?? v.id ?? v);
    return String(v);
  };

  const getName = (u: any): string | undefined => {
    if (!u) return undefined;
    return (
      u.name ??
      u.fullName ??
      u.displayName ??
      (u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : undefined)
    );
  };

  useEffect(() => {
    try {
      (usersService as any).getById = async () => null; // no hará peticiones
    } catch {}
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const [routesData, usersData] = await Promise.all([
        routesService.getAll(),
        usersService.getAll(),
      ]);

      // helpers locales
      const getId = (v: any): string | undefined => {
        if (v == null) return undefined;
        if (typeof v === 'string') return v;
        if (typeof v === 'object') return String(v._id ?? v.id ?? v);
        return String(v);
      };
      const getName = (u: any): string | undefined =>
        u?.name ?? u?.fullName ?? u?.displayName ?? (u?.firstName && u?.lastName ? `${u.firstName} ${u.lastName}` : undefined);

      // diccionario rápido de usuarios obtenidos en el listado
      const usersById: Record<string, any> = (Array.isArray(usersData) ? usersData : []).reduce(
        (acc, u: any) => {
          const id = getId(u?._id ?? u?.id);
          if (id) acc[id] = u;
          return acc;
        },
        {} as Record<string, any>
      );

      // 1) primer merge usando el listado general
      const currentUserId = localStorage.getItem('uid') || '';

      const prelim = (Array.isArray(routesData) ? routesData : []).map((r: any) => {
        const driverKey = getId(r?.driverId);
        const driver = driverKey ? usersById[driverKey] : undefined;
        
        // ✅ NUEVO: detecta si el usuario actual está en passengers
        const joined =
          Array.isArray(r?.passengers) &&
          r.passengers.some((p: any) =>
            typeof p === 'string'
              ? p === currentUserId
              : (p?._id ?? p?.id) === currentUserId
          );

        // console.log(
        //   '[Ruta]',
        //   r.title,
        //   '| driverId:',
        //   driverKey,
        //   '| Nombre encontrado:',
        //   getName(driver) ?? 'Conductor asignado'
        // );
        const name =
          ((r?.driverName || getName(driver) || '').toString().trim()) ||
          'Conductor asignado';
        // console.log('[merge] title:', r.title, '| driverId:', driverKey, '| name:', JSON.stringify(name));
        return {
          ...r,
          driverName: name,
          driver: {
            ...(r?.driver ?? {}),
            name,
            avatar: r?.driver?.avatar ?? driver?.avatar,
            rating: r?.driver?.rating ?? driver?.rating,
          },
          passengers: Array.isArray(r?.passengers) ? r.passengers : [],
          isJoined: joined,
        };
      });

      // 2) fallback: para los que aún no tengan driverName, trae el usuario por id
      const needLookup = prelim
        .filter((r: any) => !r.driverName && r?.driverId)
        .map((r: any) => ({ rid: r._id ?? r.id, driverId: getId(r.driverId) }))
        .filter((x: any) => !!x.driverId);

      if (needLookup.length) {
        const fetchedPairs = await Promise.all(
          needLookup.map(async (x) => {
            try {
              const u = await usersService.getById(x.driverId as string);
              return [x.rid, u] as const;
            } catch {
              return [x.rid, null] as const;
            }
          })
        );

        const byRouteId: Record<string, any> = Object.fromEntries(
          fetchedPairs.filter(([, u]) => !!u)
        );

        const merged = prelim.map((r: any) => {
          const key = String(r._id ?? r.id);
          const u = byRouteId[key];
          if (!u) return r;
          const name = getName(u);
          return {
            ...r,
            driverName: r.driverName ?? name,
            driver: {
              ...(r.driver ?? {}),
              name: r.driver?.name ?? name,
              avatar: r.driver?.avatar ?? u?.avatar,
              rating: r.driver?.rating ?? u?.rating,
            },
          };
        });

        // ⬇️ NUEVO: congela total por id antes de mapear a UI
        const withTotals = merged.map((r: any) => {
          const id = String(r._id ?? r.id);
          const computed = Number(r?.availableSeats ?? 0) + (Array.isArray(r?.passengers) ? r.passengers.length : 0);
          const persisted = totalById[id] ?? computed;
          return { ...r, totalSeats: persisted };
        });

        // ⬇️ NUEVO: persiste solo los que no existan todavía
        setTotalById(prev => {
          const next = { ...prev };
          for (const r of withTotals) {
            const id = String(r._id ?? r.id);
            if (next[id] == null) next[id] = r.totalSeats;
          }
          return next;
        });

        setRoutes(withTotals.map(toUiRoute));

        // setRoutesRaw(merged);
        // console.log('UI routes >>>', (prelim || merged).map(r => r.driverName));
        // setRoutes(merged.map(toUiRoute));
      } else {
        // setRoutesRaw(prelim);
        // console.log('UI routes >>>', (prelim).map(r => r.driverName));
        // ⬇️ NUEVO: congela total por id antes de mapear a UI
        const withTotals = prelim.map((r: any) => {
          const id = String(r._id ?? r.id);
          const computed = Number(r?.availableSeats ?? 0) + (Array.isArray(r?.passengers) ? r.passengers.length : 0);
          const persisted = totalById[id] ?? computed;
          return { ...r, totalSeats: persisted };
        });

        // ⬇️ NUEVO: persiste solo los que no existan todavía
        setTotalById(prev => {
          const next = { ...prev };
          for (const r of withTotals) {
            const id = String(r._id ?? r.id);
            if (next[id] == null) next[id] = r.totalSeats;
          }
          return next;
        });

        setRoutes(withTotals.map(toUiRoute));
        // setRoutes(prelim.map(toUiRoute));
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? 'Error al obtener rutas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refresh(); }, []);

  const onJoin = async (routeId: string) => {
    try {
      const msg = await routesService.join(routeId);
      toast.success(msg ?? 'Te uniste a la ruta');
      await refresh();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'No se pudo unir a la ruta');
    }
  };

  const onLeave = async (routeId: string) => {
    try {
      const msg = await routesService.leave(routeId);
      toast.success(msg ?? 'Has salido de la ruta');
      await refresh();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'No se pudo salir de la ruta');
    }
  };

  const onCreateRoute = async (form: any) => {
    try {
      const driverId = getCurrentUserId();
      if (!driverId) {
        toast.error('No se encontró el usuario actual (driverId). Inicia sesión.');
        return;
      }

      // Ajusta nombres si tu dialog usa otros keys
      const payload = {
        title: form.title?.trim() || `${form.origin} → ${form.destination}`,
        driverId,
        origin: { address: form.origin?.trim() },
        meetingPoint: form.meetingPoint?.trim() || '',
        destination: form.destination?.trim(),
        dateTime: new Date(`${form.date}T${form.time}`), // ej: '2025-11-10T18:00'
        availableSeats: Number(form.totalSeats ?? form.availableSeats ?? 1),
      };

      await routesService.create(payload as any);   // <-- tu endpoint POST
      toast.success('Ruta publicada');
      setDialogOpen(false);
      await refresh();
    } catch (e:any) {
      console.error(e);
      toast.error(e?.message ?? 'No se pudo crear la ruta');
    }
  };

  const onDelete = async (routeId: string) => {
    if (!confirm('¿Eliminar esta ruta?')) return;
    try {
      // usa el que tengas disponible
      const fn = (routesService as any).delete ?? (routesService as any).remove;
      if (!fn) throw new Error('No existe routesService.delete/remove');

      await fn(routeId);
      toast.success('Ruta eliminada');
      await refresh();
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'No se pudo eliminar la ruta');
    }
  };
  
  return (
    <Container>
      {/* <SectionHeader
        title="Rutas Compartidas"
        subtitle="Encuentra compañeros de viaje y ahorra en transporte"
      /> */}
      <SectionHeader
        title="Rutas Compartidas"
        subtitle="Encuentra compañeros de viaje y ahorra en transporte"
        actions={
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Car className="h-4 w-4" />
            Publicar ruta
          </Button>
        }
      />

      <CreateRouteDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreateRoute={onCreateRoute}   // si tu dialog espera este nombre
        // onSubmit={onCreateRoute}      // (opcional) por si tu dialog se llama distinto
      />

      {loading && (
        <p className="text-center text-sm text-muted-foreground py-8">Cargando rutas…</p>
      )}

      {!loading && routes.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No hay rutas disponibles por ahora.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {routes.map((route) => {
          // const joined = Boolean(route.isJoined);
          // const joined = route.isJoined === true;
          // const currentUserId = localStorage.getItem('uid') || '';
          // const joined =
          //   route.isJoined === true ||
          //   (Array.isArray((route as any).passengers) &&
          //     (route as any).passengers.includes(currentUserId));
          // const currentUserId = getCurrentUserId();
          // const joined =
          //   route.isJoined === true ||
          //   (!!currentUserId &&
          //     Array.isArray(route.passengersIds)
          //     ? route.passengersIds.includes(currentUserId)
          //     : Array.isArray((route as any).passengers) &&
          //       (route as any).passengers.some((p: any) =>
          //         typeof p === 'string' ? p === currentUserId : (p?._id ?? p?.id) === currentUserId
          //       )
          //   );
          const currentUserId = getCurrentUserId();

          const joined =
            route.isJoined === true ||
            (
              !!currentUserId &&
              (
                (Array.isArray(route.passengersIds) && route.passengersIds.includes(currentUserId)) ||
                (Array.isArray((route as any).passengers) &&
                  (route as any).passengers.some((p: any) =>
                    typeof p === 'string' ? p === currentUserId : (p?._id ?? p?.id) === currentUserId
                  )
                )
              )
            );

          const noSeats = route.availableSeats <= 0 && !joined;
          const initials = (route.driverName ?? 'C')[0]?.toUpperCase?.() ?? 'C';

          const isOwner = getCurrentUserId() === route.driverId;

          //console.log('uid=', currentUserId, 'passengersIds=', route.passengersIds);

          return (
            <Card key={route.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{route.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(route.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                        {' a las '}
                        {route.time}
                      </span>
                    </div>
                  </div>
                  {route.price ? (
                    <span className="text-lg font-bold text-primary">{route.price}</span>
                  ) : null}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Conductor */}
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Avatar className="h-9 w-9 ring-2 ring-background">
                    <AvatarImage
                      src={
                        route.driverAvatar && route.driverAvatar.trim() !== ''
                          ? route.driverAvatar
                          : 'https://api.dicebear.com/7.x/avataaars/svg?seed=DefaultDriver'
                      }
                      alt={route.driverName || 'Conductor asignado'}
                    />
                    <AvatarFallback className="uppercase text-[12px]">
                      {(route.driverName || 'C').charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="leading-tight">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[15px] text-foreground">
                        {route.driverName || 'Conductor asignado'}
                      </p>
                      <span className="text-[11px] bg-primary/10 text-primary px-2 py-[2px] rounded-full font-medium">
                        Conductor
                      </span>
                    </div>

                    {route.driverRating && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        ⭐ {route.driverRating} conductor
                      </p>
                    )}
                  </div>
                </div>

                {/* Detalles de ruta */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">{route.origin}</p>
                      <p className="text-sm text-muted-foreground">Origen</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium">{route.destination}</p>
                      <p className="text-sm text-muted-foreground">Destino</p>
                    </div>
                  </div>
                </div>

                {/* Plazas */}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {route.availableSeats} de {route.totalSeats} plazas disponibles
                  </span>
                </div>

                {/* Acción */}
                {/* <Button
                  onClick={() => (joined ? onLeave(route.id) : onJoin(route.id))}
                  variant={joined ? 'outline' : 'default'}
                  className="w-full"
                  disabled={noSeats}
                >
                  {joined ? 'Salir de la ruta' : noSeats ? 'Sin plazas disponibles' : 'Unirse a la ruta'}
                </Button> */}
                {/* <Button
                  onClick={() => (joined ? onLeave(route.id) : onJoin(route.id))}
                  variant={joined ? 'secondary' : 'default'}
                  className="w-full"
                  disabled={noSeats}
                >
                  {joined ? 'Ya estás unido a esta ruta' : noSeats ? 'Sin plazas disponibles' : 'Unirse a la ruta'}
                </Button> */}
                <Button
                  onClick={() => (joined ? onLeave(route.id) : onJoin(route.id))}
                  variant={joined ? 'secondary' : 'default'}
                  className="w-full"
                  disabled={noSeats}
                >
                  {joined ? 'Salir de la ruta' : noSeats ? 'Sin plazas disponibles' : 'Unirse a la ruta'}
                </Button>

                {isOwner && (
                  <Button
                    onClick={() => onDelete(route.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    Eliminar ruta
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
};

export default RoutesPage;