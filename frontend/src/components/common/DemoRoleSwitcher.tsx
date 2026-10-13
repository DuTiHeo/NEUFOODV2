import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { Layers, RotateCcw, Zap, ChevronUp, ChevronDown, Check, ShieldAlert } from 'lucide-react'

export default function DemoRoleSwitcher() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { orders, resetAllToSeed, createOrder, shipperReportIncident } = useNeuEngine()
  const [isOpen, setIsOpen] = useState(true)
  const [toastMsg, setToastMsg] = useState('')

  const pendingCanteen = orders.filter((o) => o.status === 'awaiting_canteen').length
  const poolShipper = orders.filter((o) => o.status === 'ready_for_handover' && o.receiveType === 'delivery').length

  function triggerToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  function handleCreateSampleCodOrder() {
    createOrder({
      customerId: 'user_1',
      receiveType: 'delivery',
      location: { building: 'A2', floor: 4, room: 'P402' },
      deliveryTiming: 'immediate',
      items: [
        { dishId: 'pho', name: 'Phở Bò Tái Nạm', price: 50000, qty: 1, note: 'Nhiều tương ớt' },
        { dishId: 'tra-sua', name: 'Trà Sữa Trân Châu', price: 35000, qty: 1 },
      ],
      paymentMethod: 'cod',
      note: 'Demo kịch bản ứng tiền COD',
    })
    triggerToast('Đã tạo 1 đơn COD mẫu giao lên P402-A2!')
  }

  function handleSimulateBoomOrder() {
    // Find an active order or create one and mark incident
    const newOrd = createOrder({
      customerId: 'user_1',
      receiveType: 'delivery',
      location: { building: 'A1', floor: 2, room: 'P201' },
      deliveryTiming: 'immediate',
      items: [{ dishId: 'com-ga', name: 'Cơm Gà Xối Mỡ', price: 45000, qty: 1 }],
      paymentMethod: 'cod',
      note: 'Demo không nhận hàng',
    })
    shipperReportIncident(newOrd.id, 'Khách hàng không nghe máy sau 5 phút chờ')
    triggerToast('Đã ghi nhận sự cố giao hàng không thành công.')
  }

  function handleReset() {
    if (window.confirm('Khôi phục toàn bộ dữ liệu mẫu về trạng thái ban đầu?')) {
      resetAllToSeed()
      triggerToast('Đã làm mới dữ liệu hệ thống!')
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 99999,
        fontFamily: 'sans-serif',
      }}
    >
      {toastMsg ? (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: '10px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Zap size={16} color="#facc15" />
          <span>{toastMsg}</span>
        </div>
      ) : null}

      <div
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #cbd5e1',
          width: '320px',
          overflow: 'hidden',
        }}
      >
        {/* Widget Header */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          style={{
            background: '#0f172a',
            color: '#ffffff',
            padding: '10px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="#38bdf8" />
            <strong style={{ fontSize: '0.875rem' }}>NEUFood Demo Controller</strong>
          </div>
          {isOpen ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
        </div>

        {isOpen && (
          <div style={{ padding: '14px' }}>
            <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              CHUYỂN ĐỔI VAI TRÒ (4 PHÂN HỆ):
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => navigate('/')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: pathname === '/' || pathname.startsWith('/menu') || pathname.startsWith('/don-hang') ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: pathname === '/' ? '#ecfdf5' : '#ffffff',
                  color: '#047857',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Khách hàng (/)
              </button>

              <button
                type="button"
                onClick={() => navigate('/canteen')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: pathname.startsWith('/canteen') ? '2px solid #d97706' : '1px solid #cbd5e1',
                  background: pathname.startsWith('/canteen') ? '#fef3c7' : '#ffffff',
                  color: '#b45309',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Canteen {pendingCanteen > 0 ? `(${pendingCanteen} mới)` : ''}
              </button>

              <button
                type="button"
                onClick={() => navigate('/shipper')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: pathname.startsWith('/shipper') ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: pathname.startsWith('/shipper') ? '#e0f2fe' : '#ffffff',
                  color: '#0369a1',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Shipper {poolShipper > 0 ? `(${poolShipper} đơn)` : ''}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin')}
                style={{
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: pathname.startsWith('/admin') ? '2px solid #0f172a' : '1px solid #cbd5e1',
                  background: pathname.startsWith('/admin') ? '#f1f5f9' : '#ffffff',
                  color: '#0f172a',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Quản trị hệ thống
              </button>
            </div>

            <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
              KỊCH BẢN THUYẾT TRÌNH:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={handleCreateSampleCodOrder}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.75rem',
                  color: '#0f172a',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Zap size={13} color="#d97706" />
                <span>Tạo 1 đơn COD mẫu</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateBoomOrder}
                style={{
                  padding: '7px 10px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  fontSize: '0.75rem',
                  color: '#0f172a',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <ShieldAlert size={13} color="#dc2626" />
                <span>Mô phỏng đơn không nhận hàng</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleReset}
              style={{
                width: '100%',
                padding: '6px',
                borderRadius: '6px',
                border: '1px dashed #cbd5e1',
                background: '#ffffff',
                fontSize: '0.6875rem',
                color: '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
              }}
            >
              <RotateCcw size={12} />
              <span>Khôi phục dữ liệu ban đầu (Reset)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
