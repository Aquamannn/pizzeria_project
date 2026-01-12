import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pizza, ShoppingBag, History, User, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/'); 
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const isAdmin = user?.role === 'admin';

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh' }}>
            
            {/* --- NAVBAR --- */}
            <nav style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem 2rem', 
                backgroundColor: 'white', 
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
                position: 'sticky', 
                top: 0, 
                zIndex: 10,
                marginBottom: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    <Pizza /> Pizzeria
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => navigate('/menu')}>
                        <ShoppingCart size={24} color="#374151" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{user?.name}</div>
                            <div 
                                style={{ fontSize: '0.7rem', color: '#e11d48', cursor: 'pointer', fontWeight: 'bold' }} 
                                onClick={handleLogout}
                            >
                                Logout
                            </div>
                        </div>
                        {/* FOTO PROFIL KECIL DI NAVBAR */}
                        <div style={{ width: '35px', height: '35px', borderRadius: '50%', overflow: 'hidden', border: '1px solid #ddd' }}>
                             <img 
                                src={user?.image || "https://via.placeholder.com/150"} 
                                alt="User" 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- KONTEN UTAMA --- */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 2rem 2rem' }}>
                
                {/* Greeting Section dengan FOTO BESAR */}
                <div style={{ textAlign: 'center', marginBottom: '3rem', paddingTop: '1rem' }}>
                    <div style={{ 
                        width: '120px', 
                        height: '120px', 
                        margin: '0 auto 1rem',
                        position: 'relative'
                    }}>
                        <img 
                            src={user?.image || "https://via.placeholder.com/150"} 
                            alt="Profile" 
                            style={{ 
                                width: '100%', 
                                height: '100%', 
                                objectFit: 'cover', 
                                borderRadius: '50%', 
                                border: '4px solid white',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                            }}
                        />
                    </div>


                    <h1 style={{ fontSize: '2rem', color: '#1f2937' }}>Halo, {user?.name}!</h1>
                    <p style={{ color: '#6b7280' }}>
                        {isAdmin ? 'Selamat datang kembali di dapur Pizzeria.' : 'Mau makan pizza apa hari ini?'}
                    </p>
                </div>

                {/* --- MENU NAVIGASI --- */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    
                    {isAdmin && (
                        <div onClick={() => navigate('/manage-menu')} style={cardStyle}>
                            <div style={{ background: '#e11d48', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1rem' }}>
                                <Pizza size={32} />
                            </div>
                            <h3>Kelola Menu Pizza</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Tambah, edit, atau hapus menu makanan.</p>
                        </div>
                    )}

                    <div onClick={() => navigate('/menu')} style={cardStyle}>
                        <div style={{ background: '#f59e0b', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1rem' }}>
                            <ShoppingBag size={32} />
                        </div>
                        <h3>{isAdmin ? 'Lihat Menu Restoran' : 'Pesan Sekarang'}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                            {isAdmin ? 'Cek tampilan menu di mata pelanggan.' : 'Lihat daftar menu enak kami.'}
                        </p>
                    </div>

                    {isAdmin && (
                        <div onClick={() => navigate('/history-order')} style={cardStyle}>
                            <div style={{ background: '#3b82f6', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1rem' }}>
                                <History size={32} />
                            </div>
                            <h3>Riwayat Pembelian</h3>
                            <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Lihat semua transaksi dari pelanggan.</p>
                        </div>
                    )}

                    <div onClick={() => navigate('/profile')} style={cardStyle}>
                        <div style={{ background: '#10b981', padding: '1rem', borderRadius: '50%', color: 'white', marginBottom: '1rem' }}>
                            <User size={32} />
                        </div>
                        <h3>Profil {isAdmin ? 'Admin' : 'Saya'}</h3>
                        <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>Pengaturan akun dan profil.</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

const cardStyle = {
    backgroundColor: 'white',
    padding: '2.5rem 1.5rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #f3f4f6'
};

export default Dashboard;