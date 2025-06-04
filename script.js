document.addEventListener('DOMContentLoaded', () => {
  const circles = document.querySelectorAll('.circle');
  const sections = document.querySelectorAll('.content-section');

  // Affichage section au clic sur cercle
  circles.forEach(circle => {
    circle.addEventListener('click', () => {
      const targetId = circle.getAttribute('data-section');
      sections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('visible');
      });
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.classList.remove('hidden');
        targetSection.classList.add('visible');
      }
    });
  });

  // Chargement des défauts
  let defautsData = [];

  fetch('defauts.json')
    .then(response => response.json())
    .then(data => {
      defautsData = data;
      afficherDefauts(defautsData);
      afficherStats(defautsData);
    })
    .catch(error => {
      console.error('Erreur de chargement des défauts:', error);
    });

  // Fonction afficher défauts dans la liste
  function afficherDefauts(defauts) {
    const ul = document.getElementById('liste-defauts');
    ul.innerHTML = ''; // reset liste
    defauts.forEach(defaut => {
      const li = document.createElement('li');
      li.textContent = `Défaut ${defaut.code} : ${defaut.message}`;
      ul.appendChild(li);
    });
  }

  // Recherche dynamique
  function rechercherDefaut() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const filtred = defautsData.filter(d =>
    d.message.toLowerCase().includes(query) || d.code.toString().includes(query)
  );
  afficherDefauts(filtred);
}

  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  searchButton.addEventListener('click', rechercherDefaut);

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtred = defautsData.filter(d =>
      d.message.toLowerCase().includes(query) || d.id.toString().includes(query)
    );
    afficherDefauts(filtred);
  });

  // Affichage statistique avec Chart.js
  function afficherStats(defauts) {
    // Exemple simple : stats par type de défaut (exemple fictif)
    // Ici on compte combien de défauts contiennent certains mots clés
    const categories = ['Moteur', 'Communication', 'Paramètre', 'Défaut général'];
    const counts = [0, 0, 0, 0];

    defauts.forEach(defaut => {
      const msg = defaut.message.toLowerCase();
      if (msg.includes('moteur')) counts[0]++;
      else if (msg.includes('communication')) counts[1]++;
      else if (msg.includes('paramètre')) counts[2]++;
      else counts[3]++;
    });

    const ctx = document.getElementById('chartStats').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: categories,
        datasets: [{
          label: 'Nombre de défauts par catégorie',
          data: counts,
          borderColor: '#0073e6',
          backgroundColor: 'rgba(0, 115, 230, 0.3)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#005ea2',
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: '#005ea2',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      }
    });
  }
});