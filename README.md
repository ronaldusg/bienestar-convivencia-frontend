# Bienestar y Convivencia - Plataforma Universitaria

Plataforma web integral para la gestión de bienestar estudiantil y convivencia universitaria.

## 🎯 Características

### Para Estudiantes
- **Dashboard**: Vista general con eventos próximos y recursos destacados
- **Eventos**: Explorar y registrarse en eventos universitarios
- **Comunidad**: Conectar con otros estudiantes por intereses, carrera o nacionalidad
- **Rutas Compartidas**: Encontrar compañeros de viaje y compartir transporte
- **Recursos**: Acceder a servicios de bienestar institucional
- **Perfil**: Gestionar información personal y preferencias

### Para Administradores
- **Panel de Control**: Métricas y estadísticas de la plataforma
- **Gestión de Usuarios**: Administrar usuarios y roles
- **Gestión de Eventos**: Crear, editar y eliminar eventos
- **Gestión de Recursos**: Administrar recursos de bienestar

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilos**: TailwindCSS + shadcn/ui
- **Routing**: React Router v6
- **Formularios**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library

## 📁 Estructura del Proyecto

```
src/
├── features/           # Módulos por funcionalidad
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Dashboard principal
│   ├── events/        # Eventos
│   ├── community/     # Comunidad
│   ├── routes/        # Rutas compartidas
│   ├── resources/     # Recursos de bienestar
│   ├── profile/       # Perfil de usuario
│   └── admin/         # Panel administrativo
├── shared/            # Componentes y utilidades compartidas
│   ├── components/    # Componentes reutilizables
│   ├── contexts/      # Context API (Auth)
│   ├── guards/        # Protección de rutas
│   ├── layouts/       # Layouts de la aplicación
│   └── types/         # Tipos TypeScript
├── components/ui/     # Componentes de UI (shadcn)
└── assets/           # Imágenes y recursos estáticos
```

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+ y npm

### Configuración

1. Clonar el repositorio
```bash
git clone <repository-url>
cd bienestar-convivencia-frontend
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:
```env
VITE_API_BASE_URL=http://localhost:4000/api
VITE_GOOGLE_MAPS_KEY=tu_api_key_aqui
```

4. Iniciar servidor de desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 📦 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run test       # Ejecutar tests
npm run lint       # Linter
```

## 🔐 Autenticación

La plataforma incluye un sistema de autenticación con JWT:

### Rutas Protegidas
- Todas las rutas principales requieren autenticación
- Las rutas `/admin/*` requieren rol de administrador
- Redirección automática al login si no está autenticado

## 🎨 Diseño y Estilo

### Colores Principales
- **Primary (Rojo Institucional)**: `#B71C1C` (HSL: 0 72% 41%)
- **Secundarios**: Blancos y grises neutros
- **Tipografía**: Inter

### Design System
Todos los estilos están centralizados en:
- `src/index.css` - Variables CSS y tokens de diseño
- `tailwind.config.ts` - Configuración de Tailwind

### Componentes UI
Basados en shadcn/ui con personalización institucional

## 📱 Responsive Design

La plataforma es completamente responsiva con breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px


## 📄 Licencia

© 2025 Universidad - Bienestar y Convivencia