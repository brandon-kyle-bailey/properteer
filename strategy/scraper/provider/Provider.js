const puppeteer = require('puppeteer');

class Provider {
    constructor() {
    }

    set setResource(data) {
        this.resource = data;
    }

    /**
     * @param {Function} method
     */
    set strategyOverride(method) {
        this.strategy = method;
    }

    async start() {
        try {
            this.browser = await puppeteer.launch();
            this.page = await this.browser.newPage();
            await this.page.goto(this.resource);
        } catch(error) {
            console.log(error);
        }
    }

    async execute() {
        return await this.strategy(this.page);
    }

    async finish() {
        await this.browser.close();
    }
}

module.exports = Provider;