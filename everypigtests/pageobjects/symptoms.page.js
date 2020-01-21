// symptoms.page.js
const ReportPage = require('./report.page');

class SymptomsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'symptom';
        this.row = '.symptom-row';
        this.selectWrapper = '.select-symptom-wrapper';
    }

    setPercent( val = 5, index) {
        const width = this.block(index).$('.toggler-wrapper').getCSSProperty('width').parsed.value;
        val = Math.floor(width * (val - 50) / 100);
        this.block(index).$('.toggler-wrapper').click({x: val});
        return this.pause();
    }

    setSymptom(value, percent, index) {
        if (this.isMobile) {
            this.setPicker(value).clickNext();
        } else {
            this.setDropdown(value, index);
        }
        this.setPercent(percent, index);
        return this;
    }
} 

module.exports = new SymptomsPage();
