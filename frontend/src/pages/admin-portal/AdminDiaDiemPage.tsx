import React, { useState } from 'react'
import { MapPin, Plus, CheckCircle2, XCircle, AlertTriangle, Building, Search } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'

export default function AdminDiaDiemPage() {
  const { campusLocations, toggleLocationStatus, addCampusLocation, orders } = useNeuEngine()

  const [selectedBuilding, setSelectedBuilding] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  // Modal Add Location
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [newBuilding, setNewBuilding] = useState<'A1' | 'A2' | 'B' | 'C' | 'D'>('A1')
  const [newFloor, setNewFloor] = useState<number>(3)
  const [newRoom, setNewRoom] = useState<string>('')
  const [addSuccess, setAddSuccess] = useState('')

  // Filter
  const filtered = campusLocations.filter((l) => {
    const matchesBuilding = selectedBuilding === 'all' || l.building === selectedBuilding
    const matchesSearch = l.room.toLowerCase().includes(searchTerm.toLowerCase()) || `Tòa ${l.building}`.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesBuilding && matchesSearch
  })

  const handleToggle = (loc: any) => {
    // BR-10, EX-06: Địa điểm đang có đơn chưa hoàn thành thì chỉ được vô hiệu hóa, không được xóa
    const activeOrdersAtLoc = orders.filter(
      (o) =>
        ['preparing', 'ready_for_handover', 'shipper_assigned', 'picked_up', 'delivering'].includes(o.status) &&
        o.location?.building === loc.building &&
        o.location?.room === loc.room
    )

    if (loc.isActive && activeOrdersAtLoc.length > 0) {
      alert(`Lưu ý: Địa điểm ${loc.room} (Tòa ${loc.building}) hiện đang có ${activeOrdersAtLoc.length} đơn hàng đang thực hiện. Hệ thống sẽ vô hiệu hóa nhận đơn mới tại điểm này!`)
    }

    toggleLocationStatus(loc.id, !loc.isActive)
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newRoom.trim()) return

    addCampusLocation({
      building: newBuilding,
      floor: Number(newFloor),
      room: newRoom.trim(),
    })
    setIsAddOpen(false)
    setNewRoom('')
    setAddSuccess('Đã thêm phòng học mới vào danh mục giao hàng campus NEU thành công!')
    setTimeout(() => setAddSuccess(''), 3000)
  }

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
            Quản lý Danh mục Địa điểm Giao hàng Nội khu NEU
          </h2>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
            Phạm vi khuôn viên Đại học Kinh tế Quốc dân (Tòa A1, A2, B, C, D). Vô hiệu hóa điểm đang có đơn dở dang.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '8px',
            background: '#0f172a',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          <Plus size={18} /> Thêm phòng học / Điểm giao mới
        </button>
      </div>

      {addSuccess && (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', fontWeight: 600 }}>
          <CheckCircle2 size={16} color="#059669" />
          {addSuccess}
        </div>
      )}

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', background: '#ffffff', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Tìm theo phòng hoặc tên tòa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.8125rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          {['all', 'A1', 'A2', 'B', 'C', 'D'].map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBuilding(b)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: selectedBuilding === b ? '2px solid #0284c7' : '1px solid #cbd5e1',
                background: selectedBuilding === b ? '#f0f9ff' : '#ffffff',
                color: selectedBuilding === b ? '#0369a1' : '#475569',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {b === 'all' ? 'Tất cả tòa' : `Tòa ${b}`}
            </button>
          ))}
        </div>
      </div>

      {/* Locations Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 18px' }}>Tòa nhà Campus</th>
              <th style={{ padding: '14px 18px' }}>Tầng</th>
              <th style={{ padding: '14px 18px' }}>Phòng học cụ thể</th>
              <th style={{ padding: '14px 18px' }}>Trạng thái phục vụ</th>
              <th style={{ padding: '14px 18px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((loc) => (
              <tr key={loc.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: loc.isActive ? 1 : 0.6 }}>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem' }}>
                      {loc.building}
                    </div>
                    <strong>Tòa {loc.building}</strong>
                  </div>
                </td>

                <td style={{ padding: '14px 18px', color: '#475569' }}>
                  Tầng {loc.floor}
                </td>

                <td style={{ padding: '14px 18px' }}>
                  <strong style={{ color: '#0f172a' }}>{loc.room}</strong>
                </td>

                <td style={{ padding: '14px 18px' }}>
                  {loc.isActive ? (
                    <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> Đang nhận đơn
                    </span>
                  ) : (
                    <span style={{ background: '#fef2f2', color: '#dc2626', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <XCircle size={13} /> Vô hiệu hóa
                    </span>
                  )}
                </td>

                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggle(loc)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      background: loc.isActive ? '#fff1f2' : '#ecfdf5',
                      color: loc.isActive ? '#9f1239' : '#047857',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {loc.isActive ? 'Vô hiệu hóa' : 'Kích hoạt lại'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: Thêm địa điểm mới */}
      {isAddOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', maxWidth: '420px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Thêm Phòng học / Điểm giao mới</h3>
            <form onSubmit={handleAdd}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tòa nhà:</label>
                <select value={newBuilding} onChange={(e) => setNewBuilding(e.target.value as any)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                  <option value="A1">Tòa A1</option>
                  <option value="A2">Tòa A2</option>
                  <option value="B">Tòa B</option>
                  <option value="C">Tòa C</option>
                  <option value="D">Tòa D</option>
                </select>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tầng (1 - 10):</label>
                <input type="number" min="1" max="10" value={newFloor} onChange={(e) => setNewFloor(Number(e.target.value))} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tên phòng học:</label>
                <input type="text" placeholder="Ví dụ: P308, P502..." value={newRoom} onChange={(e) => setNewRoom(e.target.value)} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsAddOpen(false)} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8125rem' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0f172a', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>Lưu địa điểm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
