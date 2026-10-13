import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RotateCcw, CheckCircle2, AlertCircle, ShieldAlert, DollarSign, ArrowRight, UserCheck } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function CanteenHoanTienPage() {
  const navigate = useNavigate()
  const { canteenSession, orders, refundCancelledOrder } = useNeuEngine()

  const isManager = canteenSession?.role === 'canteen_manager'

  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'cod'>('all')
  const [successMsg, setSuccessMsg] = useState('')

  // Các đơn hàng bị hủy hoặc có sự cố cần hoàn tiền
  const refundableOrders = orders.filter((o) => {
    const isCancelledOrIncident = o.status === 'cancelled' || o.status === 'incident'
    if (!isCancelledOrIncident) return false

    if (activeTab === 'online') return o.paymentMethod === 'qr_online'
    if (activeTab === 'cod') return o.paymentMethod === 'cod' && o.shipperAdvancePaid
    return true
  })

  const handleRefund = (orderId: string, type: 'online_customer_refund' | 'cod_shipper_advance_refund') => {
    try {
      refundCancelledOrder(orderId, type)
      setSuccessMsg(`Đã ghi nhận hoàn tiền thành công cho đơn #${orderId}!`)
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err: any) {
      alert(err.message)
    }
  }

  if (!isManager) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', background: '#ffffff', borderRadius: '14px', border: '1px solid #fee2e2', padding: '32px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
          Yêu cầu Quyền Quản lý Canteen
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
          Chức năng <strong>Hoàn tiền khi đơn bị hủy (gồm hoàn khoản tiền shipper đã ứng trước với đơn COD)</strong> chỉ được thao tác bởi tài khoản <strong>Quản lý Canteen</strong>.
        </p>
        <button
          onClick={() => navigate('/canteen/login')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: '#881337',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Đăng xuất &amp; Đăng nhập bằng Tài khoản Quản lý
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Hoàn tiền khi đơn bị hủy
        </h2>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
          Xử lý hoàn tiền cho khách thanh toán trực tuyến và <strong>hoàn trả lại tiền ứng cho shipper</strong> khi đơn bị hủy hoặc gặp sự cố.
        </p>
      </div>

      {successMsg && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', fontWeight: 600 }}>
          <CheckCircle2 size={18} color="#059669" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'all' ? '2px solid #881337' : '1px solid #cbd5e1',
            background: activeTab === 'all' ? '#fff1f2' : '#ffffff',
            color: activeTab === 'all' ? '#881337' : '#475569',
          }}
        >
          Tất cả yêu cầu hoàn tiền ({orders.filter((o) => o.status === 'cancelled' || o.status === 'incident').length})
        </button>

        <button
          onClick={() => setActiveTab('online')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'online' ? '2px solid #0284c7' : '1px solid #cbd5e1',
            background: activeTab === 'online' ? '#f0f9ff' : '#ffffff',
            color: activeTab === 'online' ? '#0369a1' : '#475569',
          }}
        >
          Hoàn tiền Khách Online
        </button>

        <button
          onClick={() => setActiveTab('cod')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            border: activeTab === 'cod' ? '2px solid #d97706' : '1px solid #cbd5e1',
            background: activeTab === 'cod' ? '#fffbeb' : '#ffffff',
            color: activeTab === 'cod' ? '#b45309' : '#475569',
          }}
        >
          Hoàn tiền ứng cho Shipper COD
        </button>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {refundableOrders.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '40px', textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b' }}>
            <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 10px' }} />
            <p style={{ margin: 0, fontWeight: 600 }}>Hiện không có đơn hàng nào cần xử lý hoàn tiền.</p>
          </div>
        ) : (
          refundableOrders.map((ord) => {
            const isOnline = ord.paymentMethod === 'qr_online'
            const isCod = ord.paymentMethod === 'cod'
            const isRefunded = ord.canteenRefunded || ord.paymentStatus === 'refunded'

            return (
              <div
                key={ord.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  border: isRefunded ? '1px solid #e2e8f0' : isCod ? '1px solid #fed7aa' : '1px solid #bae6fd',
                  padding: '20px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '1rem', color: '#0f172a' }}>#{ord.code}</strong>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: isOnline ? '#e0f2fe' : '#fef3c7', color: isOnline ? '#0369a1' : '#b45309', fontWeight: 700 }}>
                      {isOnline ? 'Đơn QR Online' : 'Đơn COD (Shipper ứng tiền)'}
                    </span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: ord.status === 'incident' ? '#fee2e2' : '#f1f5f9', color: ord.status === 'incident' ? '#b91c1c' : '#475569', fontWeight: 600 }}>
                      {ord.status === 'incident' ? 'Sự cố phát sinh' : 'Đã hủy'}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', color: '#475569' }}>
                    Khách hàng: <strong>{ord.customerName}</strong> ({ord.customerPhone}) • Điểm giao: Tòa {ord.location?.building} - P{ord.location?.room}
                  </p>

                  {ord.shipperName && (
                    <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', color: '#0369a1' }}>
                      Shipper được gán: <strong>{ord.shipperName}</strong> ({ord.shipperPhone})
                      {ord.shipperAdvancePaid && (
                        <span style={{ color: '#d97706', fontWeight: 700, marginLeft: '6px' }}>
                          [Đã ứng tiền món: {ord.subtotal.toLocaleString('vi-VN')}đ tại Canteen]
                        </span>
                      )}
                    </p>
                  )}

                  <p style={{ margin: '0 0 6px', fontSize: '0.8125rem', color: '#dc2626' }}>
                    Lý do hủy / sự cố: <em>{ord.cancelReason || ord.incidentReason || 'Đơn bị hủy'}</em>
                  </p>

                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Thời gian tạo đơn: {new Date(ord.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '2px' }}>
                    {isOnline ? 'Số tiền cần hoàn cho khách:' : 'Khoản hoàn trả tiền ứng Shipper:'}
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: isOnline ? '#0284c7' : '#d97706', marginBottom: '10px' }}>
                    {(isOnline ? ord.total : ord.subtotal).toLocaleString('vi-VN')}đ
                  </div>

                  {isRefunded ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.8125rem', fontWeight: 700, background: '#ecfdf5', padding: '6px 12px', borderRadius: '6px' }}>
                      <CheckCircle2 size={16} /> Đã hoàn tiền xong
                    </span>
                  ) : (
                    <div>
                      {isOnline && (
                        <button
                          onClick={() => handleRefund(ord.id, 'online_customer_refund')}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#0284c7',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <RotateCcw size={15} /> Hoàn tiền qua Cổng thanh toán
                        </button>
                      )}

                      {isCod && (
                        <button
                          onClick={() => handleRefund(ord.id, 'cod_shipper_advance_refund')}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#d97706',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <RotateCcw size={15} /> Hoàn tiền ứng cho Shipper
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
