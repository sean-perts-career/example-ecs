# Inspiration for this 'Hello-World' nginx container here: https://github.com/Einsteinish/docker-nginx-hello-world/tree/master
FROM nginx:mainline-alpine

RUN rm /etc/nginx/conf.d/*

ADD helloworld.conf /etc/nginx/conf.d/
ADD index.html /usr/share/nginx/html/

EXPOSE 80