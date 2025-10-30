import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, MapPin, Clock, Heart, BookOpen, Briefcase, GraduationCap, Users } from 'lucide-react';

export const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const resources = [
    {
      id: '1',
      title: 'Centro de Salud Universitario',
      description: 'Atención médica general y psicológica para toda la comunidad estudiantil.',
      fullDescription: 'El Centro de Salud Universitario ofrece servicios médicos integrales incluyendo consulta general, medicina preventiva, atención psicológica y programas de bienestar. Nuestro equipo de profesionales está comprometido con tu salud física y mental durante tu etapa universitaria.',
      type: 'Salud',
      icon: Heart,
      contact: {
        name: 'Dr. Juan Martínez',
        email: 'salud@universidad.edu',
        phone: '(601) 234-5678',
        location: 'Edificio de Bienestar, Piso 2',
        hours: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
      },
    },
    {
      id: '2',
      title: 'Asesoría Académica',
      description: 'Apoyo personalizado en tu proceso de aprendizaje y planificación académica.',
      fullDescription: 'El servicio de Asesoría Académica te brinda orientación personalizada para optimizar tu rendimiento académico. Ofrecemos apoyo en metodologías de estudio, planificación de horarios, resolución de dudas específicas y acompañamiento en tu trayectoria universitaria.',
      type: 'Académico',
      icon: GraduationCap,
      contact: {
        name: 'Lic. María González',
        email: 'asesoria@universidad.edu',
        phone: '(601) 234-5679',
        location: 'Edificio Central, Oficina 305',
        hours: 'Lunes a Viernes: 9:00 AM - 5:00 PM',
      },
    },
    {
      id: '3',
      title: 'Apoyo Financiero y Becas',
      description: 'Información sobre becas, préstamos estudiantiles y ayudas económicas.',
      fullDescription: 'La Oficina de Apoyo Financiero te asesora sobre las diferentes opciones de financiamiento disponibles, incluyendo becas académicas, deportivas, culturales, préstamos estudiantiles y programas de ayuda económica. Te acompañamos en cada paso del proceso de solicitud.',
      type: 'Financiero',
      icon: Briefcase,
      contact: {
        name: 'Lic. Carlos Ramírez',
        email: 'becas@universidad.edu',
        phone: '(601) 234-5680',
        location: 'Edificio Administrativo, Piso 1',
        hours: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
      },
    },
    {
      id: '4',
      title: 'Biblioteca Central',
      description: 'Acceso a recursos bibliográficos, salas de estudio y servicios de préstamo.',
      fullDescription: 'La Biblioteca Central cuenta con una amplia colección de recursos físicos y digitales, salas de estudio individual y grupal, acceso a bases de datos especializadas y servicios de préstamo interbibliotecario. Personal especializado te asiste en la búsqueda de información académica.',
      type: 'Académico',
      icon: BookOpen,
      contact: {
        name: 'Bibl. Ana López',
        email: 'biblioteca@universidad.edu',
        phone: '(601) 234-5681',
        location: 'Edificio de Biblioteca',
        hours: 'Lunes a Viernes: 7:00 AM - 10:00 PM, Sábados: 8:00 AM - 6:00 PM',
      },
    },
    {
      id: '5',
      title: 'Centro de Orientación Vocacional',
      description: 'Orientación para tu desarrollo profesional y elección de carrera.',
      fullDescription: 'El Centro de Orientación Vocacional ofrece servicios de asesoría en elección de carrera, exploración vocacional, planificación de desarrollo profesional y preparación para el mundo laboral. Utilizamos herramientas psicométricas y entrevistas personalizadas.',
      type: 'Desarrollo',
      icon: Users,
      contact: {
        name: 'Psic. Laura Fernández',
        email: 'orientacion@universidad.edu',
        phone: '(601) 234-5682',
        location: 'Edificio de Bienestar, Piso 1',
        hours: 'Lunes a Viernes: 9:00 AM - 5:00 PM',
      },
    },
  ];

  const resource = resources.find((r) => r.id === id);

  if (!resource) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Recurso no encontrado</p>
          <Button onClick={() => navigate('/resources')} className="mt-4">
            Volver a Recursos
          </Button>
        </div>
      </Container>
    );
  }

  const Icon = resource.icon;

  return (
    <Container>
      <Button
        variant="ghost"
        onClick={() => navigate('/resources')}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Recursos
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start gap-4 mb-4">
              <div className="p-4 bg-primary/10 rounded-lg">
                <Icon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
                <span className="text-sm font-medium px-3 py-1 bg-muted rounded-full">
                  {resource.type}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">
                {resource.fullDescription}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Responsable</p>
              <p className="font-medium">{resource.contact.name}</p>
            </div>

            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <a
                    href={`mailto:${resource.contact.email}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {resource.contact.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <a
                    href={`tel:${resource.contact.phone}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {resource.contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Ubicación</p>
                  <p className="text-sm font-medium">{resource.contact.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Horario</p>
                  <p className="text-sm font-medium">{resource.contact.hours}</p>
                </div>
              </div>
            </div>

            <Button className="w-full mt-4">Agendar Cita</Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
