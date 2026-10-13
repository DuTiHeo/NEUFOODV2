import {
  NeuOrder,
  OrderStatus,
  ShipperProfile,
  UserAccount,
  ComplaintTicket,
  SystemConfig,
  CampusLocation,
  NeuOrderItem,
  CustomerReview,
  CampusLocationItem,
} from '../types/neuModels'

const STORAGE_KEYS = {
  ORDERS: 'NEU_ORDERS_V1',
  USERS: 'NEU_USERS_V1',
  SHIPPERS: 'NEU_SHIPPERS_V1',
  COMPLAINTS: 'NEU_COMPLAINTS_V1',
  CONFIG: 'NEU_CONFIG_V1',
  ACTIVE_ROLE: 'NEU_ACTIVE_ROLE_V1',
  DISHES: 'CANTEEN_DISHES_OVERRIDE',
  REVIEWS: 'NEU_REVIEWS_V1',
  LOCATIONS: 'NEU_CAMPUS_LOCATIONS_V1',
  CANTEEN_AUTH: 'canteen_auth_session',
  CUSTOM_EVENT: 'neu_storage_updated',
}

export const INITIAL_CONFIG: SystemConfig = {
  shippingFeeByBuilding: {
    A1: 8000,
    A2: 7000,
    B: 9000,
    C: 9000,
    D: 10000,
  },
  standardSLAMinutes: 20,
  codMaxOrderLimit: 300000,
  shipperMaxAdvanceLimit: 500000,
  canteenKeepMinutes: 30,
  canteenConfirmTimeout: 10,
  autoAcceptToPreparing: true,
}

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user_1',
    email: 'sinhvien@neu.edu.vn',
    fullName: 'Nguyễn Văn An',
    phone: '0981234567',
    studentId: '11210001',
    role: 'customer',
    isCodBlacklisted: false,
    isActive: true,
  },
  {
    id: 'user_boom',
    email: 'boom@neu.edu.vn',
    fullName: 'Trần Văn Boom',
    phone: '0912345678',
    studentId: '11219999',
    role: 'customer',
    isCodBlacklisted: true,
    blacklistReason: 'Boom hàng đơn NEU-8921 ngày 10/10/2026',
    blacklistedAt: '2026-10-10T11:30:00.000Z',
    isActive: true,
  },
  {
    id: 'canteen_1',
    email: 'canteen.a2@neu.edu.vn',
    fullName: 'Quản lý Canteen A2',
    phone: '0903334444',
    role: 'canteen',
    isCodBlacklisted: false,
    isActive: true,
  },
  {
    id: 'shipper_user_1',
    email: 'shipper1@neu.edu.vn',
    fullName: 'Lê Hoàng Nam',
    phone: '0977888999',
    studentId: '11220002',
    role: 'shipper',
    isCodBlacklisted: false,
    isActive: true,
  },
  {
    id: 'admin_1',
    email: 'admin@neu.edu.vn',
    fullName: 'Ban Vận Hành Hệ Thống NEU',
    phone: '02438695555',
    role: 'admin',
    isCodBlacklisted: false,
    isActive: true,
  },
]

export const INITIAL_SHIPPERS: ShipperProfile[] = [
  {
    id: 'shipper_1',
    studentId: '11220002',
    fullName: 'Lê Hoàng Nam',
    phone: '0977888999',
    email: 'shipper1@neu.edu.vn',
    studentCardPhoto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    status: 'approved',
    isOnline: true,
    currentAdvanceAmount: 95000,
    activeOrdersCount: 1,
    totalEarnings: 184000,
    completedOrdersCount: 23,
  },
  {
    id: 'shipper_pending_1',
    studentId: '11220003',
    fullName: 'Phạm Minh Tuấn',
    phone: '0966555444',
    email: 'tuan.pm@neu.edu.vn',
    studentCardPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    isOnline: false,
    currentAdvanceAmount: 0,
    activeOrdersCount: 0,
    totalEarnings: 0,
    completedOrdersCount: 0,
  },
]

