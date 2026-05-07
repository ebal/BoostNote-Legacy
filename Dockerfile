FROM node:8.17.0

# Debian Stretch is archived - need to use archive repos
RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
  sed -i 's/security.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
  sed -i '/stretch-updates/d' /etc/apt/sources.list && \
  echo 'Acquire::Check-Valid-Until "false";' > /etc/apt/apt.conf.d/99no-check-valid-until

# Python 2.7 needed for node-gyp with old native modules
RUN apt-get update && apt-get install -y \
  python \
  build-essential \
  fakeroot \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install deps via yarn (yarn.lock pins compatible versions)
COPY package.json yarn.lock ./
RUN npm install -g npm@6 && \
  git config --global url."https://".insteadOf git:// && \
  yarn install --frozen-lockfile

COPY . .

# Compile webpack production build, then copy to staging for packaging
# The staging copy avoids fs-extra overlayfs bug when electron-packager copies app dir
RUN yarn global add grunt-cli@1.3.2 && \
  npm run compile && \
  mkdir -p /build && \
  cp -a /app /build/app && \
  cd /build/app && \
  PACK_OUT_DIR=/build/out grunt pack:osx && \
  mkdir -p /app/dist && cp -r /build/out/Boostnote-darwin-x64 /app/dist/

# Output: /app/dist/Boostnote-darwin-x64/Boostnote.app
CMD ["sh", "-c", "ls -la dist/"]
