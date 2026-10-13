import React, { useState } from 'react'
import { useNeuEngine } from '../../hooks/useNeuEngine'
import { Settings, Save, CheckCircle } from 'lucide-react'

export default function AdminCauHinhPage() {
  const { config, updateConfig } = useNeuEngine()

  const [feeA1, setFeeA1] = useState(config.shippingFeeByBuilding['A1'] || 8000)
  const [feeA2, setFeeA2] = useState(config.shippingFeeByBuilding['A2'] || 7000)
  const [feeB, setFeeB] = useState(config.shippingFeeByBuilding['B'] || 9000)
  const [feeC, setFeeC] = useState(config.shippingFeeByBuilding['C'] || 9000)
  const [feeD, setFeeD] = useState(config.shippingFeeByBuilding['D'] || 10000)

  const [sla, setSla] = useState(config.standardSLAMinutes || 20)
  const [codLimit, setCodLimit] = useState(config.codMaxOrderLimit || 300000)
  const [shipperAdvanceLimit, setShipperAdvanceLimit] = useState(config.shipperMaxAdvanceLimit || 500000)
  const [canteenKeep, setCanteenKeep] = useState(config.canteenKeepMinutes || 30)

  const [savedSuccess, setSavedSuccess] = useState(false)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    updateConfig({
      shippingFeeByBuilding: {
        A1: Number(feeA1),
        A2: Number(feeA2),
        B: Number(feeB),
        C: Number(feeC),
        D: Number(feeD),
      },
      standardSLAMinutes: Number(sla),
      codMaxOrderLimit: Number(codLimit),
      shipperMaxAdvanceLimit: Number(shipperAdvanceLimit),
      canteenKeepMinutes: Number(canteenKeep),
    })
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>
          Cấu hình Tham số Vận hành Toàn hệ thống
        </h2>
        <p style={{ fontSize: '0.8125rem', color: '#64748b', margin: 0 }}>
          Mọi thay đổi tham số sẽ áp dụng ngay cho các đơn hàng tạo mới tiếp theo.
        </p>
      </div>

      {savedSuccess ? (
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={18} />
          <strong>Đã lưu cấu hình mới thành công! Hệ thống đã ghi nhận tham số mới.</strong>
        </div>
      ) : null}

      <form onSubmit={handleSave} style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {/* Section 1: Phí giao hàng theo tòa */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
            1. Bảng phí giao hàng theo khoảng cách tòa nhà
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#64748b', marginBottom: '14px' }}>
            Phí giao nội khu dao động 7.000đ - 10.000đ tùy vị trí tòa so với trung tâm Canteen A2.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Tòa A2 (Canteen):</label>
              <input
                type="number"
                step="1000"
                value={feeA2}
                onChange={(e) => setFeeA2(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Tòa A1:</label>
              <input
                type="number"
                step="1000"
                value={feeA1}
                onChange={(e) => setFeeA1(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Tòa B:</label>
              <input
                type="number"
                step="1000"
                value={feeB}
                onChange={(e) => setFeeB(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Tòa C:</label>
              <input
                type="number"
                step="1000"
                value={feeC}
                onChange={(e) => setFeeC(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '4px' }}>Tòa D:</label>
              <input
                type="number"
                step="1000"
                value={feeD}
                onChange={(e) => setFeeD(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
            </div>
          </div>
        </div>

        <div style={{ height: '1px', background: '#e2e8f0', margin: '20px 0' }} />

        {/* Section 2: Operational Limits */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', margin: '0 0 14px' }}>
            2. Tham số giới hạn vận hành &amp; Rủi ro COD
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                Hạn mức đơn COD tối đa:
              </label>
              <input
                type="number"
                step="50000"
                value={codLimit}
                onChange={(e) => setCodLimit(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Đơn vượt hạn mức này chỉ được thanh toán QR Online</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                Hạn mức ứng tiền tối đa của Shipper:
              </label>
              <input
                type="number"
                step="50000"
                value={shipperAdvanceLimit}
                onChange={(e) => setShipperAdvanceLimit(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Shipper chạm hạn mức này không được nhận thêm đơn COD</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                Thời gian SLA chuẩn cảnh báo (Phút):
              </label>
              <input
                type="number"
                value={sla}
                onChange={(e) => setSla(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Quá thời gian chuẩn sẽ gắn cờ cảnh báo SLA trên trang Admin</span>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, marginBottom: '4px' }}>
                Thời gian giữ món tại quầy (Phút):
              </label>
              <input
                type="number"
                value={canteenKeep}
                onChange={(e) => setCanteenKeep(Number(e.target.value))}
                style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
              />
              <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>Khách nhận tại quầy được giữ món tối đa theo thời gian cấu hình</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            background: '#0284c7',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.9375rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Save size={18} />
          <span>Lưu thay đổi tham số</span>
        </button>
      </form>
    </div>
  )
}
