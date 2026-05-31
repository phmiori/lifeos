'use client';
import { useState } from 'react';
import { garageApi } from '@/lib/api-client';

export function CarForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const [formData, setFormData] = useState({
    brand: '', model: '', year_manufacture: '', year_model: '',
    purchase_price: '', purchase_date: '', plate: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res: any = await garageApi.createCar({
        ...formData,
        year_manufacture: Number(formData.year_manufacture),
        year_model: Number(formData.year_model),
        purchase_price: Number(formData.purchase_price)
      });
      if (res.id) onSuccess(res.id);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar carro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Marca</label>
          <input required className="input" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Modelo</label>
          <input required className="input" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ano Fab.</label>
          <input required type="number" className="input" value={formData.year_manufacture} onChange={e => setFormData({...formData, year_manufacture: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Ano Mod.</label>
          <input required type="number" className="input" value={formData.year_model} onChange={e => setFormData({...formData, year_model: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Preço de Compra</label>
          <input required type="number" step="0.01" className="input" value={formData.purchase_price} onChange={e => setFormData({...formData, purchase_price: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Data de Compra</label>
          <input required type="date" className="input" value={formData.purchase_date} onChange={e => setFormData({...formData, purchase_date: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Placa (opcional)</label>
          <input className="input uppercase" value={formData.plate} onChange={e => setFormData({...formData, plate: e.target.value})} />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary mt-4 w-full">
        {loading ? 'Salvando...' : 'Salvar Carro'}
      </button>
    </form>
  );
}
