import React from 'react';
import BrandBar from '../components/layout/BrandBar';
import ProductCard from '../components/ui/ProductCard';
import imgBlanca from '../assets/cartera-blanca.webp';
import imgMarron from '../assets/cartera-marron.webp';
import imgNegraTote from '../assets/cartera-negra-tote.webp';
import imgNegra from '../assets/cartera-negra.webp';

const Home = () => {
  const featuredProducts = [
    { id: 1, name: "Cartera Blanca Premium", price: "28.500", brand: "Oreiro Love", image: imgBlanca },
    { id: 2, name: "Cartera Marrón Elegance", price: "32.000", brand: "Trendy", image: imgMarron },
    { id: 3, name: "Tote Bag Negra", price: "24.900", brand: "Unicross", image: imgNegraTote },
    { id: 4, name: "Cartera Negra Classic", price: "26.300", brand: "muaA!", image: imgNegra },
  ];

  return (
    <div className="w-full min-h-screen bg-[#fafafa]">
      <BrandBar />

      <main className="w-full">
        <section className="w-full px-4 py-12">
          <div className="max-w-5xl mx-auto bg-linear-to-br from-nalu-yellow via-nalu-pink-light to-nalu-pink/20 p-12 rounded-[40px] border border-white shadow-inner text-center">
            <h2 className="text-6xl font-script text-nalu-dark">Oreiro Love</h2>
            <p className="text-gray-500 italic">
              Y las mejores marcas en marroquinería
            </p>
          </div>
        </section>

        <section className="w-full px-4 py-16">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-black mb-10 uppercase tracking-tighter text-nalu-dark">
              Novedades <span className="text-nalu-pink">✦</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home; 