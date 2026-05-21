import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AppRoutes from './routes/AppRoutes'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" />
      <AppRoutes />
    </BrowserRouter>
  )
}

export default App