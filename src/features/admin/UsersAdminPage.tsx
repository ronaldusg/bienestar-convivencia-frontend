import { useEffect } from 'react';
import { usersService } from '@/shared/services/users.service';

import { useState } from 'react';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Edit2, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { UserFormDialog } from './components/UserFormDialog';

export const UsersAdminPage = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    usersService
      .getAll()
      .then((data) => {
        console.log('Usuarios cargados desde API:', data);
        setUsers(Array.isArray(data) ? data : (data as any)?.data ?? []);
      })
      .catch((err) => {
        console.error('Error al obtener usuarios:', err);
        setError(err.message || 'Error al obtener usuarios');
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDelete = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await usersService.remove(userToDelete.id);       // DELETE /users/:id
      toast.success(`Usuario ${userToDelete.name} eliminado`);

      const list = await usersService.getAll();
      setUsers(Array.isArray(list) ? list : (list as any)?.data ?? []);

      setUserToDelete(null);
      setConfirmOpen(false);
    } catch (e: any) {
      console.error('Error eliminando usuario:', e);
      toast.error(e?.message ?? 'No se pudo eliminar el usuario');
    }
  };

  const handleSaveUser = async (userData: any) => {
  try {
    if (selectedUser?.id || selectedUser?._id) {
      const id = selectedUser._id || selectedUser.id;
      await usersService.update(id, {
        name: userData.name,
        role: userData.role,
        faculty: userData.faculty,
      });
      toast.success(`Usuario ${userData.name} actualizado`);
    } else {
      const created = await usersService.create({
        name: userData.name,
        email: userData.email,
        password: 'Password123!',
        role: userData.role || 'student',
        faculty: userData.faculty,
      });
      toast.success(`Usuario ${created?.name ?? userData.name} creado`);
    }

    setDialogOpen(false);

    await usersService.getAll().then((data) => {
      setUsers(Array.isArray(data) ? data : (data as any)?.data ?? []);
    });

  } catch (e: any) {
    console.error('Error guardando usuario:', e);
    toast.error(e?.message ?? 'No se pudo guardar el usuario');
  }
};

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <Container>
      <SectionHeader
        title="Gestión de Usuarios"
        subtitle="Administra los usuarios de la plataforma"
        actions={
          <Button onClick={() => { setSelectedUser(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Usuario
          </Button>
        }
      />

      <UserFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Eliminar usuario?"
        description={`¿Estás seguro de que deseas eliminar al usuario "${userToDelete?.name}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
      />

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los roles</SelectItem>
            <SelectItem value="student">Estudiantes</SelectItem>
            <SelectItem value="admin">Administradores</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Facultad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              //<TableRow key={user.id}>
              <TableRow key={user._id || user.id || user.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role === 'admin' ? 'Admin' : 'Estudiante'}
                  </Badge>
                </TableCell>
                <TableCell>{user.faculty}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(user._id || user.id, user.name)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
};
