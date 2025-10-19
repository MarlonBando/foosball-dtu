import { Route, Routes } from 'react-router-dom'
import './App.css'
import MatchPage from './pages/MatchPage/MatchPage.tsx'
import LoginPage from './pages/LoginPage/LoginPage.tsx';
import SignupPage from './pages/SignupPage/SignupPage.tsx';
import HomePage from './pages/HomePage/HomePage.tsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/match" element={<MatchPage />} />
    </Routes>
  )
}

export default App
