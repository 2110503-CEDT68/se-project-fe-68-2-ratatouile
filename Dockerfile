FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:5050
ARG INTERNAL_API_BASE_URL=http://host.docker.internal:5050
ARG NEXTAUTH_URL=http://localhost:3000
ARG NEXTAUTH_SECRET=replace_with_a_stable_secret

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV INTERNAL_API_BASE_URL=$INTERNAL_API_BASE_URL
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
