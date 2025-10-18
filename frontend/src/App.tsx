import { Route, Routes } from 'react-router-dom'
import './App.css'
import MatchPage from './pages/MatchPage/MatchPage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MatchPage />} />
    </Routes>
  )
}

export default App
