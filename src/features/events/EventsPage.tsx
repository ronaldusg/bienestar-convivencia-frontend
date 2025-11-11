import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin, Users, Clock, Search } from 'lucide-react';
import { toast } from 'sonner';

import { useEffect} from 'react';
import { eventsService } from '@/shared/services/events.service';
import api from '@/shared/api';
import { useAuth } from '@/shared/contexts/AuthContext';

function toText(v: any, fallback = '—') {
  if (v == null) return fallback;
  if (typeof v === 'string') return v;
  if (typeof v === 'number') return String(v);
  if (typeof v === 'object') return v.name ?? v.label ?? v.title ?? v.value ?? fallback;
  return fallback;
}

// function toDate(input: any): Date | null {
//   if (!input) return null;
//   if (input instanceof Date) return input;
//   if (typeof input === 'string' || typeof input === 'number') return new Date(input);
//   if (typeof input === 'object') {
//     const cand = input.date ?? input.start ?? input.startAt ?? input.startDate ?? input.$date ?? input.value;
//     if (cand) return new Date(cand);
//   }
//   return null;
// }

function toDate(input: any): Date | null {
  if (!input) return null;
  if (input instanceof Date) return input;

  const buildLocal = (s: string) => {
    // Detecta formato "YYYY-MM-DD" y crea fecha local sin desfase
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

    if (typeof cand === 'string') {
      const local = buildLocal(cand);
      if (local) return local;
      return new Date(cand);
    }

    if (cand instanceof Date || typeof cand === 'number') return new Date(cand);
  }

  return null;
}

function normalizeEvent(e: any) {
  return {
    ...e,
    id: e.id ?? e._id,
    enrolled:
      // typeof e.enrolled === 'number'
      //   ? e.enrolled
      //   : Array.isArray(e.participants)
      //     ? e.participants.length
      //     : (typeof e.participantsCount === 'number' ? e.participantsCount : 0),
      typeof e.enrolled === 'number'
        ? e.enrolled
        : Array.isArray(e.attendees)      ? e.attendees.length
        : Array.isArray(e.participants)   ? e.participants.length
        : typeof e.participantsCount === 'number' ? e.participantsCount
        : 0,
    capacity: Number(e.capacity) || 0,
  };
}

function userIsInEvent(ev: any, userId?: string) {
  if (!userId || !ev) return false;

  if (ev.isEnrolled === true) return true; // si tu API ya lo manda

  const list =
    (Array.isArray(ev.attendees)    && ev.attendees) ||
    (Array.isArray(ev.participants) && ev.participants) ||
    (Array.isArray(ev.registrations) && ev.registrations) ||
    [];

  // Soporta arrays de strings (ids) o de objetos (con _id/id)
  return list.some((u: any) => {
    if (typeof u === 'string') return u === userId;
    const uid = u?._id ?? u?.id;
    return uid === userId;
  });
}

