// import { useParams, useNavigate } from 'react-router-dom';
// import { Container } from '@/shared/components/Container';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { ArrowLeft, Mail, Phone, MapPin, Clock, Heart, BookOpen, Briefcase, GraduationCap, Users } from 'lucide-react';

// export const ResourceDetailPage = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const resources = [
//     {
//       id: '1',
//       title: 'Centro de Salud Universitario',
//       description: 'Atención médica general y psicológica para toda la comunidad estudiantil.',
//       fullDescription: 'El Centro de Salud Universitario ofrece servicios médicos integrales incluyendo consulta general, medicina preventiva, atención psicológica y programas de bienestar. Nuestro equipo de profesionales está comprometido con tu salud física y mental durante tu etapa universitaria.',
//       type: 'Salud',
//       icon: Heart,
//       contact: {
//         name: 'Dr. Juan Martínez',
//         email: 'salud@universidad.edu',
//         phone: '(601) 234-5678',
//         location: 'Edificio de Bienestar, Piso 2',
//         hours: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
//       },
//     },
//     {
//       id: '2',
//       title: 'Asesoría Académica',
//       description: 'Apoyo personalizado en tu proceso de aprendizaje y planificación académica.',
//       fullDescription: 'El servicio de Asesoría Académica te brinda orientación personalizada para optimizar tu rendimiento académico. Ofrecemos apoyo en metodologías de estudio, planificación de horarios, resolución de dudas específicas y acompañamiento en tu trayectoria universitaria.',
//       type: 'Académico',
//       icon: GraduationCap,
//       contact: {
//         name: 'Lic. María González',
//         email: 'asesoria@universidad.edu',
//         phone: '(601) 234-5679',
//         location: 'Edificio Central, Oficina 305',
//         hours: 'Lunes a Viernes: 9:00 AM - 5:00 PM',
//       },
//     },
//     {
//       id: '3',
//       title: 'Apoyo Financiero y Becas',
//       description: 'Información sobre becas, préstamos estudiantiles y ayudas económicas.',
//       fullDescription: 'La Oficina de Apoyo Financiero te asesora sobre las diferentes opciones de financiamiento disponibles, incluyendo becas académicas, deportivas, culturales, préstamos estudiantiles y programas de ayuda económica. Te acompañamos en cada paso del proceso de solicitud.',
//       type: 'Financiero',
//       icon: Briefcase,
//       contact: {
//         name: 'Lic. Carlos Ramírez',
//         email: 'becas@universidad.edu',
//         phone: '(601) 234-5680',
//         location: 'Edificio Administrativo, Piso 1',
//         hours: 'Lunes a Viernes: 8:00 AM - 4:00 PM',
//       },
//     },
//     {
//       id: '4',
//       title: 'Biblioteca Central',
//       description: 'Acceso a recursos bibliográficos, salas de estudio y servicios de préstamo.',
//       fullDescription: 'La Biblioteca Central cuenta con una amplia colección de recursos físicos y digitales, salas de estudio individual y grupal, acceso a bases de datos especializadas y servicios de préstamo interbibliotecario. Personal especializado te asiste en la búsqueda de información académica.',
//       type: 'Académico',
//       icon: BookOpen,
//       contact: {
//         name: 'Bibl. Ana López',
//         email: 'biblioteca@universidad.edu',
//         phone: '(601) 234-5681',
//         location: 'Edificio de Biblioteca',
//         hours: 'Lunes a Viernes: 7:00 AM - 10:00 PM, Sábados: 8:00 AM - 6:00 PM',
//       },
//     },
//     {
//       id: '5',
//       title: 'Centro de Orientación Vocacional',
//       description: 'Orientación para tu desarrollo profesional y elección de carrera.',
//       fullDescription: 'El Centro de Orientación Vocacional ofrece servicios de asesoría en elección de carrera, exploración vocacional, planificación de desarrollo profesional y preparación para el mundo laboral. Utilizamos herramientas psicométricas y entrevistas personalizadas.',
//       type: 'Desarrollo',
//       icon: Users,
//       contact: {
//         name: 'Psic. Laura Fernández',
//         email: 'orientacion@universidad.edu',
//         phone: '(601) 234-5682',
//         location: 'Edificio de Bienestar, Piso 1',
//         hours: 'Lunes a Viernes: 9:00 AM - 5:00 PM',
//       },
//     },
//   ];

