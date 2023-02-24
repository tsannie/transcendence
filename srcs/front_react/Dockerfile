# BUILD REACT APP
FROM node:17-alpine

RUN mkdir -p /etc/app
WORKDIR /etc/app
COPY ./ ./
RUN yarn install
RUN yarn build
RUN yarn global add serve

RUN mkdir /app
WORKDIR /app
RUN mv /etc/app/build /app/build
RUN rm -rf /etc/app

CMD ["serve", "-s", "build", "-l", "3000"]
