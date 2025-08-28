// Ez a fájl most még NEM használ Auth-ot,
// csak mutatunk néhány demo-anyagot, hogy lásd a vázat.

document.addEventListener('DOMContentLoaded', () => {
  const materials = [
    { title: 'Analízis I. feladatgyűjtemény', description: 'Bevezető feladatok, deriválás, integrálás.' },
    { title: 'Valószínűségszámítás összefoglaló', description: 'Gyakorló tesztek és megoldások.' },
    { title: 'Lineáris algebra példa-könyv', description: 'Mátrixok, vektorok interaktív feladatok.' },
  ];

  const container = document.getElementById('materials-container');
  const emptyMsg = container.querySelector('.empty-msg');

  // ha van demo-anyag, töröljük az üres-üzenetet és betöltjük
  if (materials.length > 0) {
    emptyMsg.remove();

    materials.forEach(mat => {
      const card = document.createElement('div');
      card.className = 'material-card';
      card.innerHTML = `
        <h3>${mat.title}</h3>
        <p>${mat.description}</p>
        <a href="#">Megnyitás</a>
      `;
      container.appendChild(card);
    });
  }

  // Kijelentkezés gombra kattintva most csak visszalökjük az indexre
  document.getElementById('logout-btn')
    .addEventListener('click', () => window.location.href = 'index.html');
});
