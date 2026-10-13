import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { Bike, Compass, Package, Wallet, Power } from 'lucide-react'

export default function ShipperLayout() {
  const { shippers, orders, toggleShipperOnline } = useNeuEngine()

  // Primary demo shipper
  const currentShipper = shippers.find((s) => s.status === 'approved') || shippers[0]

  const myDeliveringCount = orders.filter(
    (o) => o.shipperId === currentShipper.id && ['shipper_assigned', 'picked_up', 'delivering'].includes(o.status)
  ).length

  const poolCount = orders.filter((o) => o.status === 'ready_for_handover' && o.receiveType === 'delivery').length

  const tabStyle = ({ isActive }: { isActive: boolean }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
    padding: '8px 4px',
    textDecoration: 'none',
    fontSize: '0.6875rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#059669' : '#64748b',
    position: 'relative' as const,
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Mobile Device Frame Container (Max 420px) */}
      <div
        style={{
          width: '100%',
          maxWidth: '414px',
          height: '840px',
          background: '#ffffff',
          borderRadius: '32px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          border: '8px solid #334155',
          position: 'relative',
        }}
      >
        {/* Top Status Bar & Header */}
        <header
          style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#ffffff',
            padding: '16px 18px 12px',
            borderBottom: '1px solid #047857',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '9999px', overflow: 'hidden', border: '2px solid #ffffff' }}>
                <img src={currentShipper.studentCardPhoto} alt="Shipper" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', display: 'block' }}>{currentShipper.fullName}</strong>
                <span style={{ fontSize: '0.6875rem', opacity: 0.9 }}>Mã SV: {currentShipper.studentId} • NEU</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Switch Bật / Tắt sẵn sàng (UC28, BR-20) */}
              <button
                type="button"
                onClick={() => toggleShipperOnline(currentShipper.id, !currentShipper.isOnline)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 8px',
                  borderRadius: '9999px',
                  border: 'none',
                  cursor: 'pointer',
                  background: currentShipper.isOnline ? '#22c55e' : '#64748b',
                  color: '#ffffff',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                <Power size={12} />
                {currentShipper.isOnline ? 'Đang bật' : 'Đang tắt'}
              </button>

              {/* LogOut Button */}
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem('neu_shipper_session')
                  window.location.href = '/shipper/login'
                }}
                title="Đăng xuất Shipper"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '8px',
                  padding: '5px 8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                }}
              >
                Đăng xuất
              </button>
            </div>
          </div>

          {/* Limits indicator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0, 0, 0, 0.15)', padding: '6px 10px', borderRadius: '8px', fontSize: '0.6875rem' }}>
            <div>
              <span style={{ opacity: 0.8 }}>Đơn đang giao:</span>
              <strong style={{ display: 'block', fontSize: '0.75rem' }}>{myDeliveringCount} / 5 đơn</strong>
            </div>
            <div>
              <span style={{ opacity: 0.8 }}>Tiền ứng COD:</span>
              <strong style={{ display: 'block', fontSize: '0.75rem' }}>
                {Number(currentShipper.currentAdvanceAmount).toLocaleString('vi-VN')}đ / 500k
              </strong>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '14px' }}>
          <Outlet context={{ currentShipper }} />
        </main>

        {/* Bottom Tab Bar */}
        <nav
          style={{
            height: '60px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            padding: '0 4px',
          }}
        >
          <NavLink to="/shipper" end style={tabStyle}>
            <Compass size={18} />
            <span>Sàn nhận đơn</span>
            {poolCount > 0 ? (
              <span style={{ position: 'absolute', top: '4px', right: '12px', background: '#ef4444', color: '#ffffff', fontSize: '0.625rem', fontWeight: 800, padding: '1px 5px', borderRadius: '9999px' }}>
                {poolCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink to="/shipper/dang-giao" style={tabStyle}>
            <Package size={18} />
            <span>Đang giao</span>
            {myDeliveringCount > 0 ? (
              <span style={{ position: 'absolute', top: '4px', right: '12px', background: '#0284c7', color: '#ffffff', fontSize: '0.625rem', fontWeight: 800, padding: '1px 5px', borderRadius: '9999px' }}>
                {myDeliveringCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink to="/shipper/thu-nhap" style={tabStyle}>
            <Wallet size={18} />
            <span>Ví thu nhập</span>
          </NavLink>

          <NavLink to="/shipper/ho-so" style={tabStyle}>
            <Bike size={18} />
            <span>Tài khoản</span>
          </NavLink>
        </nav>
      </div>
    </div>
  )
}
