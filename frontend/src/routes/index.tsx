import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import MainLayout from '../components/layout/MainLayout'
import CanteenLayout from '../components/canteen/CanteenLayout'
import ShipperLayout from '../components/shipper/ShipperLayout'
import AdminPortalLayout from '../components/admin-portal/AdminPortalLayout'

// User Pages
import HomePage from '../pages/user/HomePage'
import MenuPage from '../pages/user/MenuPage'
import ChiTietMonPage from '../pages/user/ChiTietMonPage'
import GioHangPage from '../pages/user/GioHangPage'
import ThanhToanPage from '../pages/user/ThanhToanPage'
import DonHangPage from '../pages/user/DonHangPage'
import LichSuDonHangPage from '../pages/user/LichSuDonHangPage'
import TaiKhoanPage from '../pages/user/TaiKhoanPage'
import KhieuNaiPage from '../pages/user/KhieuNaiPage'
import DangKyShipperPage from '../pages/user/DangKyShipperPage'
import StoryPage from '../pages/user/StoryPage'
import RecruitPage from '../pages/user/RecruitPage'

function ExternalRedirect({ to }: { to: string }) {
  React.useEffect(() => {
    window.location.replace(to)
  }, [to])
  return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#64748b', fontSize: '0.9375rem' }}>
      Đang chuyển hướng sang {to}...
    </div>
  )
}

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import OAuthCallbackPage from '../pages/auth/OAuthCallbackPage'

// Canteen Portal Pages (Giai đoạn 2 & Nâng cấp phân quyền)
import CanteenDonPage from '../pages/canteen/CanteenDonPage'
import CanteenMonPage from '../pages/canteen/CanteenMonPage'
import CanteenThucDonPage from '../pages/canteen/CanteenThucDonPage'
import CanteenHoanTienPage from '../pages/canteen/CanteenHoanTienPage'
import CanteenBaoCaoPage from '../pages/canteen/CanteenBaoCaoPage'
import CanteenDanhGiaPage from '../pages/canteen/CanteenDanhGiaPage'
import CanteenLoginPage from '../pages/canteen/CanteenLoginPage'

// Shipper Mobile Pages (Giai đoạn 3 & UC02, UC04, UC05)
import ShipperSanDonPage from '../pages/shipper/ShipperSanDonPage'
import ShipperDangGiaoPage from '../pages/shipper/ShipperDangGiaoPage'
import ShipperThuNhapPage from '../pages/shipper/ShipperThuNhapPage'
import ShipperHoSoPage from '../pages/shipper/ShipperHoSoPage'
import ShipperLoginPage from '../pages/shipper/ShipperLoginPage'

// System Admin Portal Pages (Giai đoạn 4 & UC34 - UC40)
import AdminDashboardPage from '../pages/admin-portal/AdminDashboardPage'
import AdminDuyetShipperPage from '../pages/admin-portal/AdminDuyetShipperPage'
import AdminBlacklistPage from '../pages/admin-portal/AdminBlacklistPage'
import AdminDiaDiemPage from '../pages/admin-portal/AdminDiaDiemPage'
import AdminKhieuNaiPage from '../pages/admin-portal/AdminKhieuNaiPage'
import AdminBaoCaoPage from '../pages/admin-portal/AdminBaoCaoPage'
import AdminCauHinhPage from '../pages/admin-portal/AdminCauHinhPage'

// 404
import NotFoundPage from '../pages/not-found/NotFoundPage'

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* 1. CANTEEN A2 PORTAL (Web) */}
      <Route path="/canteen/login" element={<CanteenLoginPage />} />
      <Route path="/canteen" element={<CanteenLayout />}>
        <Route index element={<CanteenDonPage />} />
        <Route path="mon" element={<CanteenMonPage />} />
        <Route path="dishes" element={<CanteenMonPage />} />
        <Route path="thuc-don" element={<CanteenThucDonPage />} />
        <Route path="hoan-tien" element={<CanteenHoanTienPage />} />
        <Route path="danh-gia" element={<CanteenDanhGiaPage />} />
        <Route path="bao-cao" element={<CanteenBaoCaoPage />} />
        <Route path="reports" element={<CanteenBaoCaoPage />} />
      </Route>
      {/* Legacy /quan-ly redirects to /canteen */}
      <Route path="/quan-ly/*" element={<Navigate to="/canteen" replace />} />

      {/* 2. SHIPPER NỘI KHU PORTAL (Mobile Container) */}
      <Route path="/shipper/login" element={<ShipperLoginPage />} />
      <Route path="/shipper" element={<ShipperLayout />}>
        <Route index element={<ShipperSanDonPage />} />
        <Route path="dang-giao" element={<ShipperDangGiaoPage />} />
        <Route path="active" element={<ShipperDangGiaoPage />} />
        <Route path="thu-nhap" element={<ShipperThuNhapPage />} />
        <Route path="earnings" element={<ShipperThuNhapPage />} />
        <Route path="ho-so" element={<ShipperHoSoPage />} />
      </Route>

      {/* 3. SYSTEM ADMIN PORTAL (Web) */}
      <Route path="/admin" element={<AdminPortalLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="duyet-shipper" element={<AdminDuyetShipperPage />} />
        <Route path="shipper-approval" element={<AdminDuyetShipperPage />} />
        <Route path="blacklist" element={<AdminBlacklistPage />} />
        <Route path="dia-diem" element={<AdminDiaDiemPage />} />
        <Route path="khieu-nai" element={<AdminKhieuNaiPage />} />
        <Route path="complaints" element={<AdminKhieuNaiPage />} />
        <Route path="bao-cao" element={<AdminBaoCaoPage />} />
        <Route path="cau-hinh" element={<AdminCauHinhPage />} />
        <Route path="config" element={<AdminCauHinhPage />} />
      </Route>

      {/* 4. KHÁCH HÀNG / SINH VIÊN NEU (Web & Mobile Responsive) */}
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="mon/:id" element={<ChiTietMonPage />} />
        <Route path="gio-hang" element={<GioHangPage />} />
        <Route path="thanh-toan" element={<ThanhToanPage />} />
        <Route path="lich-su-don" element={<LichSuDonHangPage />} />
        <Route path="don-hang/:orderId" element={<DonHangPage />} />
        <Route path="don-hang" element={<Navigate to="/lich-su-don" replace />} />
        <Route path="tai-khoan" element={<TaiKhoanPage />} />
        <Route path="khieu-nai" element={<KhieuNaiPage />} />
        <Route path="dang-ky-shipper" element={<DangKyShipperPage />} />
        <Route path="recruit" element={<RecruitPage />} />
        <Route path="story" element={<StoryPage />} />
        <Route path="dang-nhap" element={<ExternalRedirect to="/DANGNHAP.html" />} />
        <Route path="dang-ky" element={<ExternalRedirect to="/DANGKY.html" />} />
        <Route path="quen-mat-khau" element={<ForgotPasswordPage />} />
        <Route path="oauth/callback" element={<OAuthCallbackPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
