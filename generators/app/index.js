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
        this.log(yosay('Welcome to the groundbreaking ' + chalk.red('example') + ' generator!'
        ));
        this.name = path.basename(process.cwd());
        this.license = 'ISC';
        this.description = '';
        this.author = '';
        var prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'name of app:', default: this.name
            },
            {
                type: 'input',
                name: 'description',
                message: 'description:', default: this.description
            },
            {
                type: 'list',   // 提供选择的列表
                name: 'SQL',
                message: '选择一种数据库',
                choices: [
                    {
                        name: 'mongodb',
                        value: true
                    },
                    {
                        name: 'MySQL',
                        value: false
                    }
                ]
            },
            {
                type: 'checkbox',
                name: 'features',
                message: 'is the websocket would you like to include?',
                choices: [{
                    name: 'websocket',
                    value: 'includeWebsocket',
                    checked: true
                }]
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
                message: 'keywords:', default: this.author
            }

        ];
        return this.prompt(prompts).then((props) => {
            const features = props.features;
            const hasFeature = feat => features && features.indexOf(feat) !== -1;

            this.name = props.name;
            // this.pkgName = props.name;
            this.SQL = props.SQL;
            this.repo = props.repo;
            this.license = props.license;
            this.author = props.author;
            this.description = props.description;
            this.keywords = props.keywords;
            this.includeWebsocket = hasFeature('includeWebsocket');

            // done();  //进入下一个生命周期阶段
        });
    }

    writing() {      //默认源目录就是生成器的templates目录，目标目录就是执行`yo example`时所处的目录。调用this.template用Underscore模板语法去填充模板文件
        this.log(this.name);
        if (this.SQL) {
            // this.template('_MongoDB/_package.json', 'package.json');  //
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
                }
            );
            // this.fs.copy('_MongoDB/_README.md', 'README.md');
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
            this.fs.copy(
                this.templatePath('_MongoDB/_api'),
                this.destinationPath('api')
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_bin/'),
                this.destinationPath('bin')
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
            this.fs.copy(
                this.templatePath('_MongoDB/_services'),
                this.destinationPath('services')
            );
            this.fs.copy(
                this.templatePath('_MongoDB/_utils'),
                this.destinationPath('utils')
            );
            // this.fs.copy('_MongoDB/_app.js', 'app.js')
            // this.fs.copy('_MongoDB/_webpack.config.js', 'webpack.config.js')
            // this.directory('_MongoDB/_api', 'api');
            // this.directory('_MongoDB/_bin/', 'bin');
            // this.directory('_MongoDB/_config', 'config');
            // this.directory('_MongoDB/_db', 'db');
            // this.directory('_MongoDB/_models', 'models');
            // this.directory('_MongoDB/_services', 'services');
            // this.directory('_MongoDB/_utils', 'utils');
        } else {
            // this.template('_MySQL/_package.json', 'package.json');  //
            this.fs.copyTpl(
                this.templatePath('_MySQL/_package.json'),
                this.destinationPath('package.json'),
                // {
                //     includeWebsocket: this.includeWebsocket,
                // }
            );

            this.fs.copy(
                this.templatePath('_MySQL/_README.md'),
                this.destinationPath('README.md')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_app.js'),
                this.destinationPath('app.js')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_api'),
                this.destinationPath('api')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_bin/'),
                this.destinationPath('bin')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_config'),
                this.destinationPath('config')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_sql'),
                this.destinationPath('sql')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_models'),
                this.destinationPath('models')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_services'),
                this.destinationPath('services')
            );
            this.fs.copy(
                this.templatePath('_MySQL/_utils'),
                this.destinationPath('utils')
            );



            // this.fs.copy('_MySQL/_README.md', 'README.md');
            // this.fs.copy('_MySQL/_app.js', 'app.js')
            // this.directory('_MySQL/_api', 'api');
            // this.directory('_MySQL/_bin/', 'bin');
            // this.directory('_MySQL/_config', 'config');
            // this.directory('_MySQL/_sql', 'sql');
            // this.directory('_MySQL/_models', 'models');
            // this.directory('_MySQL/_services', 'services');
            // this.directory('_MySQL/_utils', 'utils');
        }

        if (this.includeWebsocket) {
            // this.directory('_WebSocket/_common', 'common');
            // this.directory('_WebSocket/_ipc', 'ipc');
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
            this.fs.copy(
                this.templatePath('_WebSocket/_services/WSBasicService.js'),
                this.destinationPath('services/WSBasicService.js')
            );
            // this.fs.copy('_WebSocket/_config/WSConfig.js', 'config/WSConfig.js');
            // this.fs.copy('_WebSocket/_services/WSBasicService.js', 'services/WSBasicService.js');
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
            bower: true,
            npm: true
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