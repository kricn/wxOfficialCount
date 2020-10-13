# 微信公众号平台开发
**通过node+express+ejs+原生js搭建自己的服务器，对接微信公众号平台，通过ejs搭建h5页面反馈给用户，**
**使得微信公众号的功能更加灵活和多样性**\
**主要给实现服务的电影预告片的预览，观看，电影推荐，书目的查找等**

## 功能介绍
:white_check_mark:微信服务器鉴权\
:white_check_mark:调用微信接口鉴权\
:white_check_mark:用户关注回复自定义消息\
:white_check_mark:用户取消关注通知系统后台\
:white_check_mark:自定义菜单\
:white_check_mark:回复用户文本消息（电影推荐，书目查找）\
:white_check_mark:识别用户语音消息并回复（书目查找）\
:white_check_mark:回复给用户相应的图文消息（自定义标题和封面）\
:white_check_mark:爬取豆瓣相关数据\
:white_check_mark:上传图片和视频到七牛云托管\
:white_check_mark:预告片h5页面\
:white_check_mark:预告片视频播放\
:white_check_mark:热门电影详情h5页面\
:white_check_mark:查询到的书目及详情h5页面\
~~:white_check_mark:实现电影查询~~

## 技术栈
node + express + ejs + mongodb \
:heart:node主要服务器环境\
:heart:通过express框架配置路由，实现微信服务器鉴权和接口的鉴权，h5页面的路由配置，
图片链接，预告片链接的请求api等\
:heart:ejs引擎搭建h5页面\
:heart:mongodb存储爬取到的数据\
:heart:通过[puppeteer](https://www.npmjs.com/package/puppeteer)模块爬取豆瓣数据并保存到mongodb

## 本地开发
**由于没有服务号，该项目是在测试号开发的**\
进入自己公众号申请的的测试号，把/config/index.js里的换成自己的appID和appsecret,url换成服务器地址（这个地址一定要外网可以访问的，不能写localhost和127.0.0.1或你自己的内网ip)\
没有自己的服务器可以用ngrok作内网穿透\
修改token和七牛云地址(空间的地区也要改一下，在/server/qiniu/upload.js下修改config.zone为自己空间的地区)\
到测试号后台的接口配置信息填写相应的url和token（刚刚改的，服务要先跑起来）\
js安全域名就填写服务器对应的域名（不要http或都www）\
访问之前先爬一遍数据，不然是空白页，/serve是独立开的模块，可以单独运行，直接node index.js即可\
关注自己的测试号即可使用:ok_hand:


