import React from 'react'
import { useOutletContext } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { Wallet, CheckCircle, TrendingUp, Calendar } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function ShipperThuNhapPage() {
  const { currentShipper } = useOutletContext<{ currentShipper: any }>()
  const { orders } = useNeuEngine()

  // My completed deliveries
  const myCompletedOrders = orders.filter(
    (o) => o.shipperId === currentShipper.id && ['delivered', 'completed'].includes(o.status)
  )

  const todayEarnings = myCompletedOrders.reduce((sum, o) => sum + o.shippingFee, 0)

  return (
    <div>
      <h3 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
        Ví thu nhập Shipper NEU
      </h3>

      {/* Wallet Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '16px',
          boxShadow: '0 10px 15px -3px rgba(2, 132, 199, 0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Thu nhập tích lũy</span>
          <Wallet size={20} />
        </div>

        <p style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0 0 12px' }}>
          {formatPrice(currentShipper.totalEarnings + todayEarnings)}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(255, 255, 255, 0.15)', padding: '8px 12px', borderRadius: '10px', fontSize: '0.75rem' }}>
          <div>
            <span style={{ opacity: 0.85 }}>Hôm nay:</span>
            <strong style={{ display: 'block', fontSize: '0.875rem' }}>+{formatPrice(todayEarnings)}</strong>
          </div>
          <div>
            <span style={{ opacity: 0.85 }}>Cuốc hoàn thành:</span>
            <strong style={{ display: 'block', fontSize: '0.875rem' }}>
              {currentShipper.completedOrdersCount + myCompletedOrders.length} cuốc
            </strong>
          </div>
        </div>
      </div>

      {/* History List */}
      <div style={{ background: '#ffffff', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Calendar size={16} color="#64748b" />
          <strong style={{ fontSize: '0.8125rem', color: '#334155' }}>Lịch sử cuốc xe gần đây</strong>
        </div>

        {myCompletedOrders.length === 0 ? (
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', padding: '16px 0' }}>
            Chưa có cuốc hoàn thành trong ca hôm nay
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {myCompletedOrders.map((ord) => (
              <div
                key={ord.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  background: '#f8fafc',
                  border: '1px solid #f1f5f9',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.8125rem', color: '#0f172a' }}>#{ord.code}</strong>
                  <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748b' }}>
                    Tòa {ord.location?.building} • {ord.location?.room}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong style={{ color: '#059669', fontSize: '0.8125rem' }}>+{formatPrice(ord.shippingFee)}</strong>
                  <span style={{ display: 'block', fontSize: '0.625rem', color: '#64748b' }}>
                    {ord.paymentMethod === 'cod' ? 'Thu COD' : 'Online'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
