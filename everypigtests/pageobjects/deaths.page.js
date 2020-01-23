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

    setChronic(value, index) {
        return this.input(index, '*=Chronic').setValue(value) && this;
    }

    setAcute(value, index) {
        return this.input(index, '*=Acute').setValue(value) && this;
    }

    setEuthanasia(value, index) {
        return this.input(index, '*=Euthanasia').setValue(value) && this;
    }

    setMortalities(chronic, acute, euthanas, index) {
        this.box.waitForExist();
        if (chronic !== undefined) { this.setChronic(chronic, index); }
        if (acute !== undefined) { this.setAcute(acute, index); }
        if (euthanas !== undefined) { this.setEuthanasia(euthanas, index); }
        return this;
    }

    setMortWithReason(reason, chronic, acute, euthanas, index) {
        if (this.isMobile) {
            this.setPicker(reason).clickNext();
        } else {
            this.setDropdown(reason, index);
        }
        this.setMortalities(chronic, acute, euthanas, index);
        return this;
    }

    reset() {
        return this.removeComment()
            .setMortalities('0', '0', '0')
            .submit();
    }
}

module.exports = new DeathsPage();
