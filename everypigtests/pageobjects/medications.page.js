// medications.page.js
var ReportPage = require('./report.page');

class MedicationsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'treatment';
        this.row = '.treatment-row';
    }

    get inputWrapper() { return '.treatment-details-row'; }
    get labelWrapper() { return '.label-wrapper'; }
    get total() { return $('#head-total-count'); }
 
    setHead(number, index) {
        this.inputLabel('Head', index).waitAndClick();
        this.input('Head Treated', index).addValue(number);
        browser.keys('Tab');
        return this;
    }
    setUnits(number, index) {
        this.input('Units', index).setValueAndWait(number);
        browser.keys('Tab');
        return this;
    }
    setGals(number, index) {
        this.input('Gals', index).setValueAndWait(number);
        browser.keys('Tab');
        return this;
    }
    setCcs(number, index) {
        this.input('ccs', index).setValueAndWait(number);
        browser.keys('Tab');
        return this;
    }
    setMls(number, index) {
        this.input('Milliliters', index).setValueAndWait(number);
        browser.keys('Tab');
        return this;
    }

    setTotal(number) {
        this.total.scrollIntoView({block: "center"});
        $(this.labelWrapper + '*=Total').click();
        this.total.addValue(number);
        browser.keys('Tab');
        return this;
    }

    setWithGalsDosage(product, heads, units, gals, index) {
        if (this.isMobile) {
            this.mSetReportParam(product);
            this.mClickNext();    
        } else { 
            this.setReportParam(product, index);
        }
        if (heads !== undefined) { this.setHead(heads); }
        if (units !== undefined) { this.setUnits(units); }
        if (gals !== undefined) { this.setGals(gals); }
        return this;
    }

    setWithMlsDosage(product, heads, mls, index) {
        if (this.isMobile) {
            this.mSetReportParam(product);
            this.mClickNext();    
        } else { 
            this.setReportParam(product, index);
        }
        if (heads !== undefined) { this.setHead(heads); }
        if (mls !== undefined) { this.setMls(mls); }
        return this;
    }

    setWithCcsDosage(product, heads, ccs, index) {
        if (this.isMobile) {
            this.mSetReportParam(product);
            this.mClickNext();    
        } else { 
            this.setReportParam(product, index);
        }
        if (heads !== undefined) { this.setHead(heads); }
        if (ccs !== undefined) { this.setCcs(ccs); }
        return this;
    }

    setWithoutDosage(product, heads, index) {
        if (this.isMobile) {
            this.mSetReportParam(product);
            this.mClickNext();    
        } else { 
            this.setReportParam(product, index);
        }
        if (heads !== undefined) { this.setHead(heads); }
        return this;
    }

    setTreat(product, heads, dosage, gals, index) {
        if (this.isMobile) {
            this.mSetReportParam(product);
            this.mClickNext(); 
        } else { 
            this.setReportParam(product, index);
        }
        (heads == undefined) || this.setHead(heads);
        (dosage == undefined) || this.inputLabel('Units', index).isExisting() && this.setUnits(dosage);
        (gals == undefined) || this.inputLabel('Gals', index).isExisting() && this.setGals(gals);
        (dosage == undefined) || this.inputLabel('ccs', index).isExisting() && this.setCcs(dosage);
        (dosage == undefined) || this.inputLabel('Milliliters', index).isExisting() && this.setMls(dosage);
        return this;
    }

}

module.exports = new MedicationsPage();