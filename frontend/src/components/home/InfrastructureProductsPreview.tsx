import { motion } from 'framer-motion';
import { HomeInfrastructure, HomeProduct } from '../../types/home';
import { Train, ShoppingBag, BatteryCharging } from 'lucide-react';
import { Link } from 'react-router-dom';

interface InfrastructureProductsProps {
  infrastructure: HomeInfrastructure[];
  products: HomeProduct[];
}

export const InfrastructureProductsPreview = ({ infrastructure, products }: InfrastructureProductsProps) => {
  return (
    <section className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Infrastructure Preview */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-teal-100 text-teal-700 rounded-xl">
                <Train size={24} />
              </div>
              <h2 className="text-2xl font-black text-navy-900">Transport & Infrastructure</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Live updates on roads, ferries, airports, and EV charging networks across Norway.
            </p>
            
            <div className="space-y-4">
              {infrastructure.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                      {item.type === 'EV Charging' ? <BatteryCharging size={20} /> : <Train size={20} />}
                    </div>
                    <div>
                      <h4 className="font-bold text-navy-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">{item.city}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${item.status === 'Operational' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {item.status}
                  </span>
                </motion.div>
              ))}
            </div>
            
            <Link to="/infrastructure" className="inline-block mt-6 text-teal-600 font-bold hover:text-teal-700">
              View Smart Infrastructure Map →
            </Link>
          </div>

          {/* Products Preview */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                <ShoppingBag size={24} />
              </div>
              <h2 className="text-2xl font-black text-navy-900">Norwegian Products</h2>
            </div>
            <p className="text-gray-600 mb-8">
              Authentic local crafts, outdoor gear, and traditional food delivered worldwide.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product, index) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-4"
                >
                  <img src={product.image} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-sm text-navy-900 line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                    <p className="text-sm font-black text-indigo-600">{product.price} NOK</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/products" className="inline-block mt-6 text-indigo-600 font-bold hover:text-indigo-700">
              Shop Local Products →
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};
