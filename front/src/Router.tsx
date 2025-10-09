import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home'
import { Payment } from './pages/Payment'

export function Router() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/payment/:planId" element={<Payment />} />
    </Routes>
  )
}
