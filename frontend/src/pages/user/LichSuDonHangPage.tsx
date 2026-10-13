import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { demoHistory } from '../../data/orders'
import { OrderStatus } from '../../types/neuModels'
import styles from './LichSuDonHangPage.module.css'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

const statusBadgeMap: Record<OrderStatus | string, { label: string; style: React.CSSProperties }> = {
  created: { label: 'Khởi tạo', style: { background: '#f1f5f9', color: '#475569' } },
  awaiting_payment: { label: 'Chờ thanh toán QR', style: { background: '#fef3c7', color: '#92400e' } },
  awaiting_canteen: { label: 'Chờ Canteen xác nhận (10p)', style: { background: '#fef3c7', color: '#92400e' } },
  confirmed: { label: 'Đã xác nhận', style: { background: '#e0f2fe', color: '#0369a1' } },
  preparing: { label: 'Đang nấu món', style: { background: '#fef9c3', color: '#854d0e' } },
  ready_for_handover: { label: 'Sẵn sàng bàn giao', style: { background: '#dbeafe', color: '#1e40af' } },
  shipper_assigned: { label: 'Đã có Shipper', style: { background: '#e0e7ff', color: '#3730a3' } },
  picked_up: { label: 'Shipper đã lấy món', style: { background: '#e0e7ff', color: '#3730a3' } },
  delivering: { label: 'Đang giao tới phòng', style: { background: '#fae8ff', color: '#86198f' } },
  delivered: { label: 'Đã giao tới phòng', style: { background: '#dcfce7', color: '#166534' } },
  completed: { label: 'Hoàn thành', style: { background: '#dcfce7', color: '#166534' } },
  cancelled: { label: 'Đã hủy', style: { background: '#fee2e2', color: '#991b1b' } },
  incident: { label: 'Sự cố (Chờ xử lý)', style: { background: '#fee2e2', color: '#991b1b' } },
}

