import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Camera, User } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getProfile();
    }, []);

    // 1. Ambil Data Terbaru dari Backend
    const getProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: token }
            });
            setUser(response.data);
            setName(response.data.name);
            setPreview(response.data.image);
            
            // Update localStorage biar sinkron
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error("Gagal ambil profil", error);
        }
    };

    // 2. Handle Ganti Foto (Preview)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file)); // Biar bisa diliat langsung
    };

    // 3. Simpan Perubahan
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        if (password) formData.append('password', password);
        if (image) formData.append('image', image);

        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/users/me', formData, {
                headers: { 
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Profil Berhasil Diupdate!");
            setPassword(''); // Kosongkan password field
            getProfile(); // Refresh data
        } catch (error) {
            alert("Gagal update profil");
        }
    };

    // 4. Hapus Akun
    const handleDeleteAccount = async () => {
        if (confirm("⚠️ PERINGATAN KERAS!\n\nApakah Anda yakin ingin menghapus akun ini selamanya? Data tidak bisa dikembalikan.")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete('http://localhost:5000/api/users/me', {
                    headers: { Authorization: token }
                });
                alert("Akun berhasil dihapus. Selamat tinggal!");
                localStorage.clear();
                navigate('/');
            } catch (error) {
                alert("Gagal hapus akun");
            }
        }
    };

    if (!user) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;

    const isAdmin = user.role === 'admin';

    return (
        <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={backBtnStyle}>
                    <ArrowLeft size={20} color="#333" />
                </button>
                <h2 style={{ color: isAdmin ? '#e11d48' : '#333' }}>Profil {isAdmin ? 'Admin' : 'Saya'}</h2>
            </div>

            <div style={{ background: 'white', padding: '2rem', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                
                {/* Bagian Foto Profil */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                        <img 
                            src={preview || "https://via.placeholder.com/150"} 
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

                {/* Form Update */}
                <form onSubmit={handleUpdate} style={{ display: 'grid', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Nama Lengkap</label>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                            <User size={18} color="#999" style={{ marginRight: '10px' }}/>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                style={{ border: 'none', outline: 'none', width: '100%' }} 
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Ganti Password (Opsional)</label>
                        <input 
                            type="password" 
                            placeholder="******" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }} 
                        />
                    </div>

                    <button type="submit" style={{ background: '#1f2937', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Save size={18} /> SIMPAN PERUBAHAN
                    </button>
                </form>

                {/* Zona Bahaya */}
                <div style={{ marginTop: '3rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
                    <h4 style={{ color: '#ef4444', marginBottom: '1rem' }}>Zona Bahaya</h4>
                    <button 
                        onClick={handleDeleteAccount}
                        style={{ background: '#fee2e2', color: '#ef4444', width: '100%', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        <Trash2 size={18} /> HAPUS AKUN SAYA
                    </button>
                </div>

            </div>
        </div>
    );
};

const backBtnStyle = { background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' };

export default Profile;