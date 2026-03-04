// ============================================
// CONTADOR DE VISITAS - POR PÁGINA/SESIÓN
// ============================================
// Comportamiento:
// ✅ Cuenta cada página distinta que visita el usuario en la sesión
// ✅ Si navega de una nota a otra, ambas cuentan
// ✅ El refresh de la misma página NO vuelve a contar
// ✅ Al cerrar y reabrir el navegador, cuenta de nuevo (nueva sesión)
// ✅ Fallback seguro si Supabase falla

import { useEffect, useState } from 'react'

const VisitCounter = ({ supabase, pageKey }) => {
  const [visitCount, setVisitCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const trackVisit = async () => {
      if (!supabase) {
        setVisitCount(869)
        setLoading(false)
        setError('Modo sin conexión - contador estático')
        return
      }

      try {
        // Clave única por página en esta sesión
        const sessionKey = `visited_${pageKey || '/'}`
        const alreadyCounted = sessionStorage.getItem(sessionKey)

        if (alreadyCounted) {
          // Ya contamos esta página en esta sesión — solo leer el total actual
          const { data } = await supabase
            .from('site_stats')
            .select('visit_count')
            .eq('id', 1)
            .single()

          if (data) setVisitCount(data.visit_count)
          setLoading(false)
          return
        }

        // Página nueva en esta sesión — incrementar
        const { data: currentData, error: fetchError } = await supabase
          .from('site_stats')
          .select('visit_count')
          .eq('id', 1)
          .single()

        if (fetchError && fetchError.code === 'PGRST116') {
          // Primer registro — crear con valor base
          const { error: insertError } = await supabase
            .from('site_stats')
            .insert({ id: 1, visit_count: 869, last_updated: new Date().toISOString() })
            .select()
            .single()

          if (!insertError) {
            setVisitCount(869)
            sessionStorage.setItem(sessionKey, '1')
          }
        } else if (currentData) {
          const newCount = (currentData.visit_count || 0) + 1

          const { error: updateError } = await supabase
            .from('site_stats')
            .update({
              visit_count: newCount,
              last_updated: new Date().toISOString(),
            })
            .eq('id', 1)

          if (!updateError) {
            setVisitCount(newCount)
            sessionStorage.setItem(sessionKey, '1')
          }
        }
      } catch (err) {
        console.error('Error tracking visit:', err)
        setError('Error al actualizar contador')
        setVisitCount(869)
      } finally {
        setLoading(false)
      }
    }

    trackVisit()
  }, [supabase, pageKey])

  if (loading) {
    return (
      <div className="text-xs text-stone-500 animate-pulse">
        <p className="font-bold uppercase tracking-wider mb-1">Visitas Totales</p>
        <p className="text-2xl font-mono font-bold text-orange-500">---</p>
      </div>
    )
  }

  return (
    <div className="text-xs text-stone-400">
      <p className="font-bold uppercase tracking-wider mb-1">Visitas Totales</p>
      <p className="text-2xl font-mono font-bold text-orange-500">
        {visitCount.toLocaleString('es-MX')}
      </p>
      {error && (
        <p className="text-[10px] text-stone-500 mt-1 italic">
          {error}
        </p>
      )}
    </div>
  )
}

export default VisitCounter
