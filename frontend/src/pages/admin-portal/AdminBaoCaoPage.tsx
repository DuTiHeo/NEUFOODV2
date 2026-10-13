import React from 'react'
import { BarChart3, TrendingUp, CheckCircle, Clock, DollarSign, Building, Package, ShieldAlert } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function AdminBaoCaoPage() {
  const { orders, users, shippers, config } = useNeuEngine()

  const completedOrders = orders.filter((o) => o.status === 'completed' || o.status === 'delivered')
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0)
  const totalShippingFee = completedOrders.reduce((sum, o) => sum + (o.shippingFee || 0), 0)

  // Phân bổ theo tòa
  const ordersByBuilding: Record<string, number> = { A1: 0, A2: 0, B: 0, C: 0, D: 0 }
  orders.forEach((o) => {
    if (o.location?.building && ordersByBuilding[o.location.building] !== undefined) {
      ordersByBuilding[o.location.building]++
    }
  })

  // Cơ cấu thanh toán
  const codCount = orders.filter((o) => o.paymentMethod === 'cod').length
  const qrOnlineCount = orders.filter((o) => o.paymentMethod === 'qr_online').length

  // Tỷ lệ hoàn thành
  const successRate = orders.length > 0 ? Math.round((completedOrders.length / orders.length) * 100) : 100

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Báo cáo &amp; Thống kê Toàn hệ thống NEUFood
        </h2>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
          Dữ liệu khai thác và thống kê vận hành trên toàn khuôn viên Đại học Kinh tế Quốc dân.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Tổng doanh thu Campus</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {totalRevenue.toLocaleString('vi-VN')}đ
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Tất cả các đơn đã hoàn thành</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Tổng số đơn hàng</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#f0f9ff', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {orders.length} đơn
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>Tỷ lệ giao thành công: {successRate}%</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Đội ngũ Shipper NEU</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fdf4ff', color: '#c026d3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {shippers.filter((s) => s.status === 'approved').length} sinh viên
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đã phê duyệt hoạt động</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Mục tiêu SLA 20 phút</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fffbeb', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={20} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            {config.standardSLAMinutes} phút
          </div>
          <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Thời gian chuẩn vận hành</span>
        </div>
      </div>

      {/* Grid: Phân bổ tòa & Cơ cấu thanh toán */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Phân bổ đơn hàng theo tòa */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Phân bổ Đơn hàng theo Tòa nhà Campus
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(ordersByBuilding).map(([b, count]) => {
              const pct = orders.length > 0 ? Math.round((count / orders.length) * 100) : 0
              return (
                <div key={b}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Tòa {b}</span>
                    <span style={{ color: '#64748b' }}>{count} đơn ({pct}%)</span>
                  </div>
                  <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#0284c7', borderRadius: '9999px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Cơ cấu thanh toán */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
            Cơ cấu Phương thức Thanh toán
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
            <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '10px', border: '1px solid #bae6fd', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0369a1' }}>{qrOnlineCount}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0284c7' }}>QR Online</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Cổng thanh toán tự động</div>
            </div>

            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '10px', border: '1px solid #fde68a', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#b45309' }}>{codCount}</div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#d97706' }}>COD Tiền mặt</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>Shipper ứng tiền trước</div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '8px', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
            • Đơn COD được khống chế dưới <strong>{config.codMaxOrderLimit.toLocaleString()}đ</strong> để giảm rủi ro cho shipper.
            <br />
            • Sinh viên boom hàng bị tạm khóa tính năng COD tự động.
          </div>
        </div>
      </div>
    </div>
  )
}
