// frontend/src/pages/HistoryOrder.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const HistoryOrder = () => {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/orders');
            console.log("Data History:", res.data); // Cek di Console browser
            setOrders(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '2rem', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', fontWeight: 'bold', color: '#666' }}>
                <ArrowLeft /> Kembali ke Dashboard
            </button>

            <h1 style={{ marginBottom: '2rem', color: '#111', borderBottom: '2px solid #e11d48', paddingBottom: '10px', display: 'inline-block' }}>
                Riwayat Penjualan (Admin)
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {orders.map((order) => (
                    <div key={order.id} style={{ border: '1px solid #e5e7eb', padding: '1.5rem', borderRadius: '15px', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
                            <div>
                                {/* PAKE TANDA TANYA (?) BIAR GAK CRASH KALAU USER DIHAPUS */}
                                <h3 style={{ margin: 0, color: '#1f2937' }}>Pelanggan: {order.user?.name || 'User Tidak Dikenal'}</h3>
                                <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>{order.user?.email || '-'}</div>
                                <div style={{ fontSize: '0.85rem', color: '#9ca3af', marginTop: '5px' }}>
                                    Tanggal: {new Date(order.createdAt).toLocaleString()}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#d1fae5', color: '#065f46', padding: '5px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '5px', width: 'fit-content', marginLeft: 'auto' }}>
                                    <CheckCircle size={14} /> {order.status ? order.status.toUpperCase() : 'DONE'}
                                </div>
                                <h2 style={{ margin: 0, color: '#e11d48' }}>Rp {parseInt(order.total_price || 0).toLocaleString()}</h2>
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '10px' }}>
                            <strong style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', color: '#4b5563' }}>Rincian Menu:</strong>
                            <ul style={{ margin: 0, paddingLeft: '20px', color: '#374151' }}>
                                {/* CEK APAKAH ITEMS ITU STRING ATAU OBJECT */}
                                {order.items && (typeof order.items === 'string' ? JSON.parse(order.items) : order.items).map((item, idx) => (
                                    <li key={idx} style={{ marginBottom: '5px' }}>
                                        <span style={{ fontWeight: 'bold' }}>{item.qty}x</span> {item.name} - Rp {parseInt(item.price).toLocaleString()}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#999', padding: '3rem' }}>
                        <p>Belum ada data transaksi.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryOrder;