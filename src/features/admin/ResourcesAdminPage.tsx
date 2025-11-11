import { useEffect, useState } from 'react';
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

import { resourcesService } from '@/shared/services/resources.service';

export const ResourcesAdminPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resourceToDelete, setResourceToDelete] = useState<{ id: string; title: string } | null>(null);

  const [items, setItems] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  
  async function load() {
    setLoading(true);
    try {
      const list = await resourcesService.getAll({ includeHidden: true });

      console.log('📦 Respuesta del backend /resources:', list);

      const normalized = (Array.isArray(list) ? list : []).map((r: any) => ({
        ...r,
        id: r.id ?? r._id,
      }));
      setItems(normalized);
    } catch (e: any) {
      console.error('Error cargando recursos:', e);
      toast.error(e?.message ?? 'No se pudo cargar la lista de recursos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const handleEdit = (resource: any) => {
    setSelectedResource(resource);
    setDialogOpen(true);
  };

  async function handleToggleVisibility(resourceId: string) {
    const current = items.find((i) => i.id === resourceId);
    await resourcesService.update(resourceId, { visible: !current.visible });
    toast.success('Visibilidad actualizada');
    await load();
  }

  const handleDelete = (resourceId: string, resourceTitle: string) => {
    setResourceToDelete({ id: resourceId, title: resourceTitle });
    setConfirmOpen(true);
  };

  async function confirmDelete() {
    if (!resourceToDelete?.id) return;
    try {
      await resourcesService.delete(resourceToDelete.id); // DELETE /resources/:id
      toast.success(`Recurso "${resourceToDelete.title}" eliminado`);
      setResourceToDelete(null);
      setConfirmOpen(false);
      await load();
    } catch (e: any) {
      console.error('Error eliminando recurso:', e);
      toast.error(e?.message ?? 'No se pudo eliminar el recurso');
    }
  }

  async function handleSaveResource(formData: any) {
    const payload = {
      title: formData.title,
      content: formData.description ?? formData.content ?? '',
      type: formData.type,
      contact: formData.contact ?? undefined,
      visible: typeof formData.visible === 'boolean' ? formData.visible : true,
      location: formData.location ?? undefined,
      hours: formData.hours ?? undefined,
    };
    try {
      const res = selectedResource?.id
        ? await resourcesService.update(selectedResource.id, payload)
        : await resourcesService.create(payload);
      await load();                 
      setDialogOpen(false);         
      toast.success(selectedResource?.id ? 'Recurso actualizado' : 'Recurso creado');
      return res;                   
    } catch (e: any) {
      console.error('Error guardando recurso:', e);
      toast.error(e?.message ?? 'No se pudo guardar el recurso');
      throw e;                      
    }
  }

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
            {items.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell className="font-medium">{resource.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{resource.type}</Badge>
                </TableCell>
                <TableCell>
                  {typeof resource.contact === 'string'
                    ? resource.contact
                    : [resource.contact?.email, resource.contact?.phone]
                        .filter(Boolean)
                        .join(' · ')
                  }
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleToggleVisibility(resource.id)
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
