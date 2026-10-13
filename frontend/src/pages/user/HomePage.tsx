import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock, ShieldCheck, DollarSign, Star, Utensils, Sparkles, Bike } from 'lucide-react'
import Footer from '../../components/layout/Footer'
import { dishes } from '../../data/dishes'
import styles from './HomePage.module.css'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function HomePage() {
  // 4 món nổi bật nhất
  const popularDishes = dishes.slice(0, 4)

  return (
    <>
      <main className={styles.pageHome}>
        {/* HERO SECTION */}
        <section className={`wrap ${styles.heroSection}`}>
          <div className={styles.heroCard}>
            <div className={styles.heroContent}>
              <div className={styles.heroBadge}>
                <Sparkles size={16} />
                <span>Nền tảng đặt món Canteen NEU #1</span>
              </div>
              <h1 className={styles.heroTitle}>
                Bữa ăn tươi ngon,<br />
                giao tận giảng đường
              </h1>
              <p className={styles.heroDesc}>
                Tiếp năng lượng ngay giữa giờ học căng thẳng. Đặt món tiện lợi từ Canteen NEU, giao nhanh tới mọi phòng học tòa A1, A2, B, C, D.
              </p>
              <div className={styles.heroActions}>
                <Link to="/menu" className={styles.btnPrimary}>
                  <span>Khám phá Thực đơn</span>
                  <ArrowRight size={18} />
                </Link>
                <Link to="/dang-ky-shipper" className={styles.btnSecondary}>
                  <Bike size={18} />
                  <span>Trở thành Shipper</span>
                </Link>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <strong>15-20p</strong>
                  <span>Giao siêu tốc</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <strong>30+ Món</strong>
                  <span>Menu phong phú</span>
                </div>
                <div className={styles.statDivider} />
                <div className={styles.statItem}>
                  <strong>4.8 ★</strong>
                  <span>Đánh giá hài lòng</span>
                </div>
              </div>
            </div>

            <div className={styles.heroImageWrapper}>
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
                alt="Món ăn tươi ngon NEUFood"
                className={styles.heroImage}
              />
              <div className={styles.floatingCard}>
                <div className={styles.floatingIcon}>
                  <Utensils size={18} color="#16a34a" />
                </div>
                <div>
                  <p className={styles.floatingTitle}>Canteen A2 mở cửa</p>
                  <p className={styles.floatingSubtitle}>Phục vụ từ 07:00 - 18:30 hàng ngày</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE US - 3 FEATURES */}
        <section className={`wrap ${styles.featuresSection}`}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionSubtitle}>DÀNH RIÊNG CHO SINH VIÊN NEU</span>
            <h2 className={styles.sectionTitle}>Vì sao nên chọn NEUFood?</h2>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={`${styles.featureIconWrap} ${styles.iconEmerald}`}>
                <Clock size={28} />
              </div>
              <h3 className={styles.featureTitle}>Giao tận phòng học</h3>
              <p className={styles.featureDesc}>
                Không cần chen chúc thang máy hay xếp hàng quầy đông đúc giờ tan ca. Đơn hàng giao tới đúng phòng và tầng của bạn.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIconWrap} ${styles.iconGreen}`}>
                <ShieldCheck size={28} />
              </div>
              <h3 className={styles.featureTitle}>Thực phẩm tươi sạch</h3>
              <p className={styles.featureDesc}>
                Món ăn nấu mới hàng ngày tại bếp trung tâm Canteen A2. Quy trình chế biến an toàn, sạch sẽ, đảm bảo dinh dưỡng.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={`${styles.featureIconWrap} ${styles.iconAmber}`}>
                <DollarSign size={28} />
              </div>
              <h3 className={styles.featureTitle}>Giá chuẩn sinh viên</h3>
              <p className={styles.featureDesc}>
                Mức giá cực kỳ hợp lý chỉ từ 20.000đ - 55.000đ. Thanh toán linh hoạt bằng mã QR Online tiện lợi hoặc tiền mặt COD.
              </p>
            </div>
          </div>
        </section>

        {/* POPULAR DISHES GRID */}
        <section className={`wrap ${styles.dishesSection}`}>
          <div className={styles.dishesHeader}>
            <div>
              <span className={styles.sectionSubtitle}>THỰC ĐƠN YÊU THÍCH</span>
              <h2 className={styles.sectionTitle}>Món ăn bán chạy hôm nay</h2>
            </div>
            <Link to="/menu" className={styles.linkViewAll}>
              <span>Xem tất cả món</span>
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.dishesGrid}>
            {popularDishes.map((dish) => (
              <div key={dish.id} className={styles.dishCard}>
                <div className={styles.dishImageWrap}>
                  <img src={dish.image} alt={dish.name} className={styles.dishImage} />
                  <div className={styles.dishBadge}>
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    <span>{dish.rating}</span>
                  </div>
                </div>
                <div className={styles.dishInfo}>
                  <h3 className={styles.dishName}>{dish.name}</h3>
                  <p className={styles.dishDesc}>{dish.shortDescription}</p>
                  <div className={styles.dishFooter}>
                    <span className={styles.dishPrice}>{formatPrice(dish.price)}</span>
                    <Link to={`/mon/${dish.id}`} className={styles.btnOrder}>
                      <span>Chi tiết</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA SHIPPER BANNER */}
        <section className={`wrap ${styles.ctaSection}`}>
          <div className={styles.ctaBanner}>
            <div className={styles.ctaContent}>
              <span className={styles.ctaBadge}>ĐỒNG HÀNH CÙNG NEUFOOD</span>
              <h2 className={styles.ctaTitle}>Gia nhập đội ngũ Shipper nội khu NEU</h2>
              <p className={styles.ctaDesc}>
                Linh hoạt thời gian giữa các tiết học, tăng thu nhập ngay trong khuôn viên trường. Đăng ký dễ dàng chỉ với thẻ sinh viên NEU.
              </p>
              <Link to="/dang-ky-shipper" className={styles.ctaBtn}>
                <Bike size={20} />
                <span>Đăng ký Shipper ngay</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
