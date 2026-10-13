import React, { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { NeuOrder } from '../../types/neuModels'
import { Phone, MapPin, AlertTriangle, CheckCircle, Package, ArrowRight, ShieldAlert } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function ShipperDangGiaoPage() {
  const { currentShipper } = useOutletContext<{ currentShipper: any }>()
  const {
    orders,
    shipperMarkPickedUp,
    shipperCompleteDelivery,
    shipperReportIncident,
  } = useNeuEngine()

  const [incidentOrder, setIncidentOrder] = useState<NeuOrder | null>(null)
  const [incidentReason, setIncidentReason] = useState('Khách boom hàng / Không nghe máy sau 5 phút')
  const [incidentProof, setIncidentProof] = useState('https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80')

  // Orders assigned to this shipper and not finished yet
  const myOrders = orders.filter(
    (o) =>
      o.shipperId === currentShipper.id &&
      ['shipper_assigned', 'picked_up', 'delivering'].includes(o.status)
  )

  function handleReportSubmit() {
    if (!incidentOrder) return
    shipperReportIncident(incidentOrder.id, incidentReason, incidentProof)
    setIncidentOrder(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
          Đơn đang giao ({myOrders.length} / 5 đơn)
        </h3>
        <span style={{ fontSize: '0.6875rem', color: '#0284c7', fontWeight: 600 }}>Tối đa 5 đơn cùng lúc</span>
      </div>

      {myOrders.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '36px 16px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <Package size={36} color="#cbd5e1" style={{ margin: '0 auto 8px' }} />
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>Bạn hiện không có đơn hàng nào đang giao</p>
          <span style={{ fontSize: '0.6875rem', color: '#94a3b8' }}>Hãy qua tab &ldquo;Sàn nhận đơn&rdquo; để chọn đơn mới.</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myOrders.map((ord) => {
            const isAssigned = ord.status === 'shipper_assigned'
            const isDelivering = ord.status === 'delivering' || ord.status === 'picked_up'
            const isCod = ord.paymentMethod === 'cod'

            return (
              <div
                key={ord.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '12px',
                  padding: '14px',
                  border: '1px solid #cbd5e1',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div>
                    <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>#{ord.code}</strong>
                    <span style={{ display: 'block', fontSize: '0.6875rem', color: '#64748b' }}>
                      {isAssigned ? 'Cần qua Canteen A2 lấy đồ' : 'Đang trên đường giao tới phòng'}
                    </span>
                  </div>

                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: isCod ? '#fef3c7' : '#ecfdf5',
                      color: isCod ? '#92400e' : '#047857',
                    }}
                  >
                    {isCod ? `Thu COD: ${formatPrice(ord.total)}` : 'Đã thanh toán QR'}
                  </span>
                </div>

                {/* Destination & Customer Info (BR-28) */}
                <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '10px', marginBottom: '10px', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                    <MapPin size={16} color="#ef4444" />
                    <strong>
                      Tòa {ord.location?.building} • Tầng {ord.location?.floor} • {ord.location?.room}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Khách: </span>
                      <strong>{ord.customerName}</strong>
                    </div>

                    {/* Call button with phone revealed (BR-28) */}
                    <a
                      href={`tel:${ord.customerPhone}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        background: '#059669',
                        color: '#ffffff',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      <Phone size={12} />
                      <span>{ord.customerPhone}</span>
                    </a>
                  </div>
                </div>

                {/* Items note */}
                <div style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '12px' }}>
                  {ord.items.map((i) => `${i.qty}x ${i.name}`).join(', ')}
                </div>

                {/* Workflow Buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {isAssigned ? (
                    <div>
                      {isCod ? (
                        <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '8px 10px', fontSize: '0.75rem', color: '#92400e', marginBottom: '8px' }}>
                          <strong>Đơn COD:</strong> Cần ứng trước tiền món <strong>{formatPrice(ord.subtotal)}</strong> cho Canteen A2. Sau khi nhận túi đồ, hãy bấm nút dưới đây để đi giao.
                        </div>
                      ) : (
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '8px 10px', fontSize: '0.75rem', color: '#166534', marginBottom: '8px' }}>
                          Đơn Online (0đ ứng): Đọc mã <strong>#{ord.code}</strong> tại quầy Canteen A2 để nhận túi đồ.
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => shipperMarkPickedUp(ord.id)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#0284c7',
                          color: '#ffffff',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Package size={16} />
                        <span>1. Đã lấy món tại Canteen (Bắt đầu đi giao)</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => shipperCompleteDelivery(ord.id)}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#059669',
                        color: '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 6px -1px rgba(5, 150, 105, 0.3)',
                      }}
                    >
                      <CheckCircle size={16} />
                      <span>
                        {isCod
                          ? `2. Đã thu ${formatPrice(ord.total)} & Giao thành công`
                          : '2. Xác nhận đã giao thành công'}
                      </span>
                    </button>
                  )}

                  {/* Incident Report Button */}
                  <button
                    type="button"
                    onClick={() => setIncidentOrder(ord)}
                    style={{
                      padding: '6px',
                      borderRadius: '6px',
                      border: '1px solid #fecaca',
                      background: '#fff1f2',
                      color: '#b91c1c',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                    }}
                  >
                    <AlertTriangle size={13} />
                    <span>Báo sự cố giao hàng (Không liên lạc được)</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* INCIDENT REPORT MODAL */}
      {incidentOrder ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '360px', width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', marginBottom: '8px' }}>
              <ShieldAlert size={22} />
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>Báo cáo sự cố đơn #{incidentOrder.code}</h3>
            </div>

            <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '8px', padding: '8px 10px', fontSize: '0.6875rem', color: '#92400e', marginBottom: '12px' }}>
              Vui lòng liên hệ khách và chờ tối thiểu <strong>5 phút</strong>. Nếu khách không nhận hàng, hệ thống sẽ hoàn lại tiền ứng cho bạn.
            </div>

            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
              Nguyên nhân sự cố:
            </label>
            <select
              value={incidentReason}
              onChange={(e) => setIncidentReason(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', marginBottom: '12px' }}
            >
              <option value="Khách từ chối nhận và thanh toán">Khách từ chối nhận và thanh toán</option>
              <option value="Không liên lạc được sau 5 phút chờ tại phòng">Không liên lạc được sau 5 phút chờ tại phòng</option>
              <option value="Khách không có mặt tại phòng học">Khách không có mặt tại phòng học</option>
              <option value="Hư hỏng đồ ăn hoặc sự cố di chuyển">Hư hỏng đồ ăn hoặc sự cố di chuyển</option>
            </select>

            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>
              Bằng chứng hình ảnh (Ảnh cuộc gọi nhỡ / Trước cửa phòng):
            </label>
            <div style={{ width: '100%', height: '80px', borderRadius: '6px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
              <img src={incidentProof} alt="Bằng chứng" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIncidentOrder(null)}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleReportSubmit}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.75rem' }}
              >
                Gửi báo cáo sự cố
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
