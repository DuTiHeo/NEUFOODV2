import React, { useState } from 'react'
import { dishes as initialDishes } from '../../data/dishes'
import { Utensils, CheckCircle, XCircle, Search, Edit2, EyeOff } from 'lucide-react'

function formatPrice(n: number) {
  return `${Number(n || 0).toLocaleString('vi-VN')}đ`
}

export default function CanteenMonPage() {
  const [dishList, setDishList] = useState(() => {
    const saved = localStorage.getItem('CANTEEN_DISHES_OVERRIDE')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        /* ignore */
      }
    }
    return initialDishes.map((d) => ({
      ...d,
      isAvailable: true,
      isHidden: false,
    }))
  })

  const [q, setQ] = useState('')
  const [editingDish, setEditingDish] = useState<any>(null)
  const [editPrice, setEditPrice] = useState<number>(0)

  function saveList(list: any[]) {
    setDishList(list)
    localStorage.setItem('CANTEEN_DISHES_OVERRIDE', JSON.stringify(list))
    window.dispatchEvent(new Event('neu_storage_updated'))
  }

  function toggleAvailability(id: string) {
    const updated = dishList.map((d: any) =>
      d.id === id ? { ...d, isAvailable: !d.isAvailable } : d
    )
    saveList(updated)
  }

  function toggleHidden(id: string) {
    // BR-06: Món đã từng có đơn chỉ được ẩn, không xóa cứng
    const updated = dishList.map((d: any) =>
      d.id === id ? { ...d, isHidden: !d.isHidden } : d
    )
    saveList(updated)
  }

  function handleSavePrice() {
    if (!editingDish) return
    // BR-06: Đổi giá không ảnh hưởng đơn đã tạo
    const updated = dishList.map((d: any) =>
      d.id === editingDish.id ? { ...d, price: editPrice } : d
    )
    saveList(updated)
    setEditingDish(null)
  }

  const filtered = dishList.filter((d: any) =>
    d.name.toLowerCase().includes(q.toLowerCase()) ||
    (d.shortDescription || '').toLowerCase().includes(q.toLowerCase())
  )

  const outOfStockCount = dishList.filter((d: any) => !d.isAvailable).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
            Kho món ăn Canteen A2
          </h2>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
            Cập nhật trạng thái Còn món / Hết món theo thời gian thực cho sinh viên NEU.
          </p>
        </div>

        <div style={{ background: '#fef3c7', color: '#92400e', padding: '6px 14px', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: 600 }}>
          Hết hàng tạm thời: <strong>{outOfStockCount} món</strong>
        </div>
      </div>

      {/* Search toolbar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94a3b8' }} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm kiếm món ăn theo tên hoặc mô tả..."
            style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569' }}>
              <th style={{ padding: '12px 16px' }}>Hình ảnh &amp; Món</th>
              <th style={{ padding: '12px 16px' }}>Giá bán</th>
              <th style={{ padding: '12px 16px' }}>Trạng thái kho</th>
              <th style={{ padding: '12px 16px' }}>Hiển thị</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dish: any) => (
              <tr key={dish.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: dish.isHidden ? 0.5 : 1 }}>
                <td style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={dish.image}
                    alt={dish.name}
                    style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{dish.name}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{dish.shortDescription}</span>
                  </div>
                </td>

                <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a' }}>
                  {formatPrice(dish.price)}
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <button
                    type="button"
                    onClick={() => toggleAvailability(dish.id)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: dish.isAvailable ? '#ecfdf5' : '#fee2e2',
                      color: dish.isAvailable ? '#047857' : '#b91c1c',
                    }}
                  >
                    {dish.isAvailable ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {dish.isAvailable ? 'Còn món' : 'Hết món (Khóa thêm giỏ)'}
                  </button>
                </td>

                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.8125rem', color: dish.isHidden ? '#94a3b8' : '#059669', fontWeight: 600 }}>
                    {dish.isHidden ? 'Đã ẩn' : 'Đang bật hiển thị'}
                  </span>
                </td>

                <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDish(dish)
                        setEditPrice(dish.price)
                      }}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit2 size={13} />
                      Đổi giá
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleHidden(dish.id)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <EyeOff size={13} />
                      {dish.isHidden ? 'Bỏ ẩn' : 'Ẩn món'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Price Modal */}
      {editingDish ? (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '16px' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', maxWidth: '380px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 8px' }}>Chỉnh sửa giá bán</h3>
            <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '14px' }}>
              Đổi giá mới sẽ chỉ áp dụng cho các đơn hàng tiếp theo.
            </p>

            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '6px' }}>
              Giá bán mới (VNĐ):
            </label>
            <input
              type="number"
              step="1000"
              value={editPrice}
              onChange={(e) => setEditPrice(Number(e.target.value))}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '16px', fontSize: '1rem', fontWeight: 700 }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setEditingDish(null)}
                style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer' }}
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleSavePrice}
                style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#881337', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
              >
                Lưu giá mới
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
