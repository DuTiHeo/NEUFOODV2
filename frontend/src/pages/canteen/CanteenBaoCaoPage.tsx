import React from 'react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { DollarSign, ShoppingBag, Star, TrendingUp, User } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function CanteenBaoCaoPage() {
  const { orders } = useNeuEngine()

  // Calculate stats for Canteen A2
  const completedOrders = orders.filter((o) => ['completed', 'delivered'].includes(o.status))
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.subtotal, 0)
  const totalItemsSold = completedOrders.reduce(
    (sum, o) => sum + (o.items || []).reduce((s, it) => s + it.qty, 0),
    0
  )

  const sampleReviews = [
    { id: 1, customer: 'Nguyễn Văn An', dish: 'Phở Bò Tái Nạm', stars: 5, comment: 'Nước dùng rất thanh ngọt, thịt mềm, chuẩn vị Canteen A2!', date: 'Hôm nay' },
    { id: 2, customer: 'Lê Thu Trang', dish: 'Bún Bò Huế', stars: 5, comment: 'Đồ ăn nóng hổi, giao lên tầng 4 rất nhanh.', date: 'Hôm qua' },
    { id: 3, customer: 'Hoàng Minh', dish: 'Trà Sữa Trân Châu', stars: 4, comment: 'Trà sữa thơm nhưng hơi ngọt một chút.', date: '2 ngày trước' },
  ]

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Doanh thu món ăn (Tiền món)</span>
            <DollarSign size={20} color="#059669" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', margin: '8px 0 0' }}>
            {formatPrice(totalRevenue)}
          </p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Tính trên các đơn hoàn thành</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Đơn hoàn thành</span>
            <ShoppingBag size={20} color="#0284c7" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>
            {completedOrders.length} đơn
          </p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đã phục vụ thành công</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Tổng suất ăn bán ra</span>
            <TrendingUp size={20} color="#881337" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#881337', margin: '8px 0 0' }}>
            {totalItemsSold} suất
          </p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Tất cả các món Canteen A2</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Đánh giá trung bình</span>
            <Star size={20} color="#eab308" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#eab308', margin: '8px 0 0' }}>
            4.8 ★
          </p>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Trên 128 lượt đánh giá</span>
        </div>
      </div>

      {/* Reviews & Feedback Section */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>
          Đánh giá &amp; Phản hồi từ sinh viên
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {sampleReviews.map((rev) => (
            <div key={rev.id} style={{ padding: '14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={16} color="#64748b" />
                  <strong style={{ fontSize: '0.875rem' }}>{rev.customer}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({rev.dish})</span>
                </div>
                <div style={{ color: '#eab308', fontWeight: 700, fontSize: '0.875rem' }}>
                  {'★'.repeat(rev.stars)}
                </div>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#334155', lineHeight: 1.4 }}>
                &ldquo;{rev.comment}&rdquo;
              </p>
              <span style={{ fontSize: '0.6875rem', color: '#94a3b8', display: 'block', marginTop: '6px' }}>
                Gửi lúc: {rev.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
