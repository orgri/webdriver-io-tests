// shipment.page.js
const ReportPage = require('./report.page');

class ShipmentPage extends ReportPage {
    constructor() {
        super();
        this.inputWrapper = '.row';
        this.labelWrapper = '.label-wrapper';
    }

    get mClose() {
        return $('a[class^=back-link] .fa.fa-times');
    }

    get mWrapper() {
        return $('.CreateShipmentMobileWizard');
    }

    setHeads(number) {
        return this.input('Head').waitSetValue(number) && this;
    }

    setAvgWeight(number) {
        return this.input('Est. Avg. Weight').waitSetValue(number) && this;
    }

    fillValue(number) {
        return $('input[type=number]').waitSetValue(number) && this;
    }

    clickEdit() {
        return $('.link=Edit').waitClick() && this;
    }

    setCondition(condition) {
        switch (condition) {
            case 'good':
                $('.good-condition').click();
                break;
            case 'average':
                $('.avg-condition').click();
                break;
            case 'poor':
                $('.poor-condition').click();
                break;
            default:
                $('.good-condition').click();
                break;
        }
        return this;
    }

    setBarn() {
        //TODO: set certain barn and for desktop view
        if (isMobile) {
            const barns = $$('.barn-checkbox');
            barns[tdata.rand(barns.length - 1)].waitClick();
        }
        return this;
    }

}

module.exports = new ShipmentPage();
