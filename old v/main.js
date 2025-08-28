// main.js

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobilmenü toggle ---
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks  = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('open');
    });
  }

  // --- Background-image slide-in effekt görgetésre ---
  const sections = document.querySelectorAll('.has-bg');
  const options  = {
    threshold: 0.2,
    rootMargin: '0px 0px -20% 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const section = entry.target;
        const bgDiv   = section.querySelector('.bg-image');
        // Ha még nincs beállítva a háttérkép, betöltjük
        if (bgDiv && !bgDiv.style.backgroundImage) {
          const src = section.getAttribute('data-bg');
          bgDiv.style.backgroundImage = `url('${src}')`;
        }
        // Elindítjuk a slide-in animációt
        bgDiv.classList.add('is-visible');
        // Többé nem figyelünk erre a szekcióra
        obs.unobserve(section);
      }
    });
  }, options);

  sections.forEach(sec => observer.observe(sec));
});

// 1) CDN-es Firebase compat könyvtárak betöltése után (index.html-ben):
// <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js"></script>

// 2) Firebase initializáció
const firebaseConfig = {
  apiKey: "AIzaSyD1gvtJjjod5J3oUI-ibPnR6yzU-AldtTI",
  authDomain: "mihasznamatek-c9701.firebaseapp.com",
  projectId: "mihasznamatek-c9701",
  storageBucket: "mihasznamatek-c9701.appspot.com",
  messagingSenderId: "385597107359",
  appId: "1:385597107359:web:905725ba30245ef75c06aa",
  measurementId: "G-PCZM48WSFH"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// 3) Elementek lekérése
const signupForm = document.getElementById('signup-form');
const signupMsg  = document.getElementById('signup-msg');
const loginForm  = document.getElementById('login-form');
const loginMsg   = document.getElementById('login-msg');
const logoutBtn  = document.getElementById('logout-btn');
const userInfo   = document.getElementById('user-info');
const userEmailEl= document.getElementById('user-email');

// 4) Regisztráció kezelése
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = signupForm['signup-email'].value;
  const pw    = signupForm['signup-password'].value;

  auth.createUserWithEmailAndPassword(email, pw)
    .then(() => {
      // sikeres regisztráció → átirányítás dashboard-ra
      window.location.href = 'dashboard.html';
    })
    .catch(err => {
      signupMsg.textContent = err.message;
    });
});

// 5) Bejelentkezés kezelése
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = loginForm['login-email'].value;
  const pw    = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email, pw)
    .then(() => {
      // sikeres belépés → átirányítás dashboard-ra
      window.location.href = 'dashboard.html';
    })
    .catch(err => {
      loginMsg.textContent = err.message;
    });
});

// 6) Kijelentkezés
logoutBtn.addEventListener('click', () => {
  auth.signOut()
    .then(() => {
      // kijelentkezés után vissza az index-re
      window.location.href = 'index.html';
    });
});

// 7) Auth állapotfigyelés
auth.onAuthStateChanged(user => {
  if (user) {
    // Ha valamilyen okból mégis itt maradna bejelentkezve,
    // elrejthetjük a formokat, de a redirect a fenti then() miatt már megtörtént.
    document.querySelectorAll('.auth-form')
            .forEach(f => f.classList.add('hidden'));
    userInfo.classList.remove('hidden');
    userEmailEl.textContent = user.email;
  } else {
    // kijelentkezés után újra mutatjuk a formokat
    document.querySelectorAll('.auth-form')
            .forEach(f => f.classList.remove('hidden'));
    userInfo.classList.add('hidden');
  }
});




function initMap() {
  // 1) Geocoder példány létrehozása
  const geocoder = new google.maps.Geocoder();

  // 2) Pontos cím megadása, országkorlátozással
  geocoder.geocode({
    address: 'Szent Imre utca 18, Fót, 2151, Magyarország',
    componentRestrictions: { country: 'HU' }
  }, (results, status) => {
    if (status === 'OK' && results[0]) {
      // 3) A lekért koordináták
      const loc = results[0].geometry.location;

      // 4) Térkép inicializálása ezen a helyen
      const map = new google.maps.Map(document.getElementById('map'), {
        center: loc,
        zoom: 16,
        mapTypeId: 'roadmap'
      });

      // 5) Marker elhelyezése
      new google.maps.Marker({
        position: loc,
        map: map,
        title: '2151 Fót, Szent Imre utca 18'
      });
    } else {
      console.error('Geokódolási hiba:', status);
      // Hibakezelésként vissza lehet esni kézi koordinátára:
      const fallback = { lat: 47.6170658, lng: 19.1901412 };
      const map = new google.maps.Map(document.getElementById('map'), {
        center: fallback,
        zoom: 16,
        mapTypeId: 'roadmap'
      });
      new google.maps.Marker({ position: fallback, map: map });
    }
  });
}

// EmailJS initializáció (cseréld le a user ID-det)
(function(){
  emailjs.init('service_fnoxi68');
})();

// Email űrlap kezelése
document.getElementById('email-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const statusEl = document.getElementById('form-status');
  statusEl.textContent = 'Küldés...';

  emailjs.sendForm('service_xxx', 'template_yyy', this)
    .then(() => {
      statusEl.textContent = 'Köszönöm, az üzeneted elküldve!';
      this.reset();
    }, (err) => {
      console.error('EmailJS hiba:', err);
      statusEl.textContent = 'Hiba történt, kérlek próbáld újra később.';
    });
});


