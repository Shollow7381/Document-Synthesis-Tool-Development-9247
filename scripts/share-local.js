#!/usr/bin/env node

const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, '../dist')));

// Handle client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Get local IP addresses
function getLocalIPs() {
  const networkInterfaces = os.networkInterfaces();
  const ips = [];
  
  Object.keys(networkInterfaces).forEach(key => {
    networkInterfaces[key].forEach(netInterface => {
      if (netInterface.family === 'IPv4' && !netInterface.internal) {
        ips.push(netInterface.address);
      }
    });
  });
  
  return ips;
}

app.listen(PORT, '0.0.0.0', () => {
  const localIPs = getLocalIPs();
  
  console.log('\n🚀 Document Synthesizer is running!');
  console.log('\n📱 Share these URLs with your colleagues:');
  console.log(`   Local: http://localhost:${PORT}`);
  
  localIPs.forEach(ip => {
    console.log(`   Network: http://${ip}:${PORT}`);
  });
  
  console.log('\n💡 Make sure colleagues are on the same network');
  console.log('📁 Each user will have their own document library');
  console.log('\n⏹️  Press Ctrl+C to stop the server');
});