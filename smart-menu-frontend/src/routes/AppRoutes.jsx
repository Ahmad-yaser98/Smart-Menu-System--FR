import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import Login from '../pages/Login'
import MainLayout from '../layouts/MainLayout'
import Dashboard from '../pages/admin/Dashboard'
import Tables from '../pages/admin/Tables'
import Menu from '../pages/admin/Menu'
import Staff from '../pages/admin/Staff'
import WaiterTables from '../pages/waiter/Tables'
import NewOrder from '../pages/waiter/NewOrder'
import WaiterOrders from '../pages/waiter/Orders'
import KitchenOrders from '../pages/kitchen/KitchenOrders'
import CashierOrders from '../pages/cashier/CashierOrders'
import NotFound from '../pages/NotFound'
import Unauthorized from '../pages/Unauthorized'
import Invoices from '../pages/cashier/Invoices'
import Landing from '../pages/Landing'
import PublicMenu from '../pages/PublicMenu'
import QRCodePage from '../pages/admin/QRCode'

const W = ({ children, roles }) => (
  <ProtectedRoute allowedRoles={roles}>
    <MainLayout>{children}</MainLayout>
  </ProtectedRoute>
)

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

       <Route path="/landing" element={<Landing />} />
       <Route path="/menu" element={<PublicMenu />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<W roles={['admin']}><Dashboard /></W>} />
      <Route path="/admin/tables"    element={<W roles={['admin']}><Tables /></W>} />
      <Route path="/admin/menu"      element={<W roles={['admin']}><Menu /></W>} />
      <Route path="/admin/staff"     element={<W roles={['admin']}><Staff /></W>} />
      <Route path="/admin/qr" element={<W roles={['admin']}><QRCodePage /></W>} />

      {/* Waiter */}
      <Route path="/waiter/tables"     element={<W roles={['waiter','admin']}><WaiterTables /></W>} />
      <Route path="/waiter/orders/new" element={<W roles={['waiter','admin']}><NewOrder /></W>} />
      <Route path="/waiter/orders"     element={<W roles={['waiter','admin']}><WaiterOrders /></W>} />

      {/* Kitchen */}
      <Route path="/kitchen/orders" element={<W roles={['kitchen','admin']}><KitchenOrders /></W>} />

      {/* Cashier */}
      <Route path="/cashier/orders"   element={<W roles={['cashier','admin']}><CashierOrders /></W>} />
      <Route path="/cashier/invoices" element={<W roles={['cashier','admin']}><Invoices /></W>} />

      {/* Errors */}
      <Route path="/403" element={<Unauthorized />} />
      <Route path="*"    element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes