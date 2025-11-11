import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { eventsService, EventAttendee } from '@/shared/services/events.service';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

type Props = {
  eventId: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string; // opcional, por si quieres mostrar el nombre del evento
};

export default function EventAttendeesDialog({ eventId, open, onOpenChange, title }: Props) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<EventAttendee[]>([]);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await eventsService.getAttendees(eventId);
        if (!mounted) return;
        setItems(Array.isArray(list) ? list : []);
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? 'No se pudieron cargar los asistentes');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [open, eventId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Asistentes {title ? `— ${title}` : ''}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground py-4">Cargando asistentes…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">Aún no hay asistentes registrados.</p>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registrado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {a.joinedAt ? new Date(a.joinedAt).toLocaleString() : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}