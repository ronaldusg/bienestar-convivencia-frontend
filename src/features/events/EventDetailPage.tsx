import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Calendar, MapPin, Users, Clock, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

export const EventDetailPage = () => {
  const { id } = useParams();
  const [enrolled, setEnrolled] = useState(false);

  // Mock data - replace with API call
  const event = {
    id,
    title: 'Torneo de Fútbol Interfacultades',
    description: 'Únete a la competencia deportiva más grande del semestre. Los equipos de diferentes facultades competirán por el título de campeones. Habrá premios para los ganadores y actividades paralelas como música en vivo y food trucks.',
    category: 'Deportes',
    date: '2025-11-05',
    time: '14:00',
    location: 'Cancha Principal',
    capacity: 200,
    enrolled: 145,
    image: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800',
    organizer: {
      name: 'Departamento de Deportes',
      email: 'deportes@universidad.edu',
    },
    attendees: [
      { id: '1', name: 'Ana García', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=AG' },
      { id: '2', name: 'Carlos Ruiz', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=CR' },
      { id: '3', name: 'María López', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=ML' },
      { id: '4', name: 'Juan Pérez', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=JP' },
      { id: '5', name: 'Laura Torres', avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=LT' },
    ],
  };

  const handleEnroll = () => {
    setEnrolled(!enrolled);
    toast.success(
      enrolled ? 'Te has desinscrito del evento' : '¡Inscripción exitosa!'
    );
  };

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
            <div
              className="h-64 md:h-96 bg-cover bg-center"
              style={{ backgroundImage: `url(${event.image})` }}
            />
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-medium px-3 py-1 bg-primary/10 text-primary rounded-full">
                  {event.category}
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
                {event.attendees.map((attendee) => (
                  <div key={attendee.id} className="flex items-center gap-2">
                    <Avatar>
                      <AvatarImage src={attendee.avatar} />
                      <AvatarFallback>{attendee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{attendee.name}</span>
                  </div>
                ))}
                {event.enrolled > event.attendees.length && (
                  <span className="text-sm text-muted-foreground">
                    +{event.enrolled - event.attendees.length} más
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
                    {new Date(event.date).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
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
                  <p className="font-medium">{event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Capacidad</p>
                  <p className="font-medium">
                    {event.enrolled} / {event.capacity}
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleEnroll}
                  variant={enrolled ? 'outline' : 'default'}
                  className="w-full"
                >
                  {enrolled ? 'Cancelar Inscripción' : 'Inscribirse'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Organizador</h3>
              <p className="text-sm font-medium">{event.organizer.name}</p>
              <p className="text-sm text-muted-foreground">{event.organizer.email}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
};
