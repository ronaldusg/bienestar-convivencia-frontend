// import { useState } from 'react';
// import { Container } from '@/shared/components/Container';
// import { Link } from 'react-router-dom';
// import { SectionHeader } from '@/shared/components/SectionHeader';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Button } from '@/components/ui/button';
// import { Heart, BookOpen, Briefcase, GraduationCap, Users, Phone } from 'lucide-react';

// export const ResourcesPage = () => {
//   const [typeFilter, setTypeFilter] = useState('all');

//   const resources = [
//     {
//       id: '1',
//       title: 'Centro de Salud Universitario',
//       description: 'Atención médica general y psicológica para toda la comunidad estudiantil.',
//       type: 'Salud',
//       icon: Heart,
//       contact: 'salud@universidad.edu',
//       phone: '(601) 234-5678',
//     },
//     {
//       id: '2',
//       title: 'Asesoría Académica',
//       description: 'Apoyo personalizado en tu proceso de aprendizaje y planificación académica.',
//       type: 'Académico',
//       icon: GraduationCap,
//       contact: 'asesoria@universidad.edu',
//       phone: '(601) 234-5679',
//     },
//     {
//       id: '3',
//       title: 'Apoyo Financiero y Becas',
//       description: 'Información sobre becas, préstamos estudiantiles y ayudas económicas.',
//       type: 'Financiero',
//       icon: Briefcase,
//       contact: 'becas@universidad.edu',
//       phone: '(601) 234-5680',
//     },
//     {
//       id: '4',
//       title: 'Biblioteca Central',
//       description: 'Acceso a recursos bibliográficos, salas de estudio y servicios de préstamo.',
//       type: 'Académico',
//       icon: BookOpen,
//       contact: 'biblioteca@universidad.edu',
//       phone: '(601) 234-5681',
//     },
//     {
//       id: '5',
//       title: 'Centro de Orientación Vocacional',
//       description: 'Orientación para tu desarrollo profesional y elección de carrera.',
//       type: 'Desarrollo',
//       icon: Users,
//       contact: 'orientacion@universidad.edu',
//       phone: '(601) 234-5682',
//     },
//     {
//       id: '6',
//       title: 'Programa de Internacionalización',
//       description: 'Información sobre intercambios, movilidad académica y programas internacionales.',
//       type: 'Académico',
//       icon: GraduationCap,
//       contact: 'internacional@universidad.edu',
//       phone: '(601) 234-5683',
//     },
//     {
//       id: '7',
//       title: 'Centro de Bienestar Psicológico',
//       description: 'Apoyo emocional y consejería psicológica confidencial.',
//       type: 'Salud',
//       icon: Heart,
//       contact: 'psicologia@universidad.edu',
//       phone: '(601) 234-5684',
//     },
//     {
//       id: '8',
//       title: 'Bolsa de Empleo',
//       description: 'Oportunidades laborales, prácticas profesionales y vinculación con empresas.',
//       type: 'Desarrollo',
//       icon: Briefcase,
//       contact: 'empleo@universidad.edu',
//       phone: '(601) 234-5685',
//     },
//   ];

//   const filteredResources = typeFilter === 'all'
//     ? resources
//     : resources.filter(r => r.type === typeFilter);

//   return (
//     <Container>
//       <SectionHeader
//         title="Recursos de Bienestar"
//         subtitle="Accede a los servicios institucionales disponibles para ti"
//       />

//       {/* Filters */}
//       <div className="mb-6">
//         <Select value={typeFilter} onValueChange={setTypeFilter}>
//           <SelectTrigger className="w-full sm:w-[200px]">
//             <SelectValue placeholder="Tipo de recurso" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="all">Todos los tipos</SelectItem>
//             <SelectItem value="Salud">Salud</SelectItem>
//             <SelectItem value="Académico">Académico</SelectItem>
//             <SelectItem value="Financiero">Financiero</SelectItem>
//             <SelectItem value="Desarrollo">Desarrollo</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>

//       {/* Resources Grid */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredResources.map((resource) => {
//           const Icon = resource.icon;
//           return (
//             <Card key={resource.id} className="hover:shadow-lg transition-shadow">
//               <CardHeader>
//                 <div className="flex items-start justify-between mb-3">
//                   <div className="p-3 bg-primary/10 rounded-lg">
//                     <Icon className="h-6 w-6 text-primary" />
//                   </div>
//                   <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
//                     {resource.type}
//                   </span>
//                 </div>
//                 <CardTitle className="text-lg">{resource.title}</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <p className="text-sm text-muted-foreground">{resource.description}</p>
                
