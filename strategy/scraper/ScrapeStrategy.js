class Strategy {
    constructor(provider) {
        this.provider = new provider();
    }
    set strategyOverride(method) {
        this.provider.strategyOverride = method;
    }

    set resource(data) {
        this.provider.setResource = data;
    }

    async execute() {
        await this.provider.start();
        const data = await this.provider.execute();
        await this.provider.finish();
        return data;
    }
}


module.exports = Strategy;