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

export type EventAttendee = {
  id: string;
  name: string;
  email: string;
  joinedAt?: string;
};

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

    // const response = await api.get<any, EventsResponse>(`/events?${params.toString()}`);
    //return response.data.events;
    const res = await api.get<any, any>(`/events?${params.toString()}`);
    const raw = res?.data?.events ?? res?.events ?? res?.data ?? res;
    const list: any[] = Array.isArray(raw) ? raw : Array.isArray(res) ? res : [];
    return list.map((e: any) => ({ ...e, id: e.id ?? e._id }));
  },

  async getById(id: string): Promise<Event> {
    // const response = await api.get<any, EventResponse>(`/events/${id}`);
    // return response.data.event;
    const res = await api.get<any, any>(`/events/${id}`);
    const raw = res?.data?.event ?? res?.event ?? res?.data ?? res;
    return { ...(raw || {}), id: raw?.id ?? raw?._id } as Event;
  },

  async create(data: Partial<Event>): Promise<Event> {
    // const response = await api.post<any, EventResponse>('/events', data);
    // return response.data.event;
    const res = await api.post<any, any>('/events', data);
    const raw = res?.data?.event ?? res?.event ?? res?.data ?? res;
    return { ...(raw || {}), id: raw?.id ?? raw?._id } as Event;
  },

  async update(id: string, data: Partial<Event>): Promise<Event> {
    // const response = await api.put<any, EventResponse>(`/events/${id}`, data);
    // return response.data.event;
    const res = await api.put<any, any>(`/events/${id}`, data);
    const raw = res?.data?.event ?? res?.event ?? res?.data ?? res;
    return { ...(raw || {}), id: raw?.id ?? raw?._id } as Event;
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

  async remove(id: string): Promise<string> {
    const response = await api.delete<any, MessageResponse>(`/events/${id}`);
    return response.message;
  },

  async getAttendees(eventId: string): Promise<EventAttendee[]> {
    const res = await api.get<any, any>(`/events/${eventId}/attendees`);

    // Soporta varias formas de respuesta
    const container = res?.data ?? res;
    const rawList =
      container?.attendees ??
      container?.data?.attendees ??
      (Array.isArray(container) ? container : []);

    // Mapeo tolerante: directo o anidado en "user"
    const map = (r: any): EventAttendee => {
      const u = r?.user && typeof r.user === 'object' ? r.user : r;
      return {
        id: u?.id ?? u?._id ?? '',
        name: u?.name ?? u?.fullName ?? u?.username ?? u?.email ?? '—',
        email: u?.email ?? '—',
        joinedAt: r?.joinedAt ?? r?.createdAt ?? u?.joinedAt ?? undefined,
      };
    };

    return Array.isArray(rawList) ? rawList.map(map) : [];
  },

  enroll: (id: string) => api.post(`/events/${id}/register`).then(r => r.data),
  unenroll: (id: string) => api.post(`/events/${id}/unregister`).then(r => r.data),
};
