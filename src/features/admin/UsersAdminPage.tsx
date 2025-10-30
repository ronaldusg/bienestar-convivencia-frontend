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

  const users = [
    {
      id: '1',
      name: 'Ana García',
      email: 'ana.garcia@mail.com',
      role: 'student',
      faculty: 'Ingeniería',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
    },
    {
      id: '2',
      name: 'Carlos Admin',
      email: 'admin@universidad.edu',
      role: 'admin',
      faculty: 'Administración',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
    },
    {
      id: '3',
      name: 'María López',
      email: 'maria.lopez@mail.com',
      role: 'student',
      faculty: 'Medicina',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    },
    {
      id: '4',
      name: 'Juan Pérez',
      email: 'juan.perez@mail.com',
      role: 'student',
      faculty: 'Artes',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
    },
  ];

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

  const confirmDelete = () => {
    if (userToDelete) {
      toast.success(`Usuario ${userToDelete.name} eliminado`);
      setUserToDelete(null);
    }
  };

  const handleSaveUser = (userData: any) => {
    // En producción aquí se haría la llamada a la API
    console.log('Guardando usuario:', userData);
  };

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
              <TableRow key={user.id}>
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
                      onClick={() => handleDelete(user.id, user.name)}
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
