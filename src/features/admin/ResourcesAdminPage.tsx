import { useState } from 'react';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { ResourceFormDialog } from './components/ResourceFormDialog';

export const ResourcesAdminPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resourceToDelete, setResourceToDelete] = useState<{ id: string; title: string } | null>(null);
  const resources = [
    {
      id: '1',
      title: 'Centro de Salud Universitario',
      type: 'Salud',
      contact: 'salud@universidad.edu',
      visible: true,
    },
    {
      id: '2',
      title: 'Asesoría Académica',
      type: 'Académico',
      contact: 'asesoria@universidad.edu',
      visible: true,
    },
    {
      id: '3',
      title: 'Apoyo Financiero',
      type: 'Financiero',
      contact: 'becas@universidad.edu',
      visible: true,
    },
    {
      id: '4',
      title: 'Biblioteca Central',
      type: 'Académico',
      contact: 'biblioteca@universidad.edu',
      visible: true,
    },
  ];

  const handleEdit = (resource: any) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  const handleToggleVisibility = (resourceId: string, resourceTitle: string) => {
    toast.success(`Visibilidad de "${resourceTitle}" actualizada`);
  };

  const handleDelete = (resourceId: string, resourceTitle: string) => {
    setResourceToDelete({ id: resourceId, title: resourceTitle });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (resourceToDelete) {
      toast.success(`Recurso "${resourceToDelete.title}" eliminado`);
      setResourceToDelete(null);
    }
  };

  const handleSaveResource = (resourceData: any) => {
    console.log('Guardando recurso:', resourceData);
  };

  return (
    <Container>
      <SectionHeader
        title="Gestión de Recursos"
        subtitle="Administra los recursos de bienestar de la plataforma"
        actions={
          <Button onClick={() => { setSelectedResource(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Recurso
          </Button>
        }
      />

      <ResourceFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        resource={selectedResource}
        onSave={handleSaveResource}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Eliminar recurso?"
        description={`¿Estás seguro de que deseas eliminar el recurso "${resourceToDelete?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
      />

      {/* Resources Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Recurso</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Visibilidad</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{resource.type}</Badge>
                </TableCell>
                <TableCell>{resource.contact}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleToggleVisibility(resource.id, resource.title)
                    }
                  >
                    {resource.visible ? (
                      <Eye className="h-4 w-4 text-primary" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(resource)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(resource.id, resource.title)}
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
