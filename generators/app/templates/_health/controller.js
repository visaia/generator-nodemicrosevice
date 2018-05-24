class Controller{
    async checkHealth(ctx){
        ctx.body = {status: 'UP'};
    }
}

module.exports = new Controller();