const fs = require('fs');
const https = require('https');

fs.readFile('main.js', 'utf-8', (err, data) => {
  console.log(data);
});

https.get('https://jsonplaceholder.typicode.com/posts', res => {
  if (res.statusCode !== 200) throw new Error(res.statusCode);

  res.setEncoding('utf-8');
  let rezult = '';
  res.on('data', data => rezult += data);
  res.on('end', () => console.log(rezult));
});
