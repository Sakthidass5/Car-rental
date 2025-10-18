import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';

import Login from './pages/Login';
import Register from './pages/Register';
import CarList from './pages/CarList';
import Dashboard from './pages/Dashboard';
import BookingForm from './components/BookingForm';

import './index.css';

function App() {
  const { user } = useAuth();
  console.log('User info:', user);
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars" element={<CarList />} />
        <Route
          path="/dashboard"
          element={user?.role === 'admin' ? <Dashboard /> : <Navigate to="/" />}
        />

        <Route
          path="/book"
          element={user ? <BookingForm /> : <Navigate to="/" />}
        />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
