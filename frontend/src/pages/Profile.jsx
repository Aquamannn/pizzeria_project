// frontend/src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// Tambahkan import icon baru: Key, Copy, Eye, EyeOff, Check
import { ArrowLeft, Save, Trash2, Camera, User, LogOut, Key, Copy, Eye, EyeOff, Check } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // State buat fitur Token
    const [showToken, setShowToken] = useState(false);
    const [copied, setCopied] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            setUser(response.data);
            setName(response.data.name);
            setPreview(response.data.image); 
            
            localStorage.setItem('user', JSON.stringify(response.data));

        } catch (error) {
            console.error("Gagal ambil profil", error);
            if (error.response && (error.response.status === 401 || error.response.status === 404 || error.response.status === 403)) {
                alert("Sesi habis, silakan login ulang.");
                localStorage.clear();
                navigate('/login');
            }
        } finally {
            setLoading(false); 
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (password) formData.append('password', password);
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/me', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });
            alert("Profil Berhasil Diupdate!");
            setPassword('');
            getProfile(); 
        } catch (error) {
            console.error(error);
            alert("Gagal update profil");
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm("⚠️ Yakin hapus akun? Data hilang selamanya!")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/api/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                alert("Akun dihapus.");
                localStorage.clear();
                navigate('/');
            } catch (error) {
                alert("Gagal hapus akun");
            }
        }
    };

    // Fungsi Copy Token
    const handleCopyToken = () => {
        const token = localStorage.getItem('token');
        navigator.clipboard.writeText(token);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset ikon copy setelah 2 detik
    };

    if (loading) return (
        <div style={{textAlign:'center', marginTop:'100px', fontFamily:'sans-serif'}}>
            <h3>Memuat Data...</h3>
            <button onClick={() => {localStorage.clear(); navigate('/login')}} style={{marginTop:'20px', color:'red', cursor:'pointer', border:'none', background:'none', textDecoration:'underline'}}>
                Stuck? Klik di sini untuk Logout Paksa
            </button>
        </div>
    );

    if (!user) return null;

    const isAdmin = user.role === 'admin';
    const displayImage = preview || "https://cdn-icons-png.flaticon.com/512/847/847969.png"; 

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>
                    <ArrowLeft size={20} color="#333" />
                </button>
                <h2 style={{ color: isAdmin ? '#e11d48' : '#333' }}>Profil {isAdmin ? 'Admin' : 'Saya'}</h2>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                {/* Bagian Atas: Foto */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                        <img 
                            src={displayImage} 
                            alt="Profile" 
                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '4px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
                        />
                        <label style={{ position: 'absolute', bottom: '0', right: '0', background: '#e11d48', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
                            <Camera size={18} />
                            <input type="file" style={{ display: 'none' }} onChange={handleImageChange} accept="image/*" />
                        </label>
                    </div>
                    <p style={{ marginTop: '10px', color: '#666', fontSize: '0.9rem' }}>{user.email}</p>
                    <span style={{ background: isAdmin ? '#fecdd3' : '#dbeafe', color: isAdmin ? '#e11d48' : '#3b82f6', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {user.role.toUpperCase()}
                    </span>
                </div>

                {/* --- API TOKEN BOX (BARU) --- */}
                <div style={{ marginBottom: '2rem', background: '#1e293b', padding: '1rem', borderRadius: '8px', color: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>
                            <Key size={16} /> API Access Token
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* Tombol Lihat/Sembunyi */}
                            <button 
                                type="button" 
                                onClick={() => setShowToken(!showToken)} 
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                                title={showToken ? "Sembunyikan" : "Lihat Token"}
                            >
                                {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            {/* Tombol Copy */}
                            <button 
                                type="button" 
                                onClick={handleCopyToken} 
                                style={{ background: 'none', border: 'none', color: copied ? '#4ade80' : '#94a3b8', cursor: 'pointer' }}
                                title="Copy Token"
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    
                    {/* Tampilan Tokennya */}
                    <div style={{ 
                        background: '#0f172a', 
                        padding: '10px', 
                        borderRadius: '6px', 
                        fontFamily: 'monospace', 
                        fontSize: '0.85rem', 
                        wordBreak: 'break-all',
                        color: showToken ? '#e2e8f0' : '#475569',
                        border: '1px solid #334155'
                    }}>
                        {showToken ? localStorage.getItem('token') : '••••••••••••••••••••••••••••••••••••••••'}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '5px' }}>
                        *Gunakan token ini untuk Login di Swagger/Postman.
                    </p>
                </div>
                {/* --------------------------- */}

                <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nama Lengkap</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                            <User size={18} color="#999" style={{ marginRight: '10px' }}/>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ border: 'none', outline: 'none', width: '100%' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Ganti Password (Opsional)</label>
                        <input type="password" placeholder="******" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} />
                    </div>
                    <button type="submit" style={{ background: '#1f2937', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={18} /> SIMPAN PERUBAHAN
                    </button>
                </form>

                <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                    <button onClick={handleDeleteAccount} style={{ background: '#fee2e2', color: '#ef4444', width: '100%', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Trash2 size={18} /> HAPUS AKUN SAYA
                    </button>
                </div>
            </div>
        </div>
    );
};

const backBtnStyle = { background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

export default Profile;