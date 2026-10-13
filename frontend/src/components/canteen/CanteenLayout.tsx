import React from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Utensils,
  ChefHat,
  BarChart3,
  Store,
  RotateCcw,
  MessageSquare,
  LogOut,
  ShieldCheck,
  Users,
  MenuSquare,
  Lock,
} from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function CanteenLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { orders, canteenSession, logoutCanteen, loginCanteen } = useNeuEngine()

  const isManager = canteenSession?.role === 'canteen_manager'

  const pendingCanteenCount = orders.filter((o) => o.status === 'awaiting_canteen').length
  const preparingCount = orders.filter((o) => o.status === 'preparing').length
  const readyCount = orders.filter((o) => o.status === 'ready_for_handover').length
  const refundCount = orders.filter((o) => o.status === 'cancelled' || o.status === 'incident').filter((o) => !o.canteenRefunded).length

  const navCls = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#0d9488' : '#475569',
    background: isActive ? '#f0fdfa' : 'transparent',
    transition: 'all 0.2s',
  })

  let pageTitle = 'Bếp & Đơn hàng Canteen A2'
  if (pathname.includes('/canteen/thuc-don')) pageTitle = 'Quản lý Thực đơn (Thêm, Sửa, Đổi giá)'
  else if (pathname.includes('/canteen/hoan-tien')) pageTitle = 'Hoàn tiền khi đơn bị hủy'
  else if (pathname.includes('/canteen/mon')) pageTitle = 'Kho món & Cập nhật Trạng thái Còn/Hết'
  else if (pathname.includes('/canteen/bao-cao')) pageTitle = 'Báo cáo Doanh thu & Thống kê'
  else if (pathname.includes('/canteen/danh-gia')) pageTitle = 'Đánh giá & Trả lời Phản hồi Khách hàng'

  const handleLogout = () => {
    logoutCanteen()
    navigate('/canteen/login')
  }

  const handleSwitchToManager = () => {
    loginCanteen('canteen_manager', 'Quản lý Trưởng Canteen A2', 'canteen_manager@neu.edu.vn')
    navigate('/canteen/thuc-don')
  }

  const handleSwitchToStaff = () => {
    loginCanteen('canteen_staff', 'Nhân viên Canteen A2 (Tài khoản dùng chung)', 'canteen_staff@neu.edu.vn')
    navigate('/canteen')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '270px',
          background: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100vh',
        }}
      >
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingLeft: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#0d9488',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Store size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0d9488', margin: 0 }}>Canteen A2</h2>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Phân hệ Vận hành Bếp &amp; Quản trị</span>
          </div>
        </div>

        {/* Current Role Banner */}
        <div
          style={{
            background: isManager ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isManager ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '10px',
            padding: '10px 12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
            {isManager ? <ShieldCheck size={16} color="#dc2626" /> : <Users size={16} color="#16a34a" />}
            <strong style={{ fontSize: '0.8125rem', color: isManager ? '#991b1b' : '#166534' }}>
              {isManager ? 'Quản lý Canteen (Riêng)' : 'Tài khoản Dùng chung'}
            </strong>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
            {isManager ? 'Toàn quyền Quản lý Canteen' : 'Nhân viên bán hàng & vận hành'}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, overflowY: 'auto' }}>
          {/* SECTION: TẤT CẢ / NHÂN VIÊN */}
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', padding: '8px 16px 4px' }}>
            Vận hành thường nhật
          </div>

          <NavLink to="/canteen" end style={navCls}>
            <ChefHat size={18} />
            <span style={{ flex: 1 }}>Bếp &amp; Đơn hàng</span>
            {pendingCanteenCount > 0 ? (
              <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px' }}>
                {pendingCanteenCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink to="/canteen/mon" style={navCls}>
            <Utensils size={18} />
            <span>Kho món (Còn / Hết)</span>
          </NavLink>

          <NavLink to="/canteen/danh-gia" style={navCls}>
            <MessageSquare size={18} />
            <span>Đánh giá &amp; Phản hồi</span>
          </NavLink>

          {/* SECTION: DÀNH RIÊNG QUẢN LÝ */}
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: isManager ? '#0d9488' : '#94a3b8', textTransform: 'uppercase', padding: '16px 16px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Nghiệp vụ Quản lý</span>
            {!isManager && <Lock size={12} />}
          </div>

          <NavLink
            to="/canteen/thuc-don"
            style={navCls}
            title={!isManager ? 'Chức năng chỉ dành riêng cho Quản lý Canteen' : ''}
          >
            <MenuSquare size={18} />
            <span style={{ flex: 1 }}>Quản lý Thực đơn</span>
          </NavLink>

          <NavLink
            to="/canteen/hoan-tien"
            style={navCls}
            title={!isManager ? 'Chức năng chỉ dành riêng cho Quản lý Canteen' : ''}
          >
            <RotateCcw size={18} />
            <span style={{ flex: 1 }}>Hoàn tiền đơn hủy</span>
            {refundCount > 0 ? (
              <span style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px' }}>
                {refundCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink
            to="/canteen/bao-cao"
            style={navCls}
            title={!isManager ? 'Chức năng chỉ dành riêng cho Quản lý Canteen' : ''}
          >
            <BarChart3 size={18} />
            <span>Báo cáo doanh thu</span>
          </NavLink>
        </nav>

        {/* Live stats widget */}
        <div style={{ background: '#f1f5f9', borderRadius: '10px', padding: '10px 12px', fontSize: '0.75rem', marginBottom: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ color: '#64748b' }}>Đang nấu:</span>
            <strong style={{ color: '#d97706' }}>{preparingCount} đơn</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#64748b' }}>Chờ bàn giao:</span>
            <strong style={{ color: '#059669' }}>{readyCount} đơn</strong>
          </div>
        </div>

        {/* Footer actions: Logout / Role Switch */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {isManager ? (
            <button
              onClick={handleSwitchToStaff}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#f8fafc',
                color: '#334155',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Users size={14} /> Về TK Dùng chung (Nhân viên)
            </button>
          ) : (
            <button
              onClick={handleSwitchToManager}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: '8px',
                border: '1px solid #99f6e4',
                background: '#f0fdfa',
                color: '#0f766e',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={14} /> Đăng nhập TK Quản lý riêng
            </button>
          )}

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '8px',
              border: 'none',
              background: '#fee2e2',
              color: '#b91c1c',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            <LogOut size={14} /> Đăng xuất Canteen
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        <header
          style={{
            height: '70px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '0 32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{pageTitle}</h1>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Vai trò hiện tại: <strong>{canteenSession?.name}</strong> ({canteenSession?.email})
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#ecfdf5', color: '#065f46', padding: '6px 12px', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', background: '#10b981' }} />
              Canteen A2 Đang mở cửa
            </div>
          </div>
        </header>

        <main style={{ padding: '24px 32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
