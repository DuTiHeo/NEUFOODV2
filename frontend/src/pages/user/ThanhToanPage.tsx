import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../contexts/CartContext'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { CampusLocation } from '../../types/neuModels'
import styles from './ThanhToanPage.module.css'

function formatPrice(vnd: number) {
  return `${Number(vnd || 0).toLocaleString('vi-VN')}đ`
}

export default function ThanhToanPage() {
  const navigate = useNavigate()
  const { lines, totalCount, subtotal, clear } = useCart()
  const { config, users, createOrder } = useNeuEngine()

  // State
  const [selectedUserId, setSelectedUserId] = useState<string>('user_1')
  const [receiveType, setReceiveType] = useState<'delivery' | 'at_canteen'>('delivery')
  const [building, setBuilding] = useState<'A1' | 'A2' | 'B' | 'C' | 'D'>('A2')
  const [floor, setFloor] = useState<number>(4)
  const [room, setRoom] = useState<string>('P402')
  const [deliveryTiming, setDeliveryTiming] = useState<'immediate' | 'scheduled'>('immediate')
  const [scheduledTime, setScheduledTime] = useState<string>('12:15')
  const [payment, setPayment] = useState<'qr_online' | 'cod'>('cod')
  const [note, setNote] = useState<string>('')

  // Load default location from UC04 Quản lý thông tin cá nhân
  useEffect(() => {
    try {
      const savedLoc = localStorage.getItem('NEU_DEFAULT_LOCATION')
      if (savedLoc) {
        const parsed = JSON.parse(savedLoc)
        if (parsed.building) setBuilding(parsed.building)
        if (parsed.floor) setFloor(Number(parsed.floor))
        if (parsed.room) setRoom(parsed.room)
      }
    } catch (e) {
      console.warn('Cannot load default location', e)
    }
  }, [])

  // QR Modal State (BR-14)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [qrCountdown, setQrCountdown] = useState(120) // 2 phút theo BR-14
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === selectedUserId) || users[0]
  }, [users, selectedUserId])

  // Shipping fee
  const shippingFee = useMemo(() => {
    if (receiveType === 'at_canteen') return 0
    return config.shippingFeeByBuilding[building] || 7000
  }, [receiveType, building, config])

  const discount = totalCount > 0 ? 5000 : 0
  const total = Math.max(0, subtotal + shippingFee - discount)

  // Validation rules for COD (BR-31, BR-32, BR-33)
  const isCodBlockedByAtCanteen = receiveType === 'at_canteen'
  const isCodBlockedByLimit = total > config.codMaxOrderLimit
  const isCodBlockedByBlacklist = currentUser?.isCodBlacklisted || false
  const isCodDisabled = isCodBlockedByAtCanteen || isCodBlockedByLimit || isCodBlockedByBlacklist

  // Automatically switch to QR online if COD becomes disabled
  useEffect(() => {
    if (isCodDisabled && payment === 'cod') {
      setPayment('qr_online')
    }
  }, [isCodDisabled, payment])

  // Countdown timer for QR Modal
  useEffect(() => {
    if (!isQrModalOpen) return
    setQrCountdown(120)
    const interval = setInterval(() => {
      setQrCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isQrModalOpen])

  // Process final order creation
  async function finalizeOrder(chosenPayment: 'qr_online' | 'cod') {
    setSubmitting(true)
    setErrorMessage('')
    try {
      const locationData: CampusLocation | undefined =
        receiveType === 'delivery'
          ? {
              building,
              floor: Number(floor),
              room: room.trim() || `P${floor}01`,
            }
          : undefined

      const orderItems = lines.map((l: any) => ({
        dishId: l.dish.id,
        name: l.dish.name,
        price: l.dish.price,
        qty: l.qty,
        image: l.dish.image,
      }))

      const created = createOrder({
        customerId: currentUser.id,
        receiveType,
        location: locationData,
        deliveryTiming,
        scheduledTime: deliveryTiming === 'scheduled' ? scheduledTime : undefined,
        items: orderItems,
        paymentMethod: chosenPayment,
        note: note.trim() || undefined,
      })

      clear()
      setIsQrModalOpen(false)
      navigate(`/don-hang/${created.id}`, { state: { orderPlaced: true } })
    } catch (err: any) {
      setErrorMessage(err.message || 'Có lỗi xảy ra khi tạo đơn hàng.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleOrderClick() {
    setErrorMessage('')
    if (totalCount === 0) return

    if (receiveType === 'delivery' && !room.trim()) {
      setErrorMessage('Vui lòng nhập số phòng học để Shipper giao tới.')
      return
    }

    if (payment === 'qr_online') {
      setIsQrModalOpen(true)
    } else {
      finalizeOrder('cod')
    }
  }

  return (
    <>
      <main className={styles.pay}>
        <div className="wrap">
          {/* Progress Steps Header */}
          <section className={styles.paySteps}>
            <div className={styles.steps}>
              <div className={styles.stepsItem}>
                <div className={`${styles.stepsDot} ${styles.stepsDotOk}`}>
                  <span className={`material-symbols-outlined material-symbols-fill ${styles.stepsIcon}`}>check_circle</span>
                </div>
                <span className={`${styles.stepsLbl} ${styles.stepsLblOn}`}>Giỏ hàng</span>
              </div>
              <div className={`${styles.stepsBar} ${styles.stepsBarOn}`} />
              <div className={styles.stepsItem}>
                <div className={`${styles.stepsDot} ${styles.stepsDotHere}`}>
                  <span className={styles.stepsNum}>2</span>
                </div>
                <span className={`${styles.stepsLbl} ${styles.stepsLblBold}`}>Xác nhận &amp; Thanh toán</span>
              </div>
              <div className={styles.stepsBar} />
              <div className={styles.stepsItem}>
                <div className={`${styles.stepsDot} ${styles.stepsDotOff}`}>
                  <span className={styles.stepsNum}>3</span>
                </div>
                <span className={`${styles.stepsLbl} ${styles.stepsLblOff}`}>Theo dõi đơn</span>
              </div>
            </div>
          </section>

          {/* Test Persona Bar */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px 16px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: '#0284c7' }}>badge</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Tài khoản đặt món (Demo):</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setSelectedUserId('user_1')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedUserId === 'user_1' ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: selectedUserId === 'user_1' ? '#e0f2fe' : '#ffffff',
                  color: selectedUserId === 'user_1' ? '#0369a1' : '#334155',
                }}
              >
                Sinh viên chuẩn (Nguyễn Văn An)
              </button>
              <button
                type="button"
                onClick={() => setSelectedUserId('user_boom')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: selectedUserId === 'user_boom' ? '2px solid #ef4444' : '1px solid #cbd5e1',
                  background: selectedUserId === 'user_boom' ? '#fee2e2' : '#ffffff',
                  color: selectedUserId === 'user_boom' ? '#b91c1c' : '#334155',
                }}
              >
                Sinh viên dính Blacklist COD (Trần Văn Boom)
              </button>
            </div>
          </div>

          <div className={styles.payGrid}>
            <div className={styles.payLeft}>
              {/* Card 1: Hình thức nhận hàng */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>storefront</span>
                  <h2 className={styles.cardH}>1. Hình thức nhận hàng</h2>
                </div>
                <div className={styles.cardBody}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={() => setReceiveType('delivery')}
                      style={{
                        padding: '14px',
                        borderRadius: '8px',
                        border: receiveType === 'delivery' ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                        background: receiveType === 'delivery' ? '#fff1f2' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#b91c1c' }}>delivery_dining</span>
                        <strong style={{ color: '#881337', fontSize: '0.9375rem' }}>Giao tận nơi</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Shipper giao đến phòng học trong campus</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReceiveType('at_canteen')}
                      style={{
                        padding: '14px',
                        borderRadius: '8px',
                        border: receiveType === 'at_canteen' ? '2px solid #059669' : '1px solid #cbd5e1',
                        background: receiveType === 'at_canteen' ? '#ecfdf5' : '#ffffff',
                        cursor: 'pointer',
                        textAlign: 'left',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span className="material-symbols-outlined" style={{ color: '#059669' }}>takeout_dining</span>
                        <strong style={{ color: '#065f46', fontSize: '0.9375rem' }}>Nhận tại quầy Canteen A2</strong>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Miễn phí giao hàng, giữ đồ trong 30 phút</p>
                    </button>
                  </div>

                  {receiveType === 'at_canteen' ? (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '10px' }}>
                      <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '20px' }}>info</span>
                      <p style={{ margin: 0, fontSize: '0.8125rem', color: '#065f46', lineHeight: 1.5 }}>
                        <strong>Lưu ý:</strong> Miễn phí ship. Canteen giữ đồ tối đa <strong>30 phút</strong> sau khi món xong. Đơn nhận tại quầy áp dụng thanh toán online.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Card 2: Điểm giao hàng nội khu NEU */}
              {receiveType === 'delivery' ? (
                <div className={styles.card}>
                  <div className={styles.cardHead}>
                    <span className={`material-symbols-outlined ${styles.cardIcon}`}>location_on</span>
                    <h2 className={styles.cardH}>2. Điểm giao hàng nội khu NEU</h2>
                  </div>
                  <div className={styles.cardBody}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px', marginBottom: '14px' }}>
                      <div>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                          Tòa nhà (A1 - D):
                        </label>
                        <select
                          value={building}
                          onChange={(e) => setBuilding(e.target.value as any)}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                        >
                          <option value="A1">Tòa A1 (Phí 8.000đ)</option>
                          <option value="A2">Tòa A2 Canteen (Phí 7.000đ)</option>
                          <option value="B">Tòa B (Phí 9.000đ)</option>
                          <option value="C">Tòa C (Phí 9.000đ)</option>
                          <option value="D">Tòa D (Phí 10.000đ)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                          Tầng:
                        </label>
                        <select
                          value={floor}
                          onChange={(e) => {
                            const f = Number(e.target.value)
                            setFloor(f)
                            setRoom(`P${f}02`)
                          }}
                          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((fl) => (
                            <option key={fl} value={fl}>Tầng {fl}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                          Phòng học:
                        </label>
                        <input
                          type="text"
                          value={room}
                          onChange={(e) => setRoom(e.target.value)}
                          placeholder="Ví dụ: P402, P501"
                          style={{ width: '100%', padding: '9px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Phòng gợi ý nhanh:</span>
                      {[`P${floor}01`, `P${floor}02`, `P${floor}05`, `P${floor}10`].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRoom(r)}
                          style={{ padding: '2px 8px', borderRadius: '4px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Card 3: Thời gian giao / nhận */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>schedule</span>
                  <h2 className={styles.cardH}>3. Thời gian nhận món</h2>
                </div>
                <div className={styles.cardBody}>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="radio"
                        name="timing"
                        checked={deliveryTiming === 'immediate'}
                        onChange={() => setDeliveryTiming('immediate')}
                      />
                      <span><strong>Giao ngay</strong> (Trong khoảng 15 - 20 phút)</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                      <input
                        type="radio"
                        name="timing"
                        checked={deliveryTiming === 'scheduled'}
                        onChange={() => setDeliveryTiming('scheduled')}
                      />
                      <span><strong>Hẹn giờ trước</strong> (Tối thiểu 30 phút)</span>
                    </label>
                  </div>

                  {deliveryTiming === 'scheduled' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px' }}>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Khung giờ nhận hôm nay:</span>
                      <select
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                      >
                        <option value="11:30">11:30 (Trưa)</option>
                        <option value="12:00">12:00 (Trưa)</option>
                        <option value="12:30">12:30 (Trưa)</option>
                        <option value="13:00">13:00 (Đầu giờ chiều)</option>
                        <option value="15:30">15:30 (Giờ giải lao)</option>
                        <option value="17:00">17:00 (Tan học chiều)</option>
                      </select>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đã cách thời điểm đặt $\ge 30$ phút</span>
                    </div>
                  ) : null}

                  <label className={styles.field} style={{ marginTop: '12px' }}>
                    <span className={styles.fieldLbl}>Ghi chú cho bếp &amp; shipper</span>
                    <textarea
                      className={styles.fieldArea}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Ví dụ: Ít đá, không ớt, để ở bàn trước cửa phòng..."
                      rows={2}
                    />
                  </label>
                </div>
              </div>

              {/* Card 4: Phương thức thanh toán */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <span className={`material-symbols-outlined ${styles.cardIcon}`}>account_balance_wallet</span>
                  <h2 className={styles.cardH}>4. Phương thức thanh toán</h2>
                </div>

                <div className={styles.payOpts}>
                  {/* Option 1: QR Online */}
                  <label className={payment === 'qr_online' ? `${styles.payOpt} ${styles.payOptOn}` : styles.payOpt}>
                    <input
                      className="sr-only"
                      type="radio"
                      name="payment"
                      value="qr_online"
                      checked={payment === 'qr_online'}
                      onChange={() => setPayment('qr_online')}
                    />
                    <div className={styles.payOptIco}>
                      <span className="material-symbols-outlined">qr_code_2</span>
                    </div>
                    <div>
                      <p className={styles.payOptT}>Chuyển khoản QR Động</p>
                      <p className={styles.payOptD}>Mã VietQR động có hiệu lực trong 2 phút</p>
                    </div>
                    <span className={payment === 'qr_online' ? `${styles.payOptRing} ${styles.payOptRingOn}` : styles.payOptRing} />
                  </label>

                  {/* Option 2: COD */}
                  <label
                    className={
                      isCodDisabled
                        ? `${styles.payOpt} ${styles.payOptOff}`
                        : payment === 'cod'
                          ? `${styles.payOpt} ${styles.payOptOn}`
                          : styles.payOpt
                    }
                    style={{ opacity: isCodDisabled ? 0.6 : 1, cursor: isCodDisabled ? 'not-allowed' : 'pointer' }}
                  >
                    <input
                      className="sr-only"
                      type="radio"
                      name="payment"
                      value="cod"
                      disabled={isCodDisabled}
                      checked={payment === 'cod'}
                      onChange={() => !isCodDisabled && setPayment('cod')}
                    />
                    <div className={styles.payOptIco}>
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p className={styles.payOptT}>Tiền mặt khi nhận hàng (COD)</p>
                      <p className={styles.payOptD}>Khách trả tiền mặt cho shipper tại phòng học</p>
                      {/* Warning reasons */}
                      {isCodBlockedByAtCanteen ? (
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#b91c1c' }}>
                          Đơn nhận tại quầy không hỗ trợ thanh toán tiền mặt COD.
                        </p>
                      ) : isCodBlockedByLimit ? (
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#b91c1c' }}>
                          Đơn vượt hạn mức tiền mặt COD ({config.codMaxOrderLimit.toLocaleString()}đ).
                        </p>
                      ) : isCodBlockedByBlacklist ? (
                        <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#b91c1c' }}>
                          Tài khoản tạm thời không hỗ trợ COD: {currentUser.blacklistReason}.
                        </p>
                      ) : null}
                    </div>
                    <span className={payment === 'cod' ? `${styles.payOptRing} ${styles.payOptRingOn}` : styles.payOptRing} />
                  </label>
                </div>
              </div>
            </div>

            {/* Aside: Bill summary */}
            <aside className={styles.paySide}>
              <div className={styles.bill}>
                <div className={styles.billHead}>
                  <h2 className={styles.billTitle}>Chi tiết đơn hàng</h2>
                  <p className={styles.billHint}>
                    {receiveType === 'at_canteen' ? 'Nhận tại quầy Canteen A2' : `Giao tới Tòa ${building} - Tầng ${floor} - ${room}`}
                  </p>
                </div>
                <div className={styles.billBody}>
                  <div className={styles.billLines}>
                    {lines.length > 0 ? (
                      lines.map((line: any) => (
                        <div className={styles.billLine} key={line.dish.id}>
                          <div className={styles.billThumb}>
                            <img alt={line.dish.name} src={line.dish.image} />
                          </div>
                          <div className={styles.billMid}>
                            <h4 className={styles.billName}>{line.dish.name}</h4>
                            <p className={styles.billMeta}>x{line.qty}</p>
                          </div>
                          <p className={styles.billP}>{formatPrice(line.dish.price * line.qty)}</p>
                        </div>
                      ))
                    ) : (
                      <p className={styles.billMeta}>Giỏ hàng đang trống.</p>
                    )}
                  </div>

                  <div className={styles.billSep} />

                  <div className={styles.billRows}>
                    <div className={styles.billRow}>
                      <span>Tạm tính ({totalCount} món)</span>
                      <span className={styles.billRowInk}>{formatPrice(subtotal)}</span>
                    </div>
                    <div className={styles.billRow}>
                      <span>Phí giao hàng</span>
                      <span className={styles.billRowInk}>{formatPrice(shippingFee)}</span>
                    </div>
                    <div className={styles.billRow}>
                      <span>Ưu đãi Campus</span>
                      <span className={styles.billRowDanger}>-{formatPrice(discount)}</span>
                    </div>
                  </div>

                  <div className={styles.billSep} />

                  <div className={styles.billSum}>
                    <div>
                      <span className={styles.billSumL}>Tổng thanh toán</span>
                      <p className={styles.billVat}>Bao gồm phí đóng gói &amp; VAT</p>
                    </div>
                    <span className={styles.billSumN}>{formatPrice(total)}</span>
                  </div>

                  {errorMessage ? (
                    <p className={styles.billErr} role="alert">
                      {errorMessage}
                    </p>
                  ) : null}

                  <button
                    type="button"
                    className={styles.billGo}
                    disabled={totalCount === 0 || submitting}
                    onClick={handleOrderClick}
                  >
                    <span className="material-symbols-outlined material-symbols-fill">shopping_bag</span>
                    {submitting ? 'Đang tạo đơn…' : payment === 'qr_online' ? 'Quét mã QR thanh toán' : 'Xác nhận đặt hàng COD'}
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* MODAL VIETQR ĐỘNG (BR-14: Đồng hồ đếm ngược 2 phút) */}
      {isQrModalOpen ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '440px', width: '100%', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ background: '#881337', color: '#ffffff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700 }}>Thanh toán VietQR Động</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.75rem', opacity: 0.9 }}>Canteen A2 Đại học Kinh tế Quốc dân</p>
              </div>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '24px' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px', textAlign: 'center' }}>
              {/* Countdown badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: qrCountdown > 0 ? '#fef3c7' : '#fee2e2', color: qrCountdown > 0 ? '#92400e' : '#b91c1c', padding: '6px 14px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 700, marginBottom: '16px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>timer</span>
                {qrCountdown > 0 ? (
                  <span>Mã hết hạn sau: {Math.floor(qrCountdown / 60)}:{(qrCountdown % 60).toString().padStart(2, '0')}</span>
                ) : (
                  <span>Mã QR đã hết hạn! Vui lòng tạo lại.</span>
                )}
              </div>

              {/* QR Image */}
              <div style={{ margin: '0 auto 16px', width: '220px', height: '220px', border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {qrCountdown > 0 ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=2|99|0903334444|CANTEEN_A2_NEU|${total}|THANH_TOAN_DON_NEU`}
                    alt="VietQR Payment"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <div style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', margin: '0 auto 8px' }}>error</span>
                    Mã đã hết hạn 2 phút
                  </div>
                )}
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Số tiền:</span>
                  <strong style={{ color: '#881337', fontSize: '1rem' }}>{formatPrice(total)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#64748b' }}>Tài khoản:</span>
                  <span>123456789 - BIDV</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Chủ TK:</span>
                  <span>CANTEEN A2 NEU</span>
                </div>
              </div>

              {qrCountdown > 0 ? (
                <button
                  type="button"
                  onClick={() => finalizeOrder('qr_online')}
                  disabled={submitting}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#059669', color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  {submitting ? 'Đang xác nhận…' : 'Giả lập quét mã thành công (Demo)'}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setQrCountdown(120)}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: 'none', background: '#881337', color: '#ffffff', fontWeight: 700, fontSize: '0.9375rem', cursor: 'pointer' }}
                >
                  Làm mới mã QR (Thêm 2 phút)
                </button>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
