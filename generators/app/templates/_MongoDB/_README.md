1. KOA2工程。
2. api: 所有模块内容都写在这里， 其中包括了controller, service, router。
    这里的service都要求继承/services/BasicService
3. bin: 启动文件。
4. config: 配置文件。
5. filter: 过滤器实现。
6. models: 所有的model都写在这里。
7. services: 全局性的service写在这里。
8. utils: 一些公共类。
9. 数据库使用了mongoose的orm.
10. production--运行环境， development--开发环境


安装：
1. nodejs7.8+;
2. npm install;
3. npm run start;

