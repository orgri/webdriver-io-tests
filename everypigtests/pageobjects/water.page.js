// temps.page.js
var ReportPage = require('./report.page');

class WaterPage extends ReportPage {
    get inputWrapper() { return '.water-usage-row'; }

    setGals(number) { return this.input('Gallons').waitSetValue(number) && this; }
}

module.exports = new WaterPage();