// symptoms.page.js
const ReportPage = require('./report.page');

class SymptomsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'symptom';
        this.row = '.symptom-row';
        this.selectWrapper = '.select-symptom-wrapper';
    }

    setPercent(index) {
        let target = this.block(index).$('.symptomatic');
        this.block(index).$('.toggler-btn').dragAndDrop(target);
        this.pause();
        return this;
    }

    setSymptom(value, index) {
        if (this.isMobile) {
            this.setPicker(value);
            this.mClickNext();
        } else {
            this.setDropdown(value, index);
        }
        this.setPercent(index);
        return this;
    }
} 

module.exports = new SymptomsPage();
