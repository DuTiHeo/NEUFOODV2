import { useEffect, useState } from 'react'
import { mockEngine } from '../services/mockEngine'
import {
  NeuOrder,
  ShipperProfile,
  UserAccount,
  ComplaintTicket,
  SystemConfig,
  CustomerReview,
  CampusLocationItem,
} from '../types/neuModels'

export function useNeuEngine() {
  const [orders, setOrders] = useState<NeuOrder[]>(() => mockEngine.getOrders())
  const [shippers, setShippers] = useState<ShipperProfile[]>(() => mockEngine.getShippers())
  const [users, setUsers] = useState<UserAccount[]>(() => mockEngine.getUsers())
  const [complaints, setComplaints] = useState<ComplaintTicket[]>(() => mockEngine.getComplaints())
  const [config, setConfig] = useState<SystemConfig>(() => mockEngine.getConfig())
  const [activeRole, setActiveRoleState] = useState(() => mockEngine.getActiveRole())
  const [canteenSession, setCanteenSession] = useState(() => mockEngine.getCanteenSession())
  const [reviews, setReviews] = useState<CustomerReview[]>(() => mockEngine.getReviews())
  const [campusLocations, setCampusLocations] = useState<CampusLocationItem[]>(() => mockEngine.getCampusLocations())
  const [dishes, setDishes] = useState<any[]>(() => mockEngine.getDishes())

  useEffect(() => {
    const unsubscribe = mockEngine.subscribe(() => {
      setOrders(mockEngine.getOrders())
      setShippers(mockEngine.getShippers())
      setUsers(mockEngine.getUsers())
      setComplaints(mockEngine.getComplaints())
      setConfig(mockEngine.getConfig())
      setActiveRoleState(mockEngine.getActiveRole())
      setCanteenSession(mockEngine.getCanteenSession())
      setReviews(mockEngine.getReviews())
      setCampusLocations(mockEngine.getCampusLocations())
      setDishes(mockEngine.getDishes())
    })
    return unsubscribe
  }, [])

  return {
    orders,
    shippers,
    users,
    complaints,
    config,
    activeRole,
    canteenSession,
    reviews,
    campusLocations,
    dishes,
    setActiveRole: (role: 'customer' | 'canteen' | 'shipper' | 'admin') => {
      mockEngine.setActiveRole(role)
    },
    // Engine methods directly accessible
    createOrder: mockEngine.createOrder.bind(mockEngine),
    canteenConfirmOrder: mockEngine.canteenConfirmOrder.bind(mockEngine),
    canteenStartPreparing: mockEngine.canteenStartPreparing.bind(mockEngine),
    canteenFinishPreparing: mockEngine.canteenFinishPreparing.bind(mockEngine),
    canteenHandoverToShipper: mockEngine.canteenHandoverToShipper.bind(mockEngine),
    canteenHandoverToCustomer: mockEngine.canteenHandoverToCustomer.bind(mockEngine),
    shipperAcceptOrder: mockEngine.shipperAcceptOrder.bind(mockEngine),
    shipperMarkPickedUp: mockEngine.shipperMarkPickedUp.bind(mockEngine),
    shipperCompleteDelivery: mockEngine.shipperCompleteDelivery.bind(mockEngine),
    shipperReportIncident: mockEngine.shipperReportIncident.bind(mockEngine),
    toggleShipperOnline: mockEngine.toggleShipperOnline.bind(mockEngine),
    customerCancelOrder: mockEngine.customerCancelOrder.bind(mockEngine),
    customerConfirmReceived: mockEngine.customerConfirmReceived.bind(mockEngine),
    submitComplaint: mockEngine.submitComplaint.bind(mockEngine),
    resolveComplaint: mockEngine.resolveComplaint.bind(mockEngine),
    approveShipper: mockEngine.approveShipper.bind(mockEngine),
    toggleCodBlacklist: mockEngine.toggleCodBlacklist.bind(mockEngine),
    updateConfig: mockEngine.updateConfig.bind(mockEngine),
    resetAllToSeed: mockEngine.resetAllToSeed.bind(mockEngine),
    // Canteen Auth & Features
    loginCanteen: mockEngine.loginCanteen.bind(mockEngine),
    logoutCanteen: mockEngine.logoutCanteen.bind(mockEngine),
    addDish: mockEngine.addDish.bind(mockEngine),
    updateDish: mockEngine.updateDish.bind(mockEngine),
    toggleDishHidden: mockEngine.toggleDishHidden.bind(mockEngine),
    refundCancelledOrder: mockEngine.refundCancelledOrder.bind(mockEngine),
    replyReview: mockEngine.replyReview.bind(mockEngine),
    // Shipper Registration & Profile
    registerShipper: mockEngine.registerShipper.bind(mockEngine),
    updateShipperProfile: mockEngine.updateShipperProfile.bind(mockEngine),
    // Locations
    toggleLocationStatus: mockEngine.toggleLocationStatus.bind(mockEngine),
    addCampusLocation: mockEngine.addCampusLocation.bind(mockEngine),
  }
}
