// frontend/src/pages/Login.jsx
import { useState } from 'react';
import axios from 'axios';
import { Pizza, Lock, User } from 'lucide-react'; 
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });

      // Simpan token & data user
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert('Login Berhasil!');

      // REVISI: Semua user masuk ke Dashboard dulu
      navigate('/dashboard'); 
      
      // ... (catch error tetap sama)
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login Gagal');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#e11d48' }}>
            <Pizza size={48} />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Pizzeria Login</h2>
        
        {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '0.9rem' }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '0.5rem' }}>
                <User size={18} color="#888" style={{ marginRight: '0.5rem' }}/>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pizzeria.com"
                  style={{ border: 'none', outline: 'none', width: '100%' }}
                  required
                />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '0.5rem' }}>
                <Lock size={18} color="#888" style={{ marginRight: '0.5rem' }}/>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  style={{ border: 'none', outline: 'none', width: '100%' }}
                  required
                />
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            MASUK
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
            Belum punya akun? <Link to="/register" style={{color: '#e11d48'}}>Daftar dulu</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;