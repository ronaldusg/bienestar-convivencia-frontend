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
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { EventFormDialog } from './components/EventFormDialog';

export const EventsAdminPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventToDelete, setEventToDelete] = useState<{ id: string; title: string } | null>(null);
  const events = [
    {
      id: '1',
      title: 'Torneo de Fútbol',
      category: 'Deportes',
      date: '2025-11-05',
      location: 'Cancha Principal',
      enrolled: 145,
      capacity: 200,
      status: 'active',
    },
    {
      id: '2',
      title: 'Charla Salud Mental',
      category: 'Salud',
      date: '2025-11-08',
      location: 'Auditorio',
      enrolled: 89,
      capacity: 150,
      status: 'active',
    },
    {
      id: '3',
      title: 'Festival Cultural',
      category: 'Cultura',
      date: '2025-11-12',
      location: 'Plaza Central',
      enrolled: 320,
      capacity: 500,
      status: 'active',
    },
  ];

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDelete = (eventId: string, eventTitle: string) => {
    setEventToDelete({ id: eventId, title: eventTitle });
    setConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      toast.success(`Evento "${eventToDelete.title}" eliminado`);
      setEventToDelete(null);
    }
  };

  const handleSaveEvent = (eventData: any) => {
    console.log('Guardando evento:', eventData);
  };

  return (
    <Container>
      <SectionHeader
        title="Gestión de Eventos"
        subtitle="Administra los eventos de la plataforma"
        actions={
          <Button onClick={() => { setSelectedEvent(null); setDialogOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Evento
          </Button>
        }
      />

      <EventFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        event={selectedEvent}
        onSave={handleSaveEvent}
      />

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Eliminar evento?"
        description={`¿Estás seguro de que deseas eliminar el evento "${eventToDelete?.title}"? Esta acción no se puede deshacer.`}
        onConfirm={confirmDelete}
      />

      {/* Events Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Inscritos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{event.category}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  {event.enrolled} / {event.capacity}
                </TableCell>
                <TableCell>
                  <Badge variant="default">Activo</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(event.id, event.title)}
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
