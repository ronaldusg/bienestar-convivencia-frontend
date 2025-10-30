import { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Edit2, Mail, Phone, GraduationCap, Globe, Save, X, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [editingInterests, setEditingInterests] = useState(false);
  const [newInterest, setNewInterest] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+57 300 123 4567',
    faculty: user?.faculty || 'Ingeniería',
    career: user?.career || 'Ingeniería de Sistemas',
    nationality: user?.nationality || 'Colombia',
    interests: user?.interests || ['Tecnología', 'Deportes', 'Música'],
  });

  const handleSave = () => {
    toast.success('Perfil actualizado exitosamente');
    setEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      faculty: user?.faculty || '',
      career: user?.career || '',
      nationality: user?.nationality || '',
      interests: user?.interests || [],
    });
    setEditing(false);
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()],
      });
      setNewInterest('');
      toast.success('Interés agregado');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
    toast.success('Interés eliminado');
  };

  const handleSaveInterests = () => {
    toast.success('Intereses actualizados');
    setEditingInterests(false);
  };

  return (
    <Container>
      <SectionHeader
        title="Mi Perfil"
        subtitle="Gestiona tu información personal y preferencias"
        actions={
          !editing && (
            <Button onClick={() => setEditing(true)} className="gap-2">
              <Edit2 className="h-4 w-4" />
              Editar Perfil
            </Button>
          )
        }
      />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-32 w-32 mx-auto mb-4">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-xl">{formData.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{formData.email}</p>
            <Badge variant="secondary" className="mt-2">
              {user?.role === 'admin' ? 'Administrador' : 'Estudiante'}
            </Badge>
          </CardHeader>
        </Card>

        {/* Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {editing ? (
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nacionalidad</Label>
                    <Input
                      id="nationality"
                      value={formData.nationality}
                      onChange={(e) =>
                        setFormData({ ...formData, nationality: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty">Facultad</Label>
                    <Input
                      id="faculty"
                      value={formData.faculty}
                      onChange={(e) =>
                        setFormData({ ...formData, faculty: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="career">Carrera</Label>
                    <Input
                      id="career"
                      value={formData.career}
                      onChange={(e) =>
                        setFormData({ ...formData, career: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Guardar Cambios
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Mail className="h-5 w-5" />
                  <div>
                    <p className="text-xs">Email</p>
                    <p className="font-medium text-foreground">{formData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Phone className="h-5 w-5" />
                  <div>
                    <p className="text-xs">Teléfono</p>
                    <p className="font-medium text-foreground">{formData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Globe className="h-5 w-5" />
                  <div>
                    <p className="text-xs">Nacionalidad</p>
                    <p className="font-medium text-foreground">{formData.nationality}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <GraduationCap className="h-5 w-5" />
                  <div>
                    <p className="text-xs">Facultad y Carrera</p>
                    <p className="font-medium text-foreground">
                      {formData.faculty} - {formData.career}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Interests Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Intereses</CardTitle>
              {!editingInterests ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingInterests(true)}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Editar
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingInterests(false)}
                  >
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveInterests}>
                    Guardar
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {editingInterests && (
              <div className="flex gap-2">
                <Input
                  placeholder="Agregar interés..."
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddInterest();
                    }
                  }}
                />
                <Button onClick={handleAddInterest} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.interests.map((interest) => (
                <Badge
                  key={interest}
                  variant="secondary"
                  className="px-3 py-1 flex items-center gap-1"
                >
                  {interest}
                  {editingInterests && (
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
};
