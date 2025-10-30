import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, GraduationCap, Globe, Eye } from 'lucide-react';

export const CommunityPage = () => {
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('all');

  const students = [
    {
      id: '1',
      name: 'Ana García Rodríguez',
      faculty: 'Ingeniería',
      career: 'Ingeniería de Sistemas',
      nationality: 'Colombia',
      interests: ['Tecnología', 'Deportes', 'Música'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    },
    {
      id: '2',
      name: 'Carlos Mendoza',
      faculty: 'Ciencias',
      career: 'Biología',
      nationality: 'México',
      interests: ['Naturaleza', 'Fotografía', 'Voluntariado'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    },
    {
      id: '3',
      name: 'María Fernández',
      faculty: 'Artes',
      career: 'Diseño Gráfico',
      nationality: 'España',
      interests: ['Arte', 'Cine', 'Teatro'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
    {
      id: '4',
      name: 'Juan López Torres',
      faculty: 'Ingeniería',
      career: 'Ingeniería Civil',
      nationality: 'Chile',
      interests: ['Arquitectura', 'Viajes', 'Gaming'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    },
    {
      id: '5',
      name: 'Laura Martínez',
      faculty: 'Medicina',
      career: 'Medicina General',
      nationality: 'Argentina',
      interests: ['Salud', 'Yoga', 'Cocina'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
    },
    {
      id: '6',
      name: 'Diego Silva',
      faculty: 'Economía',
      career: 'Administración',
      nationality: 'Perú',
      interests: ['Emprendimiento', 'Finanzas', 'Networking'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
    },
    {
      id: '7',
      name: 'Sofia Ramírez',
      faculty: 'Ciencias Sociales',
      career: 'Psicología',
      nationality: 'Uruguay',
      interests: ['Psicología', 'Lectura', 'Meditación'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia',
    },
    {
      id: '8',
      name: 'Miguel Ángel Castro',
      faculty: 'Ingeniería',
      career: 'Ingeniería Industrial',
      nationality: 'Ecuador',
      interests: ['Innovación', 'Deportes', 'Tecnología'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel',
    },
  ];

  const filteredStudents = students.filter((student) => {
    const matchesFaculty = facultyFilter === 'all' || student.faculty === facultyFilter;
    const matchesNationality = nationalityFilter === 'all' || student.nationality === nationalityFilter;
    const matchesInterest = interestFilter === 'all' || student.interests.includes(interestFilter);
    return matchesFaculty && matchesNationality && matchesInterest;
  });

  return (
    <Container>
      <SectionHeader
        title="Comunidad"
        subtitle="Conecta con otros estudiantes según tus intereses, carrera o nacionalidad"
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Facultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las facultades</SelectItem>
                <SelectItem value="Ingeniería">Ingeniería</SelectItem>
                <SelectItem value="Ciencias">Ciencias</SelectItem>
                <SelectItem value="Artes">Artes</SelectItem>
                <SelectItem value="Medicina">Medicina</SelectItem>
                <SelectItem value="Economía">Economía</SelectItem>
                <SelectItem value="Ciencias Sociales">Ciencias Sociales</SelectItem>
              </SelectContent>
            </Select>

            <Select value={nationalityFilter} onValueChange={setNationalityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Nacionalidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las nacionalidades</SelectItem>
                <SelectItem value="Colombia">Colombia</SelectItem>
                <SelectItem value="México">México</SelectItem>
                <SelectItem value="España">España</SelectItem>
                <SelectItem value="Chile">Chile</SelectItem>
                <SelectItem value="Argentina">Argentina</SelectItem>
                <SelectItem value="Perú">Perú</SelectItem>
                <SelectItem value="Uruguay">Uruguay</SelectItem>
                <SelectItem value="Ecuador">Ecuador</SelectItem>
              </SelectContent>
            </Select>

            <Select value={interestFilter} onValueChange={setInterestFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Interés" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los intereses</SelectItem>
                <SelectItem value="Tecnología">Tecnología</SelectItem>
                <SelectItem value="Deportes">Deportes</SelectItem>
                <SelectItem value="Música">Música</SelectItem>
                <SelectItem value="Arte">Arte</SelectItem>
                <SelectItem value="Naturaleza">Naturaleza</SelectItem>
                <SelectItem value="Fotografía">Fotografía</SelectItem>
                <SelectItem value="Voluntariado">Voluntariado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto mb-4">
                <AvatarImage src={student.avatar} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {student.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{student.name}</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                <GraduationCap className="h-4 w-4" />
                <span>{student.faculty}</span>
              </div>
              <p className="text-sm text-muted-foreground">{student.career}</p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-1">
                <Globe className="h-4 w-4" />
                <span>{student.nationality}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Intereses</p>
                <div className="flex flex-wrap gap-2">
                  {student.interests.map((interest) => (
                    <Badge key={interest} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/community/${student.id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <Eye className="h-4 w-4" />
                    Ver Perfil
                  </Button>
                </Link>
                <Button className="flex-1 gap-2">
                  <UserPlus className="h-4 w-4" />
                  Conectar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};
