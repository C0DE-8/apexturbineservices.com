import Home from './pages/home/Home.jsx'
import NotFound from './pages/not-found/NotFound.jsx'

function App() {
  const isHome = window.location.pathname === '/' || window.location.pathname === '/index.html'
  return isHome ? <Home /> : <NotFound />
}

export default App
