# NGINX
FROM nginx
ENV MAINTAINER_EMAIL=theo@sannie.fr

RUN apt update
RUN apt install -y certbot python3-certbot-nginx && rm -rf /etc/letsencrypt

COPY ./launch_certbot.sh /

RUN chmod 744 /launch_certbot.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
# useless ?

CMD ["./launch_certbot.sh"]
