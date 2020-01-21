// shipment.page.js
const ReportPage = require('./report.page');

class ShipmentPage extends ReportPage {
    constructor() {
        super();
        this.inputWrapper = '.row';
        this.labelWrapper = '.label-wrapper';
    }

    get closeBtn() { return isMobile ? 'a[class^=back-link] .fa.fa-times' : '.close-center-box'; }
    get mobileWrapper() { return $('.CreateShipmentMobileWizard'); }

    setHeads(number) {
        return this.input(0, 'Head').waitSetValue(number) && this;
    }

    setAvgWeight(number) {
        return this.input(0, 'Est. Avg. Weight').waitSetValue(number) && this;
    }

    fillValue(number) {
        return $('input[type=number]').waitSetValue(number) && this;
    }

    clickEdit() {
        return this.clickOn('.link=Edit');
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
            const id = tdata.rand(barns.length - 1);
            this.clickOn(barns[id]);
        }
        return this;
    }
}

module.exports = new ShipmentPage();
