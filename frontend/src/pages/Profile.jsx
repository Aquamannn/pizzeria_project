import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Camera, User, LogOut } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(true); 
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    const getProfile = async () => {
        setLoading(true); // Mulai Loading
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Panggil API
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` } 
            });
            
            // Sukses! Simpan data
            setUser(response.data);
            setName(response.data.name);
            setPreview(response.data.image); 
            
            // Update localStorage biar sinkron
            localStorage.setItem('user', JSON.stringify(response.data));

        } catch (error) {
            console.error("Gagal ambil profil", error);
            
            // LOGIKA PENTING: Kalau error 401/404 (Token basi), tendang keluar!
            if (error.response && (error.response.status === 401 || error.response.status === 404 || error.response.status === 403)) {
                alert("Sesi habis, silakan login ulang.");
                localStorage.clear();
                navigate('/login');
            }
        } finally {
            // APAPUN YANG TERJADI (Sukses/Error), MATIKAN LOADING!
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
            getProfile(); // Refresh data biar gambar update
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

    // --- TAMPILAN SAAT LOADING ---
    if (loading) return (
        <div style={{textAlign:'center', marginTop:'100px', fontFamily:'sans-serif'}}>
            <h3>Memuat Data...</h3>
            {/* Tombol Darurat kalau macet */}
            <button onClick={() => {localStorage.clear(); navigate('/login')}} style={{marginTop:'20px', color:'red', cursor:'pointer', border:'none', background:'none', textDecoration:'underline'}}>
                Stuck? Klik di sini untuk Logout Paksa
            </button>
        </div>
    );

    // Kalau user masih null setelah loading selesai (berarti error parah), jangan crash
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