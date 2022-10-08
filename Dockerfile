FROM node:15

WORKDIR /app

COPY package*.json /app/

RUN npm install -g pm2 \ && npm install
# RUN npm install -g nodemon \
#     && npm install

COPY . /app


EXPOSE 3031


CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]