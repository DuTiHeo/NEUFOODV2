import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import { dishes } from '../data/dishes'

const STORAGE_KEY = 'neufood-cart-v1'
const PENDING_KEY = 'neufood-cart-pending-v1'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed && typeof parsed === 'object') setQuantities(parsed)
      }
    } catch {
      /* ignore */
    }

    // Merge any pending additions coming from static pages
    try {
      const pendingRaw = sessionStorage.getItem(PENDING_KEY)
      if (pendingRaw) {
        const pending = JSON.parse(pendingRaw)
        if (pending && typeof pending === 'object') {
          const adds = pending.adds
          if (adds && typeof adds === 'object') {
            setQuantities((prev) => {
              const next = { ...(prev && typeof prev === 'object' ? prev : {}) }
              for (const [id, qty] of Object.entries(adds)) {
                const delta = Math.max(0, Math.floor(Number(qty)))
                if (!delta) continue
                next[id] = Math.max(0, (next[id] ?? 0) + delta)
              }
              return next
            })
          }
        }
        sessionStorage.removeItem(PENDING_KEY)
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quantities))
  }, [quantities])

  const getDish = useCallback((id) => dishes.find((d) => d.id === id), [])

  const MAX_QTY_PER_DISH = 10

  const isDishAvailable = useCallback((id) => {
    try {
      const raw = localStorage.getItem('CANTEEN_DISHES_OVERRIDE')
      if (raw) {
        const list = JSON.parse(raw)
        const match = list.find((d) => d.id === id)
        if (match && match.isAvailable === false) return false
      }
    } catch {
      /* ignore */
    }
    return true
  }, [])

  const add = useCallback((id, delta = 1) => {
    if (delta > 0 && !isDishAvailable(id)) {
      alert('Món này hiện đang HẾT HÀNG tại Canteen A2 (BR-05). Vui lòng chọn món khác!')
      return
    }

    setQuantities((prev) => {
      const cur = prev[id] ?? 0
      const next = Math.min(MAX_QTY_PER_DISH, Math.max(0, cur + delta))
      if (next === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: next }
    })
  }, [isDishAvailable])

  const setQuantity = useCallback((id, qty) => {
    const q = Math.min(MAX_QTY_PER_DISH, Math.max(0, Math.floor(Number(qty))))
    if (q > 0 && !isDishAvailable(id)) {
      alert('Món này hiện đang HẾT HÀNG tại Canteen A2 (BR-05). Vui lòng chọn món khác!')
      return
    }

    setQuantities((prev) => {
      if (q === 0) {
        const { [id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [id]: q }
    })
  }, [isDishAvailable])

  const clear = useCallback(() => setQuantities({}), [])

  const lines = useMemo(() => {
    return Object.entries(quantities)
      .filter(([, q]) => q > 0)
      .map(([id, qty]) => {
        const dish = getDish(id)
        if (!dish) return null
        return { dish, qty }
      })
      .filter(Boolean)
  }, [quantities, getDish])

  const totalCount = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines])

  const subtotal = useMemo(
    () => lines.reduce((s, l) => s + l.dish.price * l.qty, 0),
    [lines],
  )

  const getQty = useCallback((id) => quantities[id] ?? 0, [quantities])

  const value = useMemo(
    () => ({
      quantities,
      add,
      setQuantity,
      clear,
      lines,
      totalCount,
      subtotal,
      getQty,
    }),
    [quantities, add, setQuantity, clear, lines, totalCount, subtotal, getQty],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const c = useContext(CartContext)
  if (!c) throw new Error('useCart must be used within CartProvider')
  return c
}