export const EventsPage = () => {
  const { user } = useAuth();
  const currentUserId = (user as any)?._id ?? user?.id;

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [enrolledEvents, setEnrolledEvents] = useState<string[]>([]);

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categoryImages: Record<string, string> = {
    Deportes: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=600',
    Cultura: 'https://images.unsplash.com/photo-1503264116251-35a269479413?w=600',
    Salud: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600',
    Académico: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600',
    Tecnología: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600',
    default: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600',
  };

  const handleEnrollToggle = async (eventId: string, eventTitle: string) => {
    try {
      if (enrolledEvents.includes(eventId)) {
        await eventsService.unenroll(eventId);

        const freshUn = normalizeEvent((await api.get(`/events/${eventId}`)).data);
        // 🔄 decrementa localmente
        // setEvents((prev) =>
        //   prev.map((e) =>
        //     (e.id ?? e._id) === eventId
        //       ? { ...e, enrolled: Math.max((Number(e.enrolled) || 1) - 1, 0) }
        //       : e
        //   )
        // );
        setEvents(prev => prev.map(e => ((e.id ?? e._id) === eventId ? { ...e, ...freshUn } : e)));

        setEnrolledEvents(enrolledEvents.filter((id) => id !== eventId));
        toast.success(`Te has desinscrito de "${eventTitle}"`);
      } else {
        await eventsService.enroll(eventId);

        const freshEn = normalizeEvent((await api.get(`/events/${eventId}`)).data);

        // 🔄 incrementa localmente
        // setEvents((prev) =>
        //   prev.map((e) =>
        //     (e.id ?? e._id) === eventId
        //       ? { ...e, enrolled: (Number(e.enrolled) || 0) + 1 }
        //       : e
        //   )
        // );
        setEvents(prev => prev.map(e => ((e.id ?? e._id) === eventId ? { ...e, ...freshEn } : e)));

        setEnrolledEvents([...enrolledEvents, eventId]);
        toast.success(`¡Te has inscrito en "${eventTitle}"!`);
      }
    } catch (err: any) {
      console.error('Error al inscribirse:', err);
      toast.error(err?.response?.data?.message ?? 'No se pudo completar la acción');
    }
  };

  const filteredEvents = (events || []).filter((event) => {
    // normaliza categoría y ubicación (pueden venir como objeto)
    const cat = typeof event.category === 'string'
      ? event.category
      : event.category?.name || event.category?.label || '';

    const loc = typeof event.location === 'string'
      ? event.location
      : event.location?.name || event.location?.label || '';

    // normaliza la fecha del evento (acepta varios campos/formatos)
    const rawEvDate = event.date ?? event.startAt ?? event.startDate ?? event.createdAt;
    const evDate = (() => {
      if (!rawEvDate) return null;
      if (rawEvDate instanceof Date) return rawEvDate;
      if (typeof rawEvDate === 'string' || typeof rawEvDate === 'number') return new Date(rawEvDate);
      if (typeof rawEvDate === 'object') {
        const cand = rawEvDate.date ?? rawEvDate.start ?? rawEvDate.startDate ?? rawEvDate.$date ?? rawEvDate.value;
        return cand ? new Date(cand) : null;
      }
      return null;
    })();

    // fecha del filtro (Input type="date" => 'YYYY-MM-DD')
    const filterDate = dateFilter ? new Date(`${dateFilter}T00:00:00`) : null;

    const matchesCategory = categoryFilter === 'all' || cat === categoryFilter;
    const matchesLocation =
      !locationFilter || loc.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesDate = !filterDate || (evDate && evDate >= filterDate);

    return matchesCategory && matchesLocation && matchesDate;
  });

  useEffect(() => {
    setLoading(true);
    eventsService
      .getAll({ sort: '-startAt' }) // puedes enviar filtros si quieres
      .then(async (data) => {
        const list = Array.isArray(data) ? data : ((data as any)?.data ?? []);

        const detailed = await Promise.all(
          list.map(async (e: any) => {
            const id = e.id ?? e._id;

            try {
              // usa el service (trae token/baseURL)
              const det = await eventsService.getById(id);

              // normaliza el objeto devuelto por el service
              const detObj = (det && typeof det === 'object')
                ? (Array.isArray((det as any).data)
                    ? (det as any).data[0]
                    : ((det as any).data ?? det))
                : det;
              
              //console.log('Detalle evento', id, detObj);

              // calcula enrolled probando varias claves comunes
              const enrolled =
                // (typeof detObj?.enrolled === 'number' && detObj.enrolled) ??
                // (Array.isArray(detObj?.participants) ? detObj.participants.length : undefined) ??
                // (Array.isArray(detObj?.registrations) ? detObj.registrations.length : undefined) ??
                // (Array.isArray(detObj?.attendees) ? detObj.attendees.length : undefined) ??
                // (typeof detObj?.participantsCount === 'number' ? detObj.participantsCount : undefined) ??
                // (typeof detObj?._count?.participants === 'number' ? detObj._count.participants : undefined) ??
                // (typeof detObj?.stats?.participants === 'number' ? detObj.stats.participants : undefined) ??
                // 0;
                (Array.isArray(detObj?.attendees) ? detObj.attendees.length : undefined) ??
                (typeof detObj?.enrolled === 'number' ? detObj.enrolled : undefined) ??
                (Array.isArray(detObj?.participants) ? detObj.participants.length : undefined) ??
                (Array.isArray(detObj?.registrations) ? detObj.registrations.length : undefined) ??
                (typeof detObj?.participantsCount === 'number' ? detObj.participantsCount : undefined) ??
                (typeof detObj?._count?.participants === 'number' ? detObj._count.participants : undefined) ??
                (typeof detObj?.stats?.participants === 'number' ? detObj.stats.participants : undefined) ??
                0;

              return {
                ...e,
                ...detObj,
                id,
                enrolled,
                capacity: Number(detObj?.capacity ?? e.capacity) || 0,
              };
            } catch (err) {
              // si falla detalle, al menos normaliza lo que venía
              return {
                ...e,
                id,
                enrolled:
                  (typeof e.enrolled === 'number' ? e.enrolled : undefined) ??
                  (Array.isArray(e.participants) ? e.participants.length : 0),
                capacity: Number(e.capacity) || 0,
              };
            }
          })
        );

        setEvents(detailed);

        // Inicializa los ids de eventos donde el usuario YA está inscrito
        if (currentUserId) {
          const initialEnrolledIds = detailed
            .filter((ev: any) => {
              if (ev.isEnrolled === true) return true; // por si la API lo manda directo
              const list =
                (Array.isArray(ev.attendees)    && ev.attendees) ||
                (Array.isArray(ev.participants) && ev.participants) ||
                (Array.isArray(ev.registrations) && ev.registrations) ||
                [];
              return list.some((u: any) => (u?._id ?? u?.id) === currentUserId);
            })
            .map((ev: any) => ev.id ?? ev._id);
          setEnrolledEvents(initialEnrolledIds);
        }
        })

      .catch((err) => {
        console.error('Error al obtener eventos:', err);
        setError(err.message || 'Error al obtener eventos');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const userId = (user as any)?._id ?? user?.id;
    if (!userId) return;

    const ids = (events || [])
      .filter((ev) => userIsInEvent(ev, userId))
      .map((ev) => ev.id ?? ev._id);

    setEnrolledEvents(ids);
  }, [events, user]);
  
  if (loading) return <p>Cargando eventos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <Container>
      <SectionHeader
        title="Eventos"
        subtitle="Descubre y participa en las actividades de la comunidad universitaria"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Deportes">Deportes</SelectItem>
                <SelectItem value="Cultura">Cultura</SelectItem>
                <SelectItem value="Académico">Académico</SelectItem>
                <SelectItem value="Salud">Salud</SelectItem>
                <SelectItem value="Tecnología">Tecnología</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Fecha desde"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />

            <Input
              placeholder="Ubicación"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />

            {/* <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          // <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <Card key={event.id ?? event._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            /> */}
            <div
              className="h-48 bg-cover bg-center"
              style={{
                backgroundImage: `url(${
                  event.image ||
                  categoryImages[toText(event.category)] ||
                  categoryImages.default
                })`,
              }}
            />
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                {/* <Badge variant="secondary">{event.category}</Badge> */}
                <Badge variant="secondary">{toText(event.category)}</Badge>
              </div>
              {/* <CardTitle className="line-clamp-2">{event.title}</CardTitle> */}
              <CardTitle className="line-clamp-2">{toText(event.title)}</CardTitle>
              {/* <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p> */}
              <p className="text-sm text-muted-foreground line-clamp-2">{toText(event.description ?? event.summary, 'Sin descripción')}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {/* {new Date(event.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                  })} */}
                  {/* {(toDate(event.date ?? event.startAt ?? event.startDate ?? event.createdAt) ?? new Date())
                  .toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })} */}
                  {(toDate(event.date ?? event.startAt ?? event.startDate ?? event.createdAt) ?? new Date())
                  .toLocaleDateString('es-ES', { day: 'numeric', month: 'long', timeZone: 'UTC' })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {/* <span>{event.time}</span> */}
                <span>{toText(event.time)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {/* <span>{event.location}</span> */}
                <span>{toText(event.location, 'Por definir')}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {/* {event.enrolled} / {event.capacity} inscritos */}
                  {/* {(Number(event.enrolled) || 0)} / {(Number(event.capacity) || 0)} inscritos */}
                  {/* {(!Number.isNaN(Number(event.enrolled)) && event.enrolled !== undefined
                    ? Number(event.enrolled)
                    : (Array.isArray(event.participants) ? event.participants.length : 0)
                  )} / {(Number(event.capacity) || 0)} inscritos */}
                  {(!Number.isNaN(Number(event.enrolled)) && event.enrolled !== undefined
                    ? Number(event.enrolled)
                    : Array.isArray(event.attendees)    ? event.attendees.length
                    : Array.isArray(event.participants) ? event.participants.length
                    : 0
                  )} / {(Number(event.capacity) || 0)} inscritos
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  // onClick={() => handleEnrollToggle(event.id, event.title)}
                  // variant={enrolledEvents.includes(event.id) ? 'outline' : 'default'}
                  onClick={async() => await handleEnrollToggle(event.id ?? event._id, toText(event.title))}
                  variant={enrolledEvents.includes(event.id ?? event._id) ? 'outline' : 'default'}
                  className="flex-1"
                >
                  {/* {enrolledEvents.includes(event.id) ? 'Cancelar' : 'Inscribirse'} */}
                  {enrolledEvents.includes(event.id ?? event._id) ? 'Cancelar' : 'Inscribirse'}
                </Button>
                {/* <Link to={`/events/${event.id}`} className="flex-1"> */}
                <Link to={`/events/${event.id ?? event._id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Detalles
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};
