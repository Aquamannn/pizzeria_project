// frontend/src/pages/ManageMenu.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Trash2, Edit, ArrowLeft, Image as ImageIcon, Pizza, Coffee, Cookie } from 'lucide-react';

const ManageMenu = () => {
    const [menus, setMenus] = useState([]);
    
    // State Form
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('food');
    const [image, setImage] = useState(null); 
    const [editId, setEditId] = useState(null); 

    const navigate = useNavigate();

    useEffect(() => {
        getMenus();
    }, []);

    const getMenus = async () => {
        const response = await axios.get('http://localhost:5000/api/menu');
        setMenus(response.data);
    };

    // --- LOGIKA GROUPING MENU ---
    // Kita pisahkan array utama 'menus' menjadi 3 array kecil
    const foods = menus.filter(item => item.category === 'food');
    const drinks = menus.filter(item => item.category === 'drink');
    const snacks = menus.filter(item => item.category === 'snack');

    // --- HANDLE SUBMIT ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('description', 'Deskripsi default'); 
        if (image) {
            formData.append('image', image);
        }

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: token, 'Content-Type': 'multipart/form-data' } };

            if (editId) {
                await axios.put(`http://localhost:5000/api/menu/${editId}`, formData, config);
                alert("Menu Berhasil Diupdate!");
            } else {
                await axios.post('http://localhost:5000/api/menu', formData, config);
                alert("Menu Berhasil Ditambahkan!");
            }

            setName('');
            setPrice('');
            setImage(null);
            setEditId(null);
            // Reset input file secara manual
            document.getElementById('fileInput').value = ""; 
            getMenus(); 

        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan menu");
        }
    };

    const handleEdit = (menu) => {
        setEditId(menu.id);
        setName(menu.name);
        setPrice(menu.price);
        setCategory(menu.category);
        window.scrollTo(0,0);
    };

    const handleDelete = async (id) => {
        if (confirm("Yakin mau hapus menu ini?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/menu/${id}`, {
                    headers: { Authorization: token }
                });
                getMenus();
            } catch (error) {
                alert("Gagal hapus menu");
            }
        }
    };

    const handleCancel = () => {
        setEditId(null);
        setName('');
        setPrice('');
        setImage(null);
        document.getElementById('fileInput').value = "";
    };

    // --- KOMPONEN KECIL BUAT NAMPILIN LIST (BIAR GAK ULANG KODINGAN) ---
    const MenuSection = ({ title, items, color, icon }) => (
        <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ 
                color: color, 
                borderBottom: `2px solid ${color}`, 
                paddingBottom: '10px', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                {icon} {title} ({items.length})
            </h3>

            {items.length === 0 ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Belum ada menu di kategori ini.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {items.map((menu) => (
                        <div key={menu.id} style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            background: 'white', 
                            padding: '1rem', 
                            borderRadius: '8px', 
                            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            borderLeft: `8px solid ${color}` // <--- INI WARNA PEMBEDANYA
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                {/* Gambar */}
                                <img 
                                    src={menu.image || "https://placehold.co/50"} 
                                    alt={menu.name} 
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '5px', backgroundColor: '#eee' }} 
                                />
                                <div>
                                    <strong style={{ fontSize: '1.1rem', display: 'block' }}>{menu.name}</strong>
                                    <span style={{ fontSize: '0.9rem', color: '#666', fontWeight: 'bold' }}>
                                        Rp {parseInt(menu.price).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Tombol Aksi */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => handleEdit(menu)} style={{ background: '#fff3cd', border: 'none', padding:'8px', borderRadius:'5px', cursor: 'pointer', color: '#f59e0b' }}>
                                    <Edit size={18} />
                                </button>
                                <button onClick={() => handleDelete(menu.id)} style={{ background: '#fee2e2', border: 'none', padding:'8px', borderRadius:'5px', cursor: 'pointer', color: '#ef4444' }}>
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
            
            {/* Header + Back */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button onClick={() => navigate('/dashboard')} style={backButtonStyle}>
                    <ArrowLeft size={20} color="#333" />
                </button>
                <h2 style={{ color: '#e11d48', margin: 0 }}>Kelola Menu</h2>
            </div>

            {/* FORM INPUT */}
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', marginBottom: '3rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', color: editId ? '#f59e0b' : '#e11d48' }}>
                    {editId ? <Edit size={24}/> : <PlusCircle size={24}/>} 
                    {editId ? 'Edit Menu' : 'Tambah Menu Baru'}
                </h3>
                
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                        <label style={{fontWeight:'bold', fontSize:'0.9rem'}}>Nama Menu</label>
                        <input type="text" placeholder="Contoh: Pizza Pepperoni" value={name} onChange={(e) => setName(e.target.value)} required style={inputStyle} />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'grid', gap: '0.5rem' }}>
                            <label style={{fontWeight:'bold', fontSize:'0.9rem'}}>Harga (Rp)</label>
                            <input type="number" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} required style={inputStyle} />
                        </div>
                        <div style={{ width: '150px', display: 'grid', gap: '0.5rem' }}>
                            <label style={{fontWeight:'bold', fontSize:'0.9rem'}}>Kategori</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle}>
                                <option value="food">Makanan</option>
                                <option value="drink">Minuman</option>
                                <option value="snack">Cemilan</option>
                            </select>
                        </div>
                    </div>

                    {/* Input Gambar */}
                    <div style={{ border: '2px dashed #ddd', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                        <label style={{ display: 'block', marginBottom: '10px', cursor: 'pointer', color: '#555' }}>
                            <ImageIcon size={24} style={{ display: 'block', margin: '0 auto 5px' }}/> 
                            Klik untuk Upload Gambar
                        </label>
                        <input id="fileInput" type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" style={{ width: '100%' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                        <button type="submit" style={{ ...btnStyle, background: editId ? '#f59e0b' : '#e11d48', flex: 1 }}>
                            {editId ? 'UPDATE MENU' : 'SIMPAN MENU'}
                        </button>
                        {editId && (
                            <button type="button" onClick={handleCancel} style={{ ...btnStyle, background: '#6b7280' }}>
                                BATAL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* DAFTAR MENU PER KATEGORI */}
            {/* Kita panggil komponen MenuSection 3 kali sesuai warna request */}
            
            <MenuSection 
                title="Makanan" 
                items={foods} 
                color="#e11d48" // MERAH
                icon={<Pizza />} 
            />

            <MenuSection 
                title="Minuman" 
                items={drinks} 
                color="#3b82f6" // BIRU
                icon={<Coffee />} 
            />

            <MenuSection 
                title="Cemilan" 
                items={snacks} 
                color="#f97316" // ORANYE
                icon={<Cookie />} 
            />

        </div>
    );
};

// Styles
const inputStyle = { padding: '0.8rem', border: '1px solid #ddd', borderRadius: '8px', fontSize: '1rem' };
const btnStyle = { color: 'white', padding: '1rem', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' };
const backButtonStyle = { background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' };

export default ManageMenu;