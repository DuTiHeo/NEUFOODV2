import React, { useState } from 'react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { ComplaintTicket } from '../../types/neuModels'
import { AlertCircle, CheckCircle, XCircle, Eye, ShieldCheck, Scale } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function AdminKhieuNaiPage() {
  const { complaints, resolveComplaint, orders } = useNeuEngine()

  const [selectedTicket, setSelectedTicket] = useState<ComplaintTicket | null>(null)
  const [faultDecision, setFaultDecision] = useState<'resolved_canteen_fault' | 'resolved_shipper_fault' | 'rejected'>('resolved_canteen_fault')
  const [resolutionNote, setResolutionNote] = useState('Xác nhận lỗi thiếu món từ phía bếp. Hoàn tiền 100% cho sinh viên.')
  const [refundAmount, setRefundAmount] = useState<number>(45000)

  function handleResolveSubmit() {
    if (!selectedTicket) return
    resolveComplaint(
      selectedTicket.id,
      faultDecision,
      resolutionNote,
      faultDecision === 'rejected' ? 0 : refundAmount
    )
    setSelectedTicket(null)
  }

  const reasonLabels: Record<string, string> = {
    missing_dish: 'Thiếu món / Sai số lượng',
    wrong_dish: 'Giao nhầm món ăn khác',
    cold_food: 'Món ăn nguội / Không đảm bảo',
    shipper_attitude: 'Thái độ phục vụ của Shipper',
    other: 'Lý do khác',
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Xử lý Khiếu nại &amp; Phán quyết Hoàn tiền
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          Đối soát trách nhiệm giữa Canteen và Shipper để xử lý hoàn tiền công bằng cho khách hàng.
        </p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Mã đơn &amp; Khách hàng</th>
              <th style={{ padding: '12px 16px' }}>Loại sự cố</th>
              <th style={{ padding: '12px 16px' }}>Mô tả chi tiết</th>
              <th style={{ padding: '12px 16px' }}>Ảnh bằng chứng</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái xử lý</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác Admin</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                  Hiện không có khiếu nại nào cần giải quyết.
                </td>
              </tr>
            ) : (
              complaints.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ color: '#0284c7', display: 'block' }}>#{c.orderCode || c.orderId}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.customerName}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#b91c1c' }}>
                    {reasonLabels[c.reasonType] || c.reasonType}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#334155', maxWidth: '280px' }}>
                    {c.description}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {c.proofImage ? (
                      <a href={c.proofImage} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                        Xem ảnh đính kèm
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Không có ảnh</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background:
                          c.status === 'pending'
                            ? '#fef3c7'
                            : c.status === 'rejected'
                              ? '#fee2e2'
                              : '#ecfdf5',
                        color:
                          c.status === 'pending'
                            ? '#92400e'
                            : c.status === 'rejected'
                              ? '#b91c1c'
                              : '#047857',
                      }}
                    >
                      {c.status === 'pending'
                        ? 'Chờ phân xử'
                        : c.status === 'resolved_canteen_fault'
                          ? 'Lỗi Canteen (Đã hoàn)'
                          : c.status === 'resolved_shipper_fault'
                            ? 'Lỗi Shipper (Đã hoàn)'
                            : 'Bác bỏ'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {c.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={() => setSelectedTicket(c)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#881337',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Scale size={14} />
                        Phán quyết
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Đã đóng ticket</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* TICKET RESOLUTION MODAL */}
      {selectedTicket ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', maxWidth: '480px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 10px', color: '#0f172a' }}>Phán quyết Khiếu nại đơn #{selectedTicket.orderCode}</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '16px' }}>
              Bên có lỗi phải chịu 100% chi phí hoàn tiền cho khách hàng.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.8125rem' }}>
              <p style={{ margin: '0 0 4px' }}><strong>Nội dung:</strong> {selectedTicket.description}</p>
              <p style={{ margin: 0, color: '#b91c1c' }}><strong>Loại sự cố:</strong> {reasonLabels[selectedTicket.reasonType]}</p>
            </div>

            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Xác định bên có lỗi:
            </label>
            <select
              value={faultDecision}
              onChange={(e) => setFaultDecision(e.target.value as any)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '14px', fontSize: '0.875rem' }}
            >
              <option value="resolved_canteen_fault">Lỗi do Canteen A2 (Nấu thiếu/sai món) - Trừ tiền quán</option>
              <option value="resolved_shipper_fault">Lỗi do Shipper (Giao chậm/làm hỏng) - Trừ thu nhập shipper</option>
              <option value="rejected">Bác bỏ khiếu nại (Không đủ căn cứ / Quá hạn 24h)</option>
            </select>

            {faultDecision !== 'rejected' ? (
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
                  Số tiền hoàn trả cho khách (VNĐ):
                </label>
                <input
                  type="number"
                  step="5000"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9375rem', fontWeight: 700 }}
                />
              </div>
            ) : null}

            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Ghi chú kết luận của Admin:
            </label>
            <textarea
              rows={2}
              value={resolutionNote}
              onChange={(e) => setResolutionNote(e.target.value)}
              style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '18px', fontSize: '0.8125rem' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleResolveSubmit}
                style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', background: '#059669', color: '#ffffff', fontWeight: 700, cursor: 'pointer' }}
              >
                Kích hoạt lệnh hoàn tiền
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