export const INITIAL_ORDERS: NeuOrder[] = [
  {
    id: 'ord_1',
    code: 'NEU-1001',
    customerId: 'user_1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0981234567',
    customerEmail: 'sinhvien@neu.edu.vn',
    receiveType: 'delivery',
    location: { building: 'A2', floor: 4, room: 'P402' },
    deliveryTiming: 'immediate',
    items: [
      {
        dishId: 'pho',
        name: 'Phở Bò Tái Nạm',
        price: 50000,
        qty: 1,
        note: 'Nhiều hành tây',
      },
      {
        dishId: 'tra-sua',
        name: 'Trà Sữa Trân Châu',
        price: 35000,
        qty: 1,
        note: '50% đường, ít đá',
      },
    ],
    subtotal: 85000,
    shippingFee: 7000,
    discount: 0,
    total: 92000,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'ready_for_handover',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    canteenConfirmedAt: new Date(Date.now() - 14 * 60000).toISOString(),
    readyAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: 'ord_2',
    code: 'NEU-1002',
    customerId: 'user_1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0981234567',
    customerEmail: 'sinhvien@neu.edu.vn',
    receiveType: 'at_canteen',
    deliveryTiming: 'immediate',
    items: [
      {
        dishId: 'bun-bo-hue',
        name: 'Bún Bò Huế',
        price: 55000,
        qty: 1,
      },
    ],
    subtotal: 55000,
    shippingFee: 0,
    discount: 0,
    total: 55000,
    paymentMethod: 'qr_online',
    paymentStatus: 'paid',
    status: 'awaiting_canteen',
    createdAt: new Date(Date.now() - 4 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: 'ord_3',
    code: 'NEU-1003',
    customerId: 'user_1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0981234567',
    customerEmail: 'sinhvien@neu.edu.vn',
    receiveType: 'delivery',
    location: { building: 'A1', floor: 3, room: 'P305' },
    deliveryTiming: 'immediate',
    items: [
      {
        dishId: 'com-ga',
        name: 'Cơm Gà Xối Mỡ',
        price: 45000,
        qty: 2,
      },
    ],
    subtotal: 90000,
    shippingFee: 8000,
    discount: 0,
    total: 98000,
    paymentMethod: 'qr_online',
    paymentStatus: 'paid',
    status: 'delivering',
    shipperId: 'shipper_1',
    shipperName: 'Lê Hoàng Nam',
    shipperPhone: '0977888999',
    createdAt: new Date(Date.now() - 25 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60000).toISOString(),
  },
  {
    id: 'ord_delivered_1',
    code: 'NEU-1004',
    customerId: 'user_1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0981234567',
    customerEmail: 'sinhvien@neu.edu.vn',
    receiveType: 'delivery',
    location: { building: 'A2', floor: 4, room: 'P402' },
    deliveryTiming: 'immediate',
    items: [
      {
        dishId: 'pho',
        name: 'Phở Bò Tái Nạm',
        price: 50000,
        qty: 1,
        note: 'Giao nhanh trước giờ học',
      },
      {
        dishId: 'tra-sua',
        name: 'Trà Sữa Trân Châu',
        price: 35000,
        qty: 1,
      },
    ],
    subtotal: 85000,
    shippingFee: 7000,
    discount: 0,
    total: 92000,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    status: 'delivered',
    shipperId: 'shipper_1',
    shipperName: 'Lê Hoàng Nam',
    shipperPhone: '0977888999',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'ord_cancelled_online_1',
    code: 'NEU-0995',
    customerId: 'user_1',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0981234567',
    customerEmail: 'sinhvien@neu.edu.vn',
    receiveType: 'delivery',
    location: { building: 'A1', floor: 2, room: 'P204' },
    deliveryTiming: 'immediate',
    items: [
      {
        dishId: 'pho',
        name: 'Phở Bò Tái Nạm',
        price: 50000,
        qty: 1,
      },
    ],
    subtotal: 50000,
    shippingFee: 8000,
    discount: 0,
    total: 58000,
    paymentMethod: 'qr_online',
    paymentStatus: 'paid',
    status: 'cancelled',
    cancelledBy: 'canteen',
    cancelReason: 'Canteen hết nguyên liệu làm phở bò',
    canteenRefunded: false,
    createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: 'ord_cancelled_cod_boom_1',
    code: 'NEU-0996',
    customerId: 'user_boom',
    customerName: 'Trần Văn Boom',
    customerPhone: '0912345678',
    customerEmail: 'boom@neu.edu.vn',
    receiveType: 'delivery',
    location: { building: 'B', floor: 5, room: 'P501' },
    deliveryTiming: 'immediate',
    items: [
      {
        dishId: 'com-tam',
        name: 'Cơm Tấm Sườn Bì Chả',
        price: 45000,
        qty: 2,
      },
    ],
    subtotal: 90000,
    shippingFee: 9000,
    discount: 0,
    total: 99000,
    paymentMethod: 'cod',
    paymentStatus: 'pending',
    status: 'incident',
    shipperId: 'shipper_1',
    shipperName: 'Lê Hoàng Nam',
    shipperPhone: '0977888999',
    shipperAdvancePaid: true, // Shipper đã ứng 90.000đ cho Canteen (BR-34)
    incidentReason: 'Khách không bắt máy sau 3 cuộc gọi, chờ 10 phút tại phòng 501-B không có người (Boom hàng)',
    canteenRefunded: false,
    createdAt: new Date(Date.now() - 90 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60000).toISOString(),
  },
]

export const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev_1',
    orderId: 'ord_delivered_1',
    orderCode: 'NEU-1004',
    customerName: 'Nguyễn Văn An',
    rating: 5,
    dishName: 'Phở Bò Tái Nạm',
    comment: 'Phở rất ngon, nước dùng ngọt thanh, giao nóng hổi tới tận phòng 402-A2.',
    createdAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
  {
    id: 'rev_2',
    orderId: 'ord_old_2',
    orderCode: 'NEU-0988',
    customerName: 'Trần Mai Linh',
    rating: 3,
    dishName: 'Cơm Gà Xối Mỡ',
    comment: 'Gà hơi nhiều dầu, canh đi kèm bị nguội. Mong canteen chú ý hơn trong việc đóng hộp.',
    createdAt: new Date(Date.now() - 240 * 60000).toISOString(),
    canteenReply: {
      text: 'Canteen A2 cảm ơn bạn Linh đã phản hồi thẳng thắn! Bếp đã nhắc nhở nhân viên ráo dầu kỹ hơn và chèn thêm giấy bạc giữ nhiệt cho canh.',
      repliedAt: new Date(Date.now() - 180 * 60000).toISOString(),
      repliedBy: 'Quản lý Canteen',
    },
  },
  {
    id: 'rev_3',
    orderId: 'ord_old_3',
    orderCode: 'NEU-0975',
    customerName: 'Hoàng Đức Huy',
    rating: 5,
    dishName: 'Trà Sữa Trân Châu',
    comment: 'Trà sữa đậm vị hồng trà, trân châu mềm dẻo. Shipper giao rất nhanh!',
    createdAt: new Date(Date.now() - 360 * 60000).toISOString(),
  },
]

