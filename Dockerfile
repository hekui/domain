FROM docker.chuangjia.me/nodejs:8.5.0

MAINTAINER XiaYang <xiayang@chuangjia.me>
ENV PORT 3000
expose 3000

WORKDIR /data/work/
RUN  apt-get update && apt-get install -y graphicsmagick

#加入node程序并安装npm包
ADD ./ ./
RUN cnpm install
RUN npm run build
RUN echo Asia/Chongqing > /etc/timezone \
  && ln -sfv /usr/share/zoneinfo/Asia/Chongqing /etc/localtime
CMD npm run start
