import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { User, ShieldCheck, ShieldAlert, Phone, Mail, MapPin, Building, Package, FileText, Bike, LogOut, Check, AlertCircle, Save } from 'lucide-react'

export default function TaiKhoanPage() {
  const { users, currentUserRole, orders, complaints } = useNeuEngine()
  const navigate = useNavigate()

  // Find user_1 or current user
  const user1 = users.find((u) => u.id === 'user_1') || {
    id: 'user_1',
    email: 'sinhvien@neu.edu.vn',
    fullName: 'Nguyễn Văn An',
    phone: '0981234567',
    studentId: '11210001',
    role: 'customer',
    isCodBlacklisted: false,
    isActive: true,
  }

  // Active selected student for testing
  const [selectedUserId, setSelectedUserId] = useState<string>('user_1')
  const activeUser = users.find((u) => u.id === selectedUserId) || user1

  // Profile Form States
  const [fullName, setFullName] = useState(activeUser.fullName)
  const [phone, setPhone] = useState(activeUser.phone)
  const [studentId, setStudentId] = useState(activeUser.studentId || '11210001')
  const [email, setEmail] = useState(activeUser.email)
  const [faculty, setFaculty] = useState('Viện CNTT & Kinh tế số NEU')

  // Default campus delivery location (BR-08, BR-09)
  const [defaultBuilding, setDefaultBuilding] = useState('A2')
  const [defaultFloor, setDefaultFloor] = useState(4)
  const [defaultRoom, setDefaultRoom] = useState('P402')
  const [deliveryNote, setDeliveryNote] = useState('Gọi trước khi đến 5 phút')

  const [savedSuccess, setSavedSuccess] = useState(false)

  // Sync state when switching user
  useEffect(() => {
    setFullName(activeUser.fullName)
    setPhone(activeUser.phone)
    setStudentId(activeUser.studentId || '11210001')
    setEmail(activeUser.email)
  }, [selectedUserId, activeUser])

  // Handle Save Profile (UC04)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Save to localStorage users
      const rawUsers = localStorage.getItem('NEU_USERS_V1')
      if (rawUsers) {
        const parsed = JSON.parse(rawUsers)
        const idx = parsed.findIndex((u: any) => u.id === activeUser.id)
        if (idx !== -1) {
          parsed[idx] = {
            ...parsed[idx],
            fullName,
            phone,
            studentId,
            email,
          }
          localStorage.setItem('NEU_USERS_V1', JSON.stringify(parsed))
        }
      }

      // Save default location
      localStorage.setItem('NEU_DEFAULT_LOCATION', JSON.stringify({
        building: defaultBuilding,
        floor: defaultFloor,
        room: defaultRoom,
        deliveryNote,
      }))

      // Update session
      localStorage.setItem('neufood_session_v1', JSON.stringify({
        email,
        name: fullName,
        phone,
        studentId,
        loginAt: new Date().toISOString(),
      }))

      window.dispatchEvent(new Event('neu_storage_updated'))
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('neufood_session_v1')
    sessionStorage.removeItem('neufood_session_v1')
    window.dispatchEvent(new Event('storage'))
    navigate('/')
  }

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 16px', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>
            Quản lý Thông tin Cá nhân
          </h1>
          <p style={{ margin: 0, fontSize: '0.875rem', color: '#64748b' }}>
            Thông tin sinh viên NEU và địa chỉ nhận hàng mặc định trong khuôn viên trường.
          </p>
        </div>
        <span style={{ fontSize: '0.8125rem', color: '#059669', background: '#ecfdf5', padding: '6px 12px', borderRadius: '8px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} /> Sinh viên NEU đã xác thực
        </span>
      </div>

      {/* Profile Role Switcher (For testing) */}
      <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '10px', border: '1px dashed #cbd5e1', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <User size={18} color="#0284c7" />
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#334155' }}>
            Mô phỏng tài khoản sinh viên:
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setSelectedUserId('user_1')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedUserId === 'user_1' ? '2px solid #0284c7' : '1px solid #cbd5e1',
              background: selectedUserId === 'user_1' ? '#e0f2fe' : '#ffffff',
              color: selectedUserId === 'user_1' ? '#0369a1' : '#475569',
            }}
          >
            Nguyễn Văn An (Tài khoản chuẩn)
          </button>
          <button
            type="button"
            onClick={() => setSelectedUserId('user_boom')}
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: selectedUserId === 'user_boom' ? '2px solid #ef4444' : '1px solid #cbd5e1',
              background: selectedUserId === 'user_boom' ? '#fee2e2' : '#ffffff',
              color: selectedUserId === 'user_boom' ? '#b91c1c' : '#475569',
            }}
          >
            Trần Văn Boom (Bị hạn chế COD)
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Check size={20} color="#059669" />
          <strong>Đã lưu thông tin cá nhân thành công! Các thông tin này sẽ được tự động điền khi bạn đặt đơn hàng.</strong>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
        {/* Left Card: Personal Info */}
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
              {fullName.charAt(0)}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>{fullName}</h2>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>Mã SV: {studentId} • NEU</p>
            </div>
          </div>

          {/* COD Status Banner */}
          <div style={{ marginBottom: '20px', padding: '12px 14px', borderRadius: '8px', background: activeUser.isCodBlacklisted ? '#fef2f2' : '#f0fdf4', border: `1px solid ${activeUser.isCodBlacklisted ? '#fecaca' : '#bbf7d0'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {activeUser.isCodBlacklisted ? <ShieldAlert size={18} color="#dc2626" /> : <ShieldCheck size={18} color="#16a34a" />}
              <strong style={{ fontSize: '0.875rem', color: activeUser.isCodBlacklisted ? '#991b1b' : '#166534' }}>
                {activeUser.isCodBlacklisted ? 'Tài khoản bị khóa tính năng COD' : 'Quyền thanh toán COD: Hoạt động'}
              </strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: activeUser.isCodBlacklisted ? '#7f1d1d' : '#14532d', lineHeight: 1.5 }}>
              {activeUser.isCodBlacklisted
                ? `Lý do: ${activeUser.blacklistReason || 'Boom hàng'}. Bạn chỉ có thể đặt đồ ăn qua hình thức quét mã VietQR Online.`
                : 'Được phép thanh toán tiền mặt khi nhận hàng (COD) với các đơn hàng dưới 300.000đ.'}
            </p>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Họ và tên:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Mã sinh viên NEU:
              </label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email trường NEU (@neu.edu.vn):
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Số điện thoại liên lạc (Shipper gọi):
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Khoa / Viện đào tạo:
              </label>
              <input
                type="text"
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: '#b91c1c',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.875rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Save size={16} /> Lưu Thay Đổi Thông Tin
            </button>
          </form>
        </div>

        {/* Right Column: Default Location & Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Default Location Card */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <MapPin size={20} color="#b91c1c" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                Địa điểm giao hàng mặc định tại NEU
              </h3>
            </div>
            <p style={{ margin: '0 0 16px', fontSize: '0.8125rem', color: '#64748b' }}>
              Địa điểm này sẽ được tự động chọn sẵn mỗi khi bạn đặt đồ ăn tại Canteen A2.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Tòa nhà:
                </label>
                <select
                  value={defaultBuilding}
                  onChange={(e) => setDefaultBuilding(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                >
                  <option value="A1">Tòa A1</option>
                  <option value="A2">Tòa A2 (Canteen)</option>
                  <option value="B">Tòa B</option>
                  <option value="C">Tòa C</option>
                  <option value="D">Tòa D</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                  Tầng:
                </label>
                <select
                  value={defaultFloor}
                  onChange={(e) => setDefaultFloor(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((fl) => (
                    <option key={fl} value={fl}>Tầng {fl}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Phòng học cụ thể:
              </label>
              <input
                type="text"
                value={defaultRoom}
                onChange={(e) => setDefaultRoom(e.target.value)}
                placeholder="Ví dụ: P402, P501..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                Ghi chú giao hàng mặc định:
              </label>
              <input
                type="text"
                value={deliveryNote}
                onChange={(e) => setDeliveryNote(e.target.value)}
                placeholder="Ví dụ: Gọi trước khi đến 5 phút..."
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}
              />
            </div>

            <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', fontSize: '0.75rem', color: '#64748b', marginBottom: '14px' }}>
              Phí ship giao nội khu dự kiến: <strong>{defaultBuilding === 'A2' ? '7.000đ' : defaultBuilding === 'A1' ? '8.000đ' : defaultBuilding === 'D' ? '10.000đ' : '9.000đ'}</strong>.
            </div>

            <button
              type="button"
              onClick={handleSave}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #b91c1c',
                background: '#fef2f2',
                color: '#b91c1c',
                fontWeight: 700,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              <Save size={15} /> Lưu Địa Chỉ Nhận Hàng Mặc Định
            </button>
          </div>

          {/* Quick Actions & Links */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Tiện ích sinh viên NEU
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Link
                to="/lich-su-don"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '8px', background: '#f8fafc', color: '#1e293b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e2e8f0' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Package size={18} color="#0284c7" />
                  <span>Đơn hàng của tôi ({orders.length} đơn)</span>
                </div>
                <span style={{ color: '#94a3b8' }}>&rarr;</span>
              </Link>

              <Link
                to="/khieu-nai"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '8px', background: '#f8fafc', color: '#1e293b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e2e8f0' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} color="#f59e0b" />
                  <span>Gửi khiếu nại đơn hàng</span>
                </div>
                <span style={{ color: '#94a3b8' }}>&rarr;</span>
              </Link>

              <Link
                to="/dang-ky-shipper"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '8px', background: '#f0f9ff', color: '#0369a1', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 700, border: '1px solid #bae6fd' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bike size={18} color="#0284c7" />
                  <span>Đăng ký làm Shipper nội khu NEU</span>
                </div>
                <span style={{ color: '#0284c7' }}>&rarr;</span>
              </Link>

              <Link
                to="/recruit"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', borderRadius: '8px', background: '#f8fafc', color: '#1e293b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #e2e8f0' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bike size={18} color="#059669" />
                  <span>Xem thông tin tuyển dụng Shipper</span>
                </div>
                <span style={{ color: '#94a3b8' }}>&rarr;</span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '8px', background: '#fee2e2', color: '#b91c1c', border: 'none', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', marginTop: '6px' }}
              >
                <LogOut size={16} /> Đăng xuất khỏi hệ thống
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
