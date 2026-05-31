'use client';
import { useRouter } from 'next/navigation';
import { CarForm } from '@/components/garage/CarForm';

export default function NewCarPage() {
  const router = useRouter();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Adicionar Novo Carro</h1>
      <div className="glass-card p-6">
        <CarForm onSuccess={(id) => router.push(`/garage/${id}`)} />
      </div>
    </div>
  );
}
