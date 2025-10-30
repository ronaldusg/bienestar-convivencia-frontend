import api from '@/shared/api';

export default function DebugCalls() {
  // Este componente crea tres botones, cada uno llama a un endpoint del backend
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        padding: '16px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxWidth: '300px',
      }}
    >
      <h2>Prueba de API</h2>
      <button
        onClick={() =>
          api.get('/events').then((res) => console.log('Eventos:', res.data)).catch(console.error)
        }
      >
        Test /events
      </button>
      <button
        onClick={() =>
          api.get('/routes').then((res) => console.log('Rutas:', res.data)).catch(console.error)
        }
      >
        Test /routes
      </button>
      <button
        onClick={() =>
          api.get('/resources').then((res) => console.log('Recursos:', res.data)).catch(console.error)
        }
      >
        Test /resources
      </button>
    </div>
  );
}