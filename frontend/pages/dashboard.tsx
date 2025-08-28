import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// Firebase típus definíciók
declare global {
    interface Window {
        firebase: any;
    }
}

type UserDoc = {
    uid?: string;
    name?: string;
    fullName?: string;
    email?: string;
    phone?: string;
    grade?: string;
    course?: string;
    birthDate?: string;
    address?: string;
};

type MathTopic = {
    id: string;
    title: string;
    completed: number;
    total: number;
    color: string;
    icon: string;
};



// Firebase inicializálási hook
const useFirebase = () => {
    const [isFirebaseReady, setIsFirebaseReady] = useState(false);
    const [firebaseError, setFirebaseError] = useState<string | null>(null);

    useEffect(() => {
        const checkFirebase = async () => {
            let attempts = 0;
            const maxAttempts = 150; // 15 másodperc

            while (attempts < maxAttempts) {
                if (window.firebase && window.firebase.apps.length > 0) {
                    setIsFirebaseReady(true);
                    return;
                }

                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            setFirebaseError("Firebase nem töltődött be időben.");
        };

        checkFirebase();
    }, []);

    return { isFirebaseReady, firebaseError };
};

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [me, setMe] = useState<UserDoc | null>(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const { isFirebaseReady, firebaseError } = useFirebase();

    // Profil kép betöltése localStorage-ból
    useEffect(() => {
        const savedImage = localStorage.getItem('profileImage');
        if (savedImage) {
            setProfileImage(savedImage);
        }
    }, []);

    useEffect(() => {
        if (!isFirebaseReady) {
            if (firebaseError) {
                setError(firebaseError);
                setLoading(false);
            }
            return;
        }

        const initializeApp = async () => {
            try {
                const auth = window.firebase.auth();
                const db = window.firebase.firestore();

                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user) {
                        router.replace("/");
                        return;
                    }

                    try {
                        const snap = await db.collection("users").doc(user.uid).get();
                        const data: UserDoc = (snap.exists ? (snap.data() as UserDoc) : {}) || {};
                        data.uid = user.uid;
                        if (!data.email) data.email = user.email ?? "";
                        if (!data.name) data.name = user.displayName ?? "";
                        setMe(data);
                        setLoading(false);
                    } catch (error) {
                        console.error("Hiba a felhasználói adatok betöltésekor:", error);
                        setError("Hiba történt az adatok betöltésekor.");
                        setLoading(false);
                    }
                });

                return () => unsub();
            } catch (error) {
                console.error("Alkalmazás inicializálási hiba:", error);
                setError("Hiba történt az alkalmazás betöltésekor.");
                setLoading(false);
            }
        };

        initializeApp();
    }, [isFirebaseReady, firebaseError, router]);

    const signOut = async () => {
        try {
            if (window.firebase) {
                await window.firebase.auth().signOut();
                router.replace("/");
            }
        } catch (error) {
            console.error("Kijelentkezési hiba:", error);
        }
    };

    const navigateToProblems = (topicId: string) => {
        router.push(`/solve/${topicId}`);
    };

    if (loading) return <div className="dash-loading">Betöltés…</div>;

    if (error) {
        return (
            <div className="error-container">
                <div className="error-message">
                    <h2>Hiba történt</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="retry-btn">
                        Újrapróbálkozás
                    </button>
                </div>
            </div>
        );
    }

    const percent = (completed: number, total: number) => total === 0 ? 0 : Math.round((completed / total) * 100);

    const mathTopics: MathTopic[] = [
        { id: 'abszoluterték', title: 'Abszolútérték', completed: 12, total: 14, color: '#8B5CF6', icon: 'A' },
        { id: 'egyenletek', title: 'Egyenletek', completed: 27, total: 29, color: '#EF4444', icon: 'Σ' },
        { id: 'sikgeometria', title: 'Síkgeometria', completed: 27, total: 30, color: '#10B981', icon: '📐' },
        { id: 'fuggvenyek-analizis', title: 'Függvények, analízis', completed: 24, total: 25, color: '#F59E0B', icon: '📈' },
        { id: 'trigonometria', title: 'Trigonometria', completed: 18, total: 22, color: '#EC4899', icon: '📐' },
        { id: 'statisztika', title: 'Statisztika', completed: 15, total: 18, color: '#06B6D4', icon: '📊' },
        { id: 'koordinatageometria', title: 'Koordinátageometria', completed: 20, total: 25, color: '#8B5CF6', icon: '📍' },
        { id: 'valoszinusegszamitas', title: 'Valószínűségszámítás', completed: 12, total: 16, color: '#10B981', icon: '🎲' },
        { id: 'gyok', title: 'Gyök', completed: 8, total: 12, color: '#3B82F6', icon: '√' },
        { id: 'bizonyitasok', title: 'Bizonyítások', completed: 5, total: 8, color: '#DC2626', icon: '✍️' },
    ];

    return (
        <div className={`dashboard-container ${isDarkMode ? 'dark-theme' : ''}`}>
            {/* Top Navigation Bar */}
            <div className="top-nav">
                <nav className="nav-tabs">
                    <button className="nav-tab active">
                        <i className="nav-icon home-icon">🏠</i>
                        Kezdőlap
                    </button>
                    <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
                        <div className="theme-switch">
                            <span className={`theme-option ${!isDarkMode ? 'active' : ''}`}>☀️</span>
                            <span className={`theme-option ${isDarkMode ? 'active' : ''}`}>🌙</span>
                        </div>
                    </button>
                    <button className="nav-tab" onClick={() => router.push('/booking')}>
                        <i className="nav-icon">📅</i>
                        Időpontfoglalás
                    </button>
                    <button className="nav-tab" onClick={() => router.push('/tasks')}>
                        <i className="nav-icon">📝</i>
                        Feladatok
                    </button>
                    <button className="nav-tab" onClick={() => router.push('/profile')}>
                        <i className="nav-icon">👤</i>
                        Adataim
                    </button>
                    {me?.uid === "4lUUn5fX4sZ79pVoy5y4t3hJFpF3" && (
                        <button className="nav-tab" onClick={() => router.push('/admin')}>
                            <i className="nav-icon">⚙️</i>
                            Admin
                        </button>
                    )}
                    <button className="nav-tab">
                        <i className="nav-icon">🔒</i>
                        Jelszó Módosítás
                    </button>
                    <button className="nav-tab" onClick={signOut}>
                        <i className="nav-icon">🚪</i>
                        Kijelentkezés
                    </button>
                </nav>
            </div>

            <div className="dashboard-content">
                {/* Left Sidebar - User Profile */}
                <aside className="sidebar">
                    <div className="user-profile">
                        <div className="profile-header">
                            <div className="profile-picture">
                                <div
                                    className="avatar-circle"
                                    onClick={() => document.getElementById('photo-input')?.click()}
                                    style={{
                                        backgroundImage: profileImage ? `url(${profileImage})` : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >
                                    {!profileImage && (me?.name ? me.name.charAt(0).toUpperCase() : 'A')}
                                    <div className="change-photo-overlay">
                                        <i className="nav-icon">📷</i>
                                        {profileImage && (
                                            <button
                                                className="remove-photo-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    localStorage.removeItem('profileImage');
                                                    setProfileImage(null);
                                                }}
                                                title="Kép eltávolítása"
                                            >
                                                ❌
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <input
                                    id="photo-input"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => {
                                                const img = new Image();
                                                img.onload = () => {
                                                    const canvas = document.createElement('canvas');
                                                    const ctx = canvas.getContext('2d');

                                                    // Kép méretezése és középre igazítása
                                                    const size = 160; // Nagyobb méret a jobb minőségért
                                                    canvas.width = size;
                                                    canvas.height = size;

                                                    // Kép méretezése és középre igazítása
                                                    const scale = Math.max(size / img.width, size / img.height);
                                                    const scaledWidth = img.width * scale;
                                                    const scaledHeight = img.height * scale;
                                                    const x = (size - scaledWidth) / 2;
                                                    const y = (size - scaledHeight) / 2;

                                                    // Háttér kitöltése fehér színnel
                                                    ctx!.fillStyle = '#ffffff';
                                                    ctx!.fillRect(0, 0, size, size);

                                                    // Kép rajzolása
                                                    ctx!.drawImage(img, x, y, scaledWidth, scaledHeight);

                                                    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

                                                    // Mentjük a képet localStorage-ba és state-be
                                                    localStorage.setItem('profileImage', dataUrl);
                                                    setProfileImage(dataUrl);

                                                    console.log('Új profil kép betöltve és mentve:', dataUrl);
                                                };
                                                img.src = event.target?.result as string;
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                            <h3>Hey, {me?.name || 'Alex'}</h3>
                            <p className="user-id">{me?.email?.split('@')[0] || '12102030'}</p>
                        </div>

                        <div className="profile-details">
                            <div className="detail-item">
                                <span className="detail-label">Kurzus:</span>
                                <span className="detail-value">{me?.course || 'Matematika Érettségi'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Telefon:</span>
                                <span className="detail-value">{me?.phone || '1234567890'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Email:</span>
                                <span className="detail-value">{me?.email || 'unknown@gmail.com'}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Cím:</span>
                                <span className="detail-value">{me?.address || 'Ghost town Road, New York, America'}</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="main-content">
                    {/* Attendance Section - Mathematical Topics */}
                    <section className="attendance-section">
                        <h2 className="section-title">Matematikai Témakörök</h2>
                        <div className="topics-grid">
                            {mathTopics.map((topic) => {
                                const p = percent(topic.completed, topic.total);
                                return (
                                    <div
                                        key={topic.id}
                                        className="topic-card"
                                        onClick={() => navigateToProblems(topic.id)}
                                    >
                                        <div className="topic-icon" style={{ backgroundColor: topic.color }}>
                                            {topic.icon}
                                        </div>
                                        <h3 className="topic-title">{topic.title}</h3>
                                        <div className="topic-progress-text">{topic.completed}/{topic.total}</div>
                                        <div className="circular-progress" style={{
                                            '--topic-color': topic.color,
                                            '--progress-percentage': p
                                        } as React.CSSProperties}>
                                            <svg>
                                                <circle
                                                    className="bg"
                                                    cx="60"
                                                    cy="60"
                                                    r="45"
                                                />
                                                <circle
                                                    className="progress"
                                                    cx="60"
                                                    cy="60"
                                                    r="45"
                                                />
                                            </svg>
                                            <div className="progress-center">
                                                <div className="progress-percentage">{p}%</div>
                                            </div>
                                        </div>
                                        <div className="topic-footer">Last 24 Hours</div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Today's Timetable Section */}
                    <section className="timetable-section">
                        <h2 className="section-title">Mai Órarend</h2>
                        <div className="timetable-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Idő</th>
                                        <th>Terem</th>
                                        <th>Tantárgy</th>
                                        <th>Típus</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>09-10 AM</td>
                                        <td>27-304Y</td>
                                        <td>MTH166</td>
                                        <td>Tutorial</td>
                                    </tr>
                                    <tr>
                                        <td>10-11 AM</td>
                                        <td>27-304Y</td>
                                        <td>MTH166</td>
                                        <td>Lecture</td>
                                    </tr>
                                    <tr>
                                        <td>11-12 PM</td>
                                        <td>27-304Y</td>
                                        <td>MTH166</td>
                                        <td>Tutorial</td>
                                    </tr>
                                    <tr>
                                        <td>12-01 PM</td>
                                        <td>27-304Y</td>
                                        <td>MTH166</td>
                                        <td>Lecture</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </main>

                {/* Right Sidebar */}
                <aside className="right-sidebar">
                    {/* Hírek */}
                    <div className="announcements-card">
                        <h3>Hírek</h3>
                        <div className="announcement-item">
                            <span className="announcement-category">Új Videó</span>
                            <p>Abszolútérték feladatok megoldása</p>
                            <span className="announcement-time">2 perce</span>
                        </div>
                        <div className="announcement-item">
                            <span className="announcement-category">Új Cikk</span>
                            <p>Egyenletek megoldási módszerei</p>
                            <span className="announcement-time">1 órával ezelőtt</span>
                        </div>
                        <div className="announcement-item">
                            <span className="announcement-category">Új Videó</span>
                            <p>Síkgeometria alapok</p>
                            <span className="announcement-time">Tegnap</span>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Chat Button */}

        </div>
    );
}
