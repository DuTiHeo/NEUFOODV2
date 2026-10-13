import React, { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { MapPin, DollarSign, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function ShipperSanDonPage() {
  const navigate = useNavigate()
  const { currentShipper } = useOutletContext<{ currentShipper: any }>()
  const { orders, shipperAcceptOrder } = useNeuEngine()
  const [errorMsg, setErrorMsg] = useState('')

  // Orders available for delivery: ready_for_handover at Canteen & receiveType === 'delivery'
  const poolOrders = orders.filter(
    (o) => o.status === 'ready_for_handover' && o.receiveType === 'delivery'
  )

  function handleAccept(orderId: string) {
    setErrorMsg('')
    try {
      shipperAcceptOrder(orderId, currentShipper.id)
      navigate('/shipper/dang-giao')
    } catch (err: any) {
      setErrorMsg(err.message || 'Không thể nhận đơn này.')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
          Sàn đơn Canteen A2 ({poolOrders.length})
        </h3>
        <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Tự động làm mới</span>
      </div>

      {!currentShipper.isOnline ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '14px', textAlign: 'center', marginBottom: '14px' }}>
          <AlertCircle size={28} color="#dc2626" style={{ margin: '0 auto 6px' }} />
          <strong style={{ fontSize: '0.8125rem', color: '#991b1b', display: 'block' }}>Bạn đang tắt trạng thái nhận đơn</strong>
          <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#7f1d1d' }}>
            Vui lòng bật trạng thái <strong>&ldquo;Đang Sẵn Sàng&rdquo;</strong> để xem và nhận đơn mới.
          </p>
        </div>
      ) : null}

      {errorMsg ? (
        <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', color: '#991b1b', fontSize: '0.75rem' }}>
          {errorMsg}
        </div>
      ) : null}

      {poolOrders.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '32px 16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <ShoppingBag size={36} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>Hiện chưa có đơn mới sẵn sàng tại Canteen A2</p>
          <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Bếp đang nấu các đơn tiếp theo...</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {poolOrders.map((ord) => {
            const isCod = ord.paymentMethod === 'cod'
            const canAffordCod = currentShipper.currentAdvanceAmount + ord.subtotal <= 500000

            return (
              <div
                key={ord.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.875rem', color: '#0284c7' }}>#{ord.code}</strong>
                    <span style={{ marginLeft: '6px', fontSize: '0.6875rem', color: '#64748b' }}>
                      {new Date(ord.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Payment tag */}
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: isCod ? '#fef3c7' : '#ecfdf5',
                      color: isCod ? '#92400e' : '#047857',
                    }}
                  >
                    {isCod ? `COD (Ứng ${formatPrice(ord.subtotal)})` : 'Online (0đ ứng)'}
                  </span>
                </div>

                {/* Destination info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <MapPin size={16} color="#ef4444" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a' }}>
                    Tòa {ord.location?.building} • Tầng {ord.location?.floor} • {ord.location?.room}
                  </span>
                </div>

                {/* Items summary */}
                <div style={{ background: '#f8fafc', padding: '6px 10px', borderRadius: '6px', fontSize: '0.75rem', color: '#475569', marginBottom: '10px' }}>
                  {ord.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                </div>

                {/* Earning & Action */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                  <div>
                    <span style={{ fontSize: '0.6875rem', color: '#64748b', display: 'block' }}>Phí ship nhận được:</span>
                    <strong style={{ fontSize: '0.9375rem', color: '#059669' }}>+{formatPrice(ord.shippingFee)}</strong>
                  </div>

                  <button
                    type="button"
                    disabled={!currentShipper.isOnline || (isCod && !canAffordCod)}
                    onClick={() => handleAccept(ord.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: !currentShipper.isOnline || (isCod && !canAffordCod) ? '#cbd5e1' : '#0284c7',
                      color: '#ffffff',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      cursor: !currentShipper.isOnline || (isCod && !canAffordCod) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Nhận đơn</span>
                    <ArrowRight size={14} />
                  </button>
                </div>

                {isCod && !canAffordCod ? (
                  <p style={{ margin: '6px 0 0', fontSize: '0.6875rem', color: '#dc2626' }}>
                    Đã đạt hạn mức ứng 500.000đ. Không thể nhận thêm đơn COD.
                  </p>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
