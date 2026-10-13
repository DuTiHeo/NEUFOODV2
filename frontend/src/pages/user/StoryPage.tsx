import React from 'react'
import { Link } from 'react-router-dom'
import { Leaf, ArrowLeft, Heart, Award, Sparkles } from 'lucide-react'
import styles from './Story.module.css'

export default function StoryPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.topNav}>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={18} />
            <span>Về Trang chủ</span>
          </Link>
          <div className={styles.brandBadge}>
            <Leaf size={18} />
            <span>NEUFood Story</span>
          </div>
        </div>

        <header className={styles.header}>
          <span className={styles.subtitle}>HÀNH TRÌNH KHỞI TẠO</span>
          <h1 className={styles.title}>Về chúng tôi — NEUFood</h1>
          <p className={styles.lead}>
            Giải pháp đặt món thông minh và giao hàng nội khu, mang năng lượng tươi mới tới từng giảng đường NEU.
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.heading2}>
              <Sparkles size={20} className={styles.iconAccent} />
              Khởi nguồn từ thực tế giảng đường
            </h2>
            <p>
              Mỗi giờ giải lao giữa các ca học tại Đại học Kinh tế Quốc dân, những hành lang và sảnh thang máy các tòa nhà A1, A2, B, C, D luôn nhộn nhịp. Tuy nhiên, khoảng nghỉ ngắn ngủi 15-20 phút thường không đủ để sinh viên từ các tầng cao di chuyển xuống canteen, xếp hàng mua đồ ăn và quay trở lại lớp kịp giờ.
            </p>
            <p>
              Nhiều bạn đành bỏ bữa trưa hoặc dùng đồ ăn vặt tạm bợ. Nhận thấy bất cập đó trong vận hành dịch vụ học đường, dự án <strong>NEUFood</strong> đã được thai nghén như một giải pháp số hóa toàn diện cho hệ thống ẩm thực trong khuôn viên trường.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading2}>
              <Heart size={20} className={styles.iconAccent} />
              Mô hình kết nối 3 bên hiệu quả
            </h2>
            <p>
              NEUFood kết nối trực tiếp ba nhân tố nòng cốt trong đời sống sinh viên:
            </p>
            <div className={styles.cardsRow}>
              <div className={styles.storyCard}>
                <h3>Canteen Bếp A2</h3>
                <p>Nấu mới mỗi ngày, chủ động số lượng khẩu phần và tối ưu quy trình ra món nhờ hệ thống quản lý đơn hàng trực tuyến.</p>
              </div>
              <div className={styles.storyCard}>
                <h3>Shipper Sinh viên</h3>
                <p>Mạng lưới sinh viên giao hàng nội khu, kiếm thêm thu nhập chính đáng giữa các ca học mà không cần rời trường.</p>
              </div>
              <div className={styles.storyCard}>
                <h3>Sinh viên &amp; Cán bộ</h3>
                <p>Nhận đồ ăn nóng sốt ngay tại cửa phòng học, tiết kiệm thời gian nghỉ ngơi để tập trung học tập và làm việc.</p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.heading2}>
              <Award size={20} className={styles.iconAccent} />
              Cam kết của NEUFood
            </h2>
            <p>
              Chúng tôi tin rằng công nghệ chỉ thực sự có ý nghĩa khi giải quyết được những vấn đề thiết thực thường nhật. NEUFood cam kết không ngừng hoàn thiện trải nghiệm: từ độ tươi ngon của từng phần ăn, sự chính xác trong từng đơn hàng, đến thái độ phục vụ thân thiện của đội ngũ shipper sinh viên NEU.
            </p>
          </section>
        </div>

        <div className={styles.bottomCta}>
          <Link to="/menu" className={styles.ctaButton}>
            <span>Khám phá thực đơn ngay hôm nay</span>
          </Link>
        </div>
      </div>
    </div>
  )
}