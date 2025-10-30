import api from '../api';

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
  async getAll(): Promise<Route[]> {
    const response = await api.get<any, RoutesResponse>('/routes');
    return response.data.routes;
  },

  async getById(id: string): Promise<Route> {
    const response = await api.get<any, RouteResponse>(`/routes/${id}`);
    return response.data.route;
  },

  async create(data: Partial<Route>): Promise<Route> {
    const response = await api.post<any, RouteResponse>('/routes', data);
    return response.data.route;
  },

  async update(id: string, data: Partial<Route>): Promise<Route> {
    const response = await api.put<any, RouteResponse>(`/routes/${id}`, data);
    return response.data.route;
  },

  async join(id: string): Promise<string> {
    const response = await api.post<any, MessageResponse>(`/routes/${id}/join`);
    return response.message;
  },

  async leave(id: string): Promise<string> {
    const response = await api.post<any, MessageResponse>(`/routes/${id}/leave`);
    return response.message;
  },
};
