FROM node:16

WORKDIR /base

COPY ["package.json", "./package.json"]
COPY ["turbo.json", "./turbo.json"]
COPY ["packages/common", "./packages/common"]
COPY ["packages/database", "./packages/database"]
COPY ["apps/api", "./apps/api"]
COPY ["pnpm-lock.yaml", "./pnpm-lock.yaml"]
COPY ["pnpm-workspace.yaml", "./pnpm-workspace.yaml"]

RUN npm install -g pnpm

EXPOSE 3005 

RUN cd /base && pnpm install && cd /base/apps/api && npm install && npm install typescript && sed -i 's/require('\''\.\/lib-cov\/fluent-ffmpeg'\'')/require('\''\.\/lib\/fluent-ffmpeg'\'')/' node_modules/fluent-ffmpeg/index.js && apt-get update && apt-get install -y ffmpeg postgresql-client && npm install prisma


RUN cd /base pnpm install && cd /base/apps/api && echo "export * from '@prisma/client';" >> node_modules/database/index.js 
RUN cd /base && npx turbo db:generate


CMD ["npm", "run", "doit"]