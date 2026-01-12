// frontend/src/pages/Register.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Shield } from 'lucide-react'; // Tambah icon Shield

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default pilih Customer
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // Kirim data role juga ke backend
      await axios.post('http://localhost:5000/api/register', {
        name,
        email,
        password,
        role // <--- Ini data pentingnya
      });
      alert('Register Berhasil! Silakan Login.');
      navigate('/'); 
    } catch (err) {
      alert(err.response?.data?.message || 'Register Gagal');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: '#e11d48' }}>
            <UserPlus size={48} />
        </div>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Daftar Akun</h2>
        
        <form onSubmit={handleRegister}>
          {/* Input Nama */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Nama Lengkap</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '0.5rem' }}>
                <User size={18} color="#888" style={{ marginRight: '0.5rem' }}/>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ border: 'none', outline: 'none', width: '100%' }} />
            </div>
          </div>

          {/* Input Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '0.5rem' }}>
                <Mail size={18} color="#888" style={{ marginRight: '0.5rem' }}/>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ border: 'none', outline: 'none', width: '100%' }} />
            </div>
          </div>

          {/* Input Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '0.5rem' }}>
                <Lock size={18} color="#888" style={{ marginRight: '0.5rem' }}/>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ border: 'none', outline: 'none', width: '100%' }} />
            </div>
          </div>

          {/* Input Pilihan Role (BARU) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Daftar Sebagai</label>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '5px', padding: '0.5rem' }}>
                <Shield size={18} color="#888" style={{ marginRight: '0.5rem' }}/>
                <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    style={{ border: 'none', outline: 'none', width: '100%', background: 'white', cursor: 'pointer' }}
                >
                    <option value="customer">Pelanggan (Pembeli)</option>
                    <option value="admin">Admin (Penjual)</option>
                </select>
            </div>
          </div>

          <button type="submit" style={{ width: '100%', padding: '0.75rem', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
            DAFTAR
          </button>
        </form>
        
        <p style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.9rem'}}>
            Sudah punya akun? <Link to="/" style={{color: '#e11d48'}}>Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;