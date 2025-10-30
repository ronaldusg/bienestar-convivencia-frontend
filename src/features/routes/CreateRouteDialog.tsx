import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const routeSchema = z.object({
  title: z.string().min(5, 'El título debe tener al menos 5 caracteres'),
  origin: z.string().min(3, 'El origen es requerido'),
  destination: z.string().min(3, 'El destino es requerido'),
  date: z.string().min(1, 'La fecha es requerida'),
  time: z.string().min(1, 'La hora es requerida'),
  totalSeats: z.string().min(1, 'Los cupos son requeridos'),
  price: z.string().min(1, 'El precio es requerido'),
});

type RouteFormValues = z.infer<typeof routeSchema>;

interface CreateRouteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateRoute: (route: RouteFormValues) => void;
}

export const CreateRouteDialog = ({
  open,
  onOpenChange,
  onCreateRoute,
}: CreateRouteDialogProps) => {
  const form = useForm<RouteFormValues>({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      title: '',
      origin: '',
      destination: '',
      date: '',
      time: '',
      totalSeats: '4',
      price: '',
    },
  });

  const onSubmit = (data: RouteFormValues) => {
    onCreateRoute(data);
    toast.success('Ruta creada exitosamente');
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nueva Ruta</DialogTitle>
          <DialogDescription>
            Publica una ruta compartida para que otros estudiantes puedan unirse
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la ruta</FormLabel>
                  <FormControl>
                    <Input placeholder="ej. Universidad → Centro Comercial" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origen</FormLabel>
                    <FormControl>
                      <Input placeholder="Punto de partida" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destino</FormLabel>
                    <FormControl>
                      <Input placeholder="Punto de llegada" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="totalSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cupos disponibles</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" max="8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por persona</FormLabel>
                    <FormControl>
                      <Input placeholder="ej. $5,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">Crear Ruta</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
