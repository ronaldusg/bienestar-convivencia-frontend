import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Bienestar y Convivencia. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Política de Datos
            </Link>
            <Link
              to="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
