1. KOA2工程。
2. api: 所有模块内容都写在这里， 其中包括了controller, service, router。
    这里的service都要求继承/services/BasicService
3. bin: 启动文件。
4. config: 配置文件。
5. filter: 过滤器实现。
6. models: 所有的model都写在这里。
7. service: 全局性的service写在这里。
8. utils: 一些公共类。
9. 数据库使用了sequelize的orm.
10. gulp;  gulpfile.js里的参数  production--运行环境， development--开发环境
11. createAPI: 根据models文件夹里的文件，动态生成controller, service, router


####  安装：
- 如果首次使用脚手架安装：
    - 1.`nodejs7.8+`;
    - 2.`npm install -g sequelize-auto`;
    - 3.`npm install -g mysql`;
    - 4.`sequelize-auto -h <%= host %> -d <%= database %> -u <%= user %> -x <%= pass %> -p 3306 --dialect mysql`  // 终端输入此命令，将读取数据库，自动生成相应的models
    - 5.`npm run create`; // 根据models文件夹里的文件，动态生成controller, service, router
    - 6.`npm run start`;
- 从代码仓库拉取：
    - 1.`nodejs7.8+`;
    - 2.`npm install`;
    - 3.`npm run start`;
