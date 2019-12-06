// temps.page.js
const ReportPage = require('./report.page');

class TempsPage extends ReportPage {
    constructor() {
        super();
        this.row = '.NumberStepInput';
        this.inputWrapper = '.step-buttons';
    }

    setHigh(number) { return this.input('High').waitSetValue(number) && this; }
    setLow(number) { return this.input('Low').waitSetValue(number) && this; }
    setTemps(highValue = '0', lowValue = '0') { return this.setHigh(highValue).setLow(lowValue) && this; }
}

module.exports = new TempsPage();
