# 🧮 Mihaszna Matek - Matematika Tanulási Platform

Egy modern webes alkalmazás matematika tanuláshoz és gyakorláshoz, sebességmérő-szerű progress tracking-kel.

## 🚀 Funkciók

- **Sebességmérő Dashboard** - Vizuális progress tracking matematikai témakörönként
- **24 Matematikai Témakör** - Az érettségi követelményeknek megfelelően
- **Felhasználói Teljesítmény Követés** - Részletes statisztikák és haladás
- **Feladatmegoldás** - Interaktív matematikai feladatok
- **Időpontfoglalás** - Tanárral való találkozók ütemezése
- **Reszponzív Dizájn** - Mobilbarát felület
- **Sötét/Világos Téma** - Személyre szabható megjelenés

## 🛠️ Technológiai Stack

### Backend
- **Firebase Authentication** - Felhasználói hitelesítés
- **Firebase Firestore** - Adatbázis
- **Firebase Hosting** - Webes hosting

### Frontend
- **Next.js** - React keretrendszer
- **TypeScript** - Típusbiztonság
- **CSS3** - Modern stílusok
- **Responsive Design** - Mobilbarát

## 📦 Telepítés

### Előfeltételek
- Node.js (v16 vagy újabb)
- npm vagy yarn
- Firebase projekt

### 1. Firebase Projekt Beállítása

1. Hozz létre egy új Firebase projektet a [Firebase Console](https://console.firebase.google.com)-ban
2. Engedélyezd az **Authentication** szolgáltatást és állítsd be az email/jelszó bejelentkezést
3. Hozz létre egy **Firestore Database**-t
4. Másold ki a Firebase konfigurációs adatokat

### 2. Firebase Konfiguráció

Hozz létre egy `firebase-config.js` fájlt a `frontend/public` mappában:

```javascript
window.__FIREBASE_CONFIG__ = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

if (window.firebase && !window.firebase.apps.length) {
    window.firebase.initializeApp(window.__FIREBASE_CONFIG__);
}
```

### 3. Frontend telepítése

```bash
cd frontend
npm install
```

### 4. Frontend szerver indítása

```bash
npm run dev
```

A frontend alkalmazás a `http://localhost:3000` címen fut.

## 🔐 Firebase Adatbázis Struktúra

### Firestore Collections

#### `users` Collection
```javascript
{
    uid: "user_id",
    name: "Felhasználó neve",
    email: "user@example.com",
    phone: "+36 20 123 4567",
    grade: "12. osztály",
    course: "Matematika Érettségi",
    birthDate: "2000-01-01",
    address: "Budapest, Magyarország"
}
```

#### `math_topics` Collection
```javascript
{
    id: "abszoluterték",
    title: "Abszolútérték",
    description: "Abszolútértékkel kapcsolatos feladatok",
    color: "#FF6B6B",
    difficulty: "Középszint",
    icon: "📏",
    total_problems: 15
}
```

#### `user_progress` Collection
```javascript
{
    user_id: "user_uid",
    topic_id: "abszoluterték",
    completed_problems: 8,
    total_problems: 15,
    last_practiced: "2023-10-26T10:00:00Z"
}
```

## 🎯 Matematikai Témakörök

1. **Abszolútérték** - Abszolútérték számítások és egyenletek
2. **Gyök** - Gyökvonás és gyökös kifejezések
3. **Bizonyítások** - Matematikai bizonyítások
4. **Egyenletek** - Lineáris és másodfokú egyenletek
5. **Egyenlőtlenségek** - Egyenlőtlenségek megoldása
6. **Egyenletrendszerek** - Lineáris egyenletrendszerek
7. **Egyszerűsítések** - Algebrai kifejezések egyszerűsítése
8. **Értelmezési tartomány** - Függvények értelmezési tartománya
9. **Exponenciális és logaritmus** - Exponenciális és logaritmusos feladatok
10. **Függvények, analízis** - Függvények vizsgálata
11. **Halmazok** - Halmazműveletek és Venn-diagramok
12. **Kombinatorika** - Permutáció, kombináció, variáció
13. **Paraméter** - Paraméteres feladatok
14. **Koordinátageometria** - Ponthalmazok és görbék
15. **Logika, gráfok** - Logikai feladatok és gráfelmélet
16. **Síkgeometria** - Síkidomok és transzformációk
17. **Sorozatok** - Számsorozatok és határértékek
18. **Statisztika** - Statisztikai számítások
19. **Számelmélet** - Oszthatóság és prímszámok
20. **Szöveges feladatok** - Szöveges feladatok megoldása
21. **Térgeometria** - Térbeli alakzatok
22. **Trigonometria** - Szinusz, koszinusz, tangens
23. **Valószínűségszámítás** - Valószínűségi számítások

## 🔧 Firebase Szolgáltatások

### Authentication
- Email/jelszó bejelentkezés
- Felhasználói profil kezelés
- Biztonságos kijelentkezés

### Firestore
- Felhasználói adatok tárolása
- Matematikai témakörök kezelése
- Teljesítmény követés
- Valós idejű adatszinkronizáció

### Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /user_progress/{progressId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.user_id;
    }
  }
}
```

## 🎨 UI/UX Jellemzők

- **Sebességmérő Progress Tracking** - Vizuális haladás mutatók
- **Kártya-alapú Layout** - Modern, tiszta felület
- **Reszponzív Design** - Mobilbarát megjelenés
- **Téma Váltás** - Sötét/világos mód
- **Animált Átmenetek** - Smooth user experience

## 🚀 Fejlesztési Terv

### Következő funkciók
- [ ] Feladat szerkesztő admin felületen
- [ ] Videó leckék integrálása
- [ ] Chat funkció tanárral
- [ ] Push értesítések
- [ ] Offline mód támogatás
- [ ] Gamification elemek (badge-ek, pontok)

### Technikai fejlesztések
- [ ] Unit tesztek
- [ ] E2E tesztek
- [ ] Firebase Functions integrálása
- [ ] CI/CD pipeline
- [ ] Monitoring és logging

## 🤝 Közreműködés

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 Licenc

Ez a projekt MIT licenc alatt van kiadva.

## 📞 Kapcsolat

- **Email:** info@mihasznamatek.hu
- **Telefon:** +36 20 123 4567
- **Cím:** 2151 Fót, Szent Imre utca 18

---

**Mihaszna Matek** - Matematika tanulás modern módon! 🧮✨