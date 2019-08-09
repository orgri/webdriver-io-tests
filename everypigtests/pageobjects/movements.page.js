// movements.page.js
var ReportPage = require('./report.page');

class MovementsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'migration-button';
        this.row = '.migration-block';
    }

    get inputWrapper() { return '.input-wrapper'; }
    get selectWrapper() { return '.movement-type-select'; }
    get labelWrapper() { return '.input-label'; }
    
    setHeads(number, index) { return this.input('Head', index).setValueAndWait(number) && this; }
    setAvgWeight(number, index) { return this.input('Est. Avg. Weight', index).setValueAndWait(number) && this; }
 
    setCondition(condition, index) {
        switch (condition) {
            case 'good':
                this.paramRow(index).$('.good-condition').click();
                break;
            case 'average':
                this.paramRow(index).$('.avg-condition').click();
                break;
            case 'poor':
                this.paramRow(index).$('.poor-condition').click();
                break;
            default:
                this.paramRow(index).$('.good-condition').click();
                break;
        }
        return this;
    }

    clickSelectParam(index) { return this.paramRow(index).$(this.selectWrapper).waitAndClick() && this; }

    setShipment(nHeads, weight, condition, index) {
        if (this.isMobile) {
            this.mSetReportParam('Shipment');
            this.mClickNext();
        } else { 
            this.setReportParam('Shipment', index); 
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        if (weight !== undefined) { this.setAvgWeight(weight, index); }
        if (condition !== undefined) { this.setCondition(condition, index); }
        return this;
    }

    setTransfer(nHeads, index) {
        if (this.isMobile) {
            this.mSetReportParam('Transfer');
            this.mClickNext();
        } else { 
            this.setReportParam('Transfer', index);
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setSale(nHeads, index) {
        if (this.isMobile) {
            this.mSetReportParam('Sale');
            this.mClickNext();
        } else { 
            this.setReportParam('Sale', index);
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setFixAdding(nHeads, weight, condition, index) {
        if (this.isMobile) {
            this.mSetReportParam('add');
            this.mClickNext();
        } else { 
            this.setReportParam('add', index);
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setFixRemoving(nHeads, index) {
        if (this.isMobile) {
            this.mSetReportParam('remov');
            this.mClickNext();
        } else { 
            this.setReportParam('remov', index);
        }      
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setMovement(type, nHeads, weight, condition, index) {
        if (this.isMobile) {
            this.mSetReportParam(type);
            this.mClickNext();
        } else { 
            this.setReportParam(type, index);
        }
        (nHeads == undefined) || this.setHeads(nHeads, index);
        (weight == undefined) || this.inputLabel('Est. Avg. Weight', index).isExisting() && this.setAvgWeight(weight, index);
        (condition == undefined) || this.inputLabel('Condition', index).isExisting() && this.setCondition(condition, index);
        return this;
    }

}

module.exports = new MovementsPage();