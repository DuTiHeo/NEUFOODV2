const STORAGE_KEY = 'neufood-order-reviews-v1'

function readAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const p = JSON.parse(raw)
    return p && typeof p === 'object' ? p : {}
  } catch {
    return {}
  }
}

/** @returns {{ starsByLine: number[], photosByLine?: string[], comment: string, savedAt: string } | null} */
export function getReviewForOrder(orderId) {
  if (!orderId) return null
  const v = readAll()[orderId]
  if (!v || !Array.isArray(v.starsByLine)) return null
  return v
}

export function saveReviewForOrder(orderId, { starsByLine, photosByLine, comment }) {
  const all = readAll()
  all[orderId] = {
    starsByLine,
    photosByLine: Array.isArray(photosByLine) ? photosByLine : [],
    comment: (comment || '').trim(),
    savedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
