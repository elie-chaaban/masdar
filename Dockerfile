# Stage 1
FROM node:16.15.1 as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY . /app
RUN yarn install
RUN yarn build

# Stage 2 - the production environment
FROM nginx:alpine

# Install tzdata package and set the timezone
ENV TZ=Asia/Dubai
RUN apk add --no-cache tzdata \
    && cp /usr/share/zoneinfo/Asia/Dubai /etc/localtime \
    && echo "Asia/Dubai" > /etc/timezone

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