//   const resource = resources.find((r) => r.id === id);

//   if (!resource) {
//     return (
//       <Container>
//         <div className="text-center py-12">
//           <p className="text-muted-foreground">Recurso no encontrado</p>
//           <Button onClick={() => navigate('/resources')} className="mt-4">
//             Volver a Recursos
//           </Button>
//         </div>
//       </Container>
//     );
//   }

//   const Icon = resource.icon;

//   return (
//     <Container>
//       <Button
//         variant="ghost"
//         onClick={() => navigate('/resources')}
//         className="mb-6 gap-2"
//       >
//         <ArrowLeft className="h-4 w-4" />
//         Volver a Recursos
//       </Button>

//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Main Content */}
//         <Card className="lg:col-span-2">
//           <CardHeader>
//             <div className="flex items-start gap-4 mb-4">
//               <div className="p-4 bg-primary/10 rounded-lg">
//                 <Icon className="h-8 w-8 text-primary" />
//               </div>
//               <div className="flex-1">
//                 <CardTitle className="text-2xl mb-2">{resource.title}</CardTitle>
//                 <span className="text-sm font-medium px-3 py-1 bg-muted rounded-full">
//                   {resource.type}
//                 </span>
//               </div>
//             </div>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             <div>
//               <h3 className="font-semibold mb-2">Descripción</h3>
//               <p className="text-muted-foreground leading-relaxed">
//                 {resource.fullDescription}
//               </p>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Contact Card */}
//         <Card className="lg:col-span-1">
//           <CardHeader>
//             <CardTitle>Información de Contacto</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <p className="text-sm text-muted-foreground mb-1">Responsable</p>
//               <p className="font-medium">{resource.contact.name}</p>
//             </div>

//             <div className="space-y-3 pt-3 border-t">
//               <div className="flex items-start gap-3">
//                 <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Email</p>
//                   <a
//                     href={`mailto:${resource.contact.email}`}
//                     className="text-sm font-medium text-primary hover:underline"
//                   >
//                     {resource.contact.email}
//                   </a>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Teléfono</p>
//                   <a
//                     href={`tel:${resource.contact.phone}`}
//                     className="text-sm font-medium text-primary hover:underline"
//                   >
//                     {resource.contact.phone}
//                   </a>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Ubicación</p>
//                   <p className="text-sm font-medium">{resource.contact.location}</p>
//                 </div>
//               </div>

//               <div className="flex items-start gap-3">
//                 <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
//                 <div>
//                   <p className="text-sm text-muted-foreground">Horario</p>
//                   <p className="text-sm font-medium">{resource.contact.hours}</p>
//                 </div>
//               </div>
//             </div>

//             <Button className="w-full mt-4">Agendar Cita</Button>
//           </CardContent>
//         </Card>
//       </div>
//     </Container>
//   );
// };

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  Heart,
  BookOpen,
  Briefcase,
  GraduationCap,
  Users,
} from 'lucide-react';
import { resourcesService } from '@/shared/services/resources.service';
import { toast } from 'sonner';

// tipos de la UI local
type ResourceType = 'health' | 'counseling' | 'academic' | 'financial' | 'other';

type UiResourceDetail = {
  id: string;
  title: string;
  fullDescription: string;       // viene de content/description
  type: ResourceType;
  typeLabel: string;             // chip mostrado
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  contact: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    hours?: string;
  };
};

