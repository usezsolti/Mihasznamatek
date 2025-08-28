// frontend/public/main.js
(function () {
  // --- Mobilmenü toggle (delegáltan, hogy ne kelljen külön keresni) ---
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-toggle");
    if (!btn) return;
    const links = document.querySelector(".nav-links");
    if (links) {
      links.classList.toggle("closed");
      btn.classList.toggle("closed");
    }
  });

  // --- Background-image lazy+slide-in ---
  const sections = document.querySelectorAll(".has-bg");
  if ("IntersectionObserver" in window && sections.length) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const section = entry.target;
          const bgDiv = section.querySelector(".bg-image");
          if (bgDiv && !bgDiv.style.backgroundImage) {
            const src = section.getAttribute("data-bg");
            bgDiv.style.backgroundImage = `url('${src}')`;
            bgDiv.classList.add("is-visible");
          }
          obs.unobserve(section);
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -20% 0px" }
    );
    sections.forEach((sec) => io.observe(sec));
  }

  // public/main.js
  document.addEventListener("DOMContentLoaded", () => {
    if (!window.firebase) {
      console.error("Firebase nem töltődött be!");
      return;
    }

    if (!window.firebase.apps.length) {
      const firebaseConfig = { /* <-- a konzolból kimásolt HELYES értékek */ };
      window.firebase.initializeApp(firebaseConfig);
    }

    // ... a többi kód (auth, firestore használat)
  });

  // --- Firebase (compat) ---
  if (window.firebase) {
    const firebaseConfig = {
      apiKey: "AIzaSyD1gvtJjjod5J3oJUI-iBPnR6yzU-AldtI",
      authDomain: "mihasznamatek-c9701.firebaseapp.com",
      projectId: "mihasznamatek-c9701",
      storageBucket: "mihasznamatek-c9701.appspot.com",
      messagingSenderId: "385597107359",
      appId: "1:385597107359:web:905725ba30245ef75c06aa",
      measurementId: "G-PCZM48WSFH"

    };
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

  }

  // --- EmailJS ---
  console.log("EmailJS ellenőrzés:", !!window.emailjs);
  if (window.emailjs) {
    console.log("EmailJS inicializálás...");
    // EmailJS inicializálás
    emailjs.init("_UgC1pw0jHHqLl6sG");
    console.log("EmailJS inicializálva");

    const emailForm = document.getElementById("email-form");
    if (emailForm) {
      console.log("Email form megtalálva:", emailForm);

      // Eltávolítjuk a régi event listener-t, ha van
      if (emailForm._emailjsHandler) {
        emailForm.removeEventListener("submit", emailForm._emailjsHandler);
      }

      // Új event listener
      emailForm._emailjsHandler = function (e) {
        e.preventDefault();
        console.log("Form submit esemény (main.js)");

        // Ellenőrizzük, hogy a React kezelő már foglalkozott-e vele
        if (e.defaultPrevented) {
          console.log("React kezelő már foglalkozott a submit-tal");
          return;
        }

        const statusEl = document.querySelector('.email-form-container p');
        if (statusEl) statusEl.textContent = "Küldés...";

        console.log("EmailJS küldés kezdeményezve (main.js)");
        
        // Form adatok összegyűjtése
        const formData = new FormData(this);
        const templateParams = {
            to_email: 'mihaszna.math@gmail.com',
            user_name: formData.get('user_name') || 'Névtelen',
            user_email: formData.get('user_email') || 'nincs@email.com',
            message: formData.get('message') || 'Nincs üzenet',
            reply_to: formData.get('user_email') || 'nincs@email.com'
        };
        
        console.log("Form adatok:", templateParams);
        
        // Első próba: templateParams
        emailjs.send("service_fnoxi68", "template_rt2i7ou", templateParams).then(
          () => {
            console.log("E-mail sikeresen elküldve");
            if (statusEl) statusEl.textContent = "Köszönöm, elküldve!";
            this.reset();
          },
          (err) => {
            console.error("EmailJS hiba (templateParams):", err);
            
            // Második próba: sendForm
            console.log("Második próba: sendForm használata...");
            emailjs.sendForm("service_fnoxi68", "template_rt2i7ou", this).then(
              () => {
                console.log("E-mail sikeresen elküldve (sendForm)");
                if (statusEl) statusEl.textContent = "Köszönöm, elküldve!";
                this.reset();
              },
              (formErr) => {
                console.error("EmailJS hiba (sendForm):", formErr);
                console.error("Hiba részletek:", {
                  serviceId: "service_fnoxi68",
                  templateId: "template_rt2i7ou",
                  formData: new FormData(this)
                });
                if (statusEl)
                  statusEl.textContent =
                    "Hiba történt, kérlek próbáld újra később.";
              }
            );
          }
        );
      };

      emailForm.addEventListener("submit", emailForm._emailjsHandler);
    } else {
      console.error("Email form nem található!");
    }
  } else {
    console.error("EmailJS nem található!");
  }

  // --- Google Maps callback (globális névtérbe kell) ---
  window.initMap = function () {
    const mapEl = document.getElementById("map");
    if (!mapEl || !window.google?.maps) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        address: "Szent Imre utca 18, Fót, 2151, Magyarország",
        componentRestrictions: { country: "HU" },
      },
      (results, status) => {
        const loc =
          status === "OK" && results[0]
            ? results[0].geometry.location
            : { lat: 47.6170658, lng: 19.1901412 };

        const map = new google.maps.Map(mapEl, {
          center: loc,
          zoom: 16,
          mapTypeId: "roadmap",
        });
        new google.maps.Marker({ position: loc, map });
      }
    );
  };
})();