export const INITIAL_CAMPUS_LOCATIONS: CampusLocationItem[] = [
  { id: 'loc_a1_p204', building: 'A1', floor: 2, room: 'P204', isActive: true },
  { id: 'loc_a1_p305', building: 'A1', floor: 3, room: 'P305', isActive: true },
  { id: 'loc_a2_p402', building: 'A2', floor: 4, room: 'P402', isActive: true },
  { id: 'loc_a2_p501', building: 'A2', floor: 5, room: 'P501', isActive: true },
  { id: 'loc_b_p305', building: 'B', floor: 3, room: 'P305', isActive: true },
  { id: 'loc_b_p501', building: 'B', floor: 5, room: 'P501', isActive: true },
  { id: 'loc_c_p201', building: 'C', floor: 2, room: 'P201', isActive: true },
  { id: 'loc_c_p403', building: 'C', floor: 4, room: 'P403', isActive: true },
  { id: 'loc_d_p102', building: 'D', floor: 1, room: 'P102', isActive: true },
  { id: 'loc_d_p308', building: 'D', floor: 3, room: 'P308', isActive: true },
]

export const INITIAL_COMPLAINTS: ComplaintTicket[] = [
  {
    id: 'comp_1',
    orderId: 'ord_old_1',
    orderCode: 'NEU-0992',
    customerId: 'user_1',
    customerName: 'Nguyễn Văn An',
    reasonType: 'cold_food',
    description: 'Món ăn giao tới phòng 501-A1 bị nguội lạnh, shipper giao trễ 30 phút so với giờ hẹn.',
    proofImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    status: 'pending',
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
]

class NeuMockEngine {
  constructor() {
    this.ensureInitialized()
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => {
        this.notifyListeners()
      })
    }
  }

  private ensureInitialized() {
    if (typeof window === 'undefined') return
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS))
    }
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS))
    }
    if (!localStorage.getItem(STORAGE_KEYS.SHIPPERS)) {
      localStorage.setItem(STORAGE_KEYS.SHIPPERS, JSON.stringify(INITIAL_SHIPPERS))
    }
    if (!localStorage.getItem(STORAGE_KEYS.COMPLAINTS)) {
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS))
    }
    if (!localStorage.getItem(STORAGE_KEYS.CONFIG)) {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(INITIAL_CONFIG))
    }
    if (!localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE)) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'customer')
    }
    if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS))
    }
    if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
      localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(INITIAL_CAMPUS_LOCATIONS))
    }
    if (!localStorage.getItem(STORAGE_KEYS.CANTEEN_AUTH)) {
      localStorage.setItem(
        STORAGE_KEYS.CANTEEN_AUTH,
        JSON.stringify({
          role: 'canteen_staff',
          name: 'Nhân viên Canteen A2 (Tài khoản dùng chung)',
          email: 'canteen_staff@neu.edu.vn',
        })
      )
    }
  }

  private notifyListeners() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(STORAGE_KEYS.CUSTOM_EVENT))
    }
  }

  public subscribe(callback: () => void) {
    if (typeof window === 'undefined') return () => {}
    const handler = () => callback()
    window.addEventListener(STORAGE_KEYS.CUSTOM_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(STORAGE_KEYS.CUSTOM_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }

  // --- ROLE MANAGEMENT ---
  public getActiveRole(): 'customer' | 'canteen' | 'shipper' | 'admin' {
    return (localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE) as any) || 'customer'
  }

  public setActiveRole(role: 'customer' | 'canteen' | 'shipper' | 'admin') {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role)
    this.notifyListeners()
  }

  // --- CONFIG MANAGEMENT ---
  public getConfig(): SystemConfig {
    this.ensureInitialized()
    const str = localStorage.getItem(STORAGE_KEYS.CONFIG)
    return str ? JSON.parse(str) : INITIAL_CONFIG
  }

  public updateConfig(patch: Partial<SystemConfig>): SystemConfig {
    const cur = this.getConfig()
    const updated = { ...cur, ...patch }
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(updated))
    this.notifyListeners()
    return updated
  }

  // --- USER & BLACKLIST ---
  public getUsers(): UserAccount[] {
    this.ensureInitialized()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
  }

  public getUserById(id: string): UserAccount | undefined {
    return this.getUsers().find((u) => u.id === id)
  }

  public toggleCodBlacklist(userId: string, isBlacklisted: boolean, reason?: string) {
    const users = this.getUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx !== -1) {
      users[idx].isCodBlacklisted = isBlacklisted
      users[idx].blacklistReason = isBlacklisted ? reason || 'Vi phạm chính sách nhận hàng COD' : undefined
      users[idx].blacklistedAt = isBlacklisted ? new Date().toISOString() : undefined
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      this.notifyListeners()
    }
  }

  // --- ORDER MANAGEMENT ---
  public getOrders(): NeuOrder[] {
    this.ensureInitialized()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]')
  }

  public getOrderById(id: string): NeuOrder | undefined {
    return this.getOrders().find((o) => o.id === id || o.code === id)
  }

  public saveOrders(orders: NeuOrder[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders))
    this.notifyListeners()
  }

  public createOrder(params: {
    customerId: string
    receiveType: 'at_canteen' | 'delivery'
    location?: CampusLocation
    deliveryTiming: 'immediate' | 'scheduled'
    scheduledTime?: string
    items: NeuOrderItem[]
    paymentMethod: 'qr_online' | 'cod'
    note?: string
  }): NeuOrder {
    const config = this.getConfig()
    const user = this.getUserById(params.customerId) || this.getUsers()[0]

    // Validate COD restrictions
    if (params.paymentMethod === 'cod') {
      if (user.isCodBlacklisted) {
        throw new Error('Tài khoản của bạn đang bị khóa tính năng COD do từng vi phạm nhận hàng.')
      }
      if (params.receiveType === 'at_canteen') {
        throw new Error('Đơn nhận tại quầy chỉ áp dụng thanh toán Online.')
      }
    }

    const subtotal = params.items.reduce((s, it) => s + it.price * it.qty, 0)
    let shippingFee = 0
    if (params.receiveType === 'delivery' && params.location) {
      shippingFee = config.shippingFeeByBuilding[params.location.building] || 8000
    }
    const total = subtotal + shippingFee

    if (params.paymentMethod === 'cod' && total > config.codMaxOrderLimit) {
      throw new Error(`Đơn hàng COD không được vượt quá hạn mức ${config.codMaxOrderLimit.toLocaleString()}đ.`)
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const newOrder: NeuOrder = {
      id: `ord_${Date.now()}`,
      code: `NEU-${randomSuffix}`,
      customerId: user.id,
      customerName: user.fullName,
      customerPhone: user.phone,
      customerEmail: user.email,
      receiveType: params.receiveType,
      location: params.location,
      deliveryTiming: params.deliveryTiming,
      scheduledTime: params.scheduledTime,
      items: params.items,
      subtotal,
      shippingFee,
      discount: 0,
      total,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'qr_online' ? 'paid' : 'pending',
      qrExpiresAt: params.paymentMethod === 'qr_online' ? Date.now() + 2 * 60000 : undefined,
      // UC22: Nếu Canteen bật chế độ Tự động chuẩn bị -> Chuyển thẳng sang 'preparing' (vào bếp ngay), không cần bấm duyệt
      status: config.autoAcceptToPreparing !== false ? 'preparing' : 'awaiting_canteen',
      canteenConfirmedAt: config.autoAcceptToPreparing !== false ? new Date().toISOString() : undefined,
      note: params.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const currentOrders = this.getOrders()
    this.saveOrders([newOrder, ...currentOrders])
    return newOrder
  }

  // --- CANTEEN ACTIONS ---
  public canteenConfirmOrder(orderId: string, accept: boolean, reason?: string, autoPrepare: boolean = true) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return
    if (accept) {
      ord.status = autoPrepare ? 'preparing' : 'confirmed'
      ord.canteenConfirmedAt = new Date().toISOString()
    } else {
      ord.status = 'cancelled'
      ord.cancelReason = reason || 'Canteen từ chối tiếp nhận (quá tải hoặc hết nguyên liệu)'
      ord.cancelledBy = 'canteen'
      if (ord.paymentMethod === 'qr_online') ord.paymentStatus = 'refunded'
    }
    ord.updatedAt = new Date().toISOString()
    this.saveOrders(orders)
  }

  public canteenStartPreparing(orderId: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return
    ord.status = 'preparing'
    ord.updatedAt = new Date().toISOString()
    this.saveOrders(orders)
  }

  public canteenFinishPreparing(orderId: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return
    ord.status = 'ready_for_handover'
    ord.readyAt = new Date().toISOString()
    ord.updatedAt = new Date().toISOString()
    this.saveOrders(orders)
  }

  public canteenHandoverToCustomer(orderId: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord || ord.receiveType !== 'at_canteen') return
    ord.status = 'completed'
    ord.updatedAt = new Date().toISOString()
    this.saveOrders(orders)
  }

  public canteenHandoverToShipper(orderId: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return
    if (ord.paymentMethod === 'cod') {
      ord.shipperAdvancePaid = true // Canteen đã thu tiền món từ shipper
    }
    ord.status = 'picked_up'
    ord.updatedAt = new Date().toISOString()
    this.saveOrders(orders)
  }

  // --- SHIPPER ACTIONS ---
  public getShippers(): ShipperProfile[] {
    this.ensureInitialized()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SHIPPERS) || '[]')
  }

  public getShipperById(id: string): ShipperProfile | undefined {
    return this.getShippers().find((s) => s.id === id)
  }

  public saveShippers(shippers: ShipperProfile[]) {
    localStorage.setItem(STORAGE_KEYS.SHIPPERS, JSON.stringify(shippers))
    this.notifyListeners()
  }

  public toggleShipperOnline(shipperId: string, isOnline: boolean) {
    const list = this.getShippers()
    const s = list.find((it) => it.id === shipperId)
    if (s) {
      s.isOnline = isOnline
      this.saveShippers(list)
    }
  }

  public shipperAcceptOrder(orderId: string, shipperId: string) {
    const shippers = this.getShippers()
    const s = shippers.find((it) => it.id === shipperId)
    if (!s) throw new Error('Không tìm thấy tài xế.')
    if (!s.isOnline) throw new Error('Bạn cần bật trạng thái Sẵn sàng nhận đơn.')
    if (s.activeOrdersCount >= 5) throw new Error('Bạn đang giao tối đa 5 đơn cùng lúc.')

    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) throw new Error('Đơn hàng không tồn tại.')
    if (ord.status !== 'ready_for_handover') throw new Error('Đơn đã được tài xế khác nhận.')

    const config = this.getConfig()
    if (ord.paymentMethod === 'cod') {
      if (s.currentAdvanceAmount + ord.subtotal > config.shipperMaxAdvanceLimit) {
        throw new Error(`Đơn này vượt quá hạn mức ứng tiền còn lại (${config.shipperMaxAdvanceLimit.toLocaleString()}đ).`)
      }
      s.currentAdvanceAmount += ord.subtotal
    }

    s.activeOrdersCount += 1
    ord.status = 'shipper_assigned'
    ord.shipperId = s.id
    ord.shipperName = s.fullName
    ord.shipperPhone = s.phone
    ord.updatedAt = new Date().toISOString()

    this.saveShippers(shippers)
    this.saveOrders(orders)
  }

  public shipperMarkPickedUp(orderId: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return
    ord.status = 'delivering'
    ord.updatedAt = new Date().toISOString()
    this.saveOrders(orders)
  }

  public shipperCompleteDelivery(orderId: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return

    ord.status = 'delivered'
    if (ord.paymentMethod === 'cod') {
      ord.cashCollected = true
      ord.paymentStatus = 'paid'
    }
    ord.updatedAt = new Date().toISOString()

    // Free shipper advance & update earnings
    if (ord.shipperId) {
      const shippers = this.getShippers()
      const s = shippers.find((it) => it.id === ord.shipperId)
      if (s) {
        if (ord.paymentMethod === 'cod') {
          s.currentAdvanceAmount = Math.max(0, s.currentAdvanceAmount - ord.subtotal)
        }
        s.activeOrdersCount = Math.max(0, s.activeOrdersCount - 1)
        s.completedOrdersCount += 1
        s.totalEarnings += ord.shippingFee
        this.saveShippers(shippers)
      }
    }

    this.saveOrders(orders)
  }

  public shipperReportIncident(orderId: string, reason: string, proofUrl?: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return

    ord.status = 'incident'
    ord.incidentReason = reason
    ord.incidentProof = proofUrl || 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=80'
    ord.updatedAt = new Date().toISOString()

    // If COD boom, put customer to blacklist immediately (BR-36)
    if (ord.paymentMethod === 'cod') {
      this.toggleCodBlacklist(ord.customerId, true, `Boom hàng đơn COD ${ord.code}: ${reason}`)
    }

    // Free shipper advance limit
    if (ord.shipperId) {
      const shippers = this.getShippers()
      const s = shippers.find((it) => it.id === ord.shipperId)
      if (s) {
        if (ord.paymentMethod === 'cod') {
          s.currentAdvanceAmount = Math.max(0, s.currentAdvanceAmount - ord.subtotal)
        }
        s.activeOrdersCount = Math.max(0, s.activeOrdersCount - 1)
        this.saveShippers(shippers)
      }
    }

    this.saveOrders(orders)
  }

  // --- CUSTOMER ACTIONS ---
  public customerCancelOrder(orderId: string, reason?: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return

    // BR-16: Chỉ được hủy khi Canteen chưa chuẩn bị
    if (!['created', 'awaiting_payment', 'awaiting_canteen', 'confirmed'].includes(ord.status)) {
      throw new Error('Không thể hủy vì nhà bếp đã bắt đầu chuẩn bị món.')
    }

    ord.status = 'cancelled'
    ord.cancelReason = reason || 'Khách hàng yêu cầu hủy đơn'
    ord.cancelledBy = 'customer'
    if (ord.paymentMethod === 'qr_online') ord.paymentStatus = 'refunded'
    ord.updatedAt = new Date().toISOString()

    this.saveOrders(orders)
  }

  public customerConfirmReceived(orderId: string) {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) return
    ord.status = 'completed'
    ord.updatedAt = new Date().toISOString()
    this.saveOrders(orders)
  }

  // --- COMPLAINTS & TICKETS ---
  public getComplaints(): ComplaintTicket[] {
    this.ensureInitialized()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COMPLAINTS) || '[]')
  }

  public saveComplaints(complaints: ComplaintTicket[]) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints))
    this.notifyListeners()
  }

  public submitComplaint(params: {
    orderId: string
    reasonType: 'missing_dish' | 'wrong_dish' | 'cold_food' | 'shipper_attitude' | 'other'
    description: string
    proofImage?: string
  }) {
    const ord = this.getOrderById(params.orderId)
    if (!ord) throw new Error('Không tìm thấy đơn hàng.')

    const newTicket: ComplaintTicket = {
      id: `comp_${Date.now()}`,
      orderId: ord.id,
      orderCode: ord.code,
      customerId: ord.customerId,
      customerName: ord.customerName,
      reasonType: params.reasonType,
      description: params.description,
      proofImage: params.proofImage,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    ord.hasComplaint = true
    this.saveOrders(this.getOrders())

    const list = this.getComplaints()
    this.saveComplaints([newTicket, ...list])
    return newTicket
  }

  public resolveComplaint(complaintId: string, decision: 'resolved_canteen_fault' | 'resolved_shipper_fault' | 'rejected', resolutionNote: string, refundAmount?: number) {
    const list = this.getComplaints()
    const ticket = list.find((t) => t.id === complaintId)
    if (!ticket) return

    ticket.status = decision
    ticket.resolutionNote = resolutionNote
    ticket.refundAmount = refundAmount || 0
    ticket.resolvedAt = new Date().toISOString()

    this.saveComplaints(list)
  }

  // --- ADMIN SHIPPER APPROVAL ---
  public approveShipper(shipperId: string, isApproved: boolean, rejectionReason?: string) {
    const list = this.getShippers()
    const s = list.find((it) => it.id === shipperId)
    if (!s) return

    s.status = isApproved ? 'approved' : 'rejected'
    s.rejectionReason = isApproved ? undefined : rejectionReason
    this.saveShippers(list)
  }

  // --- DISH AVAILABILITY (UC06, BR-05, BR-06) ---
  public getDishes(): any[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DISHES)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {
        /* ignore */
      }
    }
    return []
  }

  public updateDishAvailability(dishId: string, isAvailable: boolean) {
    const dishes = this.getDishes()
    const updated = dishes.map((d: any) =>
      d.id === dishId ? { ...d, isAvailable } : d
    )
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(updated))
    this.notifyListeners()
  }

  public isDishAvailable(dishId: string): boolean {
    const dishes = this.getDishes()
    const match = dishes.find((d: any) => d.id === dishId)
    if (!match) return true
    return match.isAvailable !== false
  }

  // --- USER PROFILE (UC04, BR-01, BR-02, BR-28) ---
  public getUserProfile(userId: string = 'user_1'): UserAccount | undefined {
    return this.getUsers().find((u) => u.id === userId)
  }

  public updateUserProfile(userId: string, data: Partial<UserAccount>) {
    const users = this.getUsers()
    const idx = users.findIndex((u) => u.id === userId)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...data }
      this.saveUsers(users)
    }
  }

  // --- CANTEEN AUTH (UC02, UC03) ---
  public getCanteenSession(): { role: 'canteen_staff' | 'canteen_manager'; name: string; email: string } {
    this.ensureInitialized()
    const raw = localStorage.getItem(STORAGE_KEYS.CANTEEN_AUTH)
    if (raw) {
      try {
        return JSON.parse(raw)
      } catch {}
    }
    return {
      role: 'canteen_staff',
      name: 'Nhân viên Canteen A2 (Tài khoản dùng chung)',
      email: 'canteen_staff@neu.edu.vn',
    }
  }

  public loginCanteen(role: 'canteen_staff' | 'canteen_manager', name?: string, email?: string) {
    const session = {
      role,
      name: name || (role === 'canteen_manager' ? 'Quản lý Trưởng Canteen A2' : 'Nhân viên Canteen A2 (Tài khoản dùng chung)'),
      email: email || (role === 'canteen_manager' ? 'canteen_manager@neu.edu.vn' : 'canteen_staff@neu.edu.vn'),
    }
    localStorage.setItem(STORAGE_KEYS.CANTEEN_AUTH, JSON.stringify(session))
    this.notifyListeners()
    return session
  }

  public logoutCanteen() {
    localStorage.removeItem(STORAGE_KEYS.CANTEEN_AUTH)
    this.notifyListeners()
  }

  // --- CANTEEN MENU MANAGEMENT (UC19, BR-06, EX-06, EX-28) ---
  public addDish(dish: {
    name: string
    categoryIds: string[]
    price: number
    shortDescription: string
    description?: string
    image?: string
  }) {
    const list = this.getDishes()
    const newDish = {
      id: `dish_${Date.now()}`,
      name: dish.name,
      categoryIds: dish.categoryIds.length > 0 ? dish.categoryIds : ['mon-chinh'],
      price: dish.price,
      shortDescription: dish.shortDescription,
      description: dish.description || dish.shortDescription,
      image: dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
      isAvailable: true,
      isHidden: false,
      rating: 5.0,
      reviewCount: 0,
    }
    const updated = [newDish, ...list]
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(updated))
    this.notifyListeners()
    return newDish
  }

  public updateDish(dishId: string, data: any) {
    const list = this.getDishes()
    const updated = list.map((d: any) =>
      d.id === dishId ? { ...d, ...data } : d
    )
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(updated))
    this.notifyListeners()
  }

  public toggleDishHidden(dishId: string) {
    // BR-06: Món đã từng có đơn chỉ được ẩn, không xóa cứng (EX-06)
    const list = this.getDishes()
    const updated = list.map((d: any) =>
      d.id === dishId ? { ...d, isHidden: !d.isHidden } : d
    )
    localStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(updated))
    this.notifyListeners()
  }

  // --- CANTEEN REFUNDS (UC24, BR-17, BR-36, BR-37) ---
  public refundCancelledOrder(orderId: string, refundType: 'online_customer_refund' | 'cod_shipper_advance_refund') {
    const orders = this.getOrders()
    const ord = orders.find((o) => o.id === orderId)
    if (!ord) throw new Error('Không tìm thấy đơn hàng cần xử lý hoàn tiền.')

    ord.canteenRefunded = true
    ord.canteenRefundType = refundType
    ord.canteenRefundedAt = new Date().toISOString()

    if (refundType === 'online_customer_refund') {
      ord.paymentStatus = 'refunded'
    } else if (refundType === 'cod_shipper_advance_refund') {
      // BR-36, BR-37: Hoàn lại tiền shipper đã ứng cho Canteen
      if (ord.shipperId) {
        const shippers = this.getShippers()
        const s = shippers.find((it) => it.id === ord.shipperId)
        if (s) {
          s.currentAdvanceAmount = Math.max(0, s.currentAdvanceAmount - ord.subtotal)
          s.totalEarnings += ord.shippingFee // Đảm bảo quyền lợi shipper khi khách boom hàng
          this.saveShippers(shippers)
        }
      }
    }

    this.saveOrders(orders)
  }

  // --- REVIEWS & FEEDBACK (UC26, BR-24, BR-28) ---
  public getReviews(): CustomerReview[] {
    this.ensureInitialized()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS) || '[]')
  }

  public replyReview(reviewId: string, replyText: string, replierRole: string = 'Quản lý Canteen') {
    const reviews = this.getReviews()
    const rev = reviews.find((r) => r.id === reviewId)
    if (!rev) throw new Error('Không tìm thấy đánh giá của khách hàng.')

    rev.canteenReply = {
      text: replyText.trim(),
      repliedAt: new Date().toISOString(),
      repliedBy: replierRole,
    }
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews))
    this.notifyListeners()
  }

  // --- SHIPPER REGISTRATION (UC27, BR-01, BR-03, BR-04, EX-04) ---
  public registerShipper(params: {
    fullName: string
    studentId: string
    email: string
    phone: string
    studentCardPhoto: string
    vehiclePlate?: string
  }): ShipperProfile {
    const shippers = this.getShippers()
    // Kiểm tra xem mã SV đã có trong danh sách chưa
    const existing = shippers.find((s) => s.studentId === params.studentId)
    if (existing && existing.status === 'approved') {
      throw new Error('Sinh viên với Mã SV này đã là Shipper được phê duyệt của hệ thống.')
    }

    const newShipper: ShipperProfile = {
      id: `shipper_${Date.now()}`,
      studentId: params.studentId,
      fullName: params.fullName,
      phone: params.phone,
      email: params.email,
      studentCardPhoto: params.studentCardPhoto || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600',
      status: 'pending',
      isOnline: false,
      currentAdvanceAmount: 0,
      activeOrdersCount: 0,
      totalEarnings: 0,
      completedOrdersCount: 0,
    }

    const updated = [newShipper, ...shippers.filter((s) => s.studentId !== params.studentId)]
    this.saveShippers(updated)
    return newShipper
  }

  public updateShipperProfile(shipperId: string, data: Partial<ShipperProfile>) {
    const list = this.getShippers()
    const idx = list.findIndex((s) => s.id === shipperId)
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data }
      this.saveShippers(list)
    }
  }

  // --- CAMPUS LOCATIONS (UC36, BR-08, BR-09, BR-10, BR-27, EX-06, EX-10) ---
  public getCampusLocations(): CampusLocationItem[] {
    this.ensureInitialized()
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LOCATIONS) || '[]')
  }

  public toggleLocationStatus(locationId: string, isActive: boolean) {
    const list = this.getCampusLocations()
    const loc = list.find((l) => l.id === locationId)
    if (!loc) return

    // BR-10, EX-06: Nếu đang có đơn dở tại địa điểm này thì chỉ vô hiệu hóa
    loc.isActive = isActive
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(list))
    this.notifyListeners()
  }

  public addCampusLocation(loc: { building: 'A1' | 'A2' | 'B' | 'C' | 'D'; floor: number; room: string }) {
    const list = this.getCampusLocations()
    const newLoc: CampusLocationItem = {
      id: `loc_${loc.building.toLowerCase()}_p${loc.room.replace(/\D/g, '') || Date.now()}`,
      building: loc.building,
      floor: loc.floor,
      room: loc.room,
      isActive: true,
    }
    const updated = [...list, newLoc]
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(updated))
    this.notifyListeners()
    return newLoc
  }

  // --- RESET ALL DATA ---
  public resetAllToSeed() {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS))
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS))
    localStorage.setItem(STORAGE_KEYS.SHIPPERS, JSON.stringify(INITIAL_SHIPPERS))
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS))
    localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(INITIAL_CONFIG))
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, 'customer')
    localStorage.removeItem(STORAGE_KEYS.DISHES)
    this.notifyListeners()
  }
}

export const mockEngine = new NeuMockEngine()
