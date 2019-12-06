// movements.page.js
const ReportPage = require('./report.page');

class MovementsPage extends ReportPage {
    constructor() {
        super();
        this.pagename = 'migration-button';
        this.row = '.migration-block';
        this.inputWrapper = '.input-wrapper';
        this.labelWrapper = '.input-label';
        this.selectWrapper = '.movement-type-select';
    }

    setHeads(number, index) { return this.input(index, 'Head').waitSetValue(number) && this; }
    setAvgWeight(number, index) { return this.input(index, 'Est. Avg. Weight').waitSetValue(number) && this; }
 
    setCondition(condition, index) {
        switch (condition) {
            case 'good':
                this.block(index).$('.good-condition').click();
                break;
            case 'average':
                this.block(index).$('.avg-condition').click();
                break;
            case 'poor':
                this.block(index).$('.poor-condition').click();
                break;
            default:
                this.block(index).$('.good-condition').click();
                break;
        }
        return this;
    }

    clickSelectParam(index) {
        return this.block(index).$(this.selectWrapper).waitClick() && this;
    }

    setShipment(nHeads, weight, condition, index) {
        if (this.isMobile) {
            this.setPicker('Shipment');
            this.mClickNext();
        } else {
            this.setDropdown('Shipment', index);
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        if (weight !== undefined) { this.setAvgWeight(weight, index); }
        if (condition !== undefined) { this.setCondition(condition, index); }
        return this;
    }

    setTransfer(nHeads, index) {
        if (this.isMobile) {
            this.setPicker('Transfer');
            this.mClickNext();
        } else {
            this.setDropdown('Transfer', index);
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setSale(nHeads, index) {
        if (this.isMobile) {
            this.setPicker('Sale');
            this.mClickNext();
        } else {
            this.setDropdown('Sale', index);
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setFixAdding(nHeads, weight, condition, index) {
        if (this.isMobile) {
            this.setPicker('add');
            this.mClickNext();
        } else {
            this.setDropdown('add', index);
        }
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setFixRemoving(nHeads, index) {
        if (this.isMobile) {
            this.setPicker('remov');
            this.mClickNext();
        } else {
            this.setDropdown('remov', index);
        }      
        if (nHeads !== undefined) { this.setHeads(nHeads, index); }
        return this;
    }

    setMovement(type, nHeads, weight, condition, index) {
        if (this.isMobile && type) {
            this.setPicker(type);
            this.mClickNext();
        } else if (type) {
            this.setDropdown(type, index);
        }
        (nHeads === undefined) || this.setHeads(nHeads, index);
        (weight === undefined) || this.inputLabel(index, 'Est. Avg. Weight').isExisting() && this.setAvgWeight(weight, index);
        (condition === undefined) || this.inputLabel(index, 'Condition').isExisting() && this.setCondition(condition, index);
        return this;
    }

}

module.exports = new MovementsPage();
