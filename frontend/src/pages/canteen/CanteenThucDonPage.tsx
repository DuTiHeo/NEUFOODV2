import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Edit3, Eye, EyeOff, DollarSign, CheckCircle, AlertTriangle, Search, Utensils, ShieldAlert } from 'lucide-react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { MENU_CATEGORIES } from '../../data/dishes'

export default function CanteenThucDonPage() {
  const navigate = useNavigate()
  const { canteenSession, dishes, addDish, updateDish, toggleDishHidden } = useNeuEngine()

  const isManager = canteenSession?.role === 'canteen_manager'

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCat, setSelectedCat] = useState('all')

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const [targetDish, setTargetDish] = useState<any>(null)

  // Form states for Add/Edit
  const [dishName, setDishName] = useState('')
  const [dishCat, setDishCat] = useState('com-hop')
  const [dishPrice, setDishPrice] = useState(35000)
  const [dishShortDesc, setDishShortDesc] = useState('')
  const [dishDesc, setDishDesc] = useState('')
  const [dishImage, setDishImage] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600')

  // Filtered dishes
  const filteredDishes = dishes.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCat === 'all' || (d.categoryIds && d.categoryIds.includes(selectedCat))
    return matchesSearch && matchesCategory
  })

  // Open Edit Modal
  const openEdit = (dish: any) => {
    setTargetDish(dish)
    setDishName(dish.name)
    setDishCat(dish.categoryIds ? dish.categoryIds[0] : 'com-hop')
    setDishPrice(dish.price)
    setDishShortDesc(dish.shortDescription || '')
    setDishDesc(dish.description || '')
    setDishImage(dish.image || '')
    setIsEditOpen(true)
  }

  // Open Change Price Modal
  const openChangePrice = (dish: any) => {
    setTargetDish(dish)
    setDishPrice(dish.price)
    setIsPriceOpen(true)
  }

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault()
    if (!dishName.trim()) return
    addDish({
      name: dishName.trim(),
      categoryIds: [dishCat],
      price: Number(dishPrice),
      shortDescription: dishShortDesc.trim() || dishName.trim(),
      description: dishDesc.trim(),
      image: dishImage.trim(),
    })
    setIsAddOpen(false)
    resetForm()
  }

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetDish || !dishName.trim()) return
    updateDish(targetDish.id, {
      name: dishName.trim(),
      categoryIds: [dishCat],
      price: Number(dishPrice),
      shortDescription: dishShortDesc.trim(),
      description: dishDesc.trim(),
      image: dishImage.trim(),
    })
    setIsEditOpen(false)
    resetForm()
  }

  const handleSavePrice = (e: React.FormEvent) => {
    e.preventDefault()
    if (!targetDish) return
    updateDish(targetDish.id, { price: Number(dishPrice) })
    setIsPriceOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setTargetDish(null)
    setDishName('')
    setDishCat('com-hop')
    setDishPrice(35000)
    setDishShortDesc('')
    setDishDesc('')
    setDishImage('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600')
  }

  if (!isManager) {
    return (
      <div style={{ maxWidth: '640px', margin: '40px auto', background: '#ffffff', borderRadius: '14px', border: '1px solid #fee2e2', padding: '32px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#fee2e2', color: '#b91c1c', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <ShieldAlert size={28} />
        </div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px' }}>
          Yêu cầu Quyền Quản lý Canteen
        </h2>
        <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6 }}>
          Bạn đang đăng nhập bằng <strong>Tài khoản dùng chung của Nhân viên</strong>. Nghiệp vụ <em>Thêm món, Sửa thông tin món, Đổi giá bán và Ẩn món</em> chỉ dành riêng cho Quản lý Canteen.
        </p>
        <button
          onClick={() => navigate('/canteen/login')}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: '#881337',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
          }}
        >
          Đăng xuất &amp; Đăng nhập bằng Tài khoản Quản lý
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Header Banner */}
      <div style={{ display: 'flex', borderBottom: 'none', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
            Quản lý Thực đơn Canteen A2
          </h2>
          <p style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
            Thêm, sửa, đổi giá bán và ẩn món ăn. Món đã từng có đơn chỉ được ẩn, không xóa cứng; đổi giá không ảnh hưởng đơn cũ.
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
            background: '#881337',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(136,19,55,0.2)',
          }}
        >
          <Plus size={18} /> Thêm món mới vào Thực đơn
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center', background: '#ffffff', padding: '14px 18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: '240px', background: '#f8fafc', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
          <Search size={16} color="#64748b" />
          <input
            type="text"
            placeholder="Tìm theo tên món hoặc mã món..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.8125rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Danh mục:</span>
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8125rem', background: '#ffffff' }}
          >
            <option value="all">Tất cả danh mục</option>
            {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dishes Table */}
      <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
              <th style={{ padding: '14px 16px' }}>Hình ảnh &amp; Món</th>
              <th style={{ padding: '14px 16px' }}>Danh mục</th>
              <th style={{ padding: '14px 16px' }}>Giá bán hiện tại</th>
              <th style={{ padding: '14px 16px' }}>Trạng thái phục vụ</th>
              <th style={{ padding: '14px 16px' }}>Hiển thị Menu</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Thao tác Quản lý</th>
            </tr>
          </thead>
          <tbody>
            {filteredDishes.map((dish) => (
              <tr key={dish.id} style={{ borderBottom: '1px solid #f1f5f9', opacity: dish.isHidden ? 0.6 : 1 }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                      src={dish.image}
                      alt={dish.name}
                      style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                    />
                    <div>
                      <strong style={{ color: '#0f172a', display: 'block', fontSize: '0.875rem' }}>{dish.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>#{dish.id}</span>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '14px 16px', color: '#475569', fontSize: '0.8125rem' }}>
                  {dish.categoryIds ? dish.categoryIds.join(', ') : 'Món chính'}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ color: '#b91c1c', fontSize: '0.9375rem' }}>
                      {dish.price.toLocaleString('vi-VN')}đ
                    </strong>
                    <button
                      onClick={() => openChangePrice(dish)}
                      title="Đổi giá bán"
                      style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', background: '#f8fafc', color: '#0284c7', cursor: 'pointer', fontSize: '0.6875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <DollarSign size={12} /> Đổi giá
                    </button>
                  </div>
                </td>

                <td style={{ padding: '14px 16px' }}>
                  {dish.isAvailable !== false ? (
                    <span style={{ background: '#ecfdf5', color: '#059669', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Còn món
                    </span>
                  ) : (
                    <span style={{ background: '#fee2e2', color: '#b91c1c', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                      Tạm hết món
                    </span>
                  )}
                </td>

                <td style={{ padding: '14px 16px' }}>
                  {dish.isHidden ? (
                    <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Đang ẩn (Không cho đặt)
                    </span>
                  ) : (
                    <span style={{ background: '#f0f9ff', color: '#0369a1', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      Đang hiển thị
                    </span>
                  )}
                </td>

                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                    <button
                      onClick={() => openEdit(dish)}
                      style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Edit3 size={14} /> Sửa
                    </button>

                    <button
                      onClick={() => toggleDishHidden(dish.id)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: dish.isHidden ? '#ecfdf5' : '#fef2f2',
                        color: dish.isHidden ? '#059669' : '#dc2626',
                        cursor: 'pointer',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      title="Món đã từng có đơn chỉ được ẩn, không thể xóa bỏ hoàn toàn"
                    >
                      {dish.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                      {dish.isHidden ? 'Hiện món' : 'Ẩn món'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL: Thêm món mới */}
      {isAddOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Thêm món mới vào Thực đơn</h3>
            <form onSubmit={handleSaveNew}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tên món ăn:</label>
                <input type="text" value={dishName} onChange={(e) => setDishName(e.target.value)} required placeholder="Ví dụ: Cơm sườn xào chua ngọt" style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Danh mục:</label>
                  <select value={dishCat} onChange={(e) => setDishCat(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                    {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Giá bán (VND):</label>
                  <input type="number" step="1000" min="5000" value={dishPrice} onChange={(e) => setDishPrice(Number(e.target.value))} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mô tả ngắn:</label>
                <input type="text" value={dishShortDesc} onChange={(e) => setDishShortDesc(e.target.value)} placeholder="Mô tả hấp dẫn về món..." style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Link ảnh món (URL):</label>
                <input type="text" value={dishImage} onChange={(e) => setDishImage(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsAddOpen(false)} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8125rem' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#881337', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>Thêm món</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Sửa món */}
      {isEditOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', maxWidth: '520px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Chỉnh sửa thông tin món: {targetDish?.name}</h3>
            <form onSubmit={handleSaveEdit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Tên món ăn:</label>
                <input type="text" value={dishName} onChange={(e) => setDishName(e.target.value)} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Danh mục:</label>
                  <select value={dishCat} onChange={(e) => setDishCat(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }}>
                    {MENU_CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Giá bán (VND):</label>
                  <input type="number" step="1000" value={dishPrice} onChange={(e) => setDishPrice(Number(e.target.value))} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Mô tả ngắn:</label>
                <input type="text" value={dishShortDesc} onChange={(e) => setDishShortDesc(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Link ảnh món (URL):</label>
                <input type="text" value={dishImage} onChange={(e) => setDishImage(e.target.value)} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8125rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsEditOpen(false)} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8125rem' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#881337', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>Lưu thay đổi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Đổi giá bán */}
      {isPriceOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100 }}>
          <div style={{ background: '#ffffff', borderRadius: '14px', maxWidth: '420px', width: '100%', padding: '24px', boxShadow: '0 20px 25px rgba(0,0,0,0.2)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '1.125rem', fontWeight: 800, color: '#0f172a' }}>Đổi giá bán món: {targetDish?.name}</h3>
            
            <div style={{ background: '#f0f9ff', padding: '10px 12px', borderRadius: '8px', border: '1px solid #bae6fd', fontSize: '0.75rem', color: '#0369a1', marginBottom: '16px', lineHeight: 1.5 }}>
              Đổi giá bán chỉ áp dụng cho các lượt đặt đơn mới. Các đơn hàng đã đặt trước thời điểm này vẫn giữ nguyên mức giá cũ.
            </div>

            <form onSubmit={handleSavePrice}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>Giá bán mới (VND):</label>
                <input type="number" step="1000" min="1000" value={dishPrice} onChange={(e) => setDishPrice(Number(e.target.value))} required style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 700, color: '#b91c1c' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setIsPriceOpen(false)} style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer', fontSize: '0.8125rem' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', border: 'none', background: '#0284c7', color: '#ffffff', fontWeight: 700, cursor: 'pointer', fontSize: '0.8125rem' }}>Cập nhật giá</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
