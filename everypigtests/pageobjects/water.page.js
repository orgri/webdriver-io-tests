// temps.page.js
const ReportPage = require('./report.page');

class WaterPage extends ReportPage {
    constructor() {
        super();
        this.row = '.water-usage-row';
        this.inputWrapper = '.input-wrapper';
    }

    setGals(number) { return this.input('Gallons').waitSetValue(number) && this; }
}

module.exports = new WaterPage();
