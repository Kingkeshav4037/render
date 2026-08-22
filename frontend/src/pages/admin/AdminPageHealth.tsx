import React, { useMemo } from 'react';
import { pageRegistry, PageRegistryEntry, PageCategory } from '../../config/pageRegistry';
import { LayoutDashboard, CheckCircle, AlertTriangle, FileWarning, SearchX } from 'lucide-react';

export const AdminPageHealth = () => {
  const stats = useMemo(() => {
    const total = pageRegistry.length;
    const productionReady = pageRegistry.filter(p => p.status === 'PRODUCTION_READY').length;
    const uiComplete = pageRegistry.filter(p => p.status === 'UI_COMPLETE').length;
    const dataMissing = pageRegistry.filter(p => !p.dataComplete).length;
    const imagesMissing = pageRegistry.filter(p => !p.contentComplete).length;
    const orphanPages = 0; // Simulated for now
    const brokenRoutes = 0; // Simulated for now

    const coveragePercentage = total > 0 ? Math.round((productionReady / total) * 100) : 0;

    const categoryStats = pageRegistry.reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = { total: 0, ready: 0 };
      acc[curr.category].total += 1;
      if (curr.status === 'PRODUCTION_READY') acc[curr.category].ready += 1;
      return acc;
    }, {} as Record<string, { total: number, ready: number }>);

    return {
      total,
      productionReady,
      uiComplete,
      dataMissing,
      imagesMissing,
      orphanPages,
      brokenRoutes,
      coveragePercentage,
      categoryStats
    };
  }, []);

  return (
    <div className="space-y-8 font-sans">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 mb-2">Page Health Audit</h1>
          <p className="text-gray-500">Master page registry and coverage overview.</p>
        </div>
        <div className="text-right">
          <div className="text-5xl font-display font-bold text-navy-900">{stats.coveragePercentage}%</div>
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Overall Coverage</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pages', value: stats.total, icon: <LayoutDashboard className="w-5 h-5 text-gray-400" /> },
          { label: 'Production Ready', value: stats.productionReady, icon: <CheckCircle className="w-5 h-5 text-green-500" /> },
          { label: 'Data Missing', value: stats.dataMissing, icon: <AlertTriangle className="w-5 h-5 text-amber-500" /> },
          { label: 'Orphan Pages', value: stats.orphanPages, icon: <SearchX className="w-5 h-5 text-red-500" /> }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-navy-900">{stat.value}</div>
            </div>
            {stat.icon}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-bold text-navy-900 mb-6">Category Coverage</h3>
          <div className="space-y-4">
            {Object.entries(stats.categoryStats).map(([cat, { total, ready }]) => {
              const pct = total > 0 ? Math.round((ready / total) * 100) : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{cat}</span>
                    <span className="font-bold text-navy-900">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${pct === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm lg:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-navy-900">Master Page Registry</h3>
            <span className="text-sm text-gray-500 font-medium">{stats.total} routes tracked</span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-xs sticky top-0 z-10">
                <tr>
                  <th className="p-4">Page / Route</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Theme</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pageRegistry.map(page => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-navy-900">{page.name}</div>
                      <div className="text-xs text-gray-500 font-mono">{page.route}</div>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        {page.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        page.status === 'PRODUCTION_READY' ? 'bg-green-100 text-green-700' :
                        page.status === 'NOT_STARTED' ? 'bg-red-100 text-red-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {page.status}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-gray-500">
                      {page.theme || 'default'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
