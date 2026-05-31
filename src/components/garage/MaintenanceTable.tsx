'use client';
import { useEffect, useState } from 'react';
import { garageApi } from '@/lib/api-client';

export function MaintenanceTable({ carId }: { carId: string }) {
  const [maintenances, setMaintenances] = useState([]);
  
  useEffect(() => {
    garageApi.getMaintenances(carId)
      .then((data: any) => setMaintenances(data.maintenances || []))
      .catch(console.error);
  }, [carId]);

  if (maintenances.length === 0) {
    return <p className="text-gray-400 text-sm">Nenhuma manutenção registrada.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-3 text-sm font-medium text-gray-400">Data</th>
            <th className="p-3 text-sm font-medium text-gray-400">Descrição</th>
            <th className="p-3 text-sm font-medium text-gray-400">KM</th>
            <th className="p-3 text-sm font-medium text-gray-400">Custo (R$)</th>
          </tr>
        </thead>
        <tbody>
          {maintenances.map((m: any) => (
            <tr key={m.id} className="border-b border-white/5 hover:bg-white/5">
              <td className="p-3 text-sm text-gray-200">{new Date(m.date).toLocaleDateString('pt-BR')}</td>
              <td className="p-3 text-sm text-white">{m.description}</td>
              <td className="p-3 text-sm text-gray-400">{m.km_at_service || '-'}</td>
              <td className="p-3 text-sm text-red-400">{Number(m.cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
