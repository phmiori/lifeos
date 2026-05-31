'use client';
import { useEffect, useState } from 'react';
import { garageApi } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { MaintenanceTable } from '@/components/garage/MaintenanceTable';

export default function CarDetailPage({ params }: { params: { id: string } }) {
  const [car, setCar] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    garageApi.getCar(params.id).then(setCar).catch(console.error);
    garageApi.getSummary(params.id).then(setSummary).catch(console.error);
  }, [params.id]);

  if (!car) return <div className="p-6">Carregando...</div>;

  return (
    <div className="p-6">
      <button onClick={() => router.back()} className="flex items-center text-sm text-gray-400 hover:text-white mb-6">
        <ArrowLeft size={16} className="mr-2" /> Voltar
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{car.brand} {car.model}</h1>
          <p className="text-gray-400">{car.year_manufacture}/{car.year_model} - Placa: {car.plate || 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 col-span-2">
          <h2 className="text-xl font-semibold text-white mb-4">Resumo Financeiro</h2>
          {summary ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Preço de Compra</p>
                <p className="text-lg text-white">R$ {Number(summary.purchase_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Total em Manutenções</p>
                <p className="text-lg text-red-400">R$ {Number(summary.total_maintenance_cost).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              {/* Mais métricas podem ser adicionadas */}
            </div>
          ) : (
            <p>Carregando resumo...</p>
          )}
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Manutenções</h2>
        <MaintenanceTable carId={car.id} />
      </div>
    </div>
  );
}
