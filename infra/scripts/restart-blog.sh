

sudo caddy reload --config /etc/caddy/Caddyfile

sudo systemctl daemon-reload

# sudo systemctl stop homelab-status-page

# sudo systemctl start homelab-status-page

# sudo systemctl enable homelab-status-page

sudo  systemctl stop caddy

sudo systemctl start caddy

sudo systemctl enable caddy 

sudo systemctl status caddy #& sudo systemctl status homelab-status-page
#mamba activate sam
