// ===== src/App.tsx =====
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Layout } from '@/components/layout/Layout'
import { Home } from '@/pages/Home'
import { Search } from '@/pages/Search'
import { Details } from '@/pages/Details'
import { Watchlist } from '@/pages/Watchlist'
import { Trending } from '@/pages/Trending'
import { ROUTES } from '@/constants/routes'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <Layout>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.SEARCH} element={<Search />} />
              <Route path={ROUTES.MOVIE} element={<Details />} />
              <Route path={ROUTES.WATCHLIST} element={<Watchlist />} />
              <Route path={ROUTES.TRENDING} element={<Trending />} />
              {/* Catch all route - redirect to home */}
              <Route path="*" element={<Home />} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </ErrorBoundary>
  )
}

export default App