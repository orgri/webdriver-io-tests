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
        let target = this.inputBlock(index).$('.symptomatic');
        this.inputBlock(index).$('.toggler-btn').dragAndDrop(target);
        this.pause();
        return this;
    }

    setSymptom(name, index) {
        if (this.isMobile) {
            this.setPicker(name);
            this.mClickNext();
        } else {
            this.setDropdown(name, index);
        }
        this.setPercent(index);
        return this;
    }
} 

module.exports = new SymptomsPage();
