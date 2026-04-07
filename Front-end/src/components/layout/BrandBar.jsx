import React from 'react';

const BrandBar = () => {
  const brands = ["Oreiro Love", "muaA!", "Unicross", "Trendy"];
  return (
    <div className="bg-white border-b border-gray-100 py-3 w-full">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {brands.map((brand) => (
          <span key={brand} className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-gray-400">
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BrandBar;