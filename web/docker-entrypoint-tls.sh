#!/bin/sh
set -e

# Non-root hopper over nginx /docker-entrypoint.d og kan ikke skrive /etc/nginx; derfor /tmp.
crt=/https/certificates/tls.crt
key=/https/certificates/tls.key
if [ -r "$crt" ] && [ -r "$key" ]; then
    mkdir -p /tmp/nginx-tls
    cat > /tmp/nginx-tls/ssl.conf <<EOF
server {
    listen 8443 ssl;
    listen [::]:8443 ssl;
    ssl_certificate     $crt;
    ssl_certificate_key $key;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
fi

exec "$@"
