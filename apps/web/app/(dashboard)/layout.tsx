import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <span className="text-xl font-bold text-gray-900">orby</span>
            <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
              <a href="/agentes" className="hover:text-gray-900 transition-colors">
                Agentes
              </a>
              <a href="/conversaciones" className="hover:text-gray-900 transition-colors">
                Conversaciones
              </a>
              <a href="/facturacion" className="hover:text-gray-900 transition-colors">
                Facturación
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
