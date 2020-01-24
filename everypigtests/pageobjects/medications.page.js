// medications.page.js
const ReportPage = require('./report.page');

class MedicationsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'treatment';
        this.row = '.treatment-row';
        this.inputWrapper = '.treatment-details-row';
        this.labelWrapper = '.label-wrapper';
        this.selectWrapper = '.select-treatment-wrapper';
    }

    get pigsUnderCare() { return $('.PigsUnderCareLine.mobile'); }
    get total() { return $('#head-total-count'); }
 
    setHead(number, index) {
        this.label(index, '*=Head').waitClick();
        this.input(index, '*=Head Treated').addValue(number);
        browser.keys('Tab');
        return this;
    }

    setUnits(number, index) {
        this.input(index, '*=Units').waitSetValue(number);
        browser.keys('Tab');
        return this;
    }

    setGals(number, index) {
        this.input(index, '*=Gals').waitSetValue(number);
        browser.keys('Tab');
        return this;
    }

    setCcs(number, index) {
        this.input(index, '*=ccs').waitSetValue(number);
        browser.keys('Tab');
        return this;
    }

    setMls(number, index) {
        this.input(index, '*=Milliliters').waitSetValue(number);
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
            this.setPicker(product).clickNext();
        } else {
            this.setDropdown(product, index);
        }
        if (heads !== undefined) { this.setHead(heads, index); }
        if (units !== undefined) { this.setUnits(units, index); }
        if (gals !== undefined) { this.setGals(gals, index); }
        return this;
    }

    setWithMlsDosage(product, heads, mls, index) {
        if (this.isMobile) {
            this.setPicker(product).clickNext();
        } else {
            this.setDropdown(product, index);
        }
        if (heads !== undefined) { this.setHead(heads, index); }
        if (mls !== undefined) { this.setMls(mls, index); }
        return this;
    }

    setWithCcsDosage(product, heads, ccs, index) {
        if (this.isMobile) {
            this.setPicker(product).clickNext();
        } else {
            this.setDropdown(product, index);
        }
        if (heads !== undefined) { this.setHead(heads, index); }
        if (ccs !== undefined) { this.setCcs(ccs, index); }
        return this;
    }

    setWithoutDosage(product, heads, index) {
        if (this.isMobile) {
            this.setPicker(product).clickNext();
        } else {
            this.setDropdown(product, index);
        }
        if (heads !== undefined) { this.setHead(heads, index); }
        return this;
    }

    setTreat(product, heads, dosage, gals, index) {
        if (this.isMobile) {
            this.setPicker(product).clickNext();
        } else {
            this.setDropdown(product, index);
        }
        (heads === undefined) || this.setHead(heads, index);
        (dosage === undefined) || this.label(index, '*=Units').isExisting() && this.setUnits(dosage, index);
        (gals === undefined) || this.label(index, '*=Gals').isExisting() && this.setGals(gals, index);
        (dosage === undefined) || this.label(index, '*=ccs').isExisting() && this.setCcs(dosage, index);
        (dosage === undefined) || this.label(index, '*=Milliliters').isExisting() && this.setMls(dosage, index);
        return this;
    }
}

module.exports = new MedicationsPage();
