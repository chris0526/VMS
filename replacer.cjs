const fs = require('fs');
const path = './src/pages';
fs.readdirSync(path).forEach(file => {
  if (file.endsWith('.jsx')) {
    let content = fs.readFileSync(`${path}/${file}`, 'utf8');
    content = content.replace(/glass-panel/g, 'card');
    fs.writeFileSync(`${path}/${file}`, content);
  }
});
