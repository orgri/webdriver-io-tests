// temps.page.js
var ReportPage = require('./report.page');

class TempsPage extends ReportPage {
    get inputWrapper() { return '.NumberStepInput'; } 

    setHigh(number) { return this.input('High').setValueAndWait(number) && this; }
    setLow(number) { return this.input('Low').setValueAndWait(number) && this; }
    setTemps(highValue = '0', lowValue = '0') { return this.setHigh(highValue).setLow(lowValue) && this; }
}

module.exports = new TempsPage();