const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/lib/communes.json'));

data["M'Sila"] = data["M'sila"] || data["M'Sila"];
data["Bordj Bou Arreridj"] = data["Bordj Bou Arréridj"] || data["Bordj Bou Arreridj"];
data["El M'Ghair"] = data["El M'ghair"] || data["El M'Ghair"];

fs.writeFileSync('src/lib/communes.json', JSON.stringify(data));
console.log('Fixed');