export default function LichSuDonHangPage() {
  const { orders } = useNeuEngine()
  const location = useLocation()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [orderFlash, setOrderFlash] = useState(false)
  const [timeFilter, setTimeFilter] = useState('30')
  const [showAll, setShowAll] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!location.state?.orderPlaced) return
    setOrderFlash(true)
    navigate(location.pathname, { replace: true, state: {} })
  }, [location.state, location.pathname, navigate])

  useEffect(() => {
    if (!orderFlash) return
    const t = window.setTimeout(() => setOrderFlash(false), 6000)
    return () => window.clearTimeout(t)
  }, [orderFlash])

  // Map neu orders into standardized display rows
  const formattedNeuOrders = useMemo(() => {
    return orders.map((o) => {
      const dt = new Date(o.createdAt)
      const date = dt.toLocaleDateString('vi-VN')
      const time = dt.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      const names = (o.items || []).map((i) => i.name)
      const summary = names.length <= 2 ? names.join(', ') : `${names.slice(0, 2).join(', ')} +${names.length - 2}`

      let detail = `${o.items?.length || 0} món`
      if (o.receiveType === 'at_canteen') {
        detail += ' • Nhận tại quầy Canteen A2'
      } else if (o.location) {
        detail += ` • Tòa ${o.location.building} - Tầng ${o.location.floor} - ${o.location.room}`
      }
      detail += o.paymentMethod === 'cod' ? ' • Tiền mặt (COD)' : ' • QR Online'

      return {
        id: o.code || o.id,
        rawId: o.id,
        status: o.status,
        date,
        time,
        timestamp: dt.getTime(),
        total: o.total,
        summary,
        detail,
        image: o.items?.[0]?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop&q=80',
        dimmed: o.status === 'cancelled',
      }
    })
  }, [orders])

  // Merge formatted orders with legacy history
  const merged = useMemo(() => {
    const legacy = demoHistory.map((d) => ({
      ...d,
      rawId: d.id,
      timestamp: Date.now() - 3 * 24 * 3600 * 1000,
    }))
    return [...formattedNeuOrders, ...legacy]
  }, [formattedNeuOrders])

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/^#/, '')
    return merged.filter((o) => {
      if (!s) return true
      return (
        o.id.toLowerCase().includes(s) ||
        o.summary.toLowerCase().includes(s) ||
        o.detail.toLowerCase().includes(s)
      )
    })
  }, [q, merged])

  const PAGE_SIZE = 10
  const INITIAL_VISIBLE = 4
  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  const hasMore = rows.length > INITIAL_VISIBLE

  const rowsToRender = useMemo(() => {
    if (!showAll) return rows.slice(0, INITIAL_VISIBLE)
    const start = (currentPage - 1) * PAGE_SIZE
    return rows.slice(start, start + PAGE_SIZE)
  }, [rows, showAll, currentPage])

  return (
    <main className={styles.page}>
      <div className={styles.inner}>
        <header className={styles.hd}>
          <h1 className={styles.title}>Lịch sử đơn hàng NEUFood</h1>
          <p className={styles.lead}>Theo dõi tiến trình 11 bước và tình trạng đơn đặt món Canteen A2.</p>
        </header>

        {orderFlash ? (
          <div className={styles.flash} role="status">
            <span className={`material-symbols-outlined ${styles.flashIco}`}>check_circle</span>
            <p className={styles.flashTxt}>Đặt hàng thành công! Đơn hàng đã được đưa vào hệ thống Canteen A2.</p>
          </div>
        ) : null}

        <section className={styles.tools} aria-label="Lọc đơn hàng">
          <div className={styles.search}>
            <span className={`material-symbols-outlined ${styles.searchIco}`}>search</span>
            <input
              className={styles.searchInp}
              type="search"
              placeholder="Tìm theo mã đơn (vd. NEU-1001, NF12345)..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Tìm theo mã đơn"
            />
          </div>
          <div className={styles.filt}>
            <div className={styles.selWrap}>
              <select className={styles.sel} value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)} aria-label="Khoảng thời gian">
                <option value="30">30 ngày gần đây</option>
                <option value="90">3 tháng</option>
                <option value="all">Tất cả thời gian</option>
              </select>
              <span className={`material-symbols-outlined ${styles.selChev}`}>expand_more</span>
            </div>
          </div>
        </section>

        <div className={styles.list}>
          {rowsToRender.length === 0 ? (
            <p className={styles.empty}>Không tìm thấy đơn hàng nào khớp với tìm kiếm.</p>
          ) : (
            rowsToRender.map((o) => {
              const badge = statusBadgeMap[o.status] || {
                label: o.status,
                style: { background: '#f1f5f9', color: '#475569' },
              }
              return (
                <article key={o.id} className={styles.card}>
                  <div className={styles.top}>
                    <div className={styles.meta}>
                      <div className={styles.idRow}>
                        <span className={styles.oid}>#{o.id}</span>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            ...badge.style,
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>
                      <p className={styles.when}>
                        Thời gian: {o.date} Lúc {o.time}
                      </p>
                    </div>
                    <div className={styles.sum}>
                      <p className={styles.sumN}>{formatPrice(o.total)}</p>
                    </div>
                  </div>

                  <div className={styles.body}>
                    <div className={o.dimmed ? `${styles.thumb} ${styles.thumbDim}` : styles.thumb}>
                      <img src={o.image} alt="" />
                    </div>
                    <div className={styles.txt}>
                      <h3 className={styles.name}>{o.summary}</h3>
                      <p className={styles.sub}>{o.detail}</p>
                    </div>
                  </div>

                  <div className={styles.foot}>
                    <Link className={`${styles.btn} ${styles.btnGhost}`} to={`/don-hang/${o.rawId || o.id}`}>
                      Theo dõi tiến trình
                    </Link>
                    {['delivered', 'completed', 'incident'].includes(o.status) ? (
                      <Link
                        className={`${styles.btn}`}
                        style={{ background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3', fontWeight: 700 }}
                        to={`/khieu-nai?orderId=${o.rawId || o.id}`}
                      >
                        Khiếu nại
                      </Link>
                    ) : null}
                    <Link className={`${styles.btn} ${styles.btnPri}`} to="/menu">
                      Đặt lại
                    </Link>
                  </div>
                </article>
              )
            })
          )}
        </div>

        {hasMore ? (
          <div className={styles.more}>
            <button
              type="button"
              className={styles.moreBtn}
              onClick={() => {
                setShowAll((prev) => !prev)
                setCurrentPage(1)
              }}
            >
              <span>{showAll ? 'Thu gọn đơn' : `Xem tất cả đơn (${rows.length})`}</span>
              <span className="material-symbols-outlined">{showAll ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}</span>
            </button>
          </div>
        ) : null}
      </div>
    </main>
  )
}
