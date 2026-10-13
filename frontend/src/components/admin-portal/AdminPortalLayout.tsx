import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, UserCheck, ShieldAlert, AlertCircle, Settings, ShieldCheck, MapPin, BarChart3 } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function AdminPortalLayout() {
  const { pathname } = useLocation()
  const { shippers, complaints, users } = useNeuEngine()

  const pendingShippersCount = shippers.filter((s) => s.status === 'pending').length
  const pendingComplaintsCount = complaints.filter((c) => c.status === 'pending').length
  const blacklistedUsersCount = users.filter((u) => u.isCodBlacklisted).length

  const navCls = ({ isActive }: { isActive: boolean }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '11px 16px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: isActive ? 700 : 500,
    color: isActive ? '#0f172a' : '#475569',
    background: isActive ? '#f1f5f9' : 'transparent',
    borderLeft: isActive ? '3px solid #059669' : '3px solid transparent',
    transition: 'all 0.2s',
  })

  let pageTitle = 'Bảng điều khiển Giám sát Vận hành'
  if (pathname.includes('/admin/duyet-shipper')) pageTitle = 'Phê duyệt / Từ chối Hồ sơ Shipper'
  else if (pathname.includes('/admin/blacklist')) pageTitle = 'Quản lý Tài khoản & Danh sách hạn chế COD'
  else if (pathname.includes('/admin/dia-diem')) pageTitle = 'Quản lý Danh mục Địa điểm Giao hàng'
  else if (pathname.includes('/admin/khieu-nai')) pageTitle = 'Xử lý Khiếu nại & Hoàn tiền'
  else if (pathname.includes('/admin/bao-cao')) pageTitle = 'Báo cáo & Thống kê Toàn hệ thống'
  else if (pathname.includes('/admin/cau-hinh')) pageTitle = 'Cấu hình Tham số Vận hành'

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px', paddingLeft: '8px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: '#0f172a',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={22} color="#38bdf8" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>System Admin</h2>
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Quản trị vận hành NEU Food</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
          <NavLink to="/admin" end style={navCls}>
            <LayoutDashboard size={19} />
            <span style={{ flex: 1 }}>Tổng quan &amp; SLA</span>
          </NavLink>

          <NavLink to="/admin/duyet-shipper" style={navCls}>
            <UserCheck size={19} />
            <span style={{ flex: 1 }}>Duyệt Shipper</span>
            {pendingShippersCount > 0 ? (
              <span style={{ background: '#ef4444', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px' }}>
                {pendingShippersCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink to="/admin/blacklist" style={navCls}>
            <ShieldAlert size={19} />
            <span style={{ flex: 1 }}>Tài khoản &amp; Hạn chế</span>
            {blacklistedUsersCount > 0 ? (
              <span style={{ background: '#f59e0b', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px' }}>
                {blacklistedUsersCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink to="/admin/dia-diem" style={navCls}>
            <MapPin size={19} />
            <span style={{ flex: 1 }}>Địa điểm giao hàng</span>
          </NavLink>

          <NavLink to="/admin/khieu-nai" style={navCls}>
            <AlertCircle size={19} />
            <span style={{ flex: 1 }}>Xử lý khiếu nại</span>
            {pendingComplaintsCount > 0 ? (
              <span style={{ background: '#dc2626', color: '#ffffff', fontSize: '0.6875rem', fontWeight: 700, padding: '2px 7px', borderRadius: '9999px' }}>
                {pendingComplaintsCount}
              </span>
            ) : null}
          </NavLink>

          <NavLink to="/admin/bao-cao" style={navCls}>
            <BarChart3 size={19} />
            <span style={{ flex: 1 }}>Báo cáo Thống kê</span>
          </NavLink>

          <NavLink to="/admin/cau-hinh" style={navCls}>
            <Settings size={19} />
            <span>Cấu hình tham số</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Container */}
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
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Tài khoản Quản trị viên hệ thống</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ background: '#f1f5f9', color: '#334155', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600 }}>
              admin@neu.edu.vn (Root)
            </span>
          </div>
        </header>

        <main style={{ padding: '24px 32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
