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

export const EventsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [enrolledEvents, setEnrolledEvents] = useState<string[]>([]);

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const events = [
  //   {
  //     id: '1',
  //     title: 'Torneo de Fútbol Interfacultades',
  //     description: 'Competencia deportiva entre las diferentes facultades',
  //     category: 'Deportes',
  //     date: '2025-11-05',
  //     time: '14:00',
  //     location: 'Cancha Principal',
  //     capacity: 200,
  //     enrolled: 145,
  //     image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400',
  //   },
  //   {
  //     id: '2',
  //     title: 'Charla: Salud Mental Universitaria',
  //     description: 'Conversatorio sobre bienestar emocional en la vida universitaria',
  //     category: 'Salud',
  //     date: '2025-11-08',
  //     time: '16:00',
  //     location: 'Auditorio Central',
  //     capacity: 150,
  //     enrolled: 89,
  //     image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400',
  //   },
  //   {
  //     id: '3',
  //     title: 'Festival Cultural Internacional',
  //     description: 'Celebración de la diversidad cultural de nuestra comunidad',
  //     category: 'Cultura',
  //     date: '2025-11-12',
  //     time: '10:00',
  //     location: 'Plaza Central',
  //     capacity: 500,
  //     enrolled: 320,
  //     image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400',
  //   },
  //   {
  //     id: '4',
  //     title: 'Hackathon Innovación Social',
  //     description: 'Maratón de programación enfocada en soluciones sociales',
  //     category: 'Académico',
  //     date: '2025-11-15',
  //     time: '09:00',
  //     location: 'Lab de Computación',
  //     capacity: 80,
  //     enrolled: 65,
  //     image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
  //   },
  //   {
  //     id: '5',
  //     title: 'Concierto Bandas Universitarias',
  //     description: 'Presentación de grupos musicales estudiantiles',
  //     category: 'Cultura',
  //     date: '2025-11-18',
  //     time: '19:00',
  //     location: 'Auditorio Principal',
  //     capacity: 300,
  //     enrolled: 275,
  //     image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
  //   },
  //   {
  //     id: '6',
  //     title: 'Taller de Yoga y Meditación',
  //     description: 'Sesión práctica de bienestar físico y mental',
  //     category: 'Salud',
  //     date: '2025-11-20',
  //     time: '07:00',
  //     location: 'Zona Verde',
  //     capacity: 40,
  //     enrolled: 32,
  //     image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400',
  //   },
  // ];

  const handleEnrollToggle = (eventId: string, eventTitle: string) => {
    if (enrolledEvents.includes(eventId)) {
      setEnrolledEvents(enrolledEvents.filter((id) => id !== eventId));
      toast.success(`Te has desinscrito de "${eventTitle}"`);
    } else {
      setEnrolledEvents([...enrolledEvents, eventId]);
      toast.success(`¡Te has inscrito en "${eventTitle}"!`);
    }
  };

  const handleSearch = () => {
    toast.info('Aplicando filtros...');
  };

  //const filteredEvents = events.filter((event) => {
  const filteredEvents = (events || []).filter((event) => {
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;
    const matchesLocation = !locationFilter || event.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesDate = !dateFilter || event.date >= dateFilter;
    return matchesCategory && matchesLocation && matchesDate;
  });

  useEffect(() => {
    setLoading(true);
    eventsService
      .getAll({ sort: '-startAt' }) // puedes enviar filtros si quieres
      .then((data) => {
        console.log('Eventos cargados desde API:', data);
        //setEvents(data); // guarda la respuesta
        //setEvents(Array.isArray(data) ? data : data?.data || []);
        setEvents(Array.isArray(data) ? data : ((data as any)?.data ?? []));
      })
      .catch((err) => {
        console.error('Error al obtener eventos:', err);
        setError(err.message || 'Error al obtener eventos');
      })
      .finally(() => setLoading(false));
  }, []);
  
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
          <div className="grid md:grid-cols-4 gap-4">
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

            <Button onClick={handleSearch} className="gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div
              className="h-48 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            />
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary">{event.category}</Badge>
              </div>
              <CardTitle className="line-clamp-2">{event.title}</CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {event.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(event.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {event.enrolled} / {event.capacity} inscritos
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => handleEnrollToggle(event.id, event.title)}
                  variant={enrolledEvents.includes(event.id) ? 'outline' : 'default'}
                  className="flex-1"
                >
                  {enrolledEvents.includes(event.id) ? 'Cancelar' : 'Inscribirse'}
                </Button>
                <Link to={`/events/${event.id}`} className="flex-1">
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
