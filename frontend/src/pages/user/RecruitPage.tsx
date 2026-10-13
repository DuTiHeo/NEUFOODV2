import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import styles from './Recruit.module.css'

export default function Recruit() {
  const { shippers } = useNeuEngine()

  const [fullName, setFullName] = useState('Phạm Minh Tuấn')
  const [studentId, setStudentId] = useState('11220003')
  const [email, setEmail] = useState('tuan.pm@neu.edu.vn')
  const [phone, setPhone] = useState('0966555444')
  const [cardPhoto, setCardPhoto] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'
  )
  const [submitted, setSubmitted] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Check if current student already has a profile in system
  const existingProfile = shippers.find((s) => s.studentId === studentId || s.email === email)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    if (!studentId.trim() || studentId.trim().length < 6) {
      setErrorMsg('Mã sinh viên NEU không hợp lệ.')
      return
    }

    if (!email.endsWith('@neu.edu.vn')) {
      setErrorMsg('Vui lòng sử dụng email sinh viên trường NEU (@neu.edu.vn).')
      return
    }

    // Add / Update profile in localStorage shippers
    const rawShippers = JSON.parse(localStorage.getItem('NEU_SHIPPERS_V1') || '[]')
    const newProfile = {
      id: `shipper_${Date.now()}`,
      studentId: studentId.trim(),
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      studentCardPhoto: cardPhoto,
      status: 'pending',
      isOnline: false,
      currentAdvanceAmount: 0,
      activeOrdersCount: 0,
      totalEarnings: 0,
      completedOrdersCount: 0,
    }

    const filtered = rawShippers.filter((s: any) => s.studentId !== studentId.trim())
    localStorage.setItem('NEU_SHIPPERS_V1', JSON.stringify([newProfile, ...filtered]))
    window.dispatchEvent(new Event('neu_storage_updated'))

    setSubmitted(true)
  }

  return (
    <div className={styles.container} style={{ maxWidth: '680px', margin: '40px auto', padding: '24px 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <span
          className="material-symbols-outlined"
          style={{ fontSize: '48px', color: '#059669', marginBottom: '8px' }}
        >
          sports_motorsports
        </span>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#047857', margin: '0 0 8px' }}>
          ĐĂNG KÝ SHIPPER NỘI KHU NEUFOOD
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.9375rem', margin: 0 }}>
          Dành riêng cho sinh viên Đại học Kinh tế Quốc dân
        </p>
      </div>

      {/* Rules Notice */}
      <div
        style={{
          background: '#ecfdf5',
          border: '1px solid #a7f3d0',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '24px',
          fontSize: '0.875rem',
          color: '#065f46',
          lineHeight: 1.5,
        }}
      >
        <strong>Quy định đăng ký Shipper nội khu:</strong>
        <ul style={{ margin: '6px 0 0', paddingLeft: '20px' }}>
          <li>Chỉ sinh viên NEU chính quy có mã SV và email trường mới được tham gia.</li>
          <li>Hồ sơ gồm: Họ tên, Mã SV, SĐT, Email trường và ảnh thẻ sinh viên rõ nét.</li>
          <li>Hồ sơ sẽ được Ban quản trị phê duyệt trước khi có thể nhận đơn hàng.</li>
        </ul>
      </div>

      {submitted ? (
        <div
          style={{
            background: '#ecfdf5',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: '56px', color: '#059669', marginBottom: '12px' }}
          >
            task_alt
          </span>
          <h3 style={{ fontSize: '1.25rem', color: '#065f46', margin: '0 0 8px' }}>
            Nộp hồ sơ Shipper thành công!
          </h3>
          <p style={{ color: '#047857', fontSize: '0.9375rem', lineHeight: 1.5, marginBottom: '20px' }}>
            Hồ sơ của bạn (Mã SV: <strong>{studentId}</strong>) đang ở trạng thái <strong>Chờ duyệt</strong>.
            Sau khi đối soát ảnh thẻ sinh viên và phê duyệt, tài khoản Shipper của bạn sẽ được kích hoạt ngay.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                border: '1px solid #059669',
                background: '#ffffff',
                color: '#059669',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Chỉnh sửa thông tin nộp lại
            </button>
            <Link
              to="/menu"
              style={{
                padding: '10px 20px',
                borderRadius: '8px',
                background: '#059669',
                color: '#ffffff',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Về trang đặt món
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          {existingProfile?.status === 'rejected' ? (
            <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '8px', padding: '12px', marginBottom: '16px', color: '#991b1b', fontSize: '0.875rem' }}>
              <strong>Hồ sơ trước đó bị từ chối:</strong> {existingProfile.rejectionReason || 'Ảnh thẻ mờ hoặc thông tin chưa chính xác'}. Vui lòng cập nhật lại bên dưới.
            </div>
          ) : null}

          {errorMsg ? (
            <div style={{ background: '#fee2e2', border: '1px solid #f87171', borderRadius: '8px', padding: '10px', marginBottom: '16px', color: '#991b1b', fontSize: '0.875rem' }}>
              {errorMsg}
            </div>
          ) : null}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
              1. Họ và tên đầy đủ:
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Văn A"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9375rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                2. Mã sinh viên NEU:
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Ví dụ: 11210001"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9375rem' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
                3. Số điện thoại nhận cuốc:
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ví dụ: 0987654321"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9375rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
              4. Email sinh viên trường (@neu.edu.vn):
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hoten.masv@neu.edu.vn"
              style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9375rem' }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
              5. Ảnh chụp thẻ sinh viên NEU:
            </label>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '80px', borderRadius: '8px', border: '2px dashed #cbd5e1', overflow: 'hidden', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cardPhoto ? (
                  <img src={cardPhoto} alt="Thẻ SV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span className="material-symbols-outlined" style={{ color: '#94a3b8' }}>badge</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 6px', fontSize: '0.8125rem', color: '#64748b' }}>
                  Chọn ảnh demo thẻ sinh viên để đối soát:
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setCardPhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80')}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Ảnh thẻ chuẩn #1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardPhoto('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80')}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f1f5f9', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Ảnh thẻ chuẩn #2
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              background: '#059669',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <span className="material-symbols-outlined">send</span>
            Nộp hồ sơ xét duyệt Shipper
          </button>
        </form>
      )}
    </div>
  )
}