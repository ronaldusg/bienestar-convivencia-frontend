import { useState } from 'react';
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
import { Heart, BookOpen, Briefcase, GraduationCap, Users, Phone } from 'lucide-react';

export const ResourcesPage = () => {
  const [typeFilter, setTypeFilter] = useState('all');

  const resources = [
    {
      id: '1',
      title: 'Centro de Salud Universitario',
      description: 'Atención médica general y psicológica para toda la comunidad estudiantil.',
      type: 'Salud',
      icon: Heart,
      contact: 'salud@universidad.edu',
      phone: '(601) 234-5678',
    },
    {
      id: '2',
      title: 'Asesoría Académica',
      description: 'Apoyo personalizado en tu proceso de aprendizaje y planificación académica.',
      type: 'Académico',
      icon: GraduationCap,
      contact: 'asesoria@universidad.edu',
      phone: '(601) 234-5679',
    },
    {
      id: '3',
      title: 'Apoyo Financiero y Becas',
      description: 'Información sobre becas, préstamos estudiantiles y ayudas económicas.',
      type: 'Financiero',
      icon: Briefcase,
      contact: 'becas@universidad.edu',
      phone: '(601) 234-5680',
    },
    {
      id: '4',
      title: 'Biblioteca Central',
      description: 'Acceso a recursos bibliográficos, salas de estudio y servicios de préstamo.',
      type: 'Académico',
      icon: BookOpen,
      contact: 'biblioteca@universidad.edu',
      phone: '(601) 234-5681',
    },
    {
      id: '5',
      title: 'Centro de Orientación Vocacional',
      description: 'Orientación para tu desarrollo profesional y elección de carrera.',
      type: 'Desarrollo',
      icon: Users,
      contact: 'orientacion@universidad.edu',
      phone: '(601) 234-5682',
    },
    {
      id: '6',
      title: 'Programa de Internacionalización',
      description: 'Información sobre intercambios, movilidad académica y programas internacionales.',
      type: 'Académico',
      icon: GraduationCap,
      contact: 'internacional@universidad.edu',
      phone: '(601) 234-5683',
    },
    {
      id: '7',
      title: 'Centro de Bienestar Psicológico',
      description: 'Apoyo emocional y consejería psicológica confidencial.',
      type: 'Salud',
      icon: Heart,
      contact: 'psicologia@universidad.edu',
      phone: '(601) 234-5684',
    },
    {
      id: '8',
      title: 'Bolsa de Empleo',
      description: 'Oportunidades laborales, prácticas profesionales y vinculación con empresas.',
      type: 'Desarrollo',
      icon: Briefcase,
      contact: 'empleo@universidad.edu',
      phone: '(601) 234-5685',
    },
  ];

  const filteredResources = typeFilter === 'all'
    ? resources
    : resources.filter(r => r.type === typeFilter);

  return (
    <Container>
      <SectionHeader
        title="Recursos de Bienestar"
        subtitle="Accede a los servicios institucionales disponibles para ti"
      />

      {/* Filters */}
      <div className="mb-6">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Tipo de recurso" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="Salud">Salud</SelectItem>
            <SelectItem value="Académico">Académico</SelectItem>
            <SelectItem value="Financiero">Financiero</SelectItem>
            <SelectItem value="Desarrollo">Desarrollo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-muted rounded">
                    {resource.type}
                  </span>
                </div>
                <CardTitle className="text-lg">{resource.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{resource.description}</p>
                
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{resource.phone}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{resource.contact}</p>
                </div>

                <Link to={`/resources/${resource.id}`}>
                  <Button variant="outline" className="w-full">
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
