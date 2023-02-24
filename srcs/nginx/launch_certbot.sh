#!/bin/sh

ln -sf /datas/default.conf /etc/nginx/conf.d/default.conf

ln -s /datas/letsencrypt /etc

#mkdir -p /var/www
#ln -s /datas/build /var/www/transcendence

if [ ! -f /etc/letsencrypt/live/transcendence.sannie.fr/fullchain.pem ]; then
    nginx
    certbot --nginx -m $MAINTAINER_EMAIL -n --agree-tos -d transcendence.sannie.fr
    nginx -s stop &
    wait $!
else
    echo "0 */12 * * * root test -x /usr/bin/certbot -a \! -d /run/systemd/system && perl -e 'sleep int(rand(43200))' && certbot -q renew" >/etc/cron.d/certbot
fi

nginx -g "daemon off;"
