'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    initializing() {    //初始化准备工作

    }

    prompting() {  //接受用户输入
        // var done = this.async(); //当处理完用户输入需要进入下一个生命周期阶段时必须调用这个方法

        //yeoman-generator 模块提供了很多内置的方法供我们调用，如下面的this.log , this.prompt , this.template , this.spawnCommand 等

        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the groundbreaking ' + chalk.red('nodemicrosevice') + ' generator!'
        ));
        this.name = path.basename(process.cwd());
        this.license = 'ISC';
        this.description = '';
        this.repo = '';
        this.author = 'CW';
        var prompts = [
            {
                type: 'checkbox',
                name: 'features',
                message: '选择是否添加websocket和sidecar',
                choices: [{
                    name: 'websocket',
                    value: 'includeWebsocket',
                    checked: true
                },
                    {
                        name: 'sidecar',
                        value: 'includesidecar',
                        checked: true
                    }]
            },
            {
                type: 'list',   // 提供选择的列表
                name: 'SQL',
                message: '选择一种数据库',
                choices: [
                    {
                        name: 'mongodb',
                        value: 'choiceMongodb'
                    },
                    {
                        name: 'MySQL',
                        value: 'choiceMySQL'
                    },
                    {
                        name: 'mssql',
                        value: 'choicemssql'
                    }
                ]
            },
            {
                type: 'input',
                name: 'host',
                message: 'IP/Hostname for the database:',
                validate: answers => {
                    if (answers) {
                        return true;
                    }

                    return '不能为空';
                },
                when: answers => answers.SQL.indexOf('choiceMySQL') !== -1 || answers.SQL.indexOf('choicemssql') !== -1
            },
            {
                type: 'input',
                name: 'database',
                message: 'Database name:',
                validate: answers => {
                    if (answers) {
                        return true;
                    }

                    return '不能为空';
                },
                when: answers => answers.SQL.indexOf('choiceMySQL') !== -1 || answers.SQL.indexOf('choicemssql') !== -1
            },
            {
                type: 'input',
                name: 'user',
                message: 'Username for database:',
                validate: answers => {
                    if (answers) {
                        return true;
                    }

                    return '不能为空';
                },
                when: answers => answers.SQL.indexOf('choiceMySQL') !== -1 || answers.SQL.indexOf('choicemssql') !== -1
            },
            {
                type: 'input',
                name: 'pass',
                message: 'Password for database:',
                validate: answers => {
                    if (answers) {
                        return true;
                    }

                    return '不能为空';
                },
                when: answers => answers.SQL.indexOf('choiceMySQL') !== -1 || answers.SQL.indexOf('choicemssql') !== -1
            },
            {
                type: 'input',
                name: 'name',
                message: 'name of project:',
                validate: answers => {
                    if (answers) {
                        return true;
                    }

                    return '不能为空';
                }
            },
            {
                type: 'input',
                name: 'description',
                message: 'description:', default: this.description
            },
            {
                type: 'input',
                name: 'sidecar',
                message: 'sidecar name:',
                validate: answers => {
                    if (answers) {
                        return true;
                    }

                    return '不能为空';
                },
                when: answers => answers.features.indexOf('includesidecar') !== -1
            },
            {
                type: 'input',
                name: 'sidecarProt',
                message: 'sidecar port:请选择4000~4999之间的端口',
                validate: answers => {
                    var pass = answers.match(
                        /^([4]\d\d\d)$/
                    );
                    if (pass) {
                        return true;
                    }

                    return '请输入正确的端口号';
                },
                when: answers => answers.features.indexOf('includesidecar') !== -1
            },
            {
                type: 'input',
                name: 'repo',
                message: 'git repository:', default: this.repo
            },
            {
                type: 'input',
                name: 'license',
                message: 'license:', default: this.license
            },
            {
                type: 'input',
                name: 'author',
                message: 'author:', default: this.author
            },
            {
                type: 'input',
                name: 'keywords',
                message: 'keywords:',
                validate: answers => {
                    if (answers) {
                        return true;
                    }

                    return '不能为空';
                }
            }

        ];
        return this.prompt(prompts).then((props) => {
            const features = props.features;
            const hasFeature = feat => features && features.indexOf(feat) !== -1;

            this.name = props.name;
            // this.pkgName = props.name;
            this.SQL = props.SQL;
            this.host = props.host;
            this.database = props.database;
            this.user = props.user;
            this.pass = props.pass;
            this.repo = props.repo;
            this.license = props.license;
            this.author = props.author;
            this.description = props.description;
            this.keywords = props.keywords;
            this.sidecar = props.sidecar;
            this.sidecarProt = props.sidecarProt;
            this.includeWebsocket = hasFeature('includeWebsocket');
            this.includesidecar = hasFeature('includesidecar');

            // done();  //进入下一个生命周期阶段
        });
    }

    writing() {      //默认源目录就是生成器的templates目录，目标目录就是执行`yo example`时所处的目录。调用this.template用Underscore模板语法去填充模板文件
        this._writingSQL();
        this._writingWebsocket();
        this._writingSidecar();
    }

    _writingSQL() {
        if (this.SQL == 'choiceMongodb') {
            this.fs.copyTpl(
                this.templatePath('_MongoDB/_package.json'),
                this.destinationPath('package.json'),
                {
                    name: this.name,
                    SQL: this.SQL,
                    repo: this.repo,
                    license: this.license,
                    author: this.author,
                    description: this.description,
                    keywords: this.keywords,
                    includeWebsocket: this.includeWebsocket,
                    includesidecar: this.includesidecar,
                }
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_README.md'),
                this.destinationPath('.README.md')
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_app.js'),
                this.destinationPath('app.js')
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_webpack.config.js'),
                this.destinationPath('webpack.config.js')
            );
            this.fs.copyTpl(
                this.templatePath('_MongoDB/_api'),
                this.destinationPath('api'),
                {
                    includeWebsocket: this.includeWebsocket,
                }
            );
            this.fs.copyTpl(
                this.templatePath('_MongoDB/_bin/'),
                this.destinationPath('bin'),
                {
                    includeWebsocket: this.includeWebsocket,
                }
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_config'),
                this.destinationPath('config')
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_db'),
                this.destinationPath('db')
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_models'),
                this.destinationPath('models')
            );
            this.fs.copyTpl(
                this.templatePath('_MongoDB/_services'),
                this.destinationPath('services'),
                {
                    includeWebsocket: this.includeWebsocket,
                }
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_utils'),
                this.destinationPath('utils')
            );
        } else if(this.SQL == 'choiceMySQL'){
            this.fs.copyTpl(
                this.templatePath('_MySQL/_package.json'),
                this.destinationPath('package.json'),
                {
                    name: this.name,
                    SQL: this.SQL,
                    repo: this.repo,
                    license: this.license,
                    author: this.author,
                    description: this.description,
                    keywords: this.keywords,
                    includeWebsocket: this.includeWebsocket,
                    includesidecar: this.includesidecar,
                }
            );
            this.fs.copyTpl(
                this.templatePath('_MySQL/_README.md'),
                this.destinationPath('README.md'),
                {
                    host: this.host,
                    database: this.database,
                    user: this.user,
                    pass: this.pass
                }
            );
            this.fs.copy(
                this.templatePath('_MySQL/_app.js'),
                this.destinationPath('app.js'),
            );
            this.fs.copy(
                this.templatePath('_MySQL/_createAPI.js'),
                this.destinationPath('createAPI.js'),
            );
            this.fs.copy(
                this.templatePath('_MySQL/_webpack.config.js'),
                this.destinationPath('webpack.config.js')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_api'),
                this.destinationPath('api')
            );
            this.fs.copyTpl(
                this.templatePath('_MySQL/_bin/'),
                this.destinationPath('bin'),
                {
                    includeWebsocket: this.includeWebsocket,
                }
            );
            this.fs.copyTpl(
                this.templatePath('_MySQL/_config'),
                this.destinationPath('config'),
                {
                    host: this.host,
                    database: this.database,
                    user: this.user,
                    pass: this.pass
                }
            );
            this.fs.copy(
                this.templatePath('_MySQL/_sql'),
                this.destinationPath('sql')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_models'),
                this.destinationPath('models')
            );
            this.fs.copyTpl(
                this.templatePath('_MySQL/_services'),
                this.destinationPath('services'),
                {
                    includeWebsocket: this.includeWebsocket,
                }
            );
            this.fs.copy(
                this.templatePath('_MySQL/_utils'),
                this.destinationPath('utils')
            );
        }else {
            this.fs.copyTpl(
                this.templatePath('_mssql/_package.json'),
                this.destinationPath('package.json'),
                {
                    name: this.name,
                    SQL: this.SQL,
                    repo: this.repo,
                    license: this.license,
                    author: this.author,
                    description: this.description,
                    keywords: this.keywords,
                    includeWebsocket: this.includeWebsocket,
                    includesidecar: this.includesidecar,
                }
            );
            this.fs.copyTpl(
                this.templatePath('_mssql/_README.md'),
                this.destinationPath('README.md'),
                {
                    host: this.host,
                    database: this.database,
                    user: this.user,
                    pass: this.pass
                }
            );
            this.fs.copy(
                this.templatePath('_mssql/_app.js'),
                this.destinationPath('app.js'),
            );
            this.fs.copy(
                this.templatePath('_mssql/_createAPI.js'),
                this.destinationPath('createAPI.js'),
            );
            this.fs.copy(
                this.templatePath('_mssql/_webpack.config.js'),
                this.destinationPath('webpack.config.js')
            );
            this.fs.copy(
                this.templatePath('_mssql/_api'),
                this.destinationPath('api')
            );
            this.fs.copyTpl(
                this.templatePath('_mssql/_bin/'),
                this.destinationPath('bin'),
                {
                    includeWebsocket: this.includeWebsocket,
                }
            );
            this.fs.copyTpl(
                this.templatePath('_mssql/_config'),
                this.destinationPath('config'),
                {
                    host: this.host,
                    database: this.database,
                    user: this.user,
                    pass: this.pass
                }
            );
            this.fs.copy(
                this.templatePath('_mssql/_sql'),
                this.destinationPath('sql')
            );
            this.fs.copy(
                this.templatePath('_mssql/_models'),
                this.destinationPath('models')
            );
            this.fs.copyTpl(
                this.templatePath('_mssql/_services'),
                this.destinationPath('services'),
                {
                    includeWebsocket: this.includeWebsocket,
                }
            );
            this.fs.copy(
                this.templatePath('_mssql/_utils'),
                this.destinationPath('utils')
            );
        }
    }
    _writingWebsocket() {
        if (this.includeWebsocket) {
            this.fs.copy(
                this.templatePath('_WebSocket/_common'),
                this.destinationPath('common')
            );
            this.fs.copy(
                this.templatePath('_WebSocket/_ipc'),
                this.destinationPath('ipc')
            );
            this.fs.copy(
                this.templatePath('_WebSocket/_config/WSConfig.js'),
                this.destinationPath('config/WSConfig.js')
            );
            // this.fs.copy(
            //     this.templatePath('_WebSocket/_services/WSBasicService.js'),
            //     this.destinationPath('services/WSBasicService.js')
            // );
        }
    }
    _writingSidecar() {
        if(this.includesidecar) {
            this.fs.copyTpl(
                this.templatePath('_node-sidecar'),
                this.destinationPath(this.sidecar),
                {
                    includesidecar: this.includesidecar,
                    sidecar: this.sidecar,
                    name: this.name,
                    sidecarProt: this.sidecarProt,
                }
            );
            this.fs.copyTpl(
                this.templatePath('_sidecar-services/SidecarService.js'),
                this.destinationPath('services/SidecarService.js'),
                {
                    sidecar: this.sidecar,
                    sidecarProt: this.sidecarProt,
                }
            );
            this.fs.copy(
                this.templatePath('_health'),
                this.destinationPath('api/health')
            );
        }
    }

    install() {
        // var done = this.async();
        // this.spawnCommand('npm', ['install'])  //安装项目依赖
        //     .on('exit', function (code) {
        //         if (code) {
        //             // done(new Error('code:' + code));
        //         } else {
        //             // done();
        //         }
        //     })
        //     .on('error');
        this.installDependencies({
            npm: true,
            bower: false,
        }).then(() => console.log('Everything is ready!'));
    }

    end() {
        // var done = this.async();
        // this.spawnCommand('gulp')   //生成器退出前运行gulp，开启watch任务
        //     .on('exit', function (code) {
        //         if (code) {
        //             done(new Error('code:' + code));
        //         } else {
        //             done();
        //         }
        //     })
        //     .on('error', done);
    }
};