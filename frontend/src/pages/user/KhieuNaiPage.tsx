import React, { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { AlertTriangle, Clock, CheckCircle, XCircle, Upload, ShieldAlert, ArrowLeft, FileText, Send } from 'lucide-react'

export default function KhieuNaiPage() {
  const [searchParams] = useSearchParams()
  const preselectedOrderId = searchParams.get('orderId') || ''

  const { orders, complaints, submitComplaint } = useNeuEngine()

  // Tab switch: Form or History
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create')

  // Form states
  const [selectedOrderId, setSelectedOrderId] = useState<string>(preselectedOrderId)
  const [reasonType, setReasonType] = useState<'missing_dish' | 'wrong_dish' | 'cold_food' | 'shipper_attitude' | 'other'>('cold_food')
  const [description, setDescription] = useState('')
  const [proofImage, setProofImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Filter completed/delivered orders of the user
  const eligibleOrders = useMemo(() => {
    return orders.filter((o) => ['delivered', 'completed', 'incident'].includes(o.status))
  }, [orders])

  // Current selected order
  const selectedOrder = useMemo(() => {
    return eligibleOrders.find((o) => o.id === selectedOrderId || o.code === selectedOrderId)
  }, [eligibleOrders, selectedOrderId])

  // Check 24-hour limit (BR-25, EX-26)
  const isOver24Hours = useMemo(() => {
    if (!selectedOrder) return false
    const orderTime = new Date(selectedOrder.createdAt).getTime()
    const diffHours = (Date.now() - orderTime) / (1000 * 60 * 60)
    return diffHours > 24
  }, [selectedOrder])

  // Check if order already has an existing complaint (BR-25)
  const existingComplaint = useMemo(() => {
    if (!selectedOrder) return null
    return complaints.find((c) => c.orderId === selectedOrder.id || c.orderCode === selectedOrder.code)
  }, [complaints, selectedOrder])

  // User's complaints history
  const myComplaints = useMemo(() => {
    return complaints
  }, [complaints])

  const reasonLabels: Record<string, string> = {
    missing_dish: 'Canteen giao thiếu món so với đơn đặt',
    wrong_dish: 'Canteen giao sai món / Nhầm món',
    cold_food: 'Món ăn bị nguội lạnh / Không đảm bảo chất lượng',
    shipper_attitude: 'Shipper giao trễ quá giờ / Thái độ không chuẩn mực',
    other: 'Sự cố khác (đổ vỡ, lỗi trừ tiền online/COD)',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!selectedOrderId) {
      setErrorMessage('Vui lòng chọn đơn hàng cần gửi khiếu nại.')
      return
    }

    if (isOver24Hours) {
      setErrorMessage('Đơn hàng đã quá hạn 24 giờ kể từ khi hoàn thành nên không thể gửi khiếu nại.')
      return
    }

    if (existingComplaint) {
      setErrorMessage('Đơn hàng này đã có khiếu nại đang được xử lý.')
      return
    }

    if (!description.trim()) {
      setErrorMessage('Vui lòng nhập mô tả chi tiết vấn đề bạn gặp phải.')
      return
    }

    setSubmitting(true)

    try {
      submitComplaint({
        orderId: selectedOrder?.id || selectedOrderId,
        reasonType,
        description: description.trim(),
        proofImage: proofImage || undefined,
      })

      setSuccessMessage('Gửi khiếu nại thành công! Yêu cầu của bạn đã được chuyển tới Ban quản trị để xử lý.')
      setDescription('')
      setActiveTab('history')
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi khi gửi khiếu nại.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ maxWidth: '960px', margin: '40px auto', padding: '0 16px', minHeight: '80vh', fontFamily: 'sans-serif' }}>
      {/* Breadcrumb & Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <Link
          to="/lich-su-don"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Quay lại Lịch sử đơn hàng
        </Link>
        <span style={{ fontSize: '0.8125rem', color: '#0369a1', background: '#e0f2fe', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>
          Hỗ trợ khách hàng
        </span>
      </div>

      {/* Main Title Banner */}
      <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#ffffff', borderRadius: '16px', padding: '24px 28px', marginBottom: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <ShieldAlert size={28} color="#f59e0b" />
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>Trung tâm Khiếu nại Đơn hàng</h1>
        </div>
        <p style={{ margin: 0, fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6 }}>
          Tiếp nhận và giải quyết khiếu nại trong vòng 24 giờ kể từ khi nhận hàng. Hoàn tiền 100% nếu xác định lỗi do phía nhà bếp hoặc giao hàng.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', marginBottom: '24px', gap: '8px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          style={{
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'create' ? '3px solid #b91c1c' : '3px solid transparent',
            background: 'none',
            color: activeTab === 'create' ? '#b91c1c' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <FileText size={18} /> Gửi Khiếu nại mới
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('history')}
          style={{
            padding: '12px 20px',
            fontSize: '0.9375rem',
            fontWeight: 700,
            border: 'none',
            borderBottom: activeTab === 'history' ? '3px solid #b91c1c' : '3px solid transparent',
            background: 'none',
            color: activeTab === 'history' ? '#b91c1c' : '#64748b',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Clock size={18} /> Lịch sử khiếu nại của tôi ({myComplaints.length})
        </button>
      </div>

      {/* TAB 1: FORM GỬI KHIẾU NẠI (UC17) */}
      {activeTab === 'create' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          {successMessage && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <CheckCircle size={20} color="#059669" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', padding: '14px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <AlertTriangle size={20} color="#dc2626" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Step 1: Select Order */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                1. Chọn đơn hàng cần khiếu nại (Đã giao / Hoàn thành):
              </label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', background: '#f8fafc' }}
                required
              >
                <option value="">-- Chọn đơn hàng từ lịch sử đặt đồ của bạn --</option>
                {eligibleOrders.map((ord) => (
                  <option key={ord.id} value={ord.id}>
                    #{ord.code} • {new Date(ord.createdAt).toLocaleDateString('vi-VN')} {new Date(ord.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} • {ord.total.toLocaleString()}đ • {ord.items.map((i) => i.name).join(', ')}
                  </option>
                ))}
              </select>

              {/* Order Info & BR-25 Validation */}
              {selectedOrder && (
                <div style={{ marginTop: '12px', padding: '14px', borderRadius: '8px', background: isOver24Hours ? '#fee2e2' : '#f1f5f9', border: `1px solid ${isOver24Hours ? '#ef4444' : '#cbd5e1'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong>Đơn hàng: #{selectedOrder.code}</strong>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '4px', background: '#ffffff', color: '#334155', fontWeight: 600 }}>
                      Thời gian đặt: {new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 6px', fontSize: '0.8125rem', color: '#475569' }}>
                    Địa điểm: {selectedOrder.receiveType === 'at_canteen' ? 'Nhận tại quầy Canteen A2' : `Tòa ${selectedOrder.location?.building} - Tầng ${selectedOrder.location?.floor} - ${selectedOrder.location?.room}`}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#475569' }}>
                    Tổng tiền: <strong>{selectedOrder.total.toLocaleString()}đ</strong> ({selectedOrder.paymentMethod === 'cod' ? 'Tiền mặt COD' : 'QR Online'})
                  </p>

                  {/* Warning Over 24h */}
                  {isOver24Hours && (
                    <div style={{ marginTop: '10px', color: '#b91c1c', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <XCircle size={16} /> Đơn hàng đã quá hạn 24 giờ kể từ khi hoàn thành nên không thể gửi khiếu nại!
                    </div>
                  )}

                  {/* Warning Duplicate Complaint */}
                  {existingComplaint && (
                    <div style={{ marginTop: '10px', color: '#b45309', fontSize: '0.8125rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={16} /> Đơn hàng này đã có khiếu nại đang được xử lý.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Reason Type */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                2. Loại sự cố / Lý do khiếu nại:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
                {Object.entries(reasonLabels).map(([key, label]) => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '12px',
                      borderRadius: '8px',
                      border: reasonType === key ? '2px solid #b91c1c' : '1px solid #cbd5e1',
                      background: reasonType === key ? '#fff1f2' : '#ffffff',
                      cursor: 'pointer',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <input
                      type="radio"
                      name="reasonType"
                      value={key}
                      checked={reasonType === key}
                      onChange={() => setReasonType(key as any)}
                      style={{ marginTop: '2px' }}
                    />
                    <span style={{ fontWeight: reasonType === key ? 700 : 500, color: reasonType === key ? '#881337' : '#1e293b' }}>
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 3: Description */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                3. Mô tả chi tiết vấn đề bạn gặp phải:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Món cơm sườn giao tới lúc 12:15 bị nguội lạnh, thiếu 01 phần canh rong biển đi kèm so với đơn đã thanh toán. Shipper giao trễ hơn giờ hẹn 25 phút..."
                rows={4}
                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem', resize: 'vertical' }}
                required
              />
            </div>

            {/* Step 4: Proof Image */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                4. Hình ảnh bằng chứng (yêu cầu đính kèm):
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <img
                  src={proofImage}
                  alt="Ảnh bằng chứng"
                  style={{ width: '90px', height: '90px', borderRadius: '8px', objectFit: 'cover', border: '2px solid #e2e8f0' }}
                />
                <div style={{ flex: 1, minWidth: '240px' }}>
                  <input
                    type="text"
                    value={proofImage}
                    onChange={(e) => setProofImage(e.target.value)}
                    placeholder="URL hình ảnh bằng chứng chụp món ăn..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', marginBottom: '6px' }}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setProofImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80')}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Mẫu ảnh 1: Món nguội
                    </button>
                    <button
                      type="button"
                      onClick={() => setProofImage('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80')}
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Mẫu ảnh 2: Thiếu món
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || isOver24Hours || !!existingComplaint}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
                border: 'none',
                background: isOver24Hours || !!existingComplaint ? '#94a3b8' : 'linear-gradient(to right, #b91c1c, #991b1b)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.9375rem',
                cursor: isOver24Hours || !!existingComplaint ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 10px rgba(185, 28, 28, 0.2)',
              }}
            >
              <Send size={18} />
              {submitting ? 'Đang gửi...' : 'Gửi Khiếu Nại Tới Ban Quản Trị'}
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: LỊCH SỬ KHIẾU NẠI */}
      {activeTab === 'history' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>
            Danh sách khiếu nại của bạn ({myComplaints.length})
          </h2>

          {myComplaints.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', color: '#64748b' }}>
              <CheckCircle size={40} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '0.9375rem', fontWeight: 600 }}>Bạn chưa có khiếu nại nào.</p>
              <p style={{ fontSize: '0.8125rem' }}>Các đơn hàng của bạn đều được vận hành bình thường.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {myComplaints.map((ticket) => {
                const isPending = ticket.status === 'pending'
                const isCanteenFault = ticket.status === 'resolved_canteen_fault'
                const isShipperFault = ticket.status === 'resolved_shipper_fault'
                const isRejected = ticket.status === 'rejected'

                return (
                  <div
                    key={ticket.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      padding: '16px',
                      background: isPending ? '#fffdf7' : isRejected ? '#fef2f2' : '#f0fdf4',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>Khiếu nại #{ticket.id}</strong>
                        <span style={{ marginLeft: '10px', fontSize: '0.8125rem', color: '#64748b' }}>
                          Đơn: <Link to={`/don-hang/${ticket.orderId}`} style={{ color: '#b91c1c', fontWeight: 700 }}>#{ticket.orderCode}</Link>
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          background: isPending ? '#fef3c7' : isRejected ? '#fee2e2' : '#dcfce7',
                          color: isPending ? '#92400e' : isRejected ? '#991b1b' : '#166534',
                        }}
                      >
                        {isPending ? 'Đang chờ Admin xử lý' : isCanteenFault ? 'Đã giải quyết (Lỗi Canteen - Hoàn tiền)' : isShipperFault ? 'Đã giải quyết (Lỗi Shipper - Hoàn tiền)' : 'Bác bỏ khiếu nại'}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.8125rem', color: '#334155', marginBottom: '8px' }}>
                      <p style={{ margin: '0 0 4px' }}><strong>Lý do:</strong> {reasonLabels[ticket.reasonType] || ticket.reasonType}</p>
                      <p style={{ margin: '0 0 6px', color: '#475569' }}><strong>Mô tả:</strong> &quot;{ticket.description}&quot;</p>
                    </div>

                    {ticket.proofImage && (
                      <div style={{ marginBottom: '10px' }}>
                        <a href={ticket.proofImage} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0369a1', textDecoration: 'underline' }}>
                          Xem ảnh bằng chứng đã gửi
                        </a>
                      </div>
                    )}

                    {/* Phán quyết của Admin (BR-37) */}
                    {!isPending && (
                      <div style={{ marginTop: '10px', padding: '10px 12px', borderRadius: '6px', background: '#ffffff', border: '1px dashed #cbd5e1', fontSize: '0.8125rem' }}>
                        <p style={{ margin: '0 0 4px', fontWeight: 700, color: '#0f172a' }}>
                          Phán quyết từ Ban Quản Trị:
                        </p>
                        <p style={{ margin: '0 0 4px', color: '#475569' }}>
                          {ticket.resolutionNote || 'Đã đối soát trách nhiệm theo đúng điều khoản dịch vụ.'}
                        </p>
                        {ticket.refundAmount ? (
                          <p style={{ margin: 0, color: '#15803d', fontWeight: 700 }}>
                            Số tiền hoàn trả về tài khoản: +{ticket.refundAmount.toLocaleString()}đ (Hoàn 100%)
                          </p>
                        ) : null}
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
  )
}
