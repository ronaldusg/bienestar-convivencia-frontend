import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/shared/components/Container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, GraduationCap, Globe, MessageCircle } from 'lucide-react';

import { usersService } from '@/shared/services/users.service';
import { useEffect, useState } from 'react';

import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

export const ProfileDetailPage = () => {
  const { id: routeId, userId } = useParams();
  const id = (routeId ?? userId) as string | undefined;

  const navigate = useNavigate();

  const [student, setStudent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        if (!id) {  
          setError('Perfil inválido: id ausente');
          return;
        }

        const data = await usersService.getById(id);

        const container = (data as any)?.data ?? data;
        let raw: any =
          container?.user ??
          container?.data?.user ??
          (container && typeof container === 'object' && !Array.isArray(container) ? container : null);

        if (!raw) {
          const list = await usersService.getAll?.();

          if (Array.isArray(list)) {
            raw = list.find((u: any) => (u?.id ?? u?._id) === id) ?? null;
          }
        }

        if (!raw || typeof raw !== 'object') {
          setError('Perfil no encontrado');
          setStudent(null);
          return;
        }

        setError(null);
        setStudent({
          ...raw,
          id: raw.id ?? raw._id ?? id, 
          name: raw.name ?? 'Usuario',
          avatar: raw.avatar ?? raw.photo ?? null,
          faculty: raw.faculty ?? '—',
          career: raw.career ?? '—',
          nationality: raw.nationality ?? '—',
          bio: raw.bio ?? '',
          interests: Array.isArray(raw.interests) ? raw.interests : [],
        });
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message ?? 'No se pudo cargar el perfil');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <p className="text-center text-sm text-muted-foreground py-8">Cargando perfil…</p>
      </Container>
    );
  }

  if (error || !student) {
    return (
      <Container>
        <div className="text-center py-12">
          <p className="text-muted-foreground">{error ?? 'Perfil no encontrado'}</p>
          <Button onClick={() => navigate('/community')} className="mt-4">
            Volver a Comunidad
          </Button>
        </div>
      </Container>
    );
  }

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
              <AvatarImage src={student.avatar ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {(student.name ?? 'U')[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{student.name ?? 'Usuario'}</CardTitle>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
              <GraduationCap className="h-4 w-4" />
              <span>{student.faculty ?? '—'}</span>
            </div>
            <p className="text-sm text-muted-foreground">{student.career ?? '—'}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-1">
              <Globe className="h-4 w-4" />
              <span>{student.nationality ?? '—'}</span>
            </div>
          </CardHeader>

          <CardContent>
            <Button
              className="w-full gap-2"
              onClick={() => {
                setConnected(true);
                toast.success(`Has enviado una solicitud de conexión a ${student.name ?? 'este usuario'}`);
              }}
              disabled={connected}
            >
              <UserPlus className="h-4 w-4" />
              {connected ? 'Solicitud enviada' : 'Conectar'}
            </Button>
          </CardContent>
        </Card>

        {/* Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sobre mí</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">{student.bio ?? 'Sin descripción'}</p>
            <div>
              <h3 className="font-semibold mb-3">Intereses</h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(student?.interests) ? student.interests : []).map((interest: string) => (
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
