const STORAGE_KEY = 'neufood-dish-reviews-by-dish-v1'

export const DISH_REVIEWS_CHANGED = 'neufood-dish-reviews-changed'

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

function writeAll(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function notify() {
  window.dispatchEvent(new CustomEvent(DISH_REVIEWS_CHANGED))
}

/** Đánh giá từ đơn hàng (theo món), mới nhất trước */
export function getReviewsForDish(dishId) {
  if (!dishId) return []
  const list = readAll()[dishId]
  if (!Array.isArray(list)) return []
  return [...list].sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt))
}

/**
 * Ghi đánh giá từng dòng đơn lên từng món (cần item.dishId).
 * Nhận xét chung đơn chỉ gắn vào dòng đầu tiên có dishId.
 */
export function appendReviewsFromOrder(orderId, items, starsByLine, orderComment, photosByLine) {
  if (!orderId || !Array.isArray(items) || !Array.isArray(starsByLine)) return
  const all = readAll()
  const general = (orderComment || '').trim()
  let attachedGeneral = false

  items.forEach((item, idx) => {
    const dishId = item.dishId
    if (!dishId) return
    const stars = starsByLine[idx]
    if (typeof stars !== 'number' || stars < 1 || stars > 5) return
    if (!all[dishId]) all[dishId] = []
    let comment = ''
    if (general) {
      if (!attachedGeneral) {
        comment = general
        attachedGeneral = true
      }
    }
    all[dishId].push({
      stars,
      comment,
      photo: photosByLine?.[idx] || '',
      savedAt: new Date().toISOString(),
      orderId,
      authorLabel: 'Bạn',
    })
  })

  writeAll(all)
  notify()
}

export function subscribeDishReviews(callback) {
  const wrapped = () => callback()
  window.addEventListener(DISH_REVIEWS_CHANGED, wrapped)
  return () => window.removeEventListener(DISH_REVIEWS_CHANGED, wrapped)
}

/**
 * Điểm TB và số lượng đúng với các đánh giá đang có trên UI:
 * đánh giá mẫu (placeholder) + đánh giá từ đơn (localStorage).
 * Không cộng reviewCount/rating ẩn từ file menu.
 */
export function computeListedReviewStats(sampleReviews, userList) {
  const stars = [
    ...(sampleReviews || []).map((r) => Math.min(5, Math.max(0, Number(r.stars) || 0))),
    ...(userList || []).map((r) => Math.min(5, Math.max(0, Number(r.stars) || 0))),
  ]
  const count = stars.length
  const avg = count > 0 ? stars.reduce((s, n) => s + n, 0) / count : 0
  return { avg, count }
}

/** 5 bước: 'full' | 'half' | 'empty' cho icon star */
export function starStepsFromAvg(avg) {
  const a = Math.min(5, Math.max(0, Number(avg) || 0))
  const steps = []
  for (let i = 1; i <= 5; i++) {
    if (a >= i) steps.push('full')
    else if (a >= i - 0.5) steps.push('half')
    else steps.push('empty')
  }
  return steps
}