//                 <div className="space-y-2 pt-2 border-t">
//                   <div className="flex items-center gap-2 text-sm">
//                     <Phone className="h-4 w-4 text-muted-foreground" />
//                     <span className="text-muted-foreground">{resource.phone}</span>
//                   </div>
//                   <p className="text-sm text-muted-foreground">{resource.contact}</p>
//                 </div>

//                 <Link to={`/resources/${resource.id}`}>
//                   <Button variant="outline" className="w-full">
//                     Ver Detalles
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>
//     </Container>
//   );
// };

import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Heart,
  BookOpen,
  Briefcase,
  GraduationCap,
  Users,
  Phone,
} from 'lucide-react';
import { resourcesService } from '@/shared/services/resources.service';
import { toast } from 'sonner';

type ResourceType = 'health' | 'counseling' | 'academic' | 'financial' | 'other';

type UiResource = {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  typeLabel: string; // etiqueta en español para mostrar
  contact: string;
  phone?: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const typeLabel = (t: ResourceType): string => {
  switch (t) {
    case 'health':
      return 'Salud';
    case 'counseling':
      return 'Orientación';
    case 'academic':
      return 'Académico';
    case 'financial':
      return 'Financiero';
    default:
      return 'Otros';
  }
};

const typeIcon = (t: ResourceType) => {
  switch (t) {
    case 'health':
      return Heart;
    case 'counseling':
      return Users;
    case 'academic':
      return GraduationCap;
    case 'financial':
      return Briefcase;
    default:
      return BookOpen;
  }
};

export const ResourcesPage = () => {
  const [typeFilter, setTypeFilter] = useState<'all' | ResourceType>('all');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<UiResource[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       const list = await resourcesService.getAll();
  //       const mapped: UiResource[] = (Array.isArray(list) ? list : []).map((r: any) => {
  //         const t = (r?.type ?? 'other') as ResourceType;
  //         return {
  //           id: r.id,
  //           title: r.title,
  //           description: r.description,
  //           type: t,
  //           typeLabel: typeLabel(t),
  //           contact: r.contact,
  //           phone: (r as any)?.phone, // opcional si viene del backend
  //           Icon: typeIcon(t),
  //         };
  //       });
  //       setItems(mapped);
  //     } catch (e: any) {
  //       console.error(e);
  //       toast.error(e?.message ?? 'Error al cargar recursos');
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   void fetchData();
  // }, []);

  useEffect(() => {
    // const fetchData = async () => {
    //   setLoading(true);
    //   try {
    //     const list = await resourcesService.getAll();

    //     const mapped: UiResource[] = (Array.isArray(list) ? list : []).map((r: any) => {
    //       // 1) Normaliza tipo (por si viene en ES)
    //       const t = (r?.type ?? 'other').toString().toLowerCase();
    //       const typeNorm =
    //         ['salud', 'health'].includes(t) ? 'health' :
    //         ['académico','academico','academic'].includes(t) ? 'academic' :
    //         ['financiero','financial','becas'].includes(t) ? 'financial' :
    //         ['orientación','orientacion','counseling','bienestar','desarrollo'].includes(t) ? 'counseling' :
    //         'other';

    //       // 2) Descripción: ahora viene en `content`
    //       const description = r?.description ?? r?.content ?? '';

    //       // 3) Contacto: ahora es objeto (email/phone/name). Fallback si fuese string.
    //       const contactObj = typeof r?.contact === 'object' && r?.contact !== null ? r.contact : {};
    //       const contactText =
    //         typeof r?.contact === 'string'
    //           ? r.contact
    //           : (contactObj.email ?? contactObj.name ?? contactObj.general ?? '');

    //       const phone = r?.phone ?? contactObj.phone ?? '';

    //       return {
    //         id: r.id ?? r._id,
    //         title: r.title ?? '',
    //         description,
    //         type: typeNorm as ResourceType,
    //         typeLabel: typeLabel(typeNorm as ResourceType),
    //         contact: contactText,
    //         phone,
    //         Icon: typeIcon(typeNorm as ResourceType),
    //       };
    //     });

    //     console.log('Resource sample ->', mapped[0]);

    //     setItems(mapped);
    //   } catch (e: any) {
    //     console.error(e);
    //     toast.error(e?.message ?? 'Error al cargar recursos');
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchData = async () => {
      setLoading(true);
      try {
        const list = await resourcesService.getAll();

        // Logs de diagnóstico (puedes quitarlos luego)
        // console.log('raw list length ->', Array.isArray(list) ? list.length : 'no array');
        // if (Array.isArray(list) && list.length) {
        //   console.log('raw[0] ->', list[0]);
        //   console.log('raw[0] keys ->', Object.keys(list[0] || {}));
        //   // Intenta mostrar content si es objeto
        //   const c = (list[0] as any)?.content;
        //   if (c && typeof c === 'object') console.log('raw[0].content keys ->', Object.keys(c));
        // }

        // Helper robusto para extraer texto
        const getText = (r: any): string => {
          const c = r?.content;
          // content plano
          if (typeof c === 'string' && c.trim()) return c.trim();
          // content con distintas llaves internas
          if (c && typeof c === 'object') {
            const inner =
              c.text ?? c.plain ?? c.value ?? c.body ?? c.markdown ?? c.html ?? c.description;
            if (typeof inner === 'string' && inner.trim()) return inner.trim();
          }
          // otras variantes comunes
          const fallbacks = [
            r?.description,
            r?.details,
            r?.body,
            r?.summary,
          ];
          for (const f of fallbacks) {
            if (typeof f === 'string' && f.trim()) return f.trim();
          }
          return '';
        };

        const normType = (tRaw: any): ResourceType => {
          const t = String(tRaw ?? 'other').toLowerCase();
          if (['salud','health'].includes(t)) return 'health';
          if (['académico','academico','academic','biblioteca'].includes(t)) return 'academic';
          if (['financiero','financial','becas'].includes(t)) return 'financial';
          if (['orientación','orientacion','counseling','bienestar','desarrollo'].includes(t)) return 'counseling';
          return 'other';
        };

        // console.log('📦 Recursos crudos recibidos desde backend:', list);
        // if (Array.isArray(list) && list.length > 0) {
        //   console.log('🔹 Primer recurso ->', list[0]);
        //   console.log('🔹 Claves del primer recurso ->', Object.keys(list[0]));
        //   console.log('🔹 Contenido del campo content ->', list[0].content);
        // }

        const mapped: UiResource[] = (Array.isArray(list) ? list : []).map((r: any) => {
          const t = normType(r?.type);
          const contactObj = typeof r?.contact === 'object' && r?.contact !== null ? r.contact : {};
          const contactText =
            typeof r?.contact === 'string'
              ? r.contact
              : (contactObj.email ?? contactObj.name ?? contactObj.general ?? '');
          const phone = r?.phone ?? contactObj.phone ?? '';

          return {
            id: r.id ?? r._id ?? '',
            title: r.title ?? '',
            //description: getText(r),          // <- ahora sí toma `content`
            description: String(r?.content ?? r?.description ?? '').trim(),
            type: t,
            typeLabel: typeLabel(t),
            contact: contactText,
            phone,
            Icon: typeIcon(t),
          };
        });

        // console.log('mapped[0] ->', mapped[0]); // verificación final
        setItems(mapped);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? 'Error al cargar recursos');
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, []);

  const filteredResources = useMemo(() => {
    if (typeFilter === 'all') return items;
    return items.filter((r) => r.type === typeFilter);
  }, [items, typeFilter]);

  return (
    <Container>
      <SectionHeader
        title="Recursos de Bienestar"
        subtitle="Accede a los servicios institucionales disponibles para ti"
      />

      {/* Filters */}
      <div className="mb-6">
        <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as any)}>
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Tipo de recurso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="health">Salud</SelectItem>
            <SelectItem value="counseling">Orientación</SelectItem>
            <SelectItem value="academic">Académico</SelectItem>
            <SelectItem value="financial">Financiero</SelectItem>
            <SelectItem value="other">Otros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading && (
        <p className="text-center text-sm text-muted-foreground py-8">
          Cargando recursos…
        </p>
      )}

      {!loading && filteredResources.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No hay recursos para mostrar.
        </p>
      )}

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = resource.Icon;
          return (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                    {resource.typeLabel}
                  </span>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {resource.description}
                </p>

                <div className="space-y-2 pt-2 border-t">
                  {resource.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{resource.phone}</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{resource.contact}</p>
                </div>

                {/* <Link to={`/resources/${resource.id}`}>
                  <Button variant="outline" className="w-full">
                    Ver Detalles
                  </Button>
                </Link> */}
                <Link to={resource.id ? `/resources/${encodeURIComponent(resource.id)}` : '#'}>
                  <Button variant="outline" className="w-full" disabled={!resource.id}>
                    Ver Detalles
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Container>
  );
};