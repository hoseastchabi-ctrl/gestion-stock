import { useEffect, useState } from 'react'
import {
  Archive, Banknote, AlertTriangle, Repeat, 
  ArrowDown, ArrowUp, UserCircle2
} from 'lucide-react'
import { getDashboard } from '../api/dashboard'

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const userName = localStorage.getItem('user_name') || 'Gérant'

  useEffect(() => {
    getDashboard()
      .then((res) => {
        setData(res.data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Erreur lors du chargement du dashboard", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-surface">
        <p className="text-on-surface-variant animate-pulse font-medium">Chargement des statistiques...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Titre principal de la page */}
      <div>
        <h2 className="text-xl font-bold text-primary">Vue d'ensemble</h2>
        <p className="text-xs text-on-surface-variant">Statistiques en temps réel de ton stock.</p>
      </div>

      {/* 4 Cartes d'indicateurs de performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Produits */}
        <div className="bg-surface border border-outline-variant p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Produits</p>
            <h3 className="text-2xl font-black text-primary mt-1">{data?.stats?.total_products || 0}</h3>
          </div>
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl"><Archive size={22} /></div>
        </div>

        {/* Valeur du Stock */}
        <div className="bg-surface border border-outline-variant p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Valeur Stock</p>
            <h3 className="text-xl font-black text-primary mt-1">
              {data?.stats?.total_value ? `${data.stats.total_value.toLocaleString()} FCFA` : '0 FCFA'}
            </h3>
          </div>
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl"><Banknote size={22} /></div>
        </div>

        {/* Alertes de Stock Bas */}
        <div className="bg-surface border border-outline-variant p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Alertes Stock</p>
            <h3 className="text-2xl font-black text-error mt-1">{data?.stats?.low_stock_count || 0}</h3>
          </div>
          <div className="p-3 bg-error-container text-on-error-container rounded-xl"><AlertTriangle size={22} /></div>
        </div>

        {/* Flux du jour */}
        <div className="bg-surface border border-outline-variant p-4 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Flux du jour</p>
            <h3 className="text-2xl font-black text-primary mt-1">{data?.stats?.movements_today || 0}</h3>
          </div>
          <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl"><Repeat size={22} /></div>
        </div>
      </div>

      {/* Section split : Alertes Critiques & Activité récente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertes critiques */}
        <div className="bg-surface border border-outline-variant p-5 rounded-2xl shadow-sm">
          <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
            <AlertTriangle className="text-error" size={18} /> Alertes Critiques
          </h4>
          <div className="space-y-3">
            {data?.critical_alerts?.length > 0 ? (
              data.critical_alerts.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-3 bg-surface-container rounded-xl border border-outline-variant">
                  <div>
                    <p className="font-bold text-sm text-primary">{item.name}</p>
                    <p className="text-[10px] text-on-surface-variant font-mono">{item.sku}</p>
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full ${item.quantity === 0 ? 'bg-error-container text-on-error-container' : 'bg-warning-container text-on-warning-container'}`}>
                    {item.quantity} restants
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-on-surface-variant py-2">Aucune alerte critique, le stock est au top !</p>
            )}
          </div>
        </div>

        {/* Activité récente */}
        <div className="bg-surface border border-outline-variant p-5 rounded-2xl shadow-sm">
          <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
            <Repeat size={18} /> Activité Récente
          </h4>
          <div className="space-y-3">
            {data?.recent_activity?.length > 0 ? (
              data.recent_activity.map((act) => (
                <div key={act.id} className="flex justify-between items-center p-3 bg-surface-container rounded-xl border border-outline-variant">
                  <div className="flex items-center gap-3">
                    {act.type === 'IN' ? (
                      <div className="p-1.5 bg-success-container text-on-success-container rounded-lg"><ArrowDown size={16} /></div>
                    ) : (
                      <div className="p-1.5 bg-error-container text-on-error-container rounded-lg"><ArrowUp size={16} /></div>
                    )}
                    <div>
                      <p className="font-bold text-sm text-primary">{act.product_name}</p>
                      <p className="text-[10px] text-on-surface-variant">{act.reason} • par {act.user_name}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${act.type === 'IN' ? 'text-success' : 'text-error'}`}>
                    {act.type === 'IN' ? '+' : '-'}{act.quantity}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-on-surface-variant py-2">Aucun mouvement enregistré aujourd'hui.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}