import React from 'react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { Activity, AlertTriangle, CheckCircle, Clock, DollarSign, Package } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function AdminDashboardPage() {
  const { orders } = useNeuEngine()

  const activeOrders = orders.filter((o) => !['completed', 'cancelled'].includes(o.status))
  const incidentOrders = orders.filter((o) => o.status === 'incident')
  const completedOrders = orders.filter((o) => ['completed', 'delivered'].includes(o.status))

  const totalSystemRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0)

  // Identify SLA breaches (> 20 mins from created)
  const slaBreachedOrders = activeOrders.filter((o) => {
    const elapsedMinutes = (Date.now() - new Date(o.createdAt).getTime()) / 60000
    return elapsedMinutes > 20
  })

  return (
    <div>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Đơn đang vận hành</span>
            <Activity size={18} color="#0284c7" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>
            {activeOrders.length}
          </p>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Đang chế biến hoặc đang giao</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Cảnh báo SLA &gt;20p</span>
            <AlertTriangle size={18} color="#dc2626" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: slaBreachedOrders.length > 0 ? '#dc2626' : '#059669', margin: '8px 0 0' }}>
            {slaBreachedOrders.length}
          </p>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Cần đôn đốc bếp hoặc shipper</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Sự cố cần giải quyết</span>
            <AlertTriangle size={18} color="#d97706" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: incidentOrders.length > 0 ? '#d97706' : '#0f172a', margin: '8px 0 0' }}>
            {incidentOrders.length}
          </p>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Boom hàng / Không liên lạc</span>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8125rem', color: '#64748b', fontWeight: 600 }}>Doanh số toàn hệ thống</span>
            <DollarSign size={18} color="#059669" />
          </div>
          <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', margin: '8px 0 0' }}>
            {formatPrice(totalSystemRevenue)}
          </p>
          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Tiền món + Phí giao</span>
        </div>
      </div>

      {/* Live Active Orders Monitor */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
          Giám sát trạng thái thời gian thực toàn hệ thống
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '10px 12px' }}>Mã đơn</th>
                <th style={{ padding: '10px 12px' }}>Khách hàng</th>
                <th style={{ padding: '10px 12px' }}>Điểm nhận / Tòa</th>
                <th style={{ padding: '10px 12px' }}>Shipper phụ trách</th>
                <th style={{ padding: '10px 12px' }}>Trạng thái</th>
                <th style={{ padding: '10px 12px' }}>Thời gian SLA</th>
                <th style={{ padding: '10px 12px', textAlign: 'right' }}>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((ord) => {
                const elapsedMinutes = Math.floor((Date.now() - new Date(ord.createdAt).getTime()) / 60000)
                const isOverSLA = elapsedMinutes > 20 && !['completed', 'delivered', 'cancelled'].includes(ord.status)

                return (
                  <tr key={ord.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: '#0284c7' }}>#{ord.code}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontWeight: 600 }}>{ord.customerName}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{ord.customerPhone}</span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {ord.receiveType === 'at_canteen' ? (
                        <span style={{ color: '#059669', fontWeight: 600 }}>Tại quầy Canteen A2</span>
                      ) : (
                        <span>Tòa {ord.location?.building} - {ord.location?.room}</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {ord.shipperName ? (
                        <span style={{ color: '#0f172a', fontWeight: 600 }}>{ord.shipperName}</span>
                      ) : (
                        <span style={{ color: '#94a3b8' }}>Chưa gán</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, background: '#f1f5f9' }}>
                        {ord.status}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {isOverSLA ? (
                        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                          Quá hạn ({elapsedMinutes}p)
                        </span>
                      ) : (
                        <span style={{ color: '#059669', fontSize: '0.75rem' }}>Đạt chuẩn ({elapsedMinutes}p)</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>
                      {formatPrice(ord.total)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
