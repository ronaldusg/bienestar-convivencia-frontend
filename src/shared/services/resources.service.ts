import api from '../api';

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'health' | 'counseling' | 'academic' | 'financial' | 'other';
  contact: string;
  location?: string;
  hours?: string;
  visible: boolean;
}

interface ResourcesResponse {
  success: boolean;
  data: {
    resources: Resource[];
  };
}

interface ResourceResponse {
  success: boolean;
  data: {
    resource: Resource;
  };
}

export const resourcesService = {
  async getAll(): Promise<Resource[]> {
    const response = await api.get<any, ResourcesResponse>('/resources');
    return response.data.resources;
  },

  async getById(id: string): Promise<Resource> {
    const response = await api.get<any, ResourceResponse>(`/resources/${id}`);
    return response.data.resource;
  },

  async create(data: Partial<Resource>): Promise<Resource> {
    const response = await api.post<any, ResourceResponse>('/resources', data);
    return response.data.resource;
  },

  async update(id: string, data: Partial<Resource>): Promise<Resource> {
    const response = await api.put<any, ResourceResponse>(`/resources/${id}`, data);
    return response.data.resource;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/resources/${id}`);
  },
};
