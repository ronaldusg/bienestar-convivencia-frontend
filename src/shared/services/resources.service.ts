import api from '../api';

export interface Resource {
  id: string;
  title: string;
  description: string;
  content?: string;              // ← añade esto
  type: 'health' | 'counseling' | 'academic' | 'financial' | 'other';
  contact: string | { email?: string; phone?: string; name?: string; general?: string };
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

// function mapResource(raw: any): Resource {
//   // Mapea posibles valores del backend a tu union (ajusta si usas otros)
//   const mapType = (t: any): Resource['type'] => {
//     const v = String(t ?? '').toLowerCase();
//     if (['salud', 'health'].includes(v)) return 'health';
//     if (['orientacion', 'counseling', 'psicologia'].includes(v)) return 'counseling';
//     if (['academico', 'académico', 'academic', 'biblioteca'].includes(v)) return 'academic';
//     if (['financiero', 'financial', 'becas'].includes(v)) return 'financial';
//     return 'other';
//   };

//   // contact puede venir string u objeto
//   const contact =
//     typeof raw?.contact === 'string'
//       ? raw.contact
//       : raw?.contact?.email ?? raw?.email ?? '';

//   const phone =
//     raw?.phone ??
//     (typeof raw?.contact === 'object' ? raw?.contact?.phone : undefined);

//   return {
//     id: raw?.id ?? raw?._id ?? '',
//     title: raw?.title ?? '',
//     description: raw?.description ?? '',
//     type: mapType(raw?.type),
//     contact,
//     location: raw?.location ?? raw?.address ?? undefined,
//     hours: raw?.hours ?? raw?.openingHours ?? undefined,
//     visible: typeof raw?.visible === 'boolean' ? raw.visible : true,
//   } as Resource;
// }

function mapResource(raw: any): Resource {
  // 1) Normaliza tipo (incluye "orientación")
  const mapType = (t: any): Resource['type'] => {
    const v = String(t ?? '').toLowerCase();
    if (['salud', 'health'].includes(v)) return 'health';
    if (['orientacion', 'orientación', 'counseling', 'psicologia', 'psicología', 'bienestar'].includes(v)) return 'counseling';
    if (['academico', 'académico', 'academic', 'biblioteca'].includes(v)) return 'academic';
    if (['financiero', 'financial', 'becas'].includes(v)) return 'financial';
    return 'other';
  };

  // 2) Extrae texto robusto (prefiere content si existe)
  const pickText = (r: any): string => {
    const c = r?.content;
    if (typeof c === 'string' && c.trim()) return c.trim();
    if (c && typeof c === 'object') {
      const inner = c.text ?? c.plain ?? c.value ?? c.body ?? c.markdown ?? c.html ?? c.description;
      if (typeof inner === 'string' && inner.trim()) return inner.trim();
    }
    const d = r?.description;
    return typeof d === 'string' ? d.trim() : '';
  };

  // 3) Mantén contact como objeto si viene así (no lo reduzcas solo a email)
  const contact =
    typeof raw?.contact === 'object' && raw?.contact !== null
      ? {
          email: raw?.contact?.email ?? raw?.email,
          phone: raw?.contact?.phone,
          name: raw?.contact?.name,
          general: raw?.contact?.general,
        }
      : (raw?.contact ?? raw?.email ?? '');

  return {
    id: raw?.id ?? raw?._id ?? '',
    title: raw?.title ?? '',
    description: pickText(raw),                       // ← ahora sí llega al detalle
    content:
      typeof raw?.content === 'string' ? raw.content.trim() : undefined, // se expone por si lo usas
    type: mapType(raw?.type),
    contact,
    location: raw?.location ?? raw?.address ?? undefined,
    hours: raw?.hours ?? raw?.openingHours ?? undefined,
    visible: typeof raw?.visible === 'boolean' ? raw.visible : true,
  };
}

// export const resourcesService = {
//   async getAll(params?: { includeHidden?: boolean }): Promise<Resource[]> {
//     const qs = new URLSearchParams();
//     if (params?.includeHidden) qs.append('includeHidden', '1');

//     const response = await api.get(`/resources${qs.toString() ? `?${qs.toString()}` : ''}`);
//     const data = (response as any)?.data ?? response;
//     const list =
//       data?.resources ??
//       (Array.isArray(data) ? data : []);

//     return list;
//   },

//   // getById
//   async getById(id: string): Promise<Resource> {
//     const response = await api.get(`/resources/${id}`);
//     const r = (response as any)?.data?.resource ?? (response as any)?.resource ?? response;
//     return r;
//   },

//   // create
//   async create(data: Partial<Resource>): Promise<Resource> {
//     const response = await api.post('/resources', data);
//     const r = (response as any)?.data?.resource ?? (response as any)?.resource ?? response;
//     return r;
//   },

//   // update
//   async update(id: string, data: Partial<Resource>): Promise<Resource> {
//     const response = await api.put(`/resources/${id}`, data);
//     const r = (response as any)?.data?.resource ?? (response as any)?.resource ?? response;
//     return r;
//   },

//   async delete(id: string): Promise<void> {
//     await api.delete(`/resources/${id}`);
//   },

//   async remove(id: string): Promise<string> {
//     const response = await api.delete<any, { message?: string }>(`/resources/${id}`);
//     return response?.message ?? 'Recurso eliminado';
//   },
// };

export const resourcesService = {
  // async getAll(params?: { includeHidden?: boolean }): Promise<Resource[]> {
  //   const qs = new URLSearchParams();
  //   if (params?.includeHidden) qs.append('includeHidden', '1');

  //   const response = await api.get(`/resources${qs.toString() ? `?${qs.toString()}` : ''}`);
  //   const data = (response as any)?.data ?? response;
  //   const list = data?.resources ?? (Array.isArray(data) ? data : []);
  //   return Array.isArray(list) ? list.map(mapResource) : [];
  // },

  async getAll(params?: { includeHidden?: boolean }): Promise<Resource[]> {
    const qs = new URLSearchParams();
    if (params?.includeHidden) qs.append('includeHidden', '1');

    const response = await api.get(`/resources${qs.toString() ? `?${qs.toString()}` : ''}`);
    const data = (response as any)?.data ?? response;
    const list = data?.resources ?? (Array.isArray(data) ? data : []);

    // 🔧 Normaliza: id y description desde content si viene así
    return (Array.isArray(list) ? list : []).map((r: any) => ({
      id: r.id ?? r._id ?? '',
      title: r.title ?? '',
      description: (typeof r.description === 'string' && r.description.trim())
        ? r.description.trim()
        : (typeof r.content === 'string' ? r.content.trim() : ''),
      content: r.content, // lo seguimos exponiendo por si lo necesitas
      type: r.type ?? 'other',
      contact: r.contact ?? '',
      location: r.location,
      hours: r.hours,
      visible: Boolean(r.visible),
    }));
  },

  // async getById(id: string): Promise<Resource> {
  //   const response = await api.get(`/resources/${id}`);
  //   const raw = (response as any)?.data?.resource ?? (response as any)?.resource ?? response;
  //   return mapResource(raw);
  // },

  async getById(id: string): Promise<Resource> {
    const response = await api.get(`/resources/${id}`);

    // Soporta {success,data:{resource}}, {data:{resource}}, {resource}, o el objeto directo
    const container = (response as any)?.data ?? response;
    const raw =
      container?.resource ??
      container?.data?.resource ??
      (container?.data && !container?.resources ? container?.data : null) ??
      (container && !container?.resources ? container : null);

    if (!raw) {
      console.error('[resourcesService.getById] ⚠️ sin recurso en respuesta:', response);
      throw new Error('Recurso no encontrado');
    }

    const mapped = mapResource(raw);
    console.log('[resourcesService.getById] OK ->', { raw, mapped });
    return mapped;
  },

  async create(data: Partial<Resource>): Promise<Resource> {
    const response = await api.post('/resources', data);
    const raw = (response as any)?.data?.resource ?? (response as any)?.resource ?? response;
    return mapResource(raw);
  },

  async update(id: string, data: Partial<Resource>): Promise<Resource> {
    const response = await api.put(`/resources/${id}`, data);
    const raw = (response as any)?.data?.resource ?? (response as any)?.resource ?? response;
    return mapResource(raw);
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/resources/${id}`);
  },

  async remove(id: string): Promise<string> {
    const response = await api.delete(`/resources/${id}`);
    const data = (response as any)?.data ?? response;
    return data?.message ?? 'Recurso eliminado';
  },
};
