import React, { useState, useEffect, useCallback } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Tag,
  DollarSign
} from 'lucide-react';
import { shopService, Product, FALLBACK_PRODUCTS } from '../../../services/shopService';
import { supabase } from '../../../lib/supabase';
import { useCurrencyStore } from '../../../store/useCurrencyStore';
import { toast } from 'sonner';

export const AdminProducts = () => {
  const { formatPrice } = useCurrencyStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [stockFilter, setStockFilter] = useState<'ALL' | 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK'>('ALL');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await shopService.getProducts();
      if (res && Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch (err) {
      console.warn('Error loading products for admin:', err);
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleUpdateStock = async (id: string, newStock: number) => {
    try {
      const inStock = newStock > 0;
      const { error } = await (supabase as any)
        .from('products')
        .update({ stock: newStock, in_stock: inStock })
        .eq('id', id);

      if (error) throw error;

      setProducts(prev =>
        prev.map(p => p.id === id ? { ...p, stock: newStock, in_stock: inStock } : p)
      );
      toast.success('Stock updated successfully');
    } catch (err: any) {
      console.error('Failed to update stock:', err);
      toast.error(err?.message || 'Failed to update stock in database');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    try {
      const inStock = (editingProduct.stock || 0) > 0;
      const { error } = await (supabase as any)
        .from('products')
        .update({
          name: editingProduct.name,
          price: Number(editingProduct.price),
          category: editingProduct.category,
          stock: Number(editingProduct.stock),
          in_stock: inStock,
          description: editingProduct.description
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(prev =>
        prev.map(p => p.id === editingProduct.id ? { ...editingProduct, in_stock: inStock } : p)
      );
      toast.success(`${editingProduct.name} saved successfully`);
      setEditingProduct(null);
    } catch (err: any) {
      console.error('Failed to save product:', err);
      toast.error(err?.message || 'Failed to update product details');
    } finally {
      setSaving(false);
    }
  };

  const productList = Array.isArray(products) ? products : [];
  const filteredProducts = productList.filter(p => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q);

    const matchesCategory = categoryFilter === 'ALL' || p.category === categoryFilter;
    
    let matchesStock = true;
    if (stockFilter === 'IN_STOCK') matchesStock = (p.stock || 0) > 5;
    if (stockFilter === 'LOW_STOCK') matchesStock = (p.stock || 0) > 0 && (p.stock || 0) <= 5;
    if (stockFilter === 'OUT_OF_STOCK') matchesStock = (p.stock || 0) === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="text-emerald-600" /> Marketplace & Stock Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time stock monitoring, pricing controls, and catalog availability.
          </p>
        </div>
        <button
          onClick={loadProducts}
          disabled={loading}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          Refresh Catalog
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Catalog SKUs</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{productList.length}</div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Units in Stock</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">
            {productList.reduce((acc, p) => acc + (p.stock || 0), 0)}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Low Stock Warnings</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {productList.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length}
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Out of Stock</div>
          <div className="text-2xl font-bold text-red-600 mt-1">
            {productList.filter(p => (p.stock || 0) === 0).length}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Smart Home">Smart Home</option>
            <option value="EV Accessories">EV Accessories</option>
            <option value="Outdoor & Gear">Outdoor & Gear</option>
            <option value="Wellness & Spa">Wellness & Spa</option>
            <option value="Nordic Specialties">Nordic Specialties</option>
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Stock Levels</option>
            <option value="IN_STOCK">In Stock (&gt;5)</option>
            <option value="LOW_STOCK">Low Stock (1–5)</option>
            <option value="OUT_OF_STOCK">Out of Stock (0)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase text-slate-500">
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price (NOK)</th>
                <th className="py-3 px-4">Stock Units</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Quick Stock Adjust</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    No products matching search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const stock = product.stock || 0;
                  const imgSrc = (product as any).img || (product as any).image || '/images/product_thermostat.jpg';
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{product.name}</div>
                            <div className="text-xs text-slate-400 font-mono">SKU: {product.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {formatPrice(product.price)}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold">
                        {stock} units
                      </td>
                      <td className="py-3.5 px-4">
                        {stock > 5 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 size={12} /> In Stock
                          </span>
                        ) : stock > 0 ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            <AlertTriangle size={12} /> Low Stock ({stock})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                            <XCircle size={12} /> Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                          <button
                            onClick={() => handleUpdateStock(product.id, Math.max(0, stock - 1))}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                          >
                            -
                          </button>
                          <span className="font-mono text-xs px-2 font-bold">{stock}</span>
                          <button
                            onClick={() => handleUpdateStock(product.id, stock + 1)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-1.5 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          title="Edit Product Details"
                        >
                          <Edit size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit size={18} className="text-emerald-600" /> Edit Product
              </h2>
              <button
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Price (NOK)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value="GEAR">GEAR</option>
                  <option value="APPAREL">APPAREL</option>
                  <option value="SMART_HOME">SMART_HOME</option>
                  <option value="SUSTAINABILITY">SUSTAINABILITY</option>
                  <option value="FOOD_SPECIALTY">FOOD_SPECIALTY</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-1">
                  Description
                </label>
                <textarea
                  value={editingProduct.description}
                  rows={3}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : null}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
