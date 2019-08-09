// deaths.page.js
var ReportPage = require('./report.page');

class DeathsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'mortality-reason';
        this.row = '.mortality-reason-row';
    }

    get message() { return $('.MessageBox'); }
    get inputWrapper() { return '.NumberStepInput'; }
    get selectWrapper() { return '.select-mort-reason-wrapper'; }
    get isMortReason() { return $('.add-mortality-reason').isExisting(); }

    clickSelectParam(index) { return this.paramRow(index).$(this.selectWrapper).waitAndClick() && this; }

    setChronic(number, index) { return this.input('Chronic', index).setValue(number) && this; }
    setAcute(number, index) { return this.input('Acute', index).setValue(number) && this; }
    setEuthanasia(number, index) { return this.input('Euthanasia', index).setValue(number) && this; }

    setMortalities(chronic, acute, euthanas, index) {
        this.box.waitForExist();
        if (chronic !== undefined) { this.setChronic(chronic, index); }
        if (acute !== undefined) { this.setAcute(acute, index); }
        if (euthanas !== undefined) { this.setEuthanasia(euthanas, index); }
        return this;
    }

    setMortWithReason(reason, chronic, acute, euthanas, index) {
        if (this.isMobile) {
            this.mSetReportParam(reason);
            this.mClickNext();
        } else { this.setReportParam(reason, index); }
        this.setMortalities(chronic, acute, euthanas, index);
        return this;
    }

    reset() {
        this.removeComment();
        this.setMortalities('0', '0', '0');
        this.submit();
        return this;
    }

}

module.exports = new DeathsPage();