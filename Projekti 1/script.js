const toggleFormBtn = document.getElementById("toggleFormBtn");
const treeniForm = document.getElementById("treeniForm");
const kesto = document.getElementById("kesto");
let treenit = JSON.parse(localStorage.getItem("treenit")) || [];
let treeniChart;
const tyhjennaBtn = document.getElementById("tyhjennaBtn");
const paivaInput = document.getElementById("paiva"); 
const tyyppiSelect = document.getElementById("tyyppi"); 
window.addEventListener("load", () => {
  paivitaTaulukko();
  laskeViikonKesto();
});


function paivitaTaulukko() {
  const tbody = document.querySelector("#treeniTable tbody");
  tbody.innerHTML = "";

  const viikonTreeni = suodataViikonTreeni(treenit);

  for (let i = 0; i < viikonTreeni.length; i++) {
    const rivi = document.createElement("tr");
    rivi.innerHTML = `
      <td><b>${viikonTreeni[i].paiva}</b></td>
      <td><b>${viikonTreeni[i].kesto}</b></td>
      <td><b>${viikonTreeni[i].tyyppi}</b></td>
    `;
    tbody.appendChild(rivi);
  }
}
function suodataViikonTreeni(treenit) {
    
    const tanaan = new Date();
    const paiva = tanaan.getDay();
    const maanantai = new Date(tanaan);
    maanantai.setDate(tanaan.getDate() - (paiva === 0 ? 6 : paiva - 1));
    const sunnuntai = new Date(maanantai);
    sunnuntai.setDate(maanantai.getDate() + 6);

const viikonTreeni = [];

    
for (let i = 0; i < treenit.length; i++) {
   const treeniPaiva = new Date(treenit[i].paiva);
    if (treeniPaiva >= maanantai && treeniPaiva <= sunnuntai) {
       viikonTreeni.push(treenit[i]);
       }
    }

    
  return viikonTreeni;

}
toggleFormBtn.addEventListener("click", () => {
if (treeniForm.style.display === "none") {
  treeniForm.style.display = "block";
} else {
  treeniForm.style.display = "none";
}
});

treeniForm.addEventListener("submit" , (e) => {
e.preventDefault();



const uusiTreeni = {
  paiva: document.getElementById("paiva").value,
  kesto: Number(kesto.value),
  tyyppi: document.getElementById("tyyppi").value
};

treenit.push(uusiTreeni);
localStorage.setItem("treenit", JSON.stringify(treenit));
alert("Treeni tallennettiin!");
paivitaTaulukko();
  laskeViikonKesto();
   treeniForm.reset();
});




function laskeViikonKesto() {
    const lasku = suodataViikonTreeni(treenit);

    let kokonaisKesto = 0;
    let pushKesto = 0;
    let pullKesto = 0;
    let jalatKesto = 0;

    for (let i = 0; i < lasku.length; i++) {
        kokonaisKesto += lasku[i].kesto;

        if (lasku[i].tyyppi === "Push") pushKesto += lasku[i].kesto;
        else if (lasku[i].tyyppi === "Pull") pullKesto += lasku[i].kesto;
        else if (lasku[i].tyyppi === "Jalkapäivä") jalatKesto += lasku[i].kesto;
    }

    const prosenttiPush = (pushKesto / kokonaisKesto) * 100;
    const prosenttiPull = (pullKesto / kokonaisKesto) * 100;
    const prosenttiJalat = (jalatKesto / kokonaisKesto) * 100;

document.getElementById("kokonaisKesto").textContent = kokonaisKesto;
document.getElementById("pushProsentti").textContent = prosenttiPush.toFixed(1);
document.getElementById("pullProsentti").textContent = prosenttiPull.toFixed(1);
document.getElementById("jalatProsentti").textContent = prosenttiJalat.toFixed(1);
paivitaKaavio(prosenttiPush, prosenttiPull, prosenttiJalat);
}
function paivitaKaavio(push, pull, jalat) {
    const ctx = document.getElementById('treeniChart').getContext('2d');

    const data = {
        labels: ['Push', 'Pull', 'Jalat'],
        datasets: [{
            label: 'Treeni prosentit',
            data: [push, pull, jalat],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    };

    if (treeniChart) {
        
        treeniChart.data.datasets[0].data = [push, pull, jalat];
        treeniChart.update();
    } else {
        
        treeniChart = new Chart(ctx, {
            type: 'pie',
            data: data
        });
    }
}
tyhjennaBtn.addEventListener("click", () => {
  const vahvistus = confirm("Haluatko varmasti tyhjentää kaikki treenit?");
  if (vahvistus) {
    localStorage.removeItem("treenit"); 
    treenit = []; 
    paivitaTaulukko(); 
    laskeViikonKesto(); 
    alert("Kaikki treenit poistettu!");
  }
});
