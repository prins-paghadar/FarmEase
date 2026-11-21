FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

ARG VITE_BACKEND_API
ENV VITE_BACKEND_API=${VITE_BACKEND_API}

COPY . .

RUN npm run build

RUN npm install -g serve

EXPOSE 3000

CMD ["serve", "-s", "dist"]