const fs = require('fs');
const { communes, wilayas } = require('geoalgeria');

const formatWilayas = [
  "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
  "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
  "Tizi Ouzou", "Alger", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
  "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
  "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arreridj",
  "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
  "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
  "Ghardaïa", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal",
  "Béni Abbès", "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair",
  "El Meniaa"
];

const result = {};
formatWilayas.forEach(w => { result[w] = []; });

communes.forEach(c => {
  let targetWilayaCode = c.wilaya_code;
  if (targetWilayaCode > 58) {
    targetWilayaCode = Math.floor(c.code_commune / 100);
  }
  
  // Find wilaya name from our formatWilayas list based on index (code - 1)
  const wilayaName = formatWilayas[targetWilayaCode - 1];
  if (wilayaName) {
    result[wilayaName].push(c.name_fr);
  }
});

// Sort communes for each wilaya alphabetically
Object.keys(result).forEach(w => {
  result[w].sort();
});

fs.writeFileSync('src/lib/communes.json', JSON.stringify(result, null, 2));

const total = Object.values(result).reduce((acc, v) => acc + v.length, 0);
console.log('Total communes:', total);
