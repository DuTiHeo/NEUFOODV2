import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, MapPin, Mail, Phone, Compass, Users } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Cột 1: Thương hiệu */}
        <div className={styles.colBrand}>
          <div className={styles.brandTitle}>
            <img src="/logo.png?v=3" alt="NEUFood" className={styles.logoImg} />
            <span>NEUFood</span>
          </div>
          <p className={styles.brandDesc}>
            Hệ thống đặt đồ ăn &amp; giao tận giảng đường tại Đại học Kinh tế Quốc dân. Bữa ăn tươi ngon, tiện lợi, tiếp sức mọi giờ học.
          </p>
          <div className={styles.tags}>
            <span className={styles.tag}>#NEUCampus</span>
            <span className={styles.tag}>#FreshFood</span>
            <span className={styles.tag}>#FastDelivery</span>
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div className={styles.colLinks}>
          <h4 className={styles.colHeader}>Liên kết nhanh</h4>
          <ul className={styles.linkList}>
            <li>
              <Link to="/menu" className={styles.linkItem}>
                <Compass size={16} />
                <span>Thực đơn Canteen</span>
              </Link>
            </li>
            <li>
              <Link to="/story" className={styles.linkItem}>
                <Leaf size={16} />
                <span>Về chúng tôi</span>
              </Link>
            </li>
            <li>
              <Link to="/recruit" className={styles.linkItem}>
                <Users size={16} />
                <span>Gia nhập đội ngũ</span>
              </Link>
            </li>
            <li>
              <Link to="/dang-ky-shipper" className={styles.linkItem}>
                <span>Đăng ký Shipper nội khu</span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ */}
        <div className={styles.colContact}>
          <h4 className={styles.colHeader}>Thông tin liên hệ</h4>
          <div className={styles.contactItem}>
            <MapPin size={18} className={styles.contactIcon} />
            <span>207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội</span>
          </div>
          <div className={styles.contactItem}>
            <Mail size={18} className={styles.contactIcon} />
            <a href="mailto:support@neufood.vn" className={styles.contactLink}>
              support@neufood.vn
            </a>
          </div>
          <div className={styles.contactItem}>
            <Phone size={18} className={styles.contactIcon} />
            <a href="tel:1900638368" className={styles.contactLink}>
              Hotline: 1900-NEU-FOOD
            </a>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p>© 2026 NEUFood — Đồ án Demo Phân tích Nghiệp vụ (PTNV)</p>
          <div className={styles.bottomLinks}>
            <Link to="/story">Giới thiệu</Link>
            <span>•</span>
            <Link to="/recruit">Tuyển dụng</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
