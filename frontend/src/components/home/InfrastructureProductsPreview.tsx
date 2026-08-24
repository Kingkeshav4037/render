import { motion } from 'framer-motion';
import { HomeInfrastructure, HomeProduct } from '../../types/home';
import { Train, ShoppingBag, BatteryCharging } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OptimizedImage } from '../shared/OptimizedImage';

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
              Explore Norway's world-class public transportation, scenic railways, and widespread EV charging network.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infrastructure.map((item, index) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4"
                >
                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl">
                    {item.type === 'EV Charging' ? <BatteryCharging size={20} /> : <Train size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.city}</p>
                    <span className="inline-block mt-2 text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link to="/infrastructure" className="inline-block mt-6 text-teal-600 font-bold hover:text-teal-700">
              Explore Infrastructure Network →
            </Link>
          </div>

          {/* Local Products Preview */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl">
                <ShoppingBag size={24} />
              </div>
              <h2 className="text-2xl font-black text-navy-900">Norwegian Goods</h2>
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
                  <OptimizedImage 
                    src={product.image} 
                    alt={product.name} 
                    category="product"
                    className="w-full h-full rounded-lg object-cover" 
                    containerClassName="w-16 h-16 rounded-lg flex-shrink-0"
                  />
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
