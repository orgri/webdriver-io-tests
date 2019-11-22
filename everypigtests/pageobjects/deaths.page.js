// deaths.page.js
const ReportPage = require('./report.page');

class DeathsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'mortality-reason';
        this.row = '.mortality-reason-row';
        this.inputWrapper = '.NumberStepInput';
        this.selectWrapper = '.select-mort-reason-wrapper';
    }

    get message() { return $('.MessageBox'); }
    get isMortReason() { return $('.add-mortality-reason').isExisting(); }

    clickSelectParam(index) {
        return this.inputBlock(index).$(this.selectWrapper).waitClick() && this;
    }

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
            this.setPicker(reason);
            this.mClickNext();
        } else {
            this.setDropdown(reason, index);
        }
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
