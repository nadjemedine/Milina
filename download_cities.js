const https = require('https');
const fs = require('fs');

https.get('https://raw.githubusercontent.com/yassine-zitouni/algerian-cities/master/algeria-cities.json', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    fs.writeFileSync('test-cities.json', data);
    console.log('Downloaded. Size:', data.length);
    const parsed = JSON.parse(data);
    console.log('Count:', parsed.length);
  });
}).on('error', (err) => {
  console.error(err);
});
