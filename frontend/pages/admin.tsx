import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Script from "next/script";
import CookieBanner from "../components/CookieBanner";

type UserDoc = {
    uid: string;
    name: string;
    email: string;
    password?: string; // Jelszó tárolása
    grade?: string;
    course: string;
    createdAt: string;
    verified?: boolean;
    verifiedAt?: string;
};

type Task = {
    id: string;
    title: string;
    description: string;
    subject: string;
    difficulty: 'easy' | 'medium' | 'hard';
    dueDate: string;
    completed: boolean;
    assignedBy: string;
    assignedDate: string;
    studentId: string;
};

// Saját adatbázis kezelő
class LocalDatabase {
    private static instance: LocalDatabase;
    private users: UserDoc[] = [];
    private tasks: Task[] = [];

    static getInstance(): LocalDatabase {
        if (!LocalDatabase.instance) {
            LocalDatabase.instance = new LocalDatabase();
        }
        return LocalDatabase.instance;
    }

    constructor() {
        this.loadFromStorage();
    }

    private loadFromStorage() {
        try {
            const storedUsers = localStorage.getItem('admin_users');
            const storedTasks = localStorage.getItem('admin_tasks');

            if (storedUsers) {
                this.users = JSON.parse(storedUsers);
            }
            if (storedTasks) {
                this.tasks = JSON.parse(storedTasks);
            }

            // Debug: logoljuk a betöltött adatokat
            console.log('Admin panel - Betöltött felhasználók:', this.users);
            console.log('Admin panel - Betöltött feladatok:', this.tasks);
        } catch (error) {
            console.error('Hiba az adatok betöltésekor:', error);
        }
    }

    private saveToStorage() {
        try {
            localStorage.setItem('admin_users', JSON.stringify(this.users));
            localStorage.setItem('admin_tasks', JSON.stringify(this.tasks));

            // Debug: logoljuk a mentett adatokat
            console.log('Admin panel - Mentett felhasználók:', this.users);
        } catch (error) {
            console.error('Hiba az adatok mentésekor:', error);
        }
    }

    getUsers(): UserDoc[] {
        return [...this.users];
    }

    addUser(user: Omit<UserDoc, 'uid' | 'createdAt'>): UserDoc {
        const newUser: UserDoc = {
            ...user,
            uid: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString()
        };
        this.users.push(newUser);
        this.saveToStorage();
        return newUser;
    }

