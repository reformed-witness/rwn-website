# syntax=docker/dockerfile:1
FROM nginx:1.27-alpine
COPY . /usr/share/nginx/html/
RUN rm -f /usr/share/nginx/html/README.md /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/.dockerignore
EXPOSE 80
