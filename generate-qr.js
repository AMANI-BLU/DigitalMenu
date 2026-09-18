const fs = require('fs');
const QRCode = require('qrcode');

QRCode.toFile('public/abbuu-qr.png', 'https://abu-coffee.vercel.app/', {
  type: 'png',
  errorCorrectionLevel: 'H',
  margin: 1,
  color: {
    dark: '#0f5132',
    light: '#ffffff'
  }
}).then(() => {
  console.log('public/abbuu-qr.png');
}).catch(err => {
  console.error(err);
  process.exit(1);
});
