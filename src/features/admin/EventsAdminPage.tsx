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
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/shared/components/ConfirmDialog';
import { EventFormDialog } from './components/EventFormDialog';

import { eventsService } from '@/shared/services/events.service';

import EventAttendeesDialog from '@/features/admin/components/EventAttendeesDialog';

export const EventsAdminPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [eventToDelete, setEventToDelete] = useState<{ id: string; title: string } | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [attOpen, setAttOpen] = useState(false);
  const [attEventId, setAttEventId] = useState<string>('');
  const [attEventTitle, setAttEventTitle] = useState<string>('');

  async function load() {
    setLoading(true);
    try {
      const list = await eventsService.getAll({ sort: '-startAt' });
      const normalized = (Array.isArray(list) ? list : []).map((e: any) => ({
        ...e,
        id: e.id ?? e._id,
      }));
      setEvents(normalized);
    } catch (e: any) {
      console.error('Error cargando eventos:', e);
      toast.error(e?.message ?? 'No se pudo cargar la lista de eventos');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const handleEdit = (event: any) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDelete = (eventId: string, eventTitle: string) => {
    setEventToDelete({ id: eventId, title: eventTitle });
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!eventToDelete?.id) return;
    try {
      await eventsService.remove(eventToDelete.id);
      toast.success(`Evento "${eventToDelete.title}" eliminado`);
      setEventToDelete(null);
      setConfirmOpen(false);
      await load();
    } catch (e: any) {
      console.error('Error eliminando evento:', e);
      toast.error(e?.message ?? 'No se pudo eliminar el evento');
    }
  };

  const handleSaveEvent = async (eventData: any) => {
    try {
      const payload: any = {
        title: eventData.title,
        category: eventData.category || undefined,
        startAt: eventData.date ? new Date(eventData.date).toISOString() : undefined,
        location: eventData.location ? { name: eventData.location } : undefined,
        description: eventData.description || undefined,
        capacity: eventData.capacity ? Number(eventData.capacity) : undefined,
      };

      if (selectedEvent?.id) {
        await eventsService.update(selectedEvent.id, payload); // PUT
        toast.success('Evento actualizado');
      } else {
        await eventsService.create(payload); // POST
        toast.success('Evento creado');
      }

      setDialogOpen(false);
      setSelectedEvent(null);
      await load();
    } catch (e: any) {
      console.error('Error guardando evento:', e);
      toast.error(e?.message ?? 'No se pudo guardar el evento');
    }
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
                  {(() => {
                    const raw = event.date ?? event.startAt;
                    if (!raw) return '—';
                    const d = new Date(raw);
                    return isNaN(d.getTime())
                      ? '—'
                      : d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
                  })()}
                </TableCell>
                <TableCell>{event.location?.name ?? event.location ?? '—'}</TableCell>
                <TableCell>
                  {event.enrolled} / {event.capacity}
                </TableCell>
                <TableCell>
                  <Badge variant="default">Activo</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAttEventId(event.id ?? event._id);        // id seguro
                        setAttEventTitle(event.title ?? 'Evento');
                        setAttOpen(true);
                      }}
                    >
                      Asistentes{typeof event.enrolled === 'number' ? ` (${event.enrolled})` : ''}
                    </Button>
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
      {attEventId && (
        <EventAttendeesDialog
          eventId={attEventId}
          open={attOpen}
          onOpenChange={setAttOpen}
          title={attEventTitle}
        />
      )}
    </Container>
  );
};
