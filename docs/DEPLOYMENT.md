... existing code ...

### Step 2: Deploy Application
\`\`\`bash
# Clone repository
git clone <your-repo-url>
cd dompetku

... existing code ...

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'dompetku',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
\`\`\`

... existing code ...

\`\`\`nginx
# /etc/nginx/sites-available/dompetku
server {
    listen 80;
    server_name your-domain.com;

... existing code ...

# Enable site
sudo ln -s /etc/nginx/sites-available/dompetku /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
\`\`\`

... existing code ...

### Log Management
\`\`\`bash
# PM2 logs
pm2 logs dompetku

... existing code ...

\`\`\`javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'dompetku',
    script: 'npm',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster'
  }]
}
