import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Bike, ShieldCheck, AlertCircle, LogIn, ArrowRight } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function ShipperLoginPage() {
  const navigate = useNavigate()
  const { shippers } = useNeuEngine()

  const [selectedShipperId, setSelectedShipperId] = useState('shipper_1')
  const [password, setPassword] = useState('shipper123')
  const [errorMessage, setErrorMessage] = useState('')

  const activeShipper = shippers.find((s) => s.id === selectedShipperId)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!activeShipper) {
      setErrorMessage('Không tìm thấy tài khoản shipper.')
      return
    }

    // Shipper phải là sinh viên NEU và được Admin phê duyệt trước khi nhận đơn
    if (activeShipper.status === 'pending') {
      setErrorMessage('Hồ sơ đăng ký của bạn đang chờ phê duyệt. Chưa thể đăng nhập phân hệ Shipper.')
      return
    }

    if (activeShipper.status === 'rejected') {
      setErrorMessage(`Hồ sơ của bạn đã bị từ chối: "${activeShipper.rejectionReason || 'Không hợp lệ'}". Vui lòng nộp lại hồ sơ tại Phân hệ Khách hàng.`)
      return
    }

    // Lưu session shipper
    localStorage.setItem(
      'neu_shipper_session',
      JSON.stringify({
        id: activeShipper.id,
        name: activeShipper.fullName,
        studentId: activeShipper.studentId,
        phone: activeShipper.phone,
        email: activeShipper.email,
      })
    )
    navigate('/shipper')
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '480px', width: '100%', background: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(5, 150, 105, 0.12)', border: '1px solid #d1fae5', overflow: 'hidden' }}>
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.2)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Bike size={32} color="#ffffff" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.375rem', fontWeight: 800 }}>Đăng Nhập Shipper Nội Khu</h1>
          <p style={{ margin: 0, fontSize: '0.8125rem', opacity: 0.9 }}>
            Dành cho sinh viên NEU đã được phê duyệt làm người giao hàng
          </p>
        </div>

        <div style={{ padding: '24px' }}>
          {/* Quick account selector */}
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
            Chọn tài khoản Shipper để đăng nhập:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
            {shippers.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedShipperId(s.id)
                  setErrorMessage('')
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  border: selectedShipperId === s.id ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: selectedShipperId === s.id ? '#f0f9ff' : '#ffffff',
                  color: selectedShipperId === s.id ? '#0369a1' : '#334155',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div>
                  <strong style={{ fontSize: '0.875rem' }}>{s.fullName}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Mã SV: {s.studentId} • {s.phone}</div>
                </div>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: s.status === 'approved' ? '#ecfdf5' : s.status === 'pending' ? '#fffbeb' : '#fef2f2',
                    color: s.status === 'approved' ? '#059669' : s.status === 'pending' ? '#d97706' : '#dc2626',
                  }}
                >
                  {s.status === 'approved' ? 'Đã duyệt' : s.status === 'pending' ? 'Chờ duyệt' : 'Bị từ chối'}
                </span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Mật khẩu:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>

            {errorMessage && (
              <div style={{ padding: '10px 12px', borderRadius: '8px', background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <AlertCircle size={18} color="#dc2626" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(to right, #0284c7, #0369a1)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(2, 132, 199, 0.25)',
              }}
            >
              <LogIn size={18} /> Đăng Nhập Vào Phân Hệ Shipper
            </button>
          </form>

          <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8125rem', color: '#64748b' }}>
            Chưa có tài khoản shipper?{' '}
            <Link to="/dang-ky-shipper" style={{ color: '#0284c7', fontWeight: 700, textDecoration: 'none' }}>
              Đăng ký nộp hồ sơ tại đây &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
