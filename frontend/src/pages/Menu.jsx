// frontend/src/pages/Menu.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Pizza, Coffee, Cookie, X, Plus, Minus, ArrowLeft, LogOut } from 'lucide-react';

const Menu = () => {
    const [menus, setMenus] = useState([]);
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        getMenus();
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            navigate('/');
        }
    }, []);

    const getMenus = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/menu');
            setMenus(response.data);
        } catch (error) {
            console.error("Gagal ambil menu", error);
        }
    };

    // --- FUNGSI CHECKOUT ---
    const handleCheckout = async () => {
        if (cart.length === 0) return alert("Keranjang kosong!");
        
        const total_price = cart.reduce((total, item) => total + item.price * item.qty, 0);

        try {
            await axios.post('http://localhost:5000/api/orders', {
                userId: user.id,
                items: cart,
                total_price: total_price
            });
            
            alert("✅ Pesanan Berhasil! Silakan tunggu, pesanan masuk ke admin.");
            setCart([]); 
            setIsCartOpen(false); 
            navigate('/dashboard'); 
        } catch (error) {
            console.error(error);
            alert("Gagal Checkout. Pastikan Backend sudah jalan.");
        }
    };

    const addToCart = (menu) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === menu.id);
            if (existingItem) {
                return prevCart.map((item) => item.id === menu.id ? { ...item, qty: item.qty + 1 } : item);
            } else {
                return [...prevCart, { ...menu, qty: 1 }];
            }
        });
        setIsCartOpen(true); 
    };

    const updateQty = (id, amount) => {
        setCart((prevCart) => prevCart.map((item) => {
            if (item.id === id) return { ...item, qty: Math.max(1, item.qty + amount) };
            return item;
        }));
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    const totalPrice = cart.reduce((total, item) => total + item.price * item.qty, 0);
    const foods = menus.filter(item => item.category === 'food');
    const drinks = menus.filter(item => item.category === 'drink');
    const snacks = menus.filter(item => item.category === 'snack');

    // --- PERBAIKAN UTAMA DISINI (HELPER URL GAMBAR) ---
    const getImageUrl = (imagePath) => {
        // 1. Kalau path kosong/null, kasih placeholder
        if (!imagePath) return "https://placehold.co/200";

        // 2. Kalau path sudah lengkap (ada http), pakai langsung (Jangan ditambah localhost lagi)
        if (imagePath.startsWith('http')) return imagePath;

        // 3. Kalau path belum lengkap, bersihkan slash Windows (\) dan tambah localhost
        return `http://localhost:5000/${imagePath.replace(/\\/g, '/')}`;
    };
    // --------------------------------------------------

    // Komponen Kartu Menu
    const MenuGrid = ({ title, items, color, icon }) => (
        <div style={{ marginBottom: '3rem' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#1f2937', marginBottom: '1.5rem', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <span style={{ color: color }}>{icon}</span> {title}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '25px' }}>
                {items.map((menu) => (
                    <div key={menu.id} style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' }}>
                        <div style={{ height: '160px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* PANGGIL FUNGSI BARU DISINI */}
                            <img src={getImageUrl(menu.image)} alt={menu.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ height: '6px', backgroundColor: color, width: '100%' }}></div>
                        <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#333' }}>{menu.name}</h3>
                            <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem', flex: 1, lineHeight: '1.4' }}>{menu.description}</p>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold', color: color, fontSize: '1rem' }}>
                                    {icon} <span>Rp {parseInt(menu.price).toLocaleString()}</span>
                                </div>
                                <button onClick={() => addToCart(menu)} style={{ background: '#1f2937', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}>
                                    <Plus size={16} /> Beli
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {items.length === 0 && <p style={{ color: '#999', fontStyle: 'italic' }}>Belum ada menu tersedia.</p>}
        </div>
    );

    return (
        <div style={{ backgroundColor: '#f9fafb', minHeight: '100vh', paddingBottom: '50px' }}>
            {/* NAVBAR */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }} title="Kembali ke Dashboard">
                    <ArrowLeft size={20} color="#333" />
                    <Pizza /> Pizzeria
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setIsCartOpen(true)}>
                        <ShoppingCart size={26} color="#374151" />
                        {cart.length > 0 && (
                            <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: '#e11d48', color: 'white', fontSize: '0.75rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                {cart.length}
                            </span>
                        )}
                    </div>
                    {/* User Info */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: '1px solid #e5e7eb', paddingLeft: '25px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#1f2937' }}>{user?.name}</div>
                            <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.75rem', color: '#ef4444', cursor: 'pointer', marginTop: '2px', fontWeight: '600' }}>
                                <LogOut size={12} /> Keluar
                            </div>
                        </div>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                             <img src={user?.image || "https://via.placeholder.com/150"} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                    </div>
                </div>
            </nav>

            {/* KONTEN UTAMA */}
            <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2rem', color: '#111', marginBottom: '0.5rem' }}>Silakan Pilih Menu 😋</h1>
                    <p style={{ color: '#666' }}>Nikmati pizza terbaik di kota langsung dari oven kami.</p>
                </div>

                <MenuGrid title="Makanan" items={foods} color="#e11d48" icon={<Pizza size={20}/>} />
                <MenuGrid title="Minuman" items={drinks} color="#3b82f6" icon={<Coffee size={20}/>} />
                <MenuGrid title="Cemilan" items={snacks} color="#f97316" icon={<Cookie size={20}/>} />
            </div>

            {/* SIDEBAR KERANJANG */}
            {isCartOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{ width: '400px', backgroundColor: 'white', height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column', boxShadow: '-5px 0 15px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h2>Keranjang ({cart.length})</h2>
                            <button onClick={() => setIsCartOpen(false)} style={{ background:'none', border:'none', cursor:'pointer' }}><X size={24} /></button>
                        </div>
                        
                        <div style={{ flex: 1, overflowY: 'auto' }}>
                            {cart.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                                    <ShoppingCart size={48} style={{ opacity: 0.2, marginBottom: '10px' }} />
                                    <p>Keranjangmu masih kosong.</p>
                                </div>
                            ) : null}

                            {cart.map((item) => (
                                <div key={item.id} style={{ display: 'flex', gap: '15px', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f3f4f6' }}>
                                    <div style={{ width: '70px', height: '70px', background: '#f3f4f6', borderRadius: '8px', overflow:'hidden' }}>
                                        {/* PANGGIL FUNGSI BARU DI KERANJANG JUGA */}
                                        <img src={getImageUrl(item.image)} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', color: '#333' }}>{item.name}</div>
                                        <div style={{ color: '#e11d48', fontSize: '0.9rem', fontWeight: '600' }}>
                                            Rp {parseInt(item.price * item.qty).toLocaleString()}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <button onClick={() => item.qty > 1 ? updateQty(item.id, -1) : removeFromCart(item.id)} style={{ padding: '4px', cursor: 'pointer', border:'1px solid #ddd', background:'white', borderRadius:'4px', display:'flex' }}><Minus size={14}/></button>
                                        <span style={{ fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, 1)} style={{ padding: '4px', cursor: 'pointer', border:'1px solid #ddd', background:'white', borderRadius:'4px', display:'flex' }}><Plus size={14}/></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: '2px solid #f3f4f6', paddingTop: '1.5rem', marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                                <span style={{ color: '#666' }}>Total:</span>
                                <span style={{ fontWeight: 'bold', color: '#111' }}>Rp {totalPrice.toLocaleString()}</span>
                            </div>
                            <button onClick={handleCheckout} style={{ width: '100%', padding: '1rem', backgroundColor: '#e11d48', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(225, 29, 72, 0.2)' }}>
                                CHECKOUT SEKARANG
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;