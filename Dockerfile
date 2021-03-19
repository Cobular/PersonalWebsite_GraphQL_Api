FROM node:12-alpine AS ts-builder
WORKDIR app
COPY ./package.json ./tsconfig.json ./
COPY ./app/ ./app
RUN npm install
RUN npm run clean
RUN npm run build

FROM node:12-alpine as prod
WORKDIR /app
COPY --from=ts-builder ./app/dist ./dist
COPY package.json ./
RUN npm install --production
CMD npm run serve
