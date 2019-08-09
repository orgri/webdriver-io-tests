// symptoms.page.js
var ReportPage = require('./report.page');

class SymptomsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'symptom';
        this.row = '.symptom-row';
    }

    setPercent(index) {
        let target = this.paramRow(index).$('.symptomatic'); 
        this.paramRow(index).$('.toggler-btn').dragAndDrop(target);
        this.pause();
        return this;
    }

    setSymptom(name, index) {
        if (this.isMobile) {
            this.mSetReportParam(name);
            this.mClickNext();    
        } else { 
            this.setReportParam(name, index);
        }
        this.setPercent(index);
        return this;
    }
} 

module.exports = new SymptomsPage();