import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, MapPin, Users, Clock, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { eventsService } from '@/shared/services/events.service';
import api from '@/shared/api';

// function displayNameOf(a: any) {
//   if (typeof a === 'string') return a;
//   return a?.name ?? a?.fullName ?? a?.email ?? a?._id ?? a?.id ?? '—';
// }

function displayNameOf(a: any) {
  if (!a) return '—';

  // Si el backend devuelve un string (id o nombre)
  if (typeof a === 'string') {
    // Si parece un ObjectId (24 hex caracteres), devuelve "Usuario inscrito"
    if (/^[0-9a-fA-F]{24}$/.test(a)) return 'Usuario inscrito';
    return a; // si es texto legible, úsalo
  }

  // Si es un objeto, prueba distintas propiedades
  return (
    a?.name ??
    a?.fullName ??
    a?.username ??
    a?.email ??
    a?.title ??
    a?._id ??
    a?.id ??
    'Usuario inscrito'
  );
}

function firstLetter(s: string) {
  return (s?.trim?.()[0] ?? '?').toUpperCase();
}

function toText(v: any, fallback = '—') {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object') return v.name ?? v.label ?? v.title ?? v.value ?? fallback;
  return fallback;
}

function toDate(input: any): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;

  const buildLocal = (s: string) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return null;
  };

  if (typeof input === 'string') {
    const local = buildLocal(input);
    if (local) return local;
    return new Date(input);
  }

  if (typeof input === 'number') return new Date(input);

  if (typeof input === 'object') {
    const cand =
      input.date ?? input.start ?? input.startAt ?? input.startDate ?? input.$date ?? input.value;
    if (!cand) return null;
    if (typeof cand === 'string') return buildLocal(cand) ?? new Date(cand);
    if (cand instanceof Date || typeof cand === 'number') return new Date(cand);
  }

  return null;
}

const categoryImages: Record<string, string> = {
  Deportes: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=1200',
  Cultura: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=1200',
  Salud: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200',
  Académico: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200',
  Tecnología: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
  default: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200',
};

