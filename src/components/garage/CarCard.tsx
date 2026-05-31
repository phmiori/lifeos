import Link from 'next/link';

export function CarCard({ car }: { car: any }) {
  return (
    <Link href={`/garage/${car.id}`}>
      <div className="glass-card p-4 hover:border-white/20 transition-all cursor-pointer">
        <div className="h-32 bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
          {car.image_urls && car.image_urls.length > 0 ? (
            <img src={car.image_urls[0]} alt={car.model} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">Sem Foto</span>
          )}
        </div>
        <h3 className="font-semibold text-lg text-white">{car.brand} {car.model}</h3>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
          <span>{car.year_manufacture}/{car.year_model}</span>
          <span className="uppercase">{car.plate || '---'}</span>
        </div>
        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-sm">
          <span className={
            car.status === 'active' ? 'text-green-400' :
            car.status === 'sold' ? 'text-blue-400' : 'text-red-400'
          }>
            {car.status === 'active' ? 'Ativo' :
             car.status === 'sold' ? 'Vendido' : 'Sucata'}
          </span>
          <span className="text-white">
            R$ {Number(car.purchase_price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </Link>
  );
}
