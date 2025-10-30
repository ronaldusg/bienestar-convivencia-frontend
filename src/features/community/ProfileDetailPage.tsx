import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, GraduationCap, Globe, MessageCircle } from 'lucide-react';

export const ProfileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - en producción vendría de la API
  const students = [
    {
      id: '1',
      name: 'Ana García Rodríguez',
      faculty: 'Ingeniería',
      career: 'Ingeniería de Sistemas',
      nationality: 'Colombia',
      interests: ['Tecnología', 'Deportes', 'Música'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      bio: 'Estudiante de último año apasionada por la tecnología y el desarrollo web. Me encanta colaborar en proyectos innovadores.',
    },
    {
      id: '2',
      name: 'Carlos Mendoza',
      faculty: 'Ciencias',
      career: 'Biología',
      nationality: 'México',
      interests: ['Naturaleza', 'Fotografía', 'Voluntariado'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      bio: 'Amante de la naturaleza y la fotografía. Busco conectar con personas interesadas en proyectos ambientales.',
    },
    {
      id: '3',
      name: 'María Fernández',
      faculty: 'Artes',
      career: 'Diseño Gráfico',
      nationality: 'España',
      interests: ['Arte', 'Cine', 'Teatro'],
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      bio: 'Diseñadora gráfica con pasión por las artes visuales y el cine. Siempre en busca de nuevas inspiraciones.',
    },
  ];

  const student = students.find((s) => s.id === id);

  if (!student) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Perfil no encontrado</p>
          <Button onClick={() => navigate('/community')} className="mt-4">
            Volver a Comunidad
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Button
        variant="ghost"
        onClick={() => navigate('/community')}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Comunidad
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src={student.avatar} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{student.name}</CardTitle>
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
            <Button className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              Enviar Mensaje
            </Button>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sobre mí</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{student.bio}</p>

            <div>
              <h3 className="font-semibold mb-3">Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {student.interests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="px-3 py-1">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Información Académica</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Facultad</p>
                    <p className="font-medium">{student.faculty}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-7">
                  <div>
                    <p className="text-sm text-muted-foreground">Carrera</p>
                    <p className="font-medium">{student.career}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