export const EventDetailPage = () => {
  const { id } = useParams();
  const [enrolled, setEnrolled] = useState(false);

  // Mock data - replace with API call
  // const event = {
  //   id,
  //   title: 'Torneo de Fútbol Interfacultades',
  //   description: 'Únete a la competencia deportiva más grande del semestre. Los equipos de diferentes facultades competirán por el título de campeones. Habrá premios para los ganadores y actividades paralelas como música en vivo y food trucks.',
  //   category: 'Deportes',
  //   date: '2025-11-05',
  //   time: '14:00',
  //   location: 'Cancha Principal',
  //   capacity: 200,
  //   enrolled: 145,
  //   image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
  //   organizer: {
  //     name: 'Departamento de Deportes',
  //     email: 'deportes@universidad.edu',
  //   },
  //   attendees: [
  //     { id: '1', name: 'Ana García', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AG' },
  //     { id: '2', name: 'Carlos Ruiz', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CR' },
  //     { id: '3', name: 'María López', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ML' },
  //     { id: '4', name: 'Juan Pérez', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JP' },
  //     { id: '5', name: 'Laura Torres', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LT' },
  //   ],
  // };

  const { user } = useAuth();
  const currentUserId = (user as any)?._id ?? user?.id;
  const [event, setEvent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  function userIsInEvent(ev: any, userId?: string) {
    if (!userId || !ev) return false;
    if (ev?.isEnrolled === true) return true;
    const list =
      (Array.isArray(ev?.attendees)    && ev.attendees) ||
      (Array.isArray(ev?.participants) && ev.participants) ||
      (Array.isArray(ev?.registrations) && ev.registrations) ||
      [];
    return list.some((u: any) => {
      if (typeof u === 'string') return u === userId;
      const uid = u?._id ?? u?.id;
      return uid === userId;
    });
  }

  // const handleEnroll = () => {
  //   setEnrolled(!enrolled);
  //   toast.success(
  //     enrolled ? 'Te has desinscrito del evento' : '¡Inscripción exitosa!'
  //   );
  // };

  const handleEnroll = async () => {
    if (!event) return;
    try {
      if (enrolled) {
        await eventsService.unenroll(event.id ?? event._id ?? id);
        const fresh = (await api.get(`/events/${event.id ?? event._id ?? id}`)).data;

        // 👇 Reaplica la misma normalización para que no se pierda tras el refresh
        let org2 =
          fresh?.organizer ??
          fresh?.organizerId ??
          fresh?.createdBy ??
          fresh?.owner ??
          fresh?.author ??
          fresh?.host;

        if (typeof org2 === 'string') {
          try {
            const r2 = await api.get(`/users/${org2}`);
            org2 = r2.data?.data ?? r2.data;
          } catch {
            org2 = { _id: org2, name: 'Organizador' };
          }
        }
        if (org2) fresh.organizer = org2;

        setEvent(fresh);
        setEnrolled(false);
        toast.success('Te has desinscrito del evento');
      } else {
        await eventsService.enroll(event.id ?? event._id ?? id);
        const fresh = (await api.get(`/events/${event.id ?? event._id ?? id}`)).data;

        // 👇 Reaplica la misma normalización para que no se pierda tras el refresh
        let org2 =
          fresh?.organizer ??
          fresh?.organizerId ??
          fresh?.createdBy ??
          fresh?.owner ??
          fresh?.author ??
          fresh?.host;

        if (typeof org2 === 'string') {
          try {
            const r2 = await api.get(`/users/${org2}`);
            org2 = r2.data?.data ?? r2.data;
          } catch {
            org2 = { _id: org2, name: 'Organizador' };
          }
        }
        if (org2) fresh.organizer = org2;

        setEvent(fresh);
        setEnrolled(true);
        toast.success('¡Inscripción exitosa!');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message ?? 'No se pudo completar la acción');
    }
  };


  // useEffect(() => {
  //   let mounted = true;
  //   (async () => {
  //     try {
  //       setLoading(true);
  //       const res = await eventsService.getById(id!);
  //       const data = (res && typeof res === 'object')
  //         ? (Array.isArray((res as any).data) ? (res as any).data[0] : ((res as any).data ?? res))
  //         : res;
  //       if (!mounted) return;
  //       setEvent(data);
  //       setEnrolled(userIsInEvent(data, currentUserId));
  //     } catch (err: any) {
  //       console.error(err);
  //       setError(err?.message ?? 'No se pudo cargar el evento');
  //     } finally {
  //       if (mounted) setLoading(false);
  //     }
  //   })();
  //   return () => { mounted = false; };
  // }, [id, currentUserId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await eventsService.getById(id!);
        let data =
          res && typeof res === 'object'
            ? Array.isArray((res as any).data)
              ? (res as any).data[0]
              : (res as any).data ?? res
            : res;

        let org =
          data?.organizer ??
          data?.organizerId ??
          data?.createdBy ??
          data?.owner ??
          data?.author ??
          data?.host;

        if (typeof org === 'string') {
          try {
            const r = await api.get(`/users/${org}`);
            org = r.data?.data ?? r.data; // admite {data:{...}} o plano
          } catch {
            org = { _id: org, name: 'Organizador' };
          }
        }
        if (org) data = { ...data, organizer: org };

        if (typeof data?.organizer === 'string') {
          try {
            const userRes = await api.get(`/users/${data.organizer}`);
            data.organizer = userRes.data?.data ?? userRes.data;
          } catch {
            data.organizer = { _id: data.organizer, name: 'Organizador' };
          }
        }

        // 🔹 Si el organizador viene como ID o en otra clave, traerlo completo
        let organizerCandidate =
          data?.organizer ?? data?.createdBy ?? data?.owner ?? data?.author ?? data?.host;

        if (typeof organizerCandidate === 'string') {
          try {
            const u = await api.get(`/users/${organizerCandidate}`);
            organizerCandidate = u.data; // { _id, name, email }
          } catch {
            organizerCandidate = { _id: organizerCandidate, name: 'Organizador' };
          }
        }

        data = { ...data, organizer: organizerCandidate };

        // 🧩 si los asistentes vienen como strings, obten sus datos reales
        if (Array.isArray(data?.attendees) && typeof data.attendees[0] === 'string') {
          const detailedAttendees = await Promise.all(
            data.attendees.map(async (userId: string) => {
              try {
                // const userRes = await api.get(`/users/${userId}`);
                // return userRes.data; // por ejemplo { _id, name, email }
                const userRes = await api.get(`/users/${userId}`);
                const user = (userRes.data?.data ?? userRes.data); // ← robusto a ambas formas
                return user; // { _id, name, email, ... }
              } catch {
                return { _id: userId, name: 'Usuario inscrito' };
              }
            })
          );
          data = { ...data, attendees: detailedAttendees };
        }

        if (!mounted) return;
        setEvent(data);
        setEnrolled(userIsInEvent(data, currentUserId));
      } catch (err: any) {
        console.error(err);
        setError(err?.message ?? 'No se pudo cargar el evento');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, currentUserId]);

  if (loading) return <Container><p>Cargando evento…</p></Container>;
  if (error)   return <Container><p style={{ color: 'red' }}>{error}</p></Container>;
  if (!event)  return <Container><p>No se encontró el evento.</p></Container>;
    const capacity = Number(event?.capacity) || 0;
  const enrolledCount =
    typeof event?.enrolled === 'number' ? event.enrolled
    : Array.isArray(event?.attendees)    ? event.attendees.length
    : Array.isArray(event?.participants) ? event.participants.length
    : 0;
  const isFull = capacity > 0 && enrolledCount >= capacity;


  return (
    <Container>
      <Link to="/events">
        <Button variant="ghost" className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver a eventos
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            {/* <div
              className="h-64 md:h-96 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            /> */}
            <div
              className="h-64 md:h-96 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  event?.image ||
                  categoryImages[event?.category?.name || event?.category || 'default'] ||
                  categoryImages.default
                })`,
              }}
            />
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {/* {event.category} */}
                  {toText(event.category)}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </CardContent>
          </Card>

          {/* Attendees */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                Asistentes Confirmados
              </h3>
              <div className="flex flex-wrap gap-4">
                {/* {event.attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={attendee.avatar} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{attendee.name}</span>
                  </div>
                ))} */}
                {(event.attendees ?? []).map((attendee: any, idx: number) => {
                  const name = displayNameOf(attendee);
                  const key = (typeof attendee === 'string' ? attendee : (attendee?._id ?? attendee?.id)) ?? idx;
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src={typeof attendee === 'object' ? attendee?.avatar : undefined} />
                        <AvatarFallback>{firstLetter(name)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{name}</span>
                    </div>
                  );
                })}
                {/* {event.enrolled > event.attendees.length && (
                  <span className="text-sm text-muted-foreground">
                    +{event.enrolled - event.attendees.length} más
                  </span>
                )} */}
                {(Number(event.enrolled) || 0) > ((event.attendees?.length) || 0) && (
                  <span className="text-sm text-muted-foreground">
                    {(Number(event.enrolled) || 0) - ((event.attendees?.length) || 0)} más
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha</p>
                  <p className="font-medium">
                    {/* {new Date(event.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })} */}
                    {/* {event?.date
                      ? new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
                      : '—'} */}
                    {(() => {
                      const d = toDate(event?.date ?? event?.startAt ?? event?.startDate ?? event?.createdAt);
                      return d
                        ? d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
                        : '—';
                    })()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Hora</p>
                  <p className="font-medium">{event.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación</p>
                  <p className="font-medium">{toText(event.location)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacidad</p>
                  <p className="font-medium">
                    {/* {event.enrolled} / {event.capacity} */}
                    {enrolledCount} / {capacity}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                {/* <Button
                  onClick={handleEnroll}
                  variant={enrolled ? 'outline' : 'default'}
                  className="w-full"
                > */}
                <Button
                  onClick={handleEnroll}
                  variant={enrolled ? 'outline' : 'default'}
                  className="w-full"
                  disabled={!enrolled && isFull}
                >
                  {enrolled ? 'Cancelar Inscripción' : 'Inscribirse'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Organizador</h3>
              {/* <p className="text-sm font-medium">{event.organizer.name}</p>
              <p className="text-sm text-muted-foreground">{event.organizer.email}</p> */}
              {/* <p className="text-sm font-medium">
                {typeof event.organizer === 'object'
                  ? (event.organizer?.name ?? '—')
                  : (event?.organizer ?? '—')}
              </p> */}
              <p className="text-sm font-medium">{toText(event.organizer)}</p>
              <p className="text-sm text-muted-foreground">
                {typeof event.organizer === 'object' ? toText(event.organizer?.email) : '—'}
              </p>
              {/* <p className="text-sm text-muted-foreground">
                {typeof event.organizer === 'object'
                  ? (event.organizer?.email ?? '—')
                  : '—'}
              </p> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};
