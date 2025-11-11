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

import { useEffect } from 'react';
import { toast } from 'sonner';
import { usersService } from '@/shared/services/users.service';

import { Input } from '@/components/ui/input';

function norm(s: unknown) {
  return String(s ?? '')
    .normalize('NFD')               
    .replace(/\p{Diacritic}/gu, '') 
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');          
}

export const CommunityPage = () => {
  const [facultyFilter, setFacultyFilter] = useState('all');
  const [nationalityFilter, setNationalityFilter] = useState('all');
  const [interestFilter, setInterestFilter] = useState('');

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const filteredStudents = students
    .filter(Boolean) 
    .filter((student) => {
      const matchesFaculty = facultyFilter === 'all' || student.faculty === facultyFilter;
      const matchesNationality = nationalityFilter === 'all' || student.nationality === nationalityFilter;
      const q = norm(interestFilter);
      const matchesInterest =
        !q ||
        (Array.isArray(student.interests) && student.interests.some((i: string) => norm(i).includes(q)));
      return matchesFaculty && matchesNationality && matchesInterest;
    });

  useEffect(() => {
    const toParam = (v: string) => {
      const t = (v ?? '').trim();
      return t && t !== 'all' ? t : undefined;
    };

    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await usersService.getAll({
          faculty: toParam(facultyFilter),
          nationality: toParam(nationalityFilter),
          interests: toParam(interestFilter),
        });
        if (!mounted) return;
        setStudents(Array.isArray(data) ? data.filter(Boolean) : []);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.response?.data?.message ?? 'No se pudo cargar la comunidad');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [facultyFilter, nationalityFilter]);

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

            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por interés..."
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((student, idx) => {

          const sid = student?._id ?? student?.id ?? `row-${idx}`;

          return (
            <Card key={sid} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={student?.avatar} />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {(student?.name ?? 'U').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{student?.name ?? 'Usuario'}</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{student?.faculty ?? '—'}</span>
                </div>
                <p className="text-sm text-muted-foreground">{student?.career ?? '—'}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-1">
                  <Globe className="h-4 w-4" />
                  <span>{student?.nationality ?? '—'}</span>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Intereses</p>
                  <div className="flex flex-wrap gap-2">
                    {(Array.isArray(student?.interests) ? student.interests : []).map((interest: string) => (
                      <Badge key={interest} variant="secondary" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link to={student?._id || student?.id ? `/community/${sid}` : '#'} className="flex-1">
                    <Button variant="outline" className="w-full gap-2" disabled={!student?._id && !student?.id}>
                      <Eye className="h-4 w-4" />
                      Ver Perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading && <p className="text-center text-sm text-muted-foreground py-8">Cargando comunidad…</p>}

      {!loading && students.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No se encontraron estudiantes con los filtros seleccionados.
        </p>
      )}

    </Container>
  );
};