    deleteUser(uid: string): boolean {
        const index = this.users.findIndex(user => user.uid === uid);
        if (index !== -1) {
            this.users.splice(index, 1);
            this.tasks = this.tasks.filter(task => task.studentId !== uid);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    getTasks(): Task[] {
        return [...this.tasks];
    }

    getTasksByUser(studentId: string): Task[] {
        return this.tasks.filter(task => task.studentId === studentId);
    }

    addTask(task: Omit<Task, 'id' | 'assignedDate'>): Task {
        const newTask: Task = {
            ...task,
            id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            assignedDate: new Date().toISOString()
        };
        this.tasks.push(newTask);
        this.saveToStorage();
        return newTask;
    }

    deleteTask(id: string): boolean {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this.saveToStorage();
            return true;
        }
        return false;
    }

    loadDemoData() {
        const demoUsers: UserDoc[] = [
            {
                uid: "demo_1",
                name: "Kovács Anna",
                email: "anna@example.com",
                grade: "10. osztály",
                course: "Matematika",
                createdAt: new Date().toISOString()
            },
            {
                uid: "demo_2",
                name: "Nagy Péter",
                email: "peter@example.com",
                grade: "11. osztály",
                course: "Matematika",
                createdAt: new Date().toISOString()
            },
            {
                uid: "demo_3",
                name: "Szabó Eszter",
                email: "eszter@example.com",
                grade: "9. osztály",
                course: "Matematika",
                createdAt: new Date().toISOString()
            }
        ];

        const demoTasks: Task[] = [
            // Kovács Anna feladatai (demo_1)
            {
                id: "task_1",
                title: "Másodfokú egyenletek",
                description: "Oldd meg a következő másodfokú egyenleteket:\n1) x² + 5x + 6 = 0\n2) 2x² - 7x + 3 = 0\n3) x² - 4x + 4 = 0",
                subject: "Matematika",
                difficulty: "medium",
                dueDate: "2024-12-25",
                completed: false,
                assignedBy: "Admin",
                assignedDate: "2024-12-19",
                studentId: "demo_1"
            },
            {
                id: "task_2",
                title: "Trigonometrikus függvények",
                description: "Számítsd ki a következő értékeket:\n1) sin(30°)\n2) cos(60°)\n3) tan(45°)\n4) sin(90°)\n5) cos(0°)",
                subject: "Matematika",
                difficulty: "easy",
                dueDate: "2024-12-22",
                completed: false,
                assignedBy: "Admin",
                assignedDate: "2024-12-19",
                studentId: "demo_1"
            },
            {
                id: "task_3",
                title: "Logaritmusok",
                description: "Oldd meg a következő logaritmusos egyenleteket:\n1) log₂(x) = 3\n2) log₃(x) = 2\n3) log₁₀(x) = 1\n4) ln(x) = 2",
                subject: "Matematika",
                difficulty: "hard",
                dueDate: "2024-12-30",
                completed: false,
                assignedBy: "Admin",
                assignedDate: "2024-12-19",
                studentId: "demo_1"
            },

            // Nagy Péter feladatai (demo_2)
            {
                id: "task_4",
                title: "Deriválás alapjai",
                description: "Számítsd ki a következő függvények deriváltjait:\n1) f(x) = x³ + 2x² - 5x + 1\n2) f(x) = eˣ + ln(x)\n3) f(x) = sin(x) + cos(x)\n4) f(x) = x² · eˣ",
                subject: "Matematika",
                difficulty: "hard",
                dueDate: "2024-12-28",
                completed: true,
                assignedBy: "Admin",
                assignedDate: "2024-12-18",
                studentId: "demo_2"
            },
            {
                id: "task_5",
                title: "Integrálás",
                description: "Számítsd ki a következő integrálokat:\n1) ∫(2x + 1)dx\n2) ∫(x² + 3x)dx\n3) ∫(eˣ)dx\n4) ∫(1/x)dx",
                subject: "Matematika",
                difficulty: "medium",
                dueDate: "2024-12-26",
                completed: false,
                assignedBy: "Admin",
                assignedDate: "2024-12-19",
                studentId: "demo_2"
            },
            {
                id: "task_6",
                title: "Valószínűségszámítás",
                description: "Egy urnában 5 piros, 3 kék és 2 zöld golyó van. Mennyi a valószínűsége, hogy:\n1) Piros golyót húzunk?\n2) Kék vagy zöld golyót húzunk?\n3) Két golyót húzunk visszatevés nélkül, és mindkettő piros?",
                subject: "Matematika",
                difficulty: "medium",
                dueDate: "2024-12-24",
                completed: false,
                assignedBy: "Admin",
                assignedDate: "2024-12-19",
                studentId: "demo_2"
            }
        ];

        this.users = demoUsers;
        this.tasks = demoTasks;
        this.saveToStorage();
    }

    clearDatabase() {
        this.users = [];
        this.tasks = [];
        localStorage.removeItem('admin_users');
        localStorage.removeItem('admin_tasks');
    }
}

export default function Admin() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserDoc[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserDoc | null>(null);
    const [userTasks, setUserTasks] = useState<Task[]>([]);
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [activeTab, setActiveTab] = useState<'users' | 'tasks' | 'new-task' | 'new-user'>('users');
    const [db] = useState(() => LocalDatabase.getInstance());
    const [emailStatus, setEmailStatus] = useState<string>('');
    const [newUserNotification, setNewUserNotification] = useState<string>('');

    // Manuális verifikáció függvény
    const manuallyVerifyUser = (email: string) => {
        try {
            const users = JSON.parse(localStorage.getItem('admin_users') || '[]');
            const userIndex = users.findIndex((u: UserDoc) => u.email === email);

            if (userIndex !== -1) {
                users[userIndex].verified = true;
                users[userIndex].verifiedAt = new Date().toISOString();
                localStorage.setItem('admin_users', JSON.stringify(users));

                // Frissítjük a felhasználók listáját
                setUsers(users);

                // Sikeres verifikáció üzenet
                setEmailStatus('✅ Felhasználó sikeresen verifikálva! Most már be tud jelentkezni.');
                setTimeout(() => setEmailStatus(''), 5000);

                // Console log a verifikációról
                console.log('Felhasználó verifikálva:', email);

                return true;
            } else {
                setEmailStatus('❌ Felhasználó nem található!');
                setTimeout(() => setEmailStatus(''), 3000);
                return false;
            }
        } catch (error) {
            console.error('Manuális verifikáció hiba:', error);
            setEmailStatus('❌ Hiba a verifikáció során!');
            setTimeout(() => setEmailStatus(''), 3000);
            return false;
        }
    };

    // Verifikációs e-mail küldő függvény
    const sendVerificationEmail = async (email: string, name: string, uid: string) => {
        try {
            setEmailStatus('📧 E-mail küldése...');
            console.log("Admin verifikációs e-mail küldés kezdeményezve:", { email, name, uid });

            // EmailJS inicializálás ellenőrzése
            if (typeof window !== 'undefined' && window.emailjs) {
                console.log("EmailJS elérhető az admin panelben");

                // EmailJS inicializálás
                if (!window.emailjs.init) {
                    console.error("EmailJS init függvény nem elérhető");
                    setEmailStatus('❌ EmailJS inicializálási hiba!');
                    setTimeout(() => setEmailStatus(''), 3000);
                    return false;
                }

                // EmailJS inicializálás
                window.emailjs.init("_UgC1pw0jHHqLl6sG");
                console.log("EmailJS inicializálva");

                const verificationToken = btoa(`${uid}_${Date.now()}`);
                const verificationLink = `${window.location.origin}/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

                console.log("Verifikációs link generálva:", verificationLink);

                // Egyszerűsített template paraméterek
                const templateParams = {
                    to_email: 'mihaszna.math@gmail.com', // Fix címzett (mint a main.js-ben)
                    user_name: name,
                    user_email: email, // A felhasználó e-mail címe
                    message: `Szia ${name}!\n\nKérlek kattints a következő linkre az e-mail címed verifikálásához:\n${verificationLink}\n\nÜdvözlettel,\nMIHASZNA Matek`,
                    reply_to: email // Válasz e-mail cím
                };

                console.log("Template paraméterek:", templateParams);
                console.log("EmailJS küldés kezdeményezve...");

                try {
                    // Első próba: template paraméterekkel
                    const result = await window.emailjs.send("service_fnoxi68", "template_rt2i7ou", templateParams);
                    console.log("EmailJS válasz:", result);

                    // Token mentése localStorage-ba
                    const pendingVerifications = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
                    pendingVerifications.push({
                        email,
                        uid,
                        token: verificationToken,
                        createdAt: new Date().toISOString()
                    });
                    localStorage.setItem('pending_verifications', JSON.stringify(pendingVerifications));

                    setEmailStatus('✅ E-mail sikeresen elküldve! Kérlek ellenőrizd a spam mappát is.');
                    setTimeout(() => setEmailStatus(''), 5000);
                    return true;
                } catch (emailError: unknown) {
                    console.error("EmailJS küldési hiba (első próba):", emailError);

                    // Második próba: egyszerűbb paraméterekkel (mint a main.js-ben)
                    try {
                        console.log("Második próba: egyszerűbb paraméterekkel...");
                        const simpleParams = {
                            to_email: email,
                            user_name: name,
                            user_email: email,
                            message: `Szia ${name}!\n\nKérlek kattints a következő linkre az e-mail címed verifikálásához:\n${verificationLink}\n\nÜdvözlettel,\nMIHASZNA Matek`,
                            reply_to: email
                        };

                        const result2 = await window.emailjs.send("service_fnoxi68", "template_rt2i7ou", simpleParams);
                        console.log("EmailJS válasz (második próba):", result2);

                        // Token mentése localStorage-ba
                        const pendingVerifications = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
                        pendingVerifications.push({
                            email,
                            uid,
                            token: verificationToken,
                            createdAt: new Date().toISOString()
                        });
                        localStorage.setItem('pending_verifications', JSON.stringify(pendingVerifications));

                        setEmailStatus('✅ E-mail sikeresen elküldve! (Második próba) Kérlek ellenőrizd a spam mappát is.');
                        setTimeout(() => setEmailStatus(''), 5000);
                        return true;
                    } catch (simpleError: unknown) {
                        console.error("EmailJS küldési hiba (második próba):", simpleError);

                        // Részletes hibaüzenet
                        const errorMessage = (simpleError as { text?: string; message?: string })?.text || (simpleError as { text?: string; message?: string })?.message || 'Ismeretlen hiba';
                        console.error("Hiba részletek:", errorMessage);

                        setEmailStatus(`❌ E-mail küldési hiba: ${errorMessage}`);

                        // Harmadik próba: sendForm metódus (mint a main.js-ben)
                        try {
                            console.log("Harmadik próba: sendForm metódus...");

                            // Létrehozunk egy ideiglenes form-ot
                            const tempForm = document.createElement('form');
                            tempForm.style.display = 'none';

                            const addField = (name: string, value: string) => {
                                const input = document.createElement('input');
                                input.type = 'hidden';
                                input.name = name;
                                input.value = value;
                                tempForm.appendChild(input);
                            };

                            addField('to_email', email);
                            addField('user_name', name);
                            addField('user_email', email);
                            addField('message', `Szia ${name}!\n\nKérlek kattints a következő linkre az e-mail címed verifikálásához:\n${verificationLink}\n\nÜdvözlettel,\nMIHASZNA Matek`);
                            addField('reply_to', email);

                            document.body.appendChild(tempForm);

                            const result3 = await window.emailjs.sendForm("service_fnoxi68", "template_rt2i7ou", tempForm);
                            console.log("EmailJS válasz (harmadik próba):", result3);

                            document.body.removeChild(tempForm);

                            // Token mentése localStorage-ba
                            const pendingVerifications = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
                            pendingVerifications.push({
                                email,
                                uid,
                                token: verificationToken,
                                createdAt: new Date().toISOString()
                            });
                            localStorage.setItem('pending_verifications', JSON.stringify(pendingVerifications));

                            setEmailStatus('✅ E-mail sikeresen elküldve! (Harmadik próba) Kérlek ellenőrizd a spam mappát is.');
                            setTimeout(() => setEmailStatus(''), 5000);
                            return true;
                        } catch (formError: unknown) {
                            console.error("EmailJS küldési hiba (harmadik próba):", formError);

                            const finalErrorMessage = (formError as { text?: string; message?: string })?.text || (formError as { text?: string; message?: string })?.message || 'Ismeretlen hiba';
                            setEmailStatus(`❌ E-mail küldési hiba (minden próba sikertelen): ${finalErrorMessage}`);
                            setTimeout(() => setEmailStatus(''), 5000);
                            return false;
                        }
                    }
                }
            } else {
                console.error("EmailJS nem elérhető az admin panelben");
                setEmailStatus('❌ EmailJS nem elérhető! Kérlek frissítsd az oldalt.');
                setTimeout(() => setEmailStatus(''), 5000);
                return false;
            }
        } catch (error: unknown) {
            console.error('Verifikációs e-mail hiba:', error);
            setEmailStatus(`❌ Hiba az e-mail küldésekor: ${(error as { message?: string })?.message || 'Ismeretlen hiba'}`);
            setTimeout(() => setEmailStatus(''), 5000);
            return false;
        }
    };

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        subject: 'Matematika',
        difficulty: 'medium' as 'easy' | 'medium' | 'hard',
        dueDate: ''
    });

    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        grade: '',
        course: 'Matematika'
    });

    useEffect(() => {
        // EmailJS inicializálás
        if (typeof window !== 'undefined') {
            const checkEmailJS = () => {
                if (window.emailjs) {
                    console.log("EmailJS betöltődött, inicializálás...");
                    try {
                        window.emailjs.init("_UgC1pw0jHHqLl6sG");
                        console.log("EmailJS sikeresen inicializálva");
                        setEmailStatus('✅ EmailJS készen áll az e-mail küldésre');
                        setTimeout(() => setEmailStatus(''), 3000);
                    } catch (error) {
                        console.error("EmailJS inicializálási hiba:", error);
                        setEmailStatus('❌ EmailJS inicializálási hiba');
                        setTimeout(() => setEmailStatus(''), 3000);
                    }
                } else {
                    console.log("EmailJS még nem töltődött be, újrapróbálás...");
                    setTimeout(checkEmailJS, 1000);
                }
            };
            checkEmailJS();
        }

        const loadData = () => {
            const allUsers = db.getUsers();
            const allTasksData = db.getTasks();

            setUsers(allUsers);
            setAllTasks(allTasksData);

            if (selectedUser) {
                const userTasksData = db.getTasksByUser(selectedUser.uid);
                setUserTasks(userTasksData);
            }

            setLoading(false);
        };

        loadData();

        // Automatikus frissítés minden 3 másodpercben
        const interval = setInterval(() => {
            const currentUsers = db.getUsers();
            const currentTasks = db.getTasks();

            // Csak akkor frissítünk, ha változás történt
            if (currentUsers.length !== users.length || currentTasks.length !== allTasks.length) {
                console.log('Automatikus frissítés - új adatok észlelve');
                loadData();
            }
        }, 3000);

        // localStorage változások figyelése
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'admin_users' || e.key === 'admin_tasks') {
                console.log('Admin panel - localStorage változás észlelve:', e.key);
                loadData();
            }
        };

        // Figyeljük a localStorage változásokat (másik tab-ból)
        window.addEventListener('storage', handleStorageChange);

        // Polling az admin_users frissítéséhez (ugyanabban a tab-ban)
        const userPollingInterval = setInterval(() => {
            const storedUsers = localStorage.getItem('admin_users');
            if (storedUsers) {
                const currentUsers = JSON.parse(storedUsers);
                if (currentUsers.length !== users.length) {
                    const newUsersCount = currentUsers.length - users.length;
                    console.log('Admin panel - Új felhasználók észlelve:', newUsersCount);

                    // Értesítés megjelenítése
                    if (newUsersCount > 0) {
                        setNewUserNotification(`🎉 ${newUsersCount} új felhasználó regisztrált!`);
                        setTimeout(() => setNewUserNotification(''), 5000);

                        // E-mail küldés az új felhasználókhoz (automatikus verifikáció helyett)
                        const newUsers = currentUsers.slice(-newUsersCount);
                        newUsers.forEach((user: UserDoc) => {
                            if (!user.verified) {
                                console.log('Verifikációs e-mail küldése:', user.email);
                                sendVerificationEmail(user.email, user.name, user.uid);
                            }
                        });
                    }

                    setUsers(currentUsers);
                }
            }
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(userPollingInterval);
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [db, selectedUser, users.length, allTasks.length]);

    const loadUserData = (user: UserDoc) => {
        setSelectedUser(user);
        setActiveTab('tasks');
        const userTasksData = db.getTasksByUser(user.uid);
        setUserTasks(userTasksData);
    };

    const assignTask = () => {
        if (!selectedUser || !newTask.title || !newTask.description || !newTask.dueDate) return;

        db.addTask({
            ...newTask,
            studentId: selectedUser.uid,
            assignedBy: "Admin",
            completed: false
        });

        setAllTasks(db.getTasks());
        setUserTasks(db.getTasksByUser(selectedUser.uid));

        setNewTask({
            title: '',
            description: '',
            subject: 'Matematika',
            difficulty: 'medium',
            dueDate: ''
        });

        setActiveTab('tasks');
    };

    const deleteTask = (taskId: string) => {
        if (!confirm("Biztosan törölni szeretnéd?")) return;

        db.deleteTask(taskId);
        setAllTasks(db.getTasks());
        if (selectedUser) {
            setUserTasks(db.getTasksByUser(selectedUser.uid));
        }
    };

    const addUser = () => {
        if (!newUser.name || !newUser.email || !newUser.grade) return;

        db.addUser(newUser);
        setUsers(db.getUsers());

        setNewUser({
            name: '',
            email: '',
            grade: '',
            course: 'Matematika'
        });

        setActiveTab('users');
    };

    const deleteUser = async (uid: string) => {
        if (!confirm("Biztosan törölni szeretnéd? A felhasználó összes feladata is törlődni fog!")) return;

        try {
            // Firebase Auth törlése is (ha lehetséges)
            if (typeof window !== 'undefined' && window.firebase) {
                const user = users.find(u => u.uid === uid);
                if (user) {
                    console.log("Firebase Auth törlés próbálása...");
                    // Megjegyzés: Firebase Auth törlés admin jogosultságot igényel
                }
            }

            // Lokális adatbázis törlése
            db.deleteUser(uid);
            setUsers(db.getUsers());
            setAllTasks(db.getTasks());

            if (selectedUser?.uid === uid) {
                setSelectedUser(null);
                setUserTasks([]);
            }

            setEmailStatus('Felhasználó törölve!');
            setTimeout(() => setEmailStatus(''), 3000);
        } catch (error) {
            console.error('Felhasználó törlési hiba:', error);
            setEmailStatus('Hiba a törlés során!');
            setTimeout(() => setEmailStatus(''), 3000);
        }
    };

    const loadDemoData = () => {
        db.loadDemoData();
        setUsers(db.getUsers());
        setAllTasks(db.getTasks());
        if (selectedUser) {
            setUserTasks(db.getTasksByUser(selectedUser.uid));
        }
    };

    const clearDatabase = () => {
        if (!confirm("Biztosan törölni szeretnéd az összes adatot? Ez nem vonható vissza!")) return;

        db.clearDatabase();
        setUsers([]);
        setAllTasks([]);
        setSelectedUser(null);
        setUserTasks([]);
    };

    const refreshData = () => {
        // Frissítjük az adatokat a localStorage-ból
        const allUsers = db.getUsers();
        const allTasksData = db.getTasks();

        setUsers(allUsers);
        setAllTasks(allTasksData);

        if (selectedUser) {
            const userTasksData = db.getTasksByUser(selectedUser.uid);
            setUserTasks(userTasksData);
        }

        console.log('Adatok frissítve:', allUsers);
    };

    const importFirebaseUsers = async () => {
        if (!confirm("Importáljuk a Firebase-ből a regisztrált felhasználókat?")) return;

        try {
            if (window.firebase && window.firebase.firestore) {
                const firestore = window.firebase.firestore();
                const snapshot = await firestore.collection("users").get();

                let importedCount = 0;
                snapshot.forEach((doc: { data: () => UserDoc; id: string }) => {
                    const userData = doc.data();
                    const uid = doc.id;

                    // Ellenőrizzük, hogy nincs-e már ilyen felhasználó
                    const existingUser = users.find(u => u.uid === uid || u.email === userData.email);
                    if (!existingUser) {
                        const newUser = {
                            uid: uid,
                            name: userData.name || 'Ismeretlen',
                            email: userData.email || '',
                            grade: userData.grade || 'Nincs megadva',
                            course: userData.course || 'Matematika',
                            createdAt: userData.createdAt || new Date().toISOString()
                        };

                        db.addUser({
                            name: newUser.name,
                            email: newUser.email,
                            grade: newUser.grade,
                            course: newUser.course
                        });
                        importedCount++;
                    }
                });

                // Frissítjük a listát
                setUsers(db.getUsers());

                if (importedCount > 0) {
                    alert(`${importedCount} új felhasználó importálva!`);
                } else {
                    alert('Nincs új felhasználó az importáláshoz.');
                }
            } else {
                alert('Firebase nem elérhető!');
            }
        } catch (error) {
            console.error('Hiba az importáláskor:', error);
            alert('Hiba történt az importáláskor!');
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'hard': return '#F44336';
            default: return '#666';
        }
    };

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'Könnyű';
            case 'medium': return 'Közepes';
            case 'hard': return 'Nehéz';
            default: return 'Ismeretlen';
        }
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontFamily: 'Montserrat, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '3px solid rgba(255,255,255,0.3)',
                        borderTop: '3px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 20px'
                    }}></div>
                    <h2>Admin Panel Betöltése</h2>
                </div>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Admin Panel - Mihaszna Matek</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </Head>

            {/* EmailJS */}
            <Script
                src="https://cdn.emailjs.com/sdk/2.3.2/email.min.js"
                strategy="beforeInteractive"
            />

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                fontFamily: 'Montserrat, sans-serif',
                color: 'white'
            }}>
                <style jsx global>{`
                    * {
                        color: #39FF14 !important;
                    }
                    input, textarea, select {
                        color: #39FF14 !important;
                    }
                    input::placeholder, textarea::placeholder {
                        color: rgba(57, 255, 20, 0.7) !important;
                    }
                `}</style>
                {emailStatus && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        background: emailStatus.includes('sikeresen') ? 'rgba(76, 175, 80, 0.9)' : 'rgba(244, 67, 54, 0.9)',
                        color: 'white',
                        padding: '15px 20px',
                        borderRadius: '10px',
                        zIndex: 1000,
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}>
                        {emailStatus}
                    </div>
                )}

                <nav style={{
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '15px 30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '20px',
                            fontWeight: 'bold'
                        }}>
                            ∑
                        </div>
                        <h1 style={{ margin: 0, fontSize: '24px', color: '#39FF14' }}>Admin Panel</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <button
                            onClick={refreshData}
                            style={{
                                background: 'rgba(76, 175, 80, 0.3)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Frissítés
                        </button>
                        <button
                            onClick={loadDemoData}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}
                        >
                            🎭 Demo
                        </button>
                        <button
                            onClick={importFirebaseUsers}
                            style={{
                                background: 'rgba(0,150,255,0.3)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}
                        >
                            🔄 Firebase Import
                        </button>
                        <button
                            onClick={clearDatabase}
                            style={{
                                background: 'rgba(244, 67, 54, 0.3)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}
                        >
                            🗑️ Törlés
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            style={{
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '25px',
                                cursor: 'pointer'
                            }}
                        >
                            🏠 Kezdőlap
                        </button>
                    </div>
                </nav>

                <div style={{ padding: '30px' }}>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '25px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            transform: 'translateY(0)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}>
                            <div style={{ fontSize: '30px', marginBottom: '10px' }}>👥</div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#39FF14' }}>{users.length}</h3>
                            <p style={{ margin: 0, color: '#39FF14' }}>Felhasználók</p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '25px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            transform: 'translateY(0)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}>
                            <div style={{ fontSize: '30px', marginBottom: '10px' }}>📝</div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#39FF14' }}>{allTasks.length}</h3>
                            <p style={{ margin: 0, color: '#39FF14' }}>Feladatok</p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '25px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            transform: 'translateY(0)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}>
                            <div style={{ fontSize: '30px', marginBottom: '10px' }}>✅</div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#39FF14' }}>{allTasks.filter(task => task.completed).length}</h3>
                            <p style={{ margin: 0, color: '#39FF14' }}>Befejezett</p>
                        </div>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            padding: '25px',
                            borderRadius: '15px',
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer',
                            transform: 'translateY(0)',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-10px)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.2)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}>
                            <div style={{ fontSize: '30px', marginBottom: '10px' }}>🆕</div>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '28px', color: '#FF49DB' }}>{users.filter(user => new Date(user.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000).length}</h3>
                            <p style={{ margin: 0, color: '#FF49DB' }}>Új (24h)</p>
                        </div>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '300px 1fr',
                        gap: '30px',
                        height: 'calc(100vh - 300px)'
                    }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '15px',
                            padding: '20px',
                            overflowY: 'auto'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '20px'
                            }}>
                                <h3 style={{ margin: 0 }}>👥 Felhasználók</h3>
                                <button
                                    onClick={() => setActiveTab('new-user')}
                                    style={{
                                        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                        border: 'none',
                                        color: 'white',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '16px'
                                    }}
                                >
                                    ➕
                                </button>
                            </div>

                            {/* Új felhasználó értesítés */}
                            {newUserNotification && (
                                <div style={{
                                    background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                    color: 'white',
                                    padding: '10px 15px',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    textAlign: 'center',
                                    animation: 'fadeInUp 0.5s ease-out',
                                    boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                                }}>
                                    {newUserNotification}
                                </div>
                            )}

                            {/* Verifikáció státusz */}
                            {emailStatus && (
                                <div style={{
                                    background: emailStatus.includes('✅') ? 'linear-gradient(45deg, #4CAF50, #45a049)' :
                                        emailStatus.includes('❌') ? 'linear-gradient(45deg, #f44336, #d32f2f)' :
                                            'linear-gradient(45deg, #2196F3, #1976D2)',
                                    color: 'white',
                                    padding: '10px 15px',
                                    borderRadius: '8px',
                                    marginBottom: '15px',
                                    textAlign: 'center',
                                    animation: 'fadeInUp 0.5s ease-out',
                                    boxShadow: emailStatus.includes('✅') ? '0 4px 12px rgba(76, 175, 80, 0.3)' :
                                        emailStatus.includes('❌') ? '0 4px 12px rgba(244, 67, 54, 0.3)' :
                                            '0 4px 12px rgba(33, 150, 243, 0.3)'
                                }}>
                                    {emailStatus}
                                </div>
                            )}

                            {/* EmailJS teszt gomb */}
                            <button
                                onClick={() => {
                                    const testEmail = prompt('Add meg a teszt e-mail címet:');
                                    if (testEmail) {
                                        console.log('EmailJS teszt küldés:', testEmail);
                                        console.log('E-mail cím ellenőrzés:');
                                        console.log('- to_email: mihaszna.math@gmail.com (fix)');
                                        console.log('- user_email:', testEmail);
                                        console.log('- reply_to:', testEmail);

                                        // Teszt e-mail küldése
                                        sendVerificationEmail(testEmail, 'Teszt Felhasználó', 'test_uid').then((success) => {
                                            if (success) {
                                                // Sikeres küldés után automatikusan megnyitjuk a verifikációs linket
                                                setTimeout(() => {
                                                    const pendingVerifications = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
                                                    const latestVerification = pendingVerifications[pendingVerifications.length - 1];

                                                    if (latestVerification && latestVerification.token) {
                                                        const verificationLink = `${window.location.origin}/verify?token=${latestVerification.token}&email=${encodeURIComponent(testEmail)}`;
                                                        console.log('Verifikációs link megnyitása:', verificationLink);
                                                        window.open(verificationLink, '_blank');
                                                    }
                                                }, 2000); // 2 másodperc várakozás
                                            }
                                        });
                                    }
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #FF9800, #F57C00)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginBottom: '15px',
                                    width: '100%'
                                }}
                                title="EmailJS teszt e-mail küldése és verifikációs link megnyitása"
                            >
                                🧪 EmailJS Teszt + Link
                            </button>

                            {/* Közvetlen e-mail küldés gomb */}
                            <button
                                onClick={() => {
                                    const testEmail = prompt('Add meg a teszt e-mail címet (közvetlen küldés):');
                                    if (testEmail) {
                                        console.log('Közvetlen e-mail küldés:', testEmail);

                                        // Különböző paraméter kombinációk tesztelése
                                        const testParams = [
                                            {
                                                name: 'Teszt 1 - to_email',
                                                params: {
                                                    to_email: testEmail,
                                                    user_name: 'Teszt Felhasználó',
                                                    user_email: testEmail,
                                                    message: `Szia Teszt Felhasználó!\n\nEz egy teszt e-mail a verifikációs rendszer ellenőrzéséhez.\n\nÜdvözlettel,\nMIHASZNA Matek`,
                                                    reply_to: 'mihaszna.math@gmail.com'
                                                }
                                            },
                                            {
                                                name: 'Teszt 2 - user_email',
                                                params: {
                                                    to_email: 'mihaszna.math@gmail.com',
                                                    user_name: 'Teszt Felhasználó',
                                                    user_email: testEmail,
                                                    message: `Szia Teszt Felhasználó!\n\nEz egy teszt e-mail a verifikációs rendszer ellenőrzéséhez.\n\nÜdvözlettel,\nMIHASZNA Matek`,
                                                    reply_to: testEmail
                                                }
                                            },
                                            {
                                                name: 'Teszt 3 - reply_to',
                                                params: {
                                                    to_email: 'mihaszna.math@gmail.com',
                                                    user_name: 'Teszt Felhasználó',
                                                    user_email: 'mihaszna.math@gmail.com',
                                                    message: `Szia Teszt Felhasználó!\n\nEz egy teszt e-mail a verifikációs rendszer ellenőrzéséhez.\n\nÜdvözlettel,\nMIHASZNA Matek`,
                                                    reply_to: testEmail
                                                }
                                            }
                                        ];

                                        // Első teszt küldése
                                        const firstTest = testParams[0];
                                        console.log(`${firstTest.name} paraméterek:`, firstTest.params);

                                        if (typeof window !== 'undefined' && window.emailjs) {
                                            window.emailjs.send("service_fnoxi68", "template_rt2i7ou", firstTest.params).then(
                                                (result: { text: string }) => {
                                                    console.log(`${firstTest.name} sikeres:`, result);
                                                    setEmailStatus(`✅ ${firstTest.name} sikeresen elküldve!`);
                                                    setTimeout(() => setEmailStatus(''), 5000);
                                                },
                                                (error: { text?: string; message?: string }) => {
                                                    console.error(`${firstTest.name} hiba:`, error);
                                                    setEmailStatus(`❌ ${firstTest.name} küldési hiba!`);
                                                    setTimeout(() => setEmailStatus(''), 5000);
                                                }
                                            );
                                        }
                                    }
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #E91E63, #C2185B)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginBottom: '15px',
                                    width: '100%'
                                }}
                                title="Közvetlen e-mail küldés a felhasználó címére"
                            >
                                📧 Közvetlen E-mail (Teszt 1)
                            </button>

                            {/* Teszt 2 gomb */}
                            <button
                                onClick={() => {
                                    const testEmail = prompt('Add meg a teszt e-mail címet (Teszt 2):');
                                    if (testEmail) {
                                        console.log('Teszt 2 - user_email:', testEmail);

                                        const testParams = {
                                            to_email: 'mihaszna.math@gmail.com',
                                            user_name: 'Teszt Felhasználó',
                                            user_email: testEmail,
                                            message: `Szia Teszt Felhasználó!\n\nEz egy teszt e-mail a verifikációs rendszer ellenőrzéséhez.\n\nÜdvözlettel,\nMIHASZNA Matek`,
                                            reply_to: testEmail
                                        };

                                        console.log('Teszt 2 paraméterek:', testParams);

                                        if (typeof window !== 'undefined' && window.emailjs) {
                                            window.emailjs.send("service_fnoxi68", "template_rt2i7ou", testParams).then(
                                                (result: { text: string }) => {
                                                    console.log('Teszt 2 sikeres:', result);
                                                    setEmailStatus('✅ Teszt 2 sikeresen elküldve!');
                                                    setTimeout(() => setEmailStatus(''), 5000);
                                                },
                                                (error: { text?: string; message?: string }) => {
                                                    console.error('Teszt 2 hiba:', error);
                                                    setEmailStatus('❌ Teszt 2 küldési hiba!');
                                                    setTimeout(() => setEmailStatus(''), 5000);
                                                }
                                            );
                                        }
                                    }
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #9C27B0, #673AB7)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginBottom: '15px',
                                    width: '100%'
                                }}
                                title="Teszt 2 - user_email paraméter"
                            >
                                📧 Teszt 2 (user_email)
                            </button>

                            {/* Teszt 3 gomb */}
                            <button
                                onClick={() => {
                                    const testEmail = prompt('Add meg a teszt e-mail címet (Teszt 3):');
                                    if (testEmail) {
                                        console.log('Teszt 3 - reply_to:', testEmail);

                                        const testParams = {
                                            to_email: 'mihaszna.math@gmail.com',
                                            user_name: 'Teszt Felhasználó',
                                            user_email: 'mihaszna.math@gmail.com',
                                            message: `Szia Teszt Felhasználó!\n\nEz egy teszt e-mail a verifikációs rendszer ellenőrzéséhez.\n\nÜdvözlettel,\nMIHASZNA Matek`,
                                            reply_to: testEmail
                                        };

                                        console.log('Teszt 3 paraméterek:', testParams);

                                        if (typeof window !== 'undefined' && window.emailjs) {
                                            window.emailjs.send("service_fnoxi68", "template_rt2i7ou", testParams).then(
                                                (result: { text: string }) => {
                                                    console.log('Teszt 3 sikeres:', result);
                                                    setEmailStatus('✅ Teszt 3 sikeresen elküldve!');
                                                    setTimeout(() => setEmailStatus(''), 5000);
                                                },
                                                (error: { text?: string; message?: string }) => {
                                                    console.error('Teszt 3 hiba:', error);
                                                    setEmailStatus('❌ Teszt 3 küldési hiba!');
                                                    setTimeout(() => setEmailStatus(''), 5000);
                                                }
                                            );
                                        }
                                    }
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #3F51B5, #303F9F)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginBottom: '15px',
                                    width: '100%'
                                }}
                                title="Teszt 3 - reply_to paraméter"
                            >
                                📧 Teszt 3 (reply_to)
                            </button>

                            {/* EmailJS debug információk */}
                            <div style={{
                                background: 'rgba(255,255,255,0.05)',
                                padding: '10px',
                                borderRadius: '8px',
                                marginBottom: '15px',
                                fontSize: '11px',
                                color: 'white'
                            }}>
                                <div><strong>EmailJS Debug:</strong></div>
                                <div>Elérhető: {typeof window !== 'undefined' && window.emailjs ? '✅ Igen' : '❌ Nem'}</div>
                                <div>Init: {typeof window !== 'undefined' && window.emailjs ? '✅ Igen' : '❌ Nem'}</div>
                                <div>Service: service_fnoxi68</div>
                                <div>Template: template_rt2i7ou</div>
                                <div>API Key: _UgC1pw0jHHqLl6sG</div>
                                <div>Pending: {(() => {
                                    if (typeof window !== 'undefined') {
                                        const pending = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
                                        return pending.length;
                                    }
                                    return 0;
                                })()} db</div>
                                <div style={{ marginTop: '8px', padding: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px' }}>
                                    <div><strong>E-mail cím beállítás:</strong></div>
                                    <div>to_email: mihaszna.math@gmail.com (fix)</div>
                                    <div>user_email: [felhasználó e-mail]</div>
                                    <div>reply_to: [felhasználó e-mail]</div>
                                    <div style={{ marginTop: '5px', fontSize: '10px', color: '#FFA500' }}>
                                        ⚠️ Az EmailJS template beállításaiban valószínűleg a user_email mező a címzett!
                                    </div>
                                </div>
                            </div>

                            {/* Debug gomb */}
                            <button
                                onClick={() => {
                                    const pendingVerifications = JSON.parse(localStorage.getItem('pending_verifications') || '[]');
                                    console.log('Pending verifications:', pendingVerifications);
                                    alert(`Pending verifications: ${pendingVerifications.length}\n\n${JSON.stringify(pendingVerifications, null, 2)}`);
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #607D8B, #455A64)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginBottom: '15px',
                                    width: '100%'
                                }}
                                title="Pending verifications megjelenítése"
                            >
                                🔍 Debug Pending
                            </button>

                            {/* EmailJS template beállítás ellenőrző */}
                            <button
                                onClick={() => {
                                    alert(`EmailJS Template Beállítások:\n\n` +
                                        `Service ID: service_fnoxi68\n` +
                                        `Template ID: template_rt2i7ou\n` +
                                        `API Key: _UgC1pw0jHHqLl6sG\n\n` +
                                        `Lehetséges paraméterek:\n` +
                                        `- to_email: Címzett e-mail címe\n` +
                                        `- user_email: Felhasználó e-mail címe\n` +
                                        `- reply_to: Válasz e-mail címe\n` +
                                        `- user_name: Felhasználó neve\n` +
                                        `- message: E-mail tartalma\n\n` +
                                        `A template beállításaiban valószínűleg a user_email mező a címzett!`);
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #FF5722, #E64A19)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginBottom: '15px',
                                    width: '100%'
                                }}
                                title="EmailJS template beállítások megjelenítése"
                            >
                                ⚙️ Template Beállítások
                            </button>

                            {/* EmailJS újratöltés gomb */}
                            <button
                                onClick={() => {
                                    if (typeof window !== 'undefined' && window.emailjs) {
                                        try {
                                            window.emailjs.init("_UgC1pw0jHHqLl6sG");
                                            setEmailStatus('✅ EmailJS újrainicializálva!');
                                            setTimeout(() => setEmailStatus(''), 3000);
                                        } catch {
                                            setEmailStatus('❌ EmailJS újrainicializálási hiba!');
                                            setTimeout(() => setEmailStatus(''), 3000);
                                        }
                                    } else {
                                        setEmailStatus('❌ EmailJS nem elérhető!');
                                        setTimeout(() => setEmailStatus(''), 3000);
                                    }
                                }}
                                style={{
                                    background: 'linear-gradient(45deg, #9C27B0, #673AB7)',
                                    color: 'white',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginBottom: '15px',
                                    width: '100%'
                                }}
                                title="EmailJS újrainicializálása"
                            >
                                🔄 EmailJS Újratöltés
                            </button>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {users.map((user, index) => (
                                    <div
                                        key={user.uid}
                                        onClick={() => loadUserData(user)}
                                        style={{
                                            background: selectedUser?.uid === user.uid ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                            padding: '15px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                            transform: 'translateY(0)',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedUser?.uid !== user.uid) {
                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedUser?.uid !== user.uid) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            }
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                background: 'linear-gradient(45deg, #39FF14, #FF49DB)',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '16px',
                                                fontWeight: 'bold'
                                            }}>
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ margin: '0 0 5px 0' }}>{user.name}</h4>
                                                <p style={{ margin: 0, fontSize: '12px', color: 'white' }}>{user.email}</p>
                                                <span style={{ fontSize: '11px', color: 'white' }}>{user.grade}</span>
                                                <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
                                                    {user.verified ? (
                                                        <span style={{ fontSize: '10px', color: '#4CAF50' }}>✅ Verifikált</span>
                                                    ) : (
                                                        <span style={{ fontSize: '10px', color: '#FF9800' }}>⚠️ Nem verifikált</span>
                                                    )}
                                                    {/* Új felhasználó címke - az elmúlt 24 órában regisztrált */}
                                                    {new Date(user.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                                                        <span style={{
                                                            fontSize: '10px',
                                                            color: '#FF49DB',
                                                            background: 'rgba(255, 73, 219, 0.2)',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            🆕 Új
                                                        </span>
                                                    )}

                                                    {/* E-mail küldési gomb új felhasználókhoz */}
                                                    {new Date(user.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && !user.verified && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (confirm(`Verifikációs e-mailt küldesz a felhasználónak: ${user.name}?`)) {
                                                                    sendVerificationEmail(user.email, user.name, user.uid);
                                                                }
                                                            }}
                                                            style={{
                                                                fontSize: '10px',
                                                                color: '#2196F3',
                                                                background: 'rgba(33, 150, 243, 0.2)',
                                                                border: '1px solid #2196F3',
                                                                padding: '2px 6px',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                marginLeft: '5px'
                                                            }}
                                                            title="Verifikációs e-mail küldése"
                                                        >
                                                            📧 E-mail
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        sendVerificationEmail(user.email, user.name, user.uid);
                                                    }}
                                                    style={{
                                                        background: 'rgba(57, 255, 20, 0.3)',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                    title="Verifikációs e-mail küldése"
                                                >
                                                    📧
                                                </button>
                                                {!user.verified && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Biztosan verifikálni szeretnéd a felhasználót: ${user.name}?`)) {
                                                                manuallyVerifyUser(user.email);
                                                            }
                                                        }}
                                                        style={{
                                                            background: 'rgba(33, 150, 243, 0.3)',
                                                            border: 'none',
                                                            color: 'white',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontSize: '12px'
                                                        }}
                                                        title="Manuális verifikáció"
                                                    >
                                                        ✅
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteUser(user.uid);
                                                    }}
                                                    style={{
                                                        background: 'rgba(244, 67, 54, 0.3)',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        cursor: 'pointer',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '15px',
                            padding: '25px',
                            overflowY: 'auto'
                        }}>
                            {activeTab === 'new-user' && (
                                <div>
                                    <h3 style={{ color: 'white' }}>Új felhasználó</h3>
                                    <form onSubmit={(e) => { e.preventDefault(); addUser(); }}>
                                        <div style={{ display: 'grid', gap: '20px' }}>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Név *</label>
                                                <input
                                                    type="text"
                                                    value={newUser.name}
                                                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        color: 'white'
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Email *</label>
                                                <input
                                                    type="email"
                                                    value={newUser.email}
                                                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                                    required
                                                    style={{
                                                        width: '100%',
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        border: '1px solid rgba(255,255,255,0.2)',
                                                        background: 'rgba(255,255,255,0.1)',
                                                        color: 'white'
                                                    }}
                                                />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Évfolyam *</label>
                                                    <input
                                                        type="text"
                                                        value={newUser.grade}
                                                        onChange={(e) => setNewUser({ ...newUser, grade: e.target.value })}
                                                        required
                                                        placeholder="pl. 10. osztály"
                                                        style={{
                                                            width: '100%',
                                                            padding: '12px',
                                                            borderRadius: '8px',
                                                            border: '1px solid rgba(255,255,255,0.2)',
                                                            background: 'rgba(255,255,255,0.1)',
                                                            color: 'white'
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Kurzus</label>
                                                    <select
                                                        value={newUser.course}
                                                        onChange={(e) => setNewUser({ ...newUser, course: e.target.value })}
                                                        style={{
                                                            width: '100%',
                                                            padding: '12px',
                                                            borderRadius: '8px',
                                                            border: '1px solid rgba(255,255,255,0.2)',
                                                            background: 'rgba(255,255,255,0.1)',
                                                            color: 'white'
                                                        }}
                                                    >
                                                        <option value="Matematika">Matematika</option>
                                                        <option value="Fizika">Fizika</option>
                                                        <option value="Kémia">Kémia</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                gap: '15px',
                                                justifyContent: 'flex-end'
                                            }}>
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTab('users')}
                                                    style={{
                                                        background: 'rgba(255,255,255,0.1)',
                                                        border: '1px solid rgba(255,255,255,0.3)',
                                                        color: 'white',
                                                        padding: '12px 25px',
                                                        borderRadius: '25px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    Mégse
                                                </button>
                                                <button
                                                    type="submit"
                                                    style={{
                                                        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '12px 25px',
                                                        borderRadius: '25px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold'
                                                    }}
                                                >
                                                    Hozzáadás
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {selectedUser && activeTab !== 'new-user' && (
                                <>
                                    <div style={{ marginBottom: '25px' }}>
                                        <h2 style={{ margin: '0 0 5px 0', color: 'white' }}>{selectedUser.name}</h2>
                                        <p style={{ margin: 0, color: 'white' }}>{selectedUser.email} • {selectedUser.grade}</p>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginBottom: '25px'
                                    }}>
                                        <button
                                            onClick={() => setActiveTab('users')}
                                            style={{
                                                background: activeTab === 'users' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            👤 Adatok
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('tasks')}
                                            style={{
                                                background: activeTab === 'tasks' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)',
                                                border: 'none',
                                                color: 'white',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            📝 Feladatok ({userTasks.length})
                                        </button>
                                    </div>

                                    {activeTab === 'users' && (
                                        <div>
                                            <h3 style={{ color: 'white' }}>Felhasználó adatok</h3>
                                            <div style={{ display: 'grid', gap: '15px' }}>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', color: 'white' }}>
                                                    <strong>Név:</strong> {selectedUser.name}
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', color: 'white' }}>
                                                    <strong>Email:</strong> {selectedUser.email}
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', color: 'white' }}>
                                                    <strong>Évfolyam:</strong> {selectedUser.grade}
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', color: 'white' }}>
                                                    <strong>Kurzus:</strong> {selectedUser.course}
                                                </div>
                                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '10px', color: 'white' }}>
                                                    <strong>Regisztráció:</strong> {new Date(selectedUser.createdAt).toLocaleDateString('hu-HU')}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'tasks' && (
                                        <div>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '20px'
                                            }}>
                                                <h3 style={{ margin: 0, color: 'white' }}>Feladatok</h3>
                                                <button
                                                    onClick={() => setActiveTab('new-task')}
                                                    style={{
                                                        background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                                        border: 'none',
                                                        color: 'white',
                                                        padding: '10px 20px',
                                                        borderRadius: '25px',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    ➕ Új feladat
                                                </button>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                                {userTasks.length === 0 ? (
                                                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.7 }}>
                                                        <div style={{ fontSize: '48px', marginBottom: '15px' }}>📝</div>
                                                        <p style={{ color: 'white' }}>Nincsenek feladatok.</p>
                                                    </div>
                                                ) : (
                                                    userTasks.map((task, index) => (
                                                        <div
                                                            key={task.id}
                                                            style={{
                                                                background: 'rgba(255,255,255,0.05)',
                                                                padding: '20px',
                                                                borderRadius: '10px',
                                                                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                                                                transition: 'all 0.3s ease',
                                                                cursor: 'pointer',
                                                                transform: 'translateY(0)',
                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(-5px)';
                                                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                                                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.transform = 'translateY(0)';
                                                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                                                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                                            }}
                                                        >
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                alignItems: 'flex-start'
                                                            }}>
                                                                <div style={{ flex: 1 }}>
                                                                    <h4 style={{ margin: '0 0 10px 0' }}>{task.title}</h4>
                                                                    <p style={{ margin: '0 0 15px 0', color: 'white' }}>{task.description}</p>
                                                                    <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                                                        <span style={{
                                                                            background: getDifficultyColor(task.difficulty),
                                                                            padding: '5px 12px',
                                                                            borderRadius: '15px',
                                                                            fontSize: '12px'
                                                                        }}>
                                                                            {getDifficultyText(task.difficulty)}
                                                                        </span>
                                                                        <span style={{
                                                                            background: 'rgba(255,255,255,0.1)',
                                                                            padding: '5px 12px',
                                                                            borderRadius: '15px',
                                                                            fontSize: '12px'
                                                                        }}>
                                                                            {new Date(task.dueDate).toLocaleDateString('hu-HU')}
                                                                        </span>
                                                                        <span style={{
                                                                            background: task.completed ? 'rgba(76, 175, 80, 0.3)' : 'rgba(255, 152, 0, 0.3)',
                                                                            padding: '5px 12px',
                                                                            borderRadius: '15px',
                                                                            fontSize: '12px'
                                                                        }}>
                                                                            {task.completed ? '✅ Kész' : '⏳ Függőben'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={() => deleteTask(task.id)}
                                                                    style={{
                                                                        background: 'rgba(244, 67, 54, 0.3)',
                                                                        border: 'none',
                                                                        color: 'white',
                                                                        padding: '8px 12px',
                                                                        borderRadius: '8px',
                                                                        cursor: 'pointer',
                                                                        fontSize: '16px',
                                                                        marginLeft: '15px'
                                                                    }}
                                                                >
                                                                    🗑️
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'new-task' && (
                                        <div>
                                            <h3 style={{ color: 'white' }}>Új feladat</h3>
                                            <form onSubmit={(e) => { e.preventDefault(); assignTask(); }}>
                                                <div style={{ display: 'grid', gap: '20px' }}>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Cím *</label>
                                                        <input
                                                            type="text"
                                                            value={newTask.title}
                                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                                            required
                                                            style={{
                                                                width: '100%',
                                                                padding: '12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid rgba(255,255,255,0.2)',
                                                                background: 'rgba(255,255,255,0.1)',
                                                                color: 'white'
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Leírás *</label>
                                                        <textarea
                                                            value={newTask.description}
                                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                            required
                                                            rows={4}
                                                            style={{
                                                                width: '100%',
                                                                padding: '12px',
                                                                borderRadius: '8px',
                                                                border: '1px solid rgba(255,255,255,0.2)',
                                                                background: 'rgba(255,255,255,0.1)',
                                                                color: 'white',
                                                                resize: 'vertical'
                                                            }}
                                                        />
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                                        <div>
                                                            <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Nehézség</label>
                                                            <select
                                                                value={newTask.difficulty}
                                                                onChange={(e) => setNewTask({ ...newTask, difficulty: e.target.value as 'easy' | 'medium' | 'hard' })}
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    color: 'white'
                                                                }}
                                                            >
                                                                <option value="easy">Könnyű</option>
                                                                <option value="medium">Közepes</option>
                                                                <option value="hard">Nehéz</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label style={{ display: 'block', marginBottom: '8px', color: 'white' }}>Határidő *</label>
                                                            <input
                                                                type="date"
                                                                value={newTask.dueDate}
                                                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                                                required
                                                                style={{
                                                                    width: '100%',
                                                                    padding: '12px',
                                                                    borderRadius: '8px',
                                                                    border: '1px solid rgba(255,255,255,0.2)',
                                                                    background: 'rgba(255,255,255,0.1)',
                                                                    color: 'white'
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '15px',
                                                        justifyContent: 'flex-end'
                                                    }}>
                                                        <button
                                                            type="button"
                                                            onClick={() => setActiveTab('tasks')}
                                                            style={{
                                                                background: 'rgba(255,255,255,0.1)',
                                                                border: '1px solid rgba(255,255,255,0.3)',
                                                                color: 'white',
                                                                padding: '12px 25px',
                                                                borderRadius: '25px',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            Mégse
                                                        </button>
                                                        <button
                                                            type="submit"
                                                            style={{
                                                                background: 'linear-gradient(45deg, #4CAF50, #45a049)',
                                                                border: 'none',
                                                                color: 'white',
                                                                padding: '12px 25px',
                                                                borderRadius: '25px',
                                                                cursor: 'pointer',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            Hozzárendelés
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </>
                            )}

                            {!selectedUser && activeTab !== 'new-user' && (
                                <div style={{
                                    textAlign: 'center',
                                    padding: '60px 20px',
                                    opacity: 0.7
                                }}>
                                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>👥</div>
                                    <h3 style={{ margin: '0 0 15px 0', color: 'white' }}>Válassz ki egy felhasználót</h3>
                                    <p style={{ margin: 0, color: 'white' }}>Kattints a bal oldali listából egy felhasználóra.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Cookie Banner */}
            <CookieBanner />
        </>
    );
}
