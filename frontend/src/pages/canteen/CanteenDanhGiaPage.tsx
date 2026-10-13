import React, { useState } from 'react'
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function CanteenDanhGiaPage() {
  const { canteenSession, reviews, replyReview } = useNeuEngine()

  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})
  const [successId, setSuccessId] = useState<string | null>(null)

  const handleReply = (reviewId: string) => {
    const text = replyInputs[reviewId]?.trim()
    if (!text) return

    const replierRole = canteenSession?.role === 'canteen_manager' ? 'Quản lý Canteen' : 'Nhân viên Canteen'
    replyReview(reviewId, text, replierRole)
    setReplyInputs((prev) => ({ ...prev, [reviewId]: '' }))
    setSuccessId(reviewId)
    setTimeout(() => setSuccessId(null), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Đánh giá &amp; Trả lời phản hồi khách hàng
        </h2>
        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
          Xem phản hồi từ khách hàng sau khi hoàn thành đơn và gửi câu trả lời tương tác từ nhà bếp.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.map((rev) => (
          <div
            key={rev.id}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            {/* Top row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.9375rem', color: '#0f172a' }}>{rev.customerName}</strong>
                <span style={{ fontSize: '0.75rem', color: '#64748b', marginLeft: '8px' }}>
                  Đơn: #{rev.orderCode} • Món: <strong>{rev.dishName}</strong>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < rev.rating ? '#eab308' : '#e2e8f0'}
                    color={i < rev.rating ? '#eab308' : '#cbd5e1'}
                  />
                ))}
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#b45309', marginLeft: '4px' }}>
                  {rev.rating}/5
                </span>
              </div>
            </div>

            {/* Comment */}
            <p style={{ margin: '0 0 12px', fontSize: '0.875rem', color: '#334155', lineHeight: 1.5, background: '#f8fafc', padding: '10px 14px', borderRadius: '8px' }}>
              &ldquo;{rev.comment}&rdquo;
            </p>

            <div style={{ fontSize: '0.6875rem', color: '#94a3b8', marginBottom: '14px' }}>
              Thời gian đánh giá: {new Date(rev.createdAt).toLocaleString('vi-VN')}
            </div>

            {/* Canteen Reply Section */}
            {rev.canteenReply ? (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', padding: '12px 14px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '0.75rem', color: '#881337', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={14} /> Phản hồi từ {rev.canteenReply.repliedBy}:
                  </strong>
                  <span style={{ fontSize: '0.6875rem', color: '#9f1239' }}>
                    {new Date(rev.canteenReply.repliedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4c0519', lineHeight: 1.4 }}>
                  {rev.canteenReply.text}
                </p>
              </div>
            ) : (
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Gõ câu trả lời của Canteen cho khách hàng..."
                    value={replyInputs[rev.id] || ''}
                    onChange={(e) => setReplyInputs({ ...replyInputs, [rev.id]: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.8125rem',
                    }}
                  />
                  <button
                    onClick={() => handleReply(rev.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#881337',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.8125rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Send size={14} /> Gửi trả lời
                  </button>
                </div>
                {successId === rev.id && (
                  <div style={{ marginTop: '6px', color: '#059669', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Đã gửi phản hồi thành công!
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
