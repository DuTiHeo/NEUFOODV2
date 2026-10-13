import React, { useState } from 'react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { ShipperProfile } from '../../types/neuModels'
import { Check, X, Eye, ShieldCheck, AlertCircle } from 'lucide-react'

export default function AdminDuyetShipperPage() {
  const { shippers, approveShipper } = useNeuEngine()

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [rejectModalShipper, setRejectModalShipper] = useState<ShipperProfile | null>(null)
  const [rejectReason, setRejectReason] = useState('Ảnh thẻ sinh viên bị mờ / Không rõ mã SV')

  function handleApprove(id: string) {
    approveShipper(id, true)
  }

  function handleRejectSubmit() {
    if (!rejectModalShipper) return
    approveShipper(rejectModalShipper.id, false, rejectReason)
    setRejectModalShipper(null)
  }

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Xét duyệt hồ sơ Shipper nội khu
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          Đối soát thẻ sinh viên NEU và số điện thoại trước khi cấp quyền nhận đơn cho sinh viên.
        </p>
      </div>

      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Mã SV NEU</th>
              <th style={{ padding: '12px 16px' }}>Họ và tên</th>
              <th style={{ padding: '12px 16px' }}>Liên hệ (Email / SĐT)</th>
              <th style={{ padding: '12px 16px' }}>Ảnh thẻ sinh viên</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái hồ sơ</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác Admin</th>
            </tr>
          </thead>
          <tbody>
            {shippers.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>{s.studentId}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{s.fullName}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'block', color: '#0f172a' }}>{s.email}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{s.phone}</span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPhoto(s.studentCardPhoto)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: '#f8fafc',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Eye size={14} color="#0284c7" />
                    <span>Xem ảnh thẻ</span>
                  </button>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background:
                        s.status === 'approved'
                          ? '#ecfdf5'
                          : s.status === 'rejected'
                            ? '#fee2e2'
                            : '#fef3c7',
                      color:
                        s.status === 'approved'
                          ? '#047857'
                          : s.status === 'rejected'
                            ? '#b91c1c'
                            : '#92400e',
                    }}
                  >
                    {s.status === 'approved' ? 'Đã duyệt' : s.status === 'rejected' ? 'Bị từ chối' : 'Chờ duyệt'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  {s.status === 'pending' ? (
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleApprove(s.id)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: 'none',
                          background: '#059669',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={14} />
                        Duyệt
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectModalShipper(s)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #ef4444',
                          background: '#ffffff',
                          color: '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <X size={14} />
                        Từ chối
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Đã có kết quả</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PHOTO PREVIEW MODAL */}
      {selectedPhoto ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 12px' }}>Đối soát thẻ sinh viên NEU</h4>
            <div style={{ width: '100%', height: '260px', borderRadius: '8px', overflow: 'hidden', marginBottom: '14px' }}>
              <img src={selectedPhoto} alt="Thẻ SV" style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#000000' }} />
            </div>
            <button
              type="button"
              onClick={() => setSelectedPhoto(null)}
              style={{ padding: '8px 20px', borderRadius: '6px', border: 'none', background: '#0f172a', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
            >
              Đóng
            </button>
          </div>
        </div>
      ) : null}

      {/* REJECT MODAL WITH MANDATORY REASON */}
      {rejectModalShipper ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', maxWidth: '420px', width: '100%' }}>
            <h3 style={{ margin: '0 0 8px', color: '#b91c1c' }}>Từ chối hồ sơ #{rejectModalShipper.studentId}</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '14px' }}>
              Vui lòng nêu rõ lý do để sinh viên cập nhật lại hồ sơ.
            </p>

            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Lý do từ chối (bắt buộc):
            </label>
            <select
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '16px', fontSize: '0.8125rem' }}
            >
              <option value="Ảnh thẻ sinh viên bị mờ / Không rõ mã SV">Ảnh thẻ sinh viên bị mờ / Không rõ mã SV</option>
              <option value="Mã sinh viên không khớp với hệ thống trường NEU">Mã sinh viên không khớp với hệ thống trường NEU</option>
              <option value="Tài khoản sinh viên đang trong danh sách bị kỷ luật">Tài khoản sinh viên đang trong danh sách bị kỷ luật</option>
            </select>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setRejectModalShipper(null)}
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
    </div>
  )
}
