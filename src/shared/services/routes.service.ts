import api from '../api';

function mapRoute(raw: any): Route {
  const dt = raw?.dateTime ? new Date(raw.dateTime) : null;
  const iso = dt ? dt.toISOString() : '';
  const date = iso ? iso.slice(0, 10) : '';       // YYYY-MM-DD
  const time = iso ? iso.slice(11, 16) : '';      // HH:mm

  const originText =
    typeof raw?.origin === 'string'
      ? raw.origin
      : raw?.origin?.address ?? raw?.origin?.name ?? '';

  const destText =
    typeof raw?.destination === 'string'
      ? raw.destination
      : raw?.destination?.address ?? raw?.destination?.name ?? '';

  const passengersCount = Array.isArray(raw?.passengers) ? raw.passengers.length : 0;
  const totalSeats = raw?.totalSeats ?? raw?.capacity ?? (raw?.availableSeats != null ? raw.availableSeats + passengersCount : undefined);

  return {
    id: raw?._id ?? raw?.id ?? '',
    title: raw?.title ?? `${originText} → ${destText}`,
    origin: originText,
    destination: destText,
    date,
    time,
    driverId: raw?.driverId ?? raw?.driver?._id ?? '',
    driverName: raw?.driverName ?? raw?.driver?.name ?? '',
    totalSeats: totalSeats ?? 0,
    availableSeats:
      raw?.availableSeats != null
        ? raw.availableSeats
        : Math.max(0, (totalSeats ?? 0) - passengersCount),
    price: raw?.price ?? 0,
    status:
      (raw?.status as Route['status']) ??
      ((raw?.availableSeats ?? 0) <= 0 ? 'full' : 'available'),
    passengers: raw?.passengers ?? [],
    isJoined: Boolean(raw?.isJoined),
  };
}

export interface Route {
  id: string;
  title: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  driverId: string;
  driverName: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: 'available' | 'full' | 'completed';
  passengers?: string[];
  isJoined?: boolean;
}

interface RoutesResponse {
  success: boolean;
  data: {
    routes: Route[];
  };
}

interface RouteResponse {
  success: boolean;
  data: {
    route: Route;
  };
}

interface MessageResponse {
  success: boolean;
  message: string;
}

export const routesService = {
  // async getAll(): Promise<Route[]> {
  //   const response = await api.get<any, RoutesResponse>('/routes');
  //   return response.data.routes;
  // },
  // async getAll(params?: {
  //   origin?: string;
  //   destination?: string;
  //   dateFrom?: string; // 'YYYY-MM-DD'
  // }): Promise<Route[]> {
  //   const qs = new URLSearchParams();
  //   if (params?.origin) qs.set('origin', params.origin);
  //   if (params?.destination) qs.set('destination', params.destination);
  //   if (params?.dateFrom) qs.set('dateFrom', params.dateFrom);

  //   const res = await api.get(`/routes?${qs.toString()}`);

  //   // Normaliza varias formas de respuesta posibles
  //   const list =
  //     (res as any)?.routes ??
  //     (res as any)?.data?.routes ??
  //     (Array.isArray(res) ? res : (res as any)?.data) ??
  //     [];

  //   return Array.isArray(list) ? list : [];
  // },

  async getAll(params?: { origin?: string; destination?: string; dateFrom?: string }): Promise<Route[]> {
    const qs = new URLSearchParams();
    if (params?.origin) qs.set('origin', params.origin);
    if (params?.destination) qs.set('destination', params.destination);
    if (params?.dateFrom) qs.set('dateFrom', params.dateFrom);

    const res = await api.get(`/routes?${qs.toString()}`);

    const list =
      (res as any)?.routes ??
      (res as any)?.data?.routes ??
      (Array.isArray(res) ? res : (res as any)?.data) ??
      [];

    return Array.isArray(list) ? list.map(mapRoute) : [];
  },

  // async getById(id: string): Promise<Route> {
  //   const response = await api.get<any, RouteResponse>(`/routes/${id}`);
  //   return response.data.route;
  // },
  // async getById(id: string): Promise<Route> {
  //   const res = await api.get(`/routes/${id}`);
  //   return (res as any)?.route ?? (res as any)?.data?.route ?? (res as any);
  // },
  async getById(id: string): Promise<Route> {
    const res = await api.get(`/routes/${id}`);
    const raw = (res as any)?.route ?? (res as any)?.data?.route ?? (res as any);
    return mapRoute(raw);
  },

  async create(data: Partial<Route>): Promise<Route> {
    const response = await api.post<any, RouteResponse>('/routes', data);
    return response.data.route;
  },

  async update(id: string, data: Partial<Route>): Promise<Route> {
    const response = await api.put<any, RouteResponse>(`/routes/${id}`, data);
    return response.data.route;
  },

  // async join(id: string): Promise<string> {
  //   const response = await api.post<any, MessageResponse>(`/routes/${id}/join`);
  //   return response.message;
  // },
  async join(id: string): Promise<string> {
    const res = await api.post(`/routes/${id}/join`, {});
    return (res as any)?.message ?? (res as any)?.data?.message ?? 'OK';
  },

  // async leave(id: string): Promise<string> {
  //   const response = await api.post<any, MessageResponse>(`/routes/${id}/leave`);
  //   return response.message;
  // },
  async leave(id: string): Promise<string> {
    const res = await api.post(`/routes/${id}/leave`, {});
    return (res as any)?.message ?? (res as any)?.data?.message ?? 'OK';
  },

  async remove(id: string): Promise<string> {
    const res = await api.delete(`/routes/${id}`);
    return (res as any)?.message ?? (res as any)?.data?.message ?? 'Ruta eliminada';
  },  
};
