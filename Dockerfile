FROM node:16-buster-slim as builder
WORKDIR /code

# 单独分离 package.json，是为了安装依赖可最大限度利用缓存
ADD package.json package-lock.json /code/
RUN yarn config set registry https://registry.npm.taobao.org/ && yarn

ADD . /code
RUN yarn build

# 选择更小体积的基础镜像
FROM nginx:alpine
COPY --from=builder code/build /usr/share/nginx/html