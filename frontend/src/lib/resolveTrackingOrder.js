import { demoHistory, demoTracking } from '../data/orders'

/** Chi tiết tracking cho các mã demo không nằm trong `demoTracking` */
export const demoOrderTrackingById = {
  NF12301: {
    status: 'cancelled',
    items: [
      {
        name: 'Burger Bò Phô Mai',
        note: '',
        qty: 1,
        price: 32000,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA1HKe0NPNk0FjSRkAYKw59_XpY-tqmkMGuHBomYEl9Mj0e0qe3jrc3kNGAylbpIs4T93bGl5JfMytAt9_vEIvu725uZYRcPXliIhOnPydQLeG399jLkmYQdQ1gi74i8brsgazSV1Dyjt20z-75qoxNdgnQqRVRbZAh5GHDUaO2OyqVUFu36mtPTyAMyZkj9rLDBF6NoX3zLDpUSN7evkJ92ZUuJz8fsJx082ZjrloI9CP5NzFMhWVzZP4yujS8kHISxS5t8x0jHEo',
      },
    ],
    shipFee: 10000,
    address: {
      line1: 'Đơn đã huỷ — hoàn tiền theo phương thức thanh toán',
      line2: 'Đại học Kinh tế Quốc dân',
    },
    eta: '—',
  },
  NF12288: {
    status: 'delivered',
    items: [
      {
        name: 'Salad Ức Gà',
        note: 'Sốt mè rang',
        qty: 2,
        price: 35000,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAAPSwNl9OMveWPz60nFPWGuyKVfr_H81MjkCuhJg37FW1YBAcR0eVRShVM5KvU9jHUU2e5gJSUHm_Z32ofjRJ_XsDcd84838Sut2kZ3zdSfJicvHP95wfjgZ4OZX53w19t_E1NufBxpnbiZoyRrCxZSG_YCF13W_hgSVGf_G2tdzUlTnwyIxB-FhpAew2PztMAfBnYS0FMxHixZYZK2uReS01vz5iEk7vJwT8Ni3lQ5w4aqp6X2V_bkXpnEk1r-jHSrtKxOhb5Sz0',
      },
      {
        name: 'Nước Ép Cam Tươi',
        note: 'Ít đá',
        qty: 1,
        price: 45000,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAAPSwNl9OMveWPz60nFPWGuyKVfr_H81MjkCuhJg37FW1YBAcR0eVRShVM5KvU9jHUU2e5gJSUHm_Z32ofjRJ_XsDcd84838Sut2kZ3zdSfJicvHP95wfjgZ4OZX53w19t_E1NufBxpnbiZoyRrCxZSG_YCF13W_hgSVGf_G2tdzUlTnwyIxB-FhpAew2PztMAfBnYS0FMxHixZYZK2uReS01vz5iEk7vJwT8Ni3lQ5w4aqp6X2V_bkXpnEk1r-jHSrtKxOhb5Sz0',
      },
    ],
    shipFee: 10000,
    address: {
      line1: 'Thư viện cánh B',
      line2: 'Đại học Kinh tế Quốc dân',
    },
    eta: 'Đã giao (15/10/2024)',
  },
}

function subtotalFromItems(items) {
  return items.reduce((s, i) => s + i.price * i.qty, 0)
}

function normalizeStored(record) {
  const items = (record.items || []).map((i) => ({
    dishId: i.dishId,
    name: i.name,
    price: i.price,
    qty: i.qty,
    image: i.image,
    note: i.note || '',
  }))
  const subtotal = record.subtotal ?? subtotalFromItems(items)
  const shipFee = record.shipFee ?? Math.max(0, (record.total ?? 0) - subtotal)
  const address = record.address ?? {
    line1: record.detail || 'Giao trong khuôn viên NEU',
    line2: 'Đại học Kinh tế Quốc dân',
  }
  const eta = record.eta || 'Khoảng 15–25 phút sau khi đặt'

  return {
    id: record.id,
    status: record.status || 'preparing',
    items,
    subtotal,
    shipFee,
    discount: record.discount ?? 0,
    total: record.total ?? subtotal + shipFee,
    address,
    eta,
    orderNote: record.orderNote || '',
    driver: demoTracking.driver,
  }
}

function fromDemoTracking(status) {
  const subtotal = subtotalFromItems(demoTracking.items)
  return {
    id: demoTracking.id,
    status,
    items: demoTracking.items.map((i) => ({ ...i, note: i.note || '' })),
    subtotal,
    shipFee: demoTracking.shipFee,
    discount: 0,
    total: subtotal + demoTracking.shipFee,
    address: demoTracking.address,
    eta: demoTracking.eta,
    orderNote: '',
    driver: demoTracking.driver,
  }
}

/**
 * @returns {object | null} view cho DonHangPage
 */
export function resolveTrackingOrder(orderId, storedOrders) {
  if (!orderId) return null

  const stored = storedOrders.find((o) => o.id === orderId)
  if (stored) return normalizeStored(stored)

  if (orderId === demoTracking.id) {
    const hist = demoHistory.find((h) => h.id === orderId)
    const status =
      hist?.status === 'cancelled' ? 'cancelled' : hist?.status === 'delivered' ? 'delivered' : hist?.status ?? 'delivered'
    return fromDemoTracking(status)
  }

  const extra = demoOrderTrackingById[orderId]
  if (extra) {
    const subtotal = subtotalFromItems(extra.items)
    return {
      id: orderId,
      status: extra.status,
      items: extra.items.map((i) => ({ ...i, note: i.note || '' })),
      subtotal,
      shipFee: extra.shipFee,
      discount: extra.discount ?? 0,
      total: subtotal + extra.shipFee - (extra.discount ?? 0),
      address: extra.address,
      eta: extra.eta,
      orderNote: '',
      driver: demoTracking.driver,
    }
  }

  return null
}
