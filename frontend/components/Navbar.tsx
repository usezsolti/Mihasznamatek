import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Navbar() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const user = localStorage.getItem('currentUser');
        if (user) {
            setCurrentUser(JSON.parse(user));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        router.push('/');
    };

    return (
        <nav className="bg-white p-4 flex items-center gap-4 shadow-md" suppressHydrationWarning>
            <Link href="/" className="logo mr-auto" aria-label="Mihaszna Matek – Főoldal">
                {/* SVG LOGÓ itt */}
            </Link>

            <Link href="/" className="mr-4 hover:underline">Főoldal</Link>

            {currentUser ? (
                <>
                    <Link href="/dashboard" className="mr-4 hover:underline">Dashboard</Link>
                    <button
                        onClick={handleLogout}
                        className="mr-4 hover:underline text-red-600"
                    >
                        Kijelentkezés
                    </button>
                </>
            ) : (
                <>
                    <Link href="/tasks" className="mr-4 hover:underline">Feladatok</Link>
                    <Link href="/register" className="mr-4 hover:underline">Regisztráció</Link>
                </>
            )}
        </nav>
    );
}
