import React, { useState } from 'react'
import { Bike, ShieldCheck, Phone, Mail, KeyRound, CheckCircle2, Save, AlertCircle } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function ShipperHoSoPage() {
  const { shippers, updateShipperProfile, config } = useNeuEngine()

  // Lấy shipper đã đăng nhập hoặc shipper_1
  const [selectedShipperId, setSelectedShipperId] = useState(() => {
    try {
      const sess = localStorage.getItem('neu_shipper_session')
      if (sess) return JSON.parse(sess).id || 'shipper_1'
    } catch {}
    return 'shipper_1'
  })

  const currentShipper = shippers.find((s) => s.id === selectedShipperId) || shippers[0]

  // Form states UC04
  const [phone, setPhone] = useState(currentShipper.phone)
  const [vehicle, setVehicle] = useState('Xe máy Wave Alpha 29-B1 688.88')
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Form states UC05
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwdMsg, setPwdMsg] = useState('')
  const [pwdErr, setPwdErr] = useState('')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    updateShipperProfile(currentShipper.id, { phone })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMsg('')
    setPwdErr('')

    if (!oldPassword) {
      setPwdErr('Vui lòng nhập mật khẩu hiện tại.')
      return
    }

    if (newPassword.length < 6) {
      setPwdErr('Mật khẩu mới phải có tối thiểu 6 ký tự.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPwdErr('Mật khẩu xác nhận không khớp.')
      return
    }

    setPwdMsg('Đổi mật khẩu tài khoản Shipper thành công!')
    setOldPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPwdMsg(''), 4000)
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Quản lý Thông tin Cá nhân Shipper
        </h2>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
          Hồ sơ sinh viên giao hàng nội khu, hạn mức ứng tiền COD và bảo mật tài khoản.
        </p>
      </div>

      {savedSuccess && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} color="#059669" />
          Đã lưu thông tin hồ sơ thành công!
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {/* Card 1: Hồ sơ cá nhân */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
            <img
              src={currentShipper.studentCardPhoto}
              alt="Ảnh thẻ"
              style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #0284c7' }}
            />
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                {currentShipper.fullName}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '0.75rem', color: '#059669', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} /> Shipper NEU Đã Duyệt
                </span>
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Đơn hoàn thành:</span>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0284c7' }}>
                {currentShipper.completedOrdersCount} đơn
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Tổng thu nhập:</span>
              <div style={{ fontSize: '1.125rem', fontWeight: 800, color: '#059669' }}>
                {currentShipper.totalEarnings.toLocaleString('vi-VN')}đ
              </div>
            </div>
          </div>

          {/* COD Advance Limit */}
          <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px', marginBottom: '20px', fontSize: '0.8125rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ color: '#92400e' }}>Tiền đang ứng COD:</span>
              <strong style={{ color: '#b45309' }}>{currentShipper.currentAdvanceAmount.toLocaleString('vi-VN')}đ</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#92400e' }}>Hạn mức tối đa cho phép:</span>
              <strong style={{ color: '#0f172a' }}>{config.shipperMaxAdvanceLimit.toLocaleString('vi-VN')}đ</strong>
            </div>
          </div>

          {/* Form edit profile */}
          <form onSubmit={handleSaveProfile}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mã sinh viên NEU:</label>
              <input type="text" value={currentShipper.studentId} disabled style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b', fontSize: '0.8125rem' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Email NEU:</label>
              <input type="text" value={currentShipper.email} disabled style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #e2e8f0', background: '#f1f5f9', color: '#64748b', fontSize: '0.8125rem' }} />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Số điện thoại liên hệ:</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Phương tiện di chuyển:</label>
              <input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#0284c7',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Save size={16} /> Lưu Thay Đổi Hồ Sơ
            </button>
          </form>
        </div>

        {/* Card 2: Đổi mật khẩu */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <KeyRound size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                Đổi Mật Khẩu Shipper
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Bảo mật tài khoản sinh viên giao hàng</span>
            </div>
          </div>

          {pwdMsg && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              {pwdMsg}
            </div>
          )}

          {pwdErr && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} color="#dc2626" />
              {pwdErr}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Mật khẩu hiện tại:
              </label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Mật khẩu mới:
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Xác nhận mật khẩu mới:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                required
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
              }}
            >
              Cập nhật Mật khẩu Mới
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
