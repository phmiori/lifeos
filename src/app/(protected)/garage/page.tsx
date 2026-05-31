'use client';
import { useEffect, useState } from 'react';
import { garageApi } from '@/lib/api-client';
import { CarCard } from '@/components/garage/CarCard';
import { Plus, Car } from 'lucide-react';
import Link from 'next/link';

export default function GaragePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    garageApi.getCars()
      .then((data: any) => setCars(data.cars || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
               style={{ background: 'var(--gradient-main)' }}>
            <Car size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Minha Garagem</h1>
            <p style={{ color: 'var(--text-muted)' }} className="text-sm">
              {cars.length} veículo{cars.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <Link href="/garage/new" className="btn btn-primary">
          <Plus size={16} /> Adicionar Carro
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cars.map((car: any) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}
