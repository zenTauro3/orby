import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Dashboard' };

const stats = [
  { label: 'Agentes activos', value: '0', color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Conversaciones', value: '0', color: 'text-green-600', bg: 'bg-green-50' },
  { label: 'Facturación del mes', value: '$0', color: 'text-purple-600', bg: 'bg-purple-50' },
] as const;

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bienvenido a orby
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm`}
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className={`mt-2 text-4xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
