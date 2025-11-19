// ========================================================================================
// App компонент, настройка рутинга с react-router-dom
// ========================================================================================

import { Route, Routes, Navigate } from 'react-router-dom'
import Ads from './pages/ads/Ads'
import AdCard from './pages/adCard/AdCard'
import Stats from './pages/stats/Stats'
import Header from './components/Header'

export default function App() {
  return (
    <div className="container">
      <header className="topbar">
        <Header />
      </header>

      <main>
        <Routes>
          <Route path="/list"     element={<Ads />} />
          <Route path="/item/:id" element={<AdCard />} />
          <Route path="/stats"    element={<Stats />} />
          <Route path="/"         element={<Navigate to="/list" replace />} />
          <Route path="*"         element={<div>404</div>} />
        </Routes>
      </main>
    </div>
  )
}
