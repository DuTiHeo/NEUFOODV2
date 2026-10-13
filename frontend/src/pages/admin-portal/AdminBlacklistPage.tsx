import React, { useState } from 'react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { ShieldAlert, ShieldCheck, UserX, UserCheck, AlertTriangle } from 'lucide-react'

export default function AdminBlacklistPage() {
  const { users, toggleCodBlacklist } = useNeuEngine()
  const [activeTab, setActiveTab] = useState<'blacklist' | 'all'>('blacklist')

  const blacklistedUsers = users.filter((u) => u.isCodBlacklisted)

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Quản lý Tài khoản &amp; Danh sách Hạn chế COD
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          Kiểm soát quyền truy cập và hạn chế tính năng COD đối với khách hàng vi phạm boom hàng.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => setActiveTab('blacklist')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'blacklist' ? '#b91c1c' : '#ffffff',
            color: activeTab === 'blacklist' ? '#ffffff' : '#475569',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <ShieldAlert size={16} />
          <span>Danh sách Hạn chế COD ({blacklistedUsers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('all')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: activeTab === 'all' ? '#0f172a' : '#ffffff',
            color: activeTab === 'all' ? '#ffffff' : '#475569',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <UserCheck size={16} />
          <span>Tất cả người dùng ({users.length})</span>
        </button>
      </div>

      {/* View 1: Blacklist Table */}
      {activeTab === 'blacklist' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ background: '#fff1f2', borderBottom: '1px solid #fecdd3', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#881337', fontSize: '0.8125rem' }}>
            <AlertTriangle size={18} />
            <span>
              Khách hàng trong danh sách này bị tạm khóa tính năng COD, chỉ được đặt hàng qua thanh toán QR Online.
            </span>
          </div>

          {blacklistedUsers.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '32px 0', fontSize: '0.875rem' }}>
              Không có tài khoản nào bị hạn chế COD.
            </p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 16px' }}>Sinh viên</th>
                  <th style={{ padding: '12px 16px' }}>Mã SV / SĐT</th>
                  <th style={{ padding: '12px 16px' }}>Lý do hạn chế COD</th>
                  <th style={{ padding: '12px 16px' }}>Quyền COD</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {blacklistedUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <strong style={{ display: 'block', color: '#0f172a' }}>{u.fullName}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span>{u.studentId || 'Chưa cập nhật'}</span>
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>{u.phone}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#b91c1c', fontSize: '0.8125rem' }}>
                      {u.blacklistReason || 'Boom hàng đơn COD'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#fee2e2', color: '#991b1b', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        Đã Khóa COD
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => toggleCodBlacklist(u.id, false)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid #059669',
                          background: '#ffffff',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Gỡ khỏi Blacklist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* View 2: All Users Table */}
      {activeTab === 'all' && (
        <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
                <th style={{ padding: '12px 16px' }}>Người dùng</th>
                <th style={{ padding: '12px 16px' }}>Vai trò (Role)</th>
                <th style={{ padding: '12px 16px' }}>Tính năng COD</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{u.fullName}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.email}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#334155' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {u.isCodBlacklisted ? (
                      <span style={{ color: '#dc2626', fontWeight: 600, fontSize: '0.75rem' }}>Bị khóa COD</span>
                    ) : (
                      <span style={{ color: '#059669', fontWeight: 600, fontSize: '0.75rem' }}>Khả dụng</span>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    {u.role === 'customer' ? (
                      <button
                        type="button"
                        onClick={() => toggleCodBlacklist(u.id, !u.isCodBlacklisted, 'Admin can thiệp thủ công')}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: u.isCodBlacklisted ? '1px solid #059669' : '1px solid #ef4444',
                          background: '#ffffff',
                          color: u.isCodBlacklisted ? '#059669' : '#dc2626',
                          fontWeight: 600,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        {u.isCodBlacklisted ? 'Mở lại COD' : 'Khóa COD (Thủ công)'}
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
