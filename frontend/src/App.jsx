// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageMenu from './pages/ManageMenu';
import Menu from './pages/Menu'; 
import Profile from './pages/Profile';
import HistoryOrder from './pages/HistoryOrder';
import BackgroundMusic from './components/BackgroundMusic';


function App() {
  return (
    <Router>
      <BackgroundMusic />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage-menu" element={<ManageMenu />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/history-order" element={<HistoryOrder />} />
        <Route path="/menu" element={<Menu />} /> 
      </Routes>
    </Router>
  );
}

export default App;