// helpers para icono/etiqueta
const typeIcon = (t: ResourceType) => {
  switch (t) {
    case 'health': return Heart;
    case 'counseling': return Users;
    case 'academic': return GraduationCap;
    case 'financial': return Briefcase;
    default: return BookOpen;
  }
};

const typeLabel = (t: ResourceType): string => {
  switch (t) {
    case 'health': return 'Salud';
    case 'counseling': return 'Orientación';
    case 'academic': return 'Académico';
    case 'financial': return 'Financiero';
    default: return 'Otros';
  }
};

// normaliza el tipo por si viene en español
const normType = (tRaw: any): ResourceType => {
  const t = String(tRaw ?? 'other').toLowerCase();
  if (['salud', 'health'].includes(t)) return 'health';
  if (['orientación','orientacion','counseling','bienestar','desarrollo'].includes(t)) return 'counseling';
  if (['académico','academico','academic','biblioteca'].includes(t)) return 'academic';
  if (['financiero','financial','becas'].includes(t)) return 'financial';
  return 'other';
};

export const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [resource, setResource] = useState<UiResourceDetail | null>(null);

  // useEffect(() => {
  //   const fetchOne = async () => {
  //     if (!id) return;
  //     setLoading(true);
  //     try {
  //       const raw = await resourcesService.getById(id);

  //       const t = normType((raw as any)?.type);
  //       const c = (raw as any)?.contact;
  //       const contactObj =
  //         typeof c === 'object' && c !== null
  //           ? c
  //           : { email: typeof c === 'string' ? c : undefined };

  //       const fullDescription =
  //         (typeof (raw as any)?.content === 'string' && (raw as any)?.content.trim())
  //           ? (raw as any)?.content.trim()
  //           : (typeof (raw as any)?.description === 'string' ? (raw as any)?.description.trim() : '');

  //       const mapped: UiResourceDetail = {
  //         id: (raw as any)?.id ?? (raw as any)?._id ?? String(id),
  //         title: (raw as any)?.title ?? '',
  //         fullDescription,
  //         type: t,
  //         typeLabel: typeLabel(t),
  //         Icon: typeIcon(t),
  //         contact: {
  //           name: contactObj?.name,
  //           email: contactObj?.email,
  //           phone: contactObj?.phone,
  //           location: contactObj?.location,
  //           hours: contactObj?.hours,
  //         },
  //       };

  //       setResource(mapped);
  //     } catch (e: any) {
  //       console.error(e);
  //       toast.error(e?.message ?? 'No se pudo cargar el recurso');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   void fetchOne();
  // }, [id]);

  // useEffect(() => {
  //   const fetchOne = async () => {
  //     if (!id) return;
  //     setLoading(true);
  //     try {
  //       // YA viene mapeado por el servicio (id/title/description/content/type/contact/location/hours/visible)
  //       const raw = await resourcesService.getById(id);

  //       // contact puede ser string u objeto -> normalizamos a objeto para la UI
  //       const contactObj =
  //         typeof raw.contact === 'object' && raw.contact !== null
  //           ? raw.contact
  //           : (typeof raw.contact === 'string' ? { email: raw.contact } : {});

  //       // prioriza content si existe; si no, description
  //       const fullDescription =
  //         (typeof raw.content === 'string' && raw.content.trim())
  //           ? raw.content.trim()
  //           : (raw.description ?? '');

  //       const mapped: UiResourceDetail = {
  //         id: raw.id ?? String(id),
  //         title: raw.title ?? '',
  //         fullDescription,
  //         // el servicio ya normalizó type a 'health' | 'counseling' | 'academic' | 'financial' | 'other'
  //         type: raw.type as ResourceType,
  //         typeLabel: typeLabel(raw.type as ResourceType),
  //         Icon: typeIcon(raw.type as ResourceType),
  //         contact: {
  //           name: contactObj?.name,
  //           email: contactObj?.email,
  //           phone: contactObj?.phone,
  //           // en tu modelo vienen arriba: location/hours son top-level → pásalos aquí
  //           location: raw.location,
  //           hours: raw.hours,
  //         },
  //       };

  //       setResource(mapped);
  //     } catch (e: any) {
  //       console.error(e);
  //       toast.error(e?.message ?? 'No se pudo cargar el recurso');
  //       setResource(null);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   void fetchOne();
  // }, [id]);

  useEffect(() => {
    const fetchOne = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const r = await resourcesService.getById(id);
        console.log('[ResourceDetailPage] recibido del servicio ->', r);

        const contactObj =
          typeof r.contact === 'object' && r.contact !== null
            ? r.contact
            : (typeof r.contact === 'string' ? { email: r.contact } : {});

        const fullDescription =
          (typeof r.content === 'string' && r.content.trim())
            ? r.content.trim()
            : (typeof r.description === 'string' ? r.description.trim() : '');

        const mapped: UiResourceDetail = {
          id: r.id || String(id),
          title: r.title ?? '',
          fullDescription,
          type: r.type as ResourceType,
          typeLabel: typeLabel(r.type as ResourceType),
          Icon: typeIcon(r.type as ResourceType),
          contact: {
            name: contactObj?.name,
            email: contactObj?.email,
            phone: contactObj?.phone,
            location: r.location,   // vienen top-level en Resource
            hours: r.hours,         // vienen top-level en Resource
          },
        };

        console.log('[ResourceDetailPage] mapeado UI ->', mapped);
        setResource(mapped);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? 'No se pudo cargar el recurso');
        setResource(null);
      } finally {
        setLoading(false);
      }
    };

    void fetchOne();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="text-center py-12 text-sm text-muted-foreground">Cargando…</div>
      </Container>
    );
  }

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

  const Icon = resource.Icon;

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
                  {resource.typeLabel}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">
                {resource.fullDescription || '—'}
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
            {resource.contact?.name && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Responsable</p>
                <p className="font-medium">{resource.contact.name}</p>
              </div>
            )}

            <div className="space-y-3 pt-3 border-t">
              {resource.contact?.email && (
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
              )}

              {resource.contact?.phone && (
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
              )}

              {resource.contact?.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ubicación</p>
                    <p className="text-sm font-medium">{resource.contact.location}</p>
                  </div>
                </div>
              )}

              {resource.contact?.hours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horario</p>
                    <p className="text-sm font-medium">{resource.contact.hours}</p>
                  </div>
                </div>
              )}
            </div>

            {/* <Button className="w-full mt-4">Agendar Cita</Button> */}
            <div className="grid grid-cols-1 gap-2 mt-4">
              {/* Email */}
              {resource.contact?.email && (
                <a
                  href={`mailto:${resource.contact.email}?subject=${encodeURIComponent(`Consulta sobre ${resource.title}`)}&body=${encodeURIComponent(
                    `Hola,\n\nQuisiera solicitar información/una cita respecto a: "${resource.title}".\n\nGracias.`
                  )}`}
                >
                  <Button className="w-full">Escribir correo</Button>
                </a>
              )}

              {/* Llamar */}
              {resource.contact?.phone && (
                <a href={`tel:${resource.contact.phone}`}>
                  <Button variant="outline" className="w-full">Llamar</Button>
                </a>
              )}

              {/* WhatsApp (si hay teléfono) */}
              {resource.contact?.phone && (
                <a
                  href={`https://wa.me/${resource.contact.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `Hola, quisiera agendar/consultar sobre "${resource.title}".`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="outline" className="w-full">WhatsApp</Button>
                </a>
              )}

              {/* Google Calendar (abre con título/detalles prellenados) */}
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
                  `Consulta: ${resource.title}`
                )}&details=${encodeURIComponent(
                  `Contacto: ${resource.contact?.email ?? resource.contact?.phone ?? 'N/D'}\n\nDescripción: ${resource.fullDescription || '—'}`
                )}&location=${encodeURIComponent(resource.contact?.location || '')}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost" className="w-full">Añadir recordatorio</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
