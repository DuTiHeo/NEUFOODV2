import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bike, ShieldCheck, CheckCircle2, AlertCircle, ArrowLeft, Send, Upload, FileText } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function DangKyShipperPage() {
  const navigate = useNavigate()
  const { registerShipper, shippers } = useNeuEngine()

  const [fullName, setFullName] = useState('Nguyễn Văn An')
  const [studentId, setStudentId] = useState('11210001')
  const [email, setEmail] = useState('sinhvien@neu.edu.vn')
  const [phone, setPhone] = useState('0981234567')
  const [vehiclePlate, setVehiclePlate] = useState('29-B1 688.88 (Xe máy Honda Wave)')
  const [studentCardPhoto, setStudentCardPhoto] = useState('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600')
  const [agreeTerms, setAgreeTerms] = useState(true)

  const [submitted, setSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Kiểm tra xem sinh viên này đã có hồ sơ chưa
  const existingProfile = shippers.find((s) => s.studentId === studentId)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!studentId.startsWith('112') && !studentId.startsWith('11')) {
      setErrorMessage('Mã sinh viên không hợp lệ. Chỉ sinh viên NEU mới được đăng ký làm shipper.')
      return
    }

    if (!email.endsWith('@neu.edu.vn')) {
      setErrorMessage('Vui lòng sử dụng email trường NEU (@neu.edu.vn) để xác thực.')
      return
    }

    if (!agreeTerms) {
      setErrorMessage('Vui lòng đồng ý với Quy chế giao hàng nội khu NEU.')
      return
    }

    try {
      registerShipper({
        fullName,
        studentId,
        email,
        phone,
        studentCardPhoto,
        vehiclePlate,
      })
      setSubmitted(true)
    } catch (err: any) {
      setErrorMessage(err.message)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 16px', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      {/* Back button */}
      <div style={{ marginBottom: '20px' }}>
        <Link to="/tai-khoan" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          <ArrowLeft size={16} /> Quay lại Hồ sơ cá nhân
        </Link>
      </div>

      {/* Main Container */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)', color: '#ffffff', padding: '32px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bike size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Đăng Ký Làm Shipper Nội Khu NEU</h1>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                Dành riêng cho sinh viên Đại học Kinh tế Quốc dân
              </p>
            </div>
          </div>
        </div>

        {/* Existing Application Banner */}
        {existingProfile && (
          <div style={{ margin: '24px 24px 0', padding: '16px 20px', borderRadius: '10px', background: existingProfile.status === 'approved' ? '#ecfdf5' : existingProfile.status === 'rejected' ? '#fef2f2' : '#fffbeb', border: `1px solid ${existingProfile.status === 'approved' ? '#a7f3d0' : existingProfile.status === 'rejected' ? '#fecaca' : '#fde68a'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <strong style={{ fontSize: '0.9375rem', color: existingProfile.status === 'approved' ? '#065f46' : existingProfile.status === 'rejected' ? '#991b1b' : '#92400e' }}>
                Trạng thái hồ sơ: {existingProfile.status === 'approved' ? 'Đã được Phê duyệt' : existingProfile.status === 'rejected' ? 'Bị từ chối' : 'Đang chờ xét duyệt'}
              </strong>
              {existingProfile.status === 'approved' && (
                <Link to="/shipper" style={{ padding: '6px 14px', borderRadius: '6px', background: '#059669', color: '#ffffff', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 700 }}>
                  Vào Phân hệ Shipper &rarr;
                </Link>
              )}
            </div>

            {existingProfile.status === 'pending' && (
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#b45309', lineHeight: 1.5 }}>
                Hồ sơ của bạn đã được tiếp nhận và đang chờ Ban Quản Trị xem xét đối chiếu thẻ sinh viên. Bạn sẽ nhận được thông báo ngay khi hồ sơ được kích hoạt.
              </p>
            )}

            {existingProfile.status === 'rejected' && (
              <div>
                <p style={{ margin: '0 0 8px', fontSize: '0.8125rem', color: '#dc2626' }}>
                  Lý do từ chối: <strong>{existingProfile.rejectionReason || 'Ảnh thẻ sinh viên không rõ nét hoặc thông tin không trùng khớp.'}</strong>
                </p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>
                  Bạn có thể cập nhật lại thông tin và bấm gửi lại hồ sơ bên dưới.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Success Alert after submit */}
        {submitted && (
          <div style={{ margin: '24px 24px 0', padding: '16px 20px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle2 size={20} color="#059669" />
            <div>
              <strong>Nộp hồ sơ đăng ký thành công!</strong>
              <div style={{ fontSize: '0.8125rem' }}>
                Hồ sơ đã được chuyển tới Ban Quản Trị để thẩm định và phê duyệt.
              </div>
            </div>
          </div>
        )}

        {/* Application Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Họ và tên sinh viên:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Mã sinh viên NEU:
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                placeholder="Ví dụ: 11210001"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email trường NEU (@neu.edu.vn):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số điện thoại liên lạc:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Phương tiện di chuyển nội khu &amp; Biển số xe (nếu có):
            </label>
            <input
              type="text"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
              placeholder="Ví dụ: Xe đạp điện, hoặc Xe máy Honda Wave 29-B1 123.45"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
            />
          </div>

          {/* Student Card Photo Upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Ảnh chụp thẻ sinh viên NEU (Yêu cầu bắt buộc):
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <img
                src={studentCardPhoto}
                alt="Ảnh thẻ sinh viên"
                style={{ width: '120px', height: '80px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #cbd5e1' }}
              />
              <div style={{ flex: 1, minWidth: '240px' }}>
                <input
                  type="text"
                  value={studentCardPhoto}
                  onChange={(e) => setStudentCardPhoto(e.target.value)}
                  placeholder="URL ảnh thẻ sinh viên..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', marginBottom: '6px' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Ảnh thẻ sinh viên phải rõ mã số, họ tên và dấu mộc của trường NEU để Admin đối soát.
                </span>
              </div>
            </div>
          </div>

          {/* Rules Checkbox */}
          <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.8125rem', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                style={{ marginTop: '2px' }}
              />
              <span>
                Tôi cam kết tuân thủ <strong>Quy chế giao hàng nội khu NEUFood</strong>: Ứng tiền món cho Canteen với đơn COD, giao đúng phòng học và đảm bảo thời gian giao hàng.
              </span>
            </label>
          </div>

          {errorMessage && (
            <div style={{ color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={16} /> {errorMessage}
            </div>
          )}

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(to right, #059669, #047857)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9375rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)',
            }}
          >
            <Send size={18} /> Gửi Hồ Sơ Đăng Ký
          </button>
        </form>
      </div>
    </div>
  )
}
