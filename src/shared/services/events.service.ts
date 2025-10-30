import api from '../api';

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  capacity: number;
  enrolled: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  imageUrl?: string;
  isEnrolled?: boolean;
}

interface EventsResponse {
  success: boolean;
  data: {
    events: Event[];
    total?: number;
    page?: number;
    limit?: number;
  };
}

interface EventResponse {
  success: boolean;
  data: {
    event: Event;
  };
}

interface MessageResponse {
  success: boolean;
  message: string;
}

export const eventsService = {
  async getAll(filters?: {
    category?: string;
    dateFrom?: string;
    location?: string;
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<Event[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.sort) params.append('sort', filters.sort);

    const response = await api.get<any, EventsResponse>(`/events?${params.toString()}`);
    return response.data.events;
  },

  async getById(id: string): Promise<Event> {
    const response = await api.get<any, EventResponse>(`/events/${id}`);
    return response.data.event;
  },

  async create(data: Partial<Event>): Promise<Event> {
    const response = await api.post<any, EventResponse>('/events', data);
    return response.data.event;
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const response = await api.put<any, EventResponse>(`/events/${id}`, data);
    return response.data.event;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/events/${id}`);
  },

  async register(id: string): Promise<string> {
    const response = await api.post<any, MessageResponse>(`/events/${id}/register`);
    return response.message;
  },

  async unregister(id: string): Promise<string> {
    const response = await api.post<any, MessageResponse>(`/events/${id}/unregister`);
    return response.message;
  },
};
