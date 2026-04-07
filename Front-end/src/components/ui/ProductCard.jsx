import React from 'react';
import { MessageCircle } from 'lucide-react';

const ProductCard = ({ name, price, brand, image }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-[0_3px_10px_rgb(0,0,0,0.1)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 group">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
          <span className="text-[9px] font-black text-gray-500 uppercase tracking-tighter">{brand}</span>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{brand}</h3>
        <h4 className="text-sm font-semibold text-gray-800 line-clamp-1 mb-2 uppercase">{name}</h4>
        <div className="flex items-center justify-between mt-4">
          <span className="text-lg font-black text-nalu-dark">${price}</span>
          <button className="bg-nalu-pink hover:bg-nalu-pink/90 text-white p-2 rounded-lg shadow-md shadow-nalu-pink/20 transition-all">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;