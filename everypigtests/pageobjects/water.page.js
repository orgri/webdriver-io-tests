// temps.page.js
const ReportPage = require('./report.page');

class WaterPage extends ReportPage {
    constructor() {
        super();
        this.inputWrapper = '.water-usage-row';
    }

    setGals(number) { return this.input('Gallons').waitSetValue(number) && this; }
}

module.exports = new WaterPage();
