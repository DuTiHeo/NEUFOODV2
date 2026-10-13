import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, ShieldCheck, Users, Lock, LogIn, ArrowRight } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function CanteenLoginPage() {
  const navigate = useNavigate()
  const { loginCanteen } = useNeuEngine()

  const [role, setRole] = useState<'canteen_staff' | 'canteen_manager'>('canteen_staff')
  const [email, setEmail] = useState('canteen_staff@neu.edu.vn')
  const [password, setPassword] = useState('canteen123')
  const [error, setError] = useState('')

  const handleSelectRole = (selectedRole: 'canteen_staff' | 'canteen_manager') => {
    setRole(selectedRole)
    if (selectedRole === 'canteen_staff') {
      setEmail('canteen_staff@neu.edu.vn')
      setPassword('canteen123')
    } else {
      setEmail('canteen_manager@neu.edu.vn')
      setPassword('manager123')
    }
    setError('')
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      setError('Vui lòng nhập mật khẩu.')
      return
    }

    if (role === 'canteen_staff') {
      loginCanteen('canteen_staff', 'Nhân viên Canteen A2 (Tài khoản dùng chung)', email)
      navigate('/canteen')
    } else {
      loginCanteen('canteen_manager', 'Quản lý Trưởng Canteen A2', email)
      navigate('/canteen/thuc-don')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0fdfa 0%, #f8fafc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '480px', width: '100%', background: '#ffffff', borderRadius: '16px', boxShadow: '0 10px 25px rgba(13, 148, 136, 0.1)', border: '1px solid #ccfbf1', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', color: '#ffffff', padding: '28px 24px', textAlign: 'center' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <Store size={32} color="#ffffff" />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: '1.375rem', fontWeight: 800 }}>Cổng Đăng Nhập Canteen A2</h1>
          <p style={{ margin: 0, fontSize: '0.8125rem', opacity: 0.9 }}>
            Phân quyền đăng nhập cho Nhân viên phục vụ và Quản lý Canteen
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div style={{ padding: '24px' }}>
          <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 700, color: '#475569', marginBottom: '10px' }}>
            Chọn tài khoản được Admin cấp sẵn:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <button
              type="button"
              onClick={() => handleSelectRole('canteen_staff')}
              style={{
                padding: '12px 10px',
                borderRadius: '10px',
                border: role === 'canteen_staff' ? '2px solid #881337' : '1px solid #cbd5e1',
                background: role === 'canteen_staff' ? '#fff1f2' : '#ffffff',
                color: role === 'canteen_staff' ? '#881337' : '#475569',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '4px' }}>
                <Users size={16} /> TK Dùng Chung
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                Dành cho cả Quản lý &amp; Nhân viên (Bếp, bàn giao, kho món)
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectRole('canteen_manager')}
              style={{
                padding: '12px 10px',
                borderRadius: '10px',
                border: role === 'canteen_manager' ? '2px solid #881337' : '1px solid #cbd5e1',
                background: role === 'canteen_manager' ? '#fff1f2' : '#ffffff',
                color: role === 'canteen_manager' ? '#881337' : '#475569',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '0.8125rem', marginBottom: '4px' }}>
                <ShieldCheck size={16} /> TK Quản Lý Riêng
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                Quản lý nâng cao (Thực đơn, Hoàn tiền, Báo cáo doanh thu)
              </div>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Email tài khoản:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
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

            {error && (
              <div style={{ marginBottom: '14px', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                background: 'linear-gradient(to right, #881337, #9f1239)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(136, 19, 55, 0.2)',
              }}
            >
              <LogIn size={18} /> Đăng nhập vào Giao diện {role === 'canteen_staff' ? 'Nhân viên Canteen' : 'Quản lý Canteen'}
            </button>
          </form>

          {/* Quick Info Box */}
          <div style={{ marginTop: '20px', padding: '12px 14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>
            <strong style={{ color: '#0f172a' }}>Quy trình phân quyền Canteen A2:</strong>
            <br />
            • Khi xong việc với <em>Quản lý thực đơn / Hoàn tiền</em>, Quản lý sẽ bấm Đăng xuất để hệ thống trở về Tài khoản dùng chung cho Nhân viên tiếp tục vận hành.
          </div>
        </div>
      </div>
    </div>
  )
}
