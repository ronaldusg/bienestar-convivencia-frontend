// import { useState } from 'react';
// import { Container } from '@/shared/components/Container';
// import { SectionHeader } from '@/shared/components/SectionHeader';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { MapPin, Clock, Users, Car } from 'lucide-react';
// import { toast } from 'sonner';
// import { CreateRouteDialog } from './CreateRouteDialog';

// export const RoutesPage = () => {
//   const [joinedRoutes, setJoinedRoutes] = useState<string[]>([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [routesList, setRoutesList] = useState([
//     {
//       id: '1',
//       title: 'Universidad → Centro Comercial Unicentro',
//       driver: {
//         name: 'Carlos Mendoza',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
//         rating: 4.8,
//       },
//       origin: 'Campus Principal',
//       destination: 'Unicentro',
//       time: '18:00',
//       date: '2025-10-30',
//       availableSeats: 3,
//       totalSeats: 4,
//       price: '$5,000',
//     },
//     {
//       id: '2',
//       title: 'Universidad → Portal del Norte',
//       driver: {
//         name: 'Ana García',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
//         rating: 4.9,
//       },
//       origin: 'Campus Principal',
//       destination: 'Portal del Norte',
//       time: '19:30',
//       date: '2025-10-30',
//       availableSeats: 2,
//       totalSeats: 4,
//       price: '$8,000',
//     },
//     {
//       id: '3',
//       title: 'Centro → Universidad',
//       driver: {
//         name: 'Laura Martínez',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Laura',
//         rating: 5.0,
//       },
//       origin: 'Centro Histórico',
//       destination: 'Campus Principal',
//       time: '07:00',
//       date: '2025-10-31',
//       availableSeats: 1,
//       totalSeats: 3,
//       price: '$6,000',
//     },
//     {
//       id: '4',
//       title: 'Universidad → Aeropuerto El Dorado',
//       driver: {
//         name: 'Diego Silva',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Diego',
//         rating: 4.7,
//       },
//       origin: 'Campus Principal',
//       destination: 'Aeropuerto',
//       time: '15:00',
//       date: '2025-11-02',
//       availableSeats: 2,
//       totalSeats: 3,
//       price: '$15,000',
//     },
//   ]);

//   const handleCreateRoute = (routeData: any) => {
//     const newRoute = {
//       id: (routesList.length + 1).toString(),
//       title: routeData.title,
//       driver: {
//         name: 'Usuario Demo',
//         avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Demo',
//         rating: 5.0,
//       },
//       origin: routeData.origin,
//       destination: routeData.destination,
//       time: routeData.time,
//       date: routeData.date,
//       availableSeats: parseInt(routeData.totalSeats),
//       totalSeats: parseInt(routeData.totalSeats),
//       price: routeData.price,
//     };
//     setRoutesList([...routesList, newRoute]);
//   };

//   const handleJoinRoute = (routeId: string) => {
//     if (joinedRoutes.includes(routeId)) {
//       setJoinedRoutes(joinedRoutes.filter(id => id !== routeId));
//       toast.success('Te has salido de la ruta');
//     } else {
//       setJoinedRoutes([...joinedRoutes, routeId]);
//       toast.success('¡Te has unido a la ruta!');
//     }
//   };

//   return (
//     <Container>
//       <SectionHeader
//         title="Rutas Compartidas"
//         subtitle="Encuentra compañeros de viaje y ahorra en transporte"
//         actions={
//           <Button onClick={() => setDialogOpen(true)} className="gap-2">
//             <Car className="h-4 w-4" />
//             Publicar Ruta
//           </Button>
//         }
//       />

//       <CreateRouteDialog
//         open={dialogOpen}
//         onOpenChange={setDialogOpen}
//         onCreateRoute={handleCreateRoute}
//       />

//       {/* Map Placeholder */}
//       <Card className="mb-6 overflow-hidden">
//         <div className="h-64 bg-muted flex items-center justify-center">
//           <div className="text-center">
//             <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
//             <p className="text-muted-foreground">
//               Mapa de rutas disponibles
//             </p>
//             <p className="text-sm text-muted-foreground">
//               (Integración con Google Maps)
//             </p>
//           </div>
//         </div>
//       </Card>

//       {/* Routes List */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {routesList.map((route) => (
//           <Card key={route.id} className="hover:shadow-lg transition-shadow">
//             <CardHeader>
//               <CardTitle className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <h3 className="text-lg font-semibold mb-2">{route.title}</h3>
//                   <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                     <Clock className="h-4 w-4" />
//                     <span>
//                       {new Date(route.date).toLocaleDateString('es-ES', {
//                         day: 'numeric',
//                         month: 'short',
//                       })}
//                       {' a las '}
//                       {route.time}
//                     </span>
//                   </div>
//                 </div>
//                 <span className="text-lg font-bold text-primary">{route.price}</span>
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {/* Driver Info */}
//               <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
//                 <Avatar>
//                   <AvatarImage src={route.driver.avatar} />
//                   <AvatarFallback>{route.driver.name.charAt(0)}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="font-medium">{route.driver.name}</p>
//                   <p className="text-sm text-muted-foreground">
//                     ⭐ {route.driver.rating} conductor
//                   </p>
//                 </div>
//               </div>

//               {/* Route Details */}
//               <div className="space-y-2">
//                 <div className="flex items-start gap-2">
//                   <MapPin className="h-5 w-5 text-primary mt-0.5" />
//                   <div>
//                     <p className="font-medium">{route.origin}</p>
//                     <p className="text-sm text-muted-foreground">Origen</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-2">
//                   <MapPin className="h-5 w-5 text-destructive mt-0.5" />
//                   <div>
//                     <p className="font-medium">{route.destination}</p>
//                     <p className="text-sm text-muted-foreground">Destino</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Seats */}
//               <div className="flex items-center gap-2 text-sm">
//                 <Users className="h-4 w-4 text-muted-foreground" />
//                 <span>
//                   {route.availableSeats} de {route.totalSeats} plazas disponibles
//                 </span>
//               </div>

//               {/* Action Button */}
//               <Button
//                 onClick={() => handleJoinRoute(route.id)}
//                 variant={joinedRoutes.includes(route.id) ? 'outline' : 'default'}
//                 className="w-full"
//                 disabled={route.availableSeats === 0}
//               >
//                 {joinedRoutes.includes(route.id)
//                   ? 'Salir de la ruta'
//                   : route.availableSeats === 0
//                   ? 'Sin plazas disponibles'
//                   : 'Unirse a la ruta'}
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </Container>
//   );
// };

import { useEffect, useState } from 'react';
import { routesService } from '@/shared/services/routes.service';
import { Container } from '@/shared/components/Container';
import { SectionHeader } from '@/shared/components/SectionHeader';

export const RoutesPage = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    routesService
      .getAll()
      .then((data) => {
        console.log('Rutas cargadas desde API:', data);
        //setRoutes(Array.isArray(data) ? data : data?.data || []);
        setRoutes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error('Error al obtener rutas:', err);
        setError(err.message || 'Error al obtener rutas');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando rutas...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <Container>
      <SectionHeader
        title="Rutas compartidas"
        subtitle="Descubre y únete a rutas universitarias disponibles"
      />

      <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
        {JSON.stringify(routes, null, 2)}
      </pre>
    </Container>
  );
};

export default RoutesPage;