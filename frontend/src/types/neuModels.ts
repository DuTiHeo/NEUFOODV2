/**
 * NEU Food - Centralized Domain Types
 * Based on Business Requirements (BR01 - BR37) & Use Cases (UC01 - UC43)
 */

export type OrderStatus =
  | 'created'                // Khởi tạo
  | 'awaiting_payment'       // Chờ thanh toán (QR Online)
  | 'awaiting_canteen'       // Chờ Canteen xác nhận (BR-15: 10 phút)
  | 'confirmed'              // Đã xác nhận
  | 'preparing'              // Đang chuẩn bị món
  | 'ready_for_handover'     // Sẵn sàng bàn giao (báo cho shipper hoặc khách nhận quầy)
  | 'shipper_assigned'       // Đã có Shipper nhận đơn
  | 'picked_up'              // Shipper đã lấy món tại Canteen (đã ứng tiền nếu COD)
  | 'delivering'             // Đang giao tới phòng học
  | 'delivered'              // Đã giao tới nơi / Thu tiền COD
  | 'completed'              // Hoàn thành đơn hàng
  | 'cancelled'              // Đơn đã hủy
  | 'incident'               // Sự cố giao hàng (Boom hàng, không liên lạc được)

export type ReceiveType = 'at_canteen' | 'delivery'
export type PaymentMethod = 'qr_online' | 'cod'

export interface CampusLocation {
  building: 'A1' | 'A2' | 'B' | 'C' | 'D'
  floor: number
  room: string
}

export interface NeuOrderItem {
  dishId: string
  name: string
  price: number
  qty: number
  image?: string
  note?: string
}

export interface NeuOrder {
  id: string
  code: string // VD: NEU-8492
  customerId: string
  customerName: string
  customerPhone: string
  customerEmail: string

  receiveType: ReceiveType
  location?: CampusLocation
  deliveryTiming: 'immediate' | 'scheduled'
  scheduledTime?: string

  items: NeuOrderItem[]
  subtotal: number
  shippingFee: number
  discount: number
  total: number

  paymentMethod: PaymentMethod
  paymentStatus: 'pending' | 'paid' | 'refunded'
  qrExpiresAt?: number // timestamp (2 phút theo BR-14)

  status: OrderStatus
  note?: string

  createdAt: string
  updatedAt: string
  canteenConfirmedAt?: string
  readyAt?: string

  // Shipper handling
  shipperId?: string
  shipperName?: string
  shipperPhone?: string
  shipperAdvancePaid?: boolean // Shipper đã ứng tiền món cho Canteen (BR-34)
  cashCollected?: boolean      // Shipper đã thu tiền mặt từ khách (BR-34)

  cancelReason?: string
  cancelledBy?: 'customer' | 'canteen' | 'system'

  // Incident & Complaint
  incidentReason?: string
  incidentProof?: string
  hasComplaint?: boolean

  // Canteen Refund (UC24, BR-17, BR-36, BR-37)
  canteenRefunded?: boolean
  canteenRefundType?: 'online_customer_refund' | 'cod_shipper_advance_refund'
  canteenRefundedAt?: string
}

export interface ShipperProfile {
  id: string
  studentId: string
  fullName: string
  phone: string
  email: string
  studentCardPhoto: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
  isOnline: boolean              // Bật/tắt sẵn sàng nhận đơn (BR-20)
  currentAdvanceAmount: number   // Tiền ứng hiện tại (Max 500k theo BR-35)
  activeOrdersCount: number      // Đơn đang giao (Max 5 theo BR-19)
  totalEarnings: number          // Tổng thu nhập tích lũy
  completedOrdersCount: number
}

export interface UserAccount {
  id: string
  email: string
  fullName: string
  phone: string
  studentId?: string
  role: 'customer' | 'canteen' | 'shipper' | 'admin'
  isCodBlacklisted: boolean      // Bị khóa COD do boom hàng (BR-32, BR-36)
  blacklistReason?: string
  blacklistedAt?: string
  isActive: boolean
}

export interface ComplaintTicket {
  id: string
  orderId: string
  orderCode: string
  customerId: string
  customerName: string
  reasonType: 'missing_dish' | 'wrong_dish' | 'cold_food' | 'shipper_attitude' | 'other'
  description: string
  proofImage?: string
  status: 'pending' | 'resolved_canteen_fault' | 'resolved_shipper_fault' | 'rejected'
  resolutionNote?: string
  refundAmount?: number
  createdAt: string
  resolvedAt?: string
}

export interface SystemConfig {
  shippingFeeByBuilding: Record<string, number>
  standardSLAMinutes: number      // 20p cảnh báo (BR-23)
  codMaxOrderLimit: number        // 300.000đ (BR-33)
  shipperMaxAdvanceLimit: number  // 500.000đ (BR-35)
  canteenKeepMinutes: number      // 30p quầy giữ (BR-31)
  canteenConfirmTimeout: number   // 10p xác nhận (BR-15)
  autoAcceptToPreparing?: boolean // Tự động vào bếp khi khách đặt đơn (UC22)
}

export interface CustomerReview {
  id: string
  orderId: string
  orderCode: string
  customerName: string
  rating: number // 1 - 5
  dishName: string
  comment: string
  createdAt: string
  canteenReply?: {
    text: string
    repliedAt: string
    repliedBy: string // 'Nhân viên Canteen' | 'Quản lý Canteen'
  }
}

export interface CampusLocationItem {
  id: string
  building: 'A1' | 'A2' | 'B' | 'C' | 'D'
  floor: number
  room: string
  isActive: boolean
}
