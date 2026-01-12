import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5); 
    const [isExpanded, setIsExpanded] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        // Fungsi rahasia buat nyalain lagu
        const tryToPlay = () => {
            if (audioRef.current) {
                audioRef.current.volume = volume;
                audioRef.current.play()
                    .then(() => {
                        // Kalau sukses play:
                        setIsPlaying(true);
                        // Hapus jebakan biar gak jalan terus-terusan
                        window.removeEventListener('click', tryToPlay);
                        window.removeEventListener('keydown', tryToPlay);
                    })
                    .catch((error) => {
                        // Kalau masih gagal, diem aja dulu
                        console.log("Menunggu interaksi user...");
                    });
            }
        };

        // 1. Coba play langsung (siapa tau hoki/browsernya santai)
        tryToPlay();

        // 2. PASANG JEBAKAN: Dengerin klik mouse atau pencetan keyboard APAPUN di seluruh layar
        window.addEventListener('click', tryToPlay);
        window.addEventListener('keydown', tryToPlay);

        // Bersih-bersih pas komponen hilang
        return () => {
            window.removeEventListener('click', tryToPlay);
            window.removeEventListener('keydown', tryToPlay);
        };
    }, []); // [] artinya cuma jalan sekali pas awal

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div 
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            style={{ 
                position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999,
                display: 'flex', alignItems: 'center',
                backgroundColor: 'rgba(31, 41, 55, 0.9)', 
                padding: '10px', borderRadius: '30px',
                border: '2px solid #e11d48',
                boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                transition: 'all 0.3s ease',
                width: isExpanded ? '200px' : '50px',
                overflow: 'hidden'
            }}
        >
            <audio ref={audioRef} loop>
                <source src="/assets/music.mp3" type="audio/mp3" />
            </audio>

            <button 
                onClick={togglePlay}
                style={{
                    background: 'none', border: 'none', color: '#e11d48', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: '30px'
                }}
            >
                {isPlaying ? (
                    <div className="music-wave" style={{ display: 'flex', gap: '2px', alignItems: 'flex-end', height: '20px' }}>
                        <div style={{width:'3px', height:'100%', background:'#e11d48', animation:'bounce 1s infinite'}}></div>
                        <div style={{width:'3px', height:'60%', background:'#e11d48', animation:'bounce 1.2s infinite'}}></div>
                        <div style={{width:'3px', height:'80%', background:'#e11d48', animation:'bounce 0.8s infinite'}}></div>
                    </div>
                ) : (
                    <Play size={24} fill="#e11d48" />
                )}
            </button>

            <div style={{ 
                display: 'flex', alignItems: 'center', marginLeft: '10px', 
                opacity: isExpanded ? 1 : 0, transition: 'opacity 0.3s', width: '100%'
            }}>
                <input 
                    type="range" min="0" max="1" step="0.01" value={volume}
                    onChange={handleVolumeChange}
                    style={{ width: '100%', accentColor: '#e11d48', cursor: 'pointer', height: '4px' }} 
                />
            </div>
            <style>{`@keyframes bounce { 0%, 100% { transform: scaleY(0.5); } 50% { transform: scaleY(1); } }`}</style>
        </div>
    );
};

export default BackgroundMusic;