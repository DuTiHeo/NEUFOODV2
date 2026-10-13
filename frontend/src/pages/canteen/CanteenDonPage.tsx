import React, { useState } from 'react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { NeuOrder } from '../../types/neuModels'
import { Clock, CheckCircle2, XCircle, AlertTriangle, User, MapPin, ChefHat, Package, Check, QrCode } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function CanteenDonPage() {
  const {
    orders,
    config,
    updateConfig,
    canteenConfirmOrder,
    canteenStartPreparing,
    canteenFinishPreparing,
    canteenHandoverToCustomer,
    canteenHandoverToShipper,
  } = useNeuEngine()

  const [rejectModalOrder, setRejectModalOrder] = useState<NeuOrder | null>(null)
  const [rejectReason, setRejectReason] = useState('Hết nguyên liệu món')
  const [activeTab, setActiveTab] = useState<'all' | 'awaiting' | 'preparing' | 'ready'>('all')
  const [qrModalOrder, setQrModalOrder] = useState<NeuOrder | null>(null)

  const isAutoPrepare = config.autoAcceptToPreparing !== false

  const awaitingOrders = orders.filter((o) => o.status === 'awaiting_canteen')
  const preparingOrders = orders.filter((o) => ['confirmed', 'preparing'].includes(o.status))
  const readyOrders = orders.filter((o) => ['ready_for_handover', 'shipper_assigned'].includes(o.status))

  function handleToggleAutoPrepare() {
    const nextVal = !isAutoPrepare
    updateConfig({ autoAcceptToPreparing: nextVal })
    if (nextVal && awaitingOrders.length > 0) {
      awaitingOrders.forEach((o) => canteenConfirmOrder(o.id, true, undefined, true))
    }
  }

  function handleRejectSubmit() {
    if (!rejectModalOrder) return
    canteenConfirmOrder(rejectModalOrder.id, false, rejectReason)
    setRejectModalOrder(null)
  }

  return (
    <div>
      {/* Top Banner KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Chờ xác nhận (10p)</span>
            <span style={{ background: '#fef3c7', color: '#d97706', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Hàng chờ</span>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800, color: awaitingOrders.length > 0 ? '#ef4444' : '#0f172a', margin: '8px 0 0' }}>
            {awaitingOrders.length}
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Đang nấu món</span>
            <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Bếp</span>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', margin: '8px 0 0' }}>
            {preparingOrders.length}
          </p>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '12px', padding: '18px 20px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>Sẵn sàng bàn giao</span>
            <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>Quầy &amp; Shipper</span>
          </div>
          <p style={{ fontSize: '1.875rem', fontWeight: 800, color: '#059669', margin: '8px 0 0' }}>
            {readyOrders.length}
          </p>
        </div>
      </div>

      {/* UC22 Control Bar: Auto-prepare mode toggle */}
      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isAutoPrepare ? '#ecfdf5' : '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChefHat size={22} color={isAutoPrepare ? '#059669' : '#d97706'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>
                Chế độ tiếp nhận đơn vào bếp:
              </span>
              <span style={{ padding: '2px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800, background: isAutoPrepare ? '#dcfce7' : '#fef3c7', color: isAutoPrepare ? '#166534' : '#92400e' }}>
                {isAutoPrepare ? 'Tự động vào bếp (Khách đặt là nấu ngay)' : 'Chuẩn bị thủ công (Duyệt từng đơn)'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#64748b' }}>
              {isAutoPrepare
                ? 'Đơn mới đặt sẽ tự động chuyển sang "Đang chuẩn bị" để bếp nấu ngay mà Canteen không cần bấm xác nhận.'
                : 'Đơn mới sẽ chờ nhân viên kiểm tra số lượng nguyên liệu và bấm nhận đơn thủ công.'}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isAutoPrepare && awaitingOrders.length > 0 && (
            <button
              type="button"
              onClick={() => {
                awaitingOrders.forEach((o) => canteenConfirmOrder(o.id, true, undefined, true))
              }}
              style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#0284c7', color: '#ffffff', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Đưa ngay tất cả vào bếp ({awaitingOrders.length} đơn)
            </button>
          )}
          <button
            type="button"
            onClick={handleToggleAutoPrepare}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: isAutoPrepare ? '1px solid #cbd5e1' : '1px solid #059669',
              background: isAutoPrepare ? '#ffffff' : '#059669',
              color: isAutoPrepare ? '#334155' : '#ffffff',
              fontSize: '0.8125rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {isAutoPrepare ? 'Chuyển sang Chế độ Thủ công' : 'Bật Tự động vào bếp'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'all' ? '#881337' : '#ffffff',
            color: activeTab === 'all' ? '#ffffff' : '#475569',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Xem dạng bảng Kanban 3 cột
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('awaiting')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'awaiting' ? '#881337' : '#ffffff',
            color: activeTab === 'awaiting' ? '#ffffff' : '#475569',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Đơn mới chờ nhận ({awaitingOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preparing')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'preparing' ? '#881337' : '#ffffff',
            color: activeTab === 'preparing' ? '#ffffff' : '#475569',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Đang nấu ({preparingOrders.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ready')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'ready' ? '#881337' : '#ffffff',
            color: activeTab === 'ready' ? '#ffffff' : '#475569',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Chờ bàn giao ({readyOrders.length})
        </button>
      </div>

      {/* Kanban Board Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: activeTab === 'all' ? 'repeat(3, 1fr)' : '1fr', gap: '20px', alignItems: 'start' }}>
        {/* Column 1: Awaiting Confirmation */}
        {(activeTab === 'all' || activeTab === 'awaiting') && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} color="#d97706" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>1. Chờ Canteen nhận</h3>
              </div>
              <span style={{ background: '#fef3c7', color: '#b45309', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                {awaitingOrders.length} đơn
              </span>
            </div>

            {isAutoPrepare ? (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.75rem', color: '#065f46' }}>
                <strong>Chế độ tự động đang bật:</strong> Đơn mới sẽ chuyển thẳng vào bếp để nấu ngay.
              </div>
            ) : (
              <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', fontSize: '0.75rem', color: '#92400e' }}>
                <strong>Chế độ thủ công đang bật:</strong> Nhân viên kiểm tra và bấm "Nhận đơn" trong vòng 10 phút.
              </div>
            )}

            {awaitingOrders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '24px 0' }}>Không có đơn chờ duyệt</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {awaitingOrders.map((ord) => (
                  <div key={ord.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '14px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.9375rem', color: '#881337' }}>#{ord.code}</strong>
                        <span style={{ marginLeft: '8px', fontSize: '0.75rem', color: '#64748b' }}>
                          {new Date(ord.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: ord.receiveType === 'at_canteen' ? '#ecfdf5' : '#fff1f2',
                          color: ord.receiveType === 'at_canteen' ? '#047857' : '#be123c',
                        }}
                      >
                        {ord.receiveType === 'at_canteen' ? 'Nhận tại quầy' : `Giao Tòa ${ord.location?.building}`}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: '#334155', marginBottom: '10px' }}>
                      <p style={{ margin: '0 0 4px', fontWeight: 600 }}>Khách: {ord.customerName} - {ord.customerPhone}</p>
                      {ord.receiveType === 'delivery' && ord.location ? (
                        <p style={{ margin: '0 0 4px', color: '#64748b' }}>Phòng: {ord.location.room} (Tầng {ord.location.floor})</p>
                      ) : null}
                      <ul style={{ margin: '6px 0 0', paddingLeft: '18px', color: '#0f172a' }}>
                        {ord.items.map((it, idx) => (
                          <li key={idx}><strong>{it.qty}x</strong> {it.name} {it.note ? <i style={{ color: '#64748b' }}>({it.note})</i> : ''}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px dashed #e2e8f0', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {ord.paymentMethod === 'cod' ? 'Thanh toán COD' : 'Đã thanh toán QR'}
                      </span>
                      <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>{formatPrice(ord.total)}</strong>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setRejectModalOrder(ord)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ef4444', background: '#ffffff', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Từ chối
                      </button>
                      <button
                        type="button"
                        onClick={() => canteenConfirmOrder(ord.id, true, undefined, isAutoPrepare)}
                        style={{ padding: '8px', borderRadius: '6px', border: 'none', background: '#059669', color: '#ffffff', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        {isAutoPrepare ? 'Đưa vào bếp ngay' : 'Nhận đơn (10p)'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Column 2: Preparing In Kitchen */}
        {(activeTab === 'all' || activeTab === 'preparing') && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ChefHat size={18} color="#0284c7" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>2. Đang chuẩn bị món</h3>
              </div>
              <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                {preparingOrders.length} đơn
              </span>
            </div>

            {preparingOrders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '24px 0' }}>Bếp đang trống</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {preparingOrders.map((ord) => (
                  <div key={ord.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '14px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '0.9375rem', color: '#0284c7' }}>#{ord.code}</strong>
                      <span style={{ fontSize: '0.75rem', background: ord.status === 'confirmed' ? '#fef3c7' : '#e0f2fe', color: ord.status === 'confirmed' ? '#92400e' : '#0369a1', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>
                        {ord.status === 'confirmed' ? 'Chờ bấm nấu' : 'Đang nấu'}
                      </span>
                    </div>

                    <div style={{ background: '#f1f5f9', borderRadius: '8px', padding: '10px', marginBottom: '10px', fontSize: '0.8125rem' }}>
                      <strong>Món cần nấu:</strong>
                      <ul style={{ margin: '4px 0 0', paddingLeft: '18px' }}>
                        {ord.items.map((it, idx) => (
                          <li key={idx} style={{ color: '#0f172a', fontWeight: 600 }}>{it.qty}x {it.name}</li>
                        ))}
                      </ul>
                      {ord.note ? <p style={{ margin: '6px 0 0', color: '#b91c1c' }}>Ghi chú: {ord.note}</p> : null}
                    </div>

                    {ord.status === 'confirmed' ? (
                      <button
                        type="button"
                        onClick={() => canteenStartPreparing(ord.id)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#d97706',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <ChefHat size={18} />
                        Bắt đầu chuẩn bị món
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => canteenFinishPreparing(ord.id)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#0284c7',
                          color: '#ffffff',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                        }}
                      >
                        <Check size={18} />
                        Hoàn tất nấu &amp; Báo sẵn sàng
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Column 3: Ready for Handover */}
        {(activeTab === 'all' || activeTab === 'ready') && (
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Package size={18} color="#059669" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>3. Bàn giao đơn</h3>
              </div>
              <span style={{ background: '#ecfdf5', color: '#047857', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                {readyOrders.length} đơn
              </span>
            </div>

            {readyOrders.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem', padding: '24px 0' }}>Không có đơn chờ bàn giao</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {readyOrders.map((ord) => {
                  const isAtCanteen = ord.receiveType === 'at_canteen'
                  const hasShipper = Boolean(ord.shipperName)

                  return (
                    <div key={ord.id} style={{ background: '#ffffff', borderRadius: '10px', padding: '14px', border: '1px solid #cbd5e1', boxShadow: '0 2px 4px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                        <strong style={{ fontSize: '0.9375rem', color: '#059669' }}>#{ord.code}</strong>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: isAtCanteen ? '#dcfce7' : '#e0e7ff', color: isAtCanteen ? '#166534' : '#3730a3' }}>
                          {isAtCanteen ? 'Khách nhận tại quầy' : 'Giao nội khu'}
                        </span>
                      </div>

                      <p style={{ margin: '0 0 6px', fontSize: '0.8125rem', color: '#334155' }}>
                        Khách: {ord.customerName} ({ord.customerPhone})
                      </p>

                      {/* Handover action buttons */}
                      {isAtCanteen ? (
                        <button
                          type="button"
                          onClick={() => canteenHandoverToCustomer(ord.id)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#059669',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.8125rem',
                            cursor: 'pointer',
                          }}
                        >
                          Xác nhận bàn giao cho khách tại quầy
                        </button>
                      ) : (
                        <div>
                          {hasShipper ? (
                            <div>
                              <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#047857' }}>
                                Shipper nhận: <strong>{ord.shipperName}</strong> ({ord.shipperPhone})
                              </p>

                              {ord.paymentMethod === 'cod' ? (
                                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                                  <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#92400e', fontWeight: 700 }}>
                                    Thu tiền món COD: {formatPrice(ord.subtotal)}
                                  </p>
                                  <p style={{ margin: '0 0 8px', fontSize: '0.6875rem', color: '#78350f' }}>
                                    Shipper trả tiền món cho Canteen trước khi lấy đồ.
                                  </p>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                    <button
                                      type="button"
                                      onClick={() => setQrModalOrder(ord)}
                                      style={{
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #d97706',
                                        background: '#ffffff',
                                        color: '#b45309',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '4px',
                                      }}
                                    >
                                      <QrCode size={14} />
                                      <span>Quét VietQR</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => canteenHandoverToShipper(ord.id)}
                                      style={{
                                        padding: '8px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        background: '#d97706',
                                        color: '#ffffff',
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Đã thu &amp; Bàn giao
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '10px', marginBottom: '8px' }}>
                                    <p style={{ margin: '0 0 4px', fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
                                      Đã giao túi đồ cho Shipper
                                    </p>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#065f46' }}>
                                      Chờ Shipper bấm <strong>&ldquo;Đã lấy món&rdquo;</strong> trên ứng dụng để bắt đầu đi giao.
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => canteenHandoverToShipper(ord.id)}
                                    style={{
                                      width: '100%',
                                      padding: '8px',
                                      borderRadius: '6px',
                                      border: '1px dashed #cbd5e1',
                                      background: '#f8fafc',
                                      color: '#64748b',
                                      fontSize: '0.75rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                    }}
                                    title="Chỉ bấm khi Shipper gặp lỗi mạng hoặc điện thoại hết pin"
                                  >
                                    Xác nhận bàn giao thủ công (Dự phòng)
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div style={{ padding: '8px', background: '#f1f5f9', borderRadius: '6px', textAlign: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                              Đang chờ Shipper nhận trên sàn...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* REJECT MODAL */}
      {rejectModalOrder ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', maxWidth: '400px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 10px', color: '#b91c1c' }}>Từ chối đơn #{rejectModalOrder.code}</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '14px' }}>
              Nếu từ chối, đơn sẽ bị hủy và tiền thanh toán online sẽ được hoàn tự động cho khách.
            </p>

            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Lý do từ chối:
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '16px' }}
            >
              <option value="Hết nguyên liệu món">Hết nguyên liệu món</option>
              <option value="Canteen quá tải trong giờ cao điểm">Canteen quá tải trong giờ cao điểm</option>
              <option value="Đã hết giờ phục vụ">Đã hết giờ phục vụ</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setRejectModalOrder(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#dc2626', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* VIETQR MODAL CHO SHIPPER THANH TOAN COD */}
      {qrModalOrder ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '16px', maxWidth: '380px', width: '100%', padding: '24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
              <QrCode size={24} color="#881337" />
              <h3 style={{ margin: 0, color: '#881337', fontSize: '1.125rem', fontWeight: 800 }}>VietQR Thu Tiền Món COD</h3>
            </div>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: '0 0 16px' }}>
              Shipper <strong>{qrModalOrder.shipperName}</strong> quét mã để chuyển tiền món đơn #{qrModalOrder.code}
            </p>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '16px', display: 'inline-block' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=247PAYMENT_CANTEEN_NEU_${qrModalOrder.code}_${qrModalOrder.subtotal}`}
                alt="VietQR Quầy Canteen"
                style={{ width: '180px', height: '180px', margin: '0 auto', display: 'block' }}
              />
              <p style={{ margin: '8px 0 0', fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>
                {formatPrice(qrModalOrder.subtotal)}
              </p>
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                Nội dung: COD {qrModalOrder.code}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setQrModalOrder(null)}
                style={{ padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#475569', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  canteenHandoverToShipper(qrModalOrder.id)
                  setQrModalOrder(null)
                }}
                style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#059669', color: '#ffffff', fontSize: '0.8125rem', fontWeight: 700, cursor: 'pointer' }}
              >
                Xác nhận đã nhận tiền
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
