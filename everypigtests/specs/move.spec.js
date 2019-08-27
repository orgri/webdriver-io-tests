const checkupPage = require('../pageobjects/checkup.page');
const movePage = require('../pageobjects/movements.page');

describe('Report movements', () => {    

    after(function () {
        checkupPage.clearSection('Move').submit();
    });

    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest.title == 'Choose group'
            || checkupPage.openCurrent().chooseSection(0, 'Move');
    });

    it('Choose group', () => {
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    if (isMobile) {
        it('Opens picker', () => {
            expect(movePage.mobileRow('Ship').isExisting(), 'mobileRow(Ship).isExisting').to.equal(true);
        });

        it('Check and uncheck movement', () => {
            movePage.mSetReportParam('Shipment').mSetReportParam('Shipment');

            expect(movePage.isSelected('Shipment'), 'isSelected(Shipment)').to.equal(false);
        });

        it('Not able to tap Next without choosed movement', () => {
            expect(movePage.isNextDisabled, 'isNextDisabled').to.equal(true);
        });

        it('Back to checkup', () => {
            movePage.mBack();

            expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
        });

        it('Search when choosing movements', () => {
            movePage.setSearch('Sale');

            expect(movePage.mobileRow('Sale').isExisting(), 'mobileRow(Sale).isExisting').to.equal(true);
            expect(movePage.mRows, 'mRows').to.have.lengthOf(1);
            expect(movePage.mRows[0].getText(), 'mRows[0]').to.match(/Sale/);
        });
    }

    it('Cancel report with changes', function () {
        if (movePage.isMobile) {
            this.skip();
        } else {
            movePage.setMovement(tdata.randMoveType, tdata.randHeads, 
                tdata.randWeight, tdata.randCondition)
                .setComment(tdata.randComment)
                .cancel();
            checkupPage.section(0).scrollIntoView({ block: "center" });

            expect(checkupPage.isEmpty(0), 'isEmpty').to.equal(true);
        }
    });

    it('Close report with changes', () => {
        movePage.setMovement(tdata.randMoveType, tdata.randHeads, 
            tdata.randWeight, tdata.randCondition)
            .setComment(tdata.randComment)
            .close();
        checkupPage.section(0).scrollIntoView({ block: "center" });

        expect(checkupPage.isEmpty(0), 'isEmpty').to.equal(true);
    });

    it('Report Shipment', () => {
        const heads = tdata.randHeads + '',
            weight = tdata.randWeight + '',
            condition = tdata.randCondition;

        movePage.setShipment(heads, weight, condition).submit();
        checkupPage.section(0).scrollIntoView({ block: "center" });

        const rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.added[0], 'pigs added').to.equal(heads);
        expect(rslt.weight[0], 'avgWeight').to.equal(weight + ' lbs');
        expect(rslt.condition[0], 'condition').to.equal(condition);
    });

    it('Fix adding ', () => {
        const heads = tdata.randHeads + '';
        const weight = tdata.randWeight + '';
        const condition = tdata.randCondition;

        movePage.setFixAdding(heads, weight, condition).submit();
        checkupPage.section(0).scrollIntoView({ block: "center" });
        
        const rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.added[0], 'pigs added').to.equal(heads);
    });

    it('Report Transfer', () => {
        const heads = tdata.randHeads + '';

        movePage.setTransfer(heads).submit();
        checkupPage.section(0).scrollIntoView({ block: "center" });

        const rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.removed[0], 'pigs removed').to.equal(heads);
    });

    it('Report Sale', () => {
        const heads = tdata.randHeads + '';

        movePage.setSale(heads).submit();
        checkupPage.clickToModal('No').section(0).scrollIntoView({ block: "center" });

        const rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.removed[0], 'pigs removed').to.equal(heads);
    });

    it('Fix removing', () => {
        const heads = tdata.randHeads + '';

        movePage.setFixRemoving(heads).submit();
        checkupPage.section(0).scrollIntoView({ block: "center" });

        const rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.removed[0], 'pigs removed').to.equal(heads);
    });

    it('Change movement', () => {
        const heads = tdata.randArrayHeads(2);
        const weight = tdata.randWeight + '';
        tdata.toStringVal(heads);

        movePage.setFixRemoving(heads[0]).clickSelectParam()
            .setShipment(heads[1], weight).submit();
        checkupPage.section(0).scrollIntoView({ block: "center" });

        const rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.added[0], 'pigs added').to.equal(heads[1]);
        expect(rslt.weight[0], 'avgWeight').to.equal(weight + ' lbs');
    });

});

describe('Movements page, invalid input)', () => {

    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest.title == 'Choose group'
            || checkupPage.openCurrent().chooseSection(0, 'Move');
    });

    it('Choose group', () => {
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Not able to set Heads bigger than 99999', () => {
        movePage.setTransfer('1234567890');
        expect(movePage.input('Head').getValue(), 'heads').to.equal('12345');
    });

    it('Not able to set Weight bigger than ?', () => {
        movePage.setShipment('0', '1234567890');
        expect(movePage.input('Weight').getValue(), 'avgWeight').to.equal('12345');
    });

    it('Not able to set negative value in Heads', () => {
        movePage.setSale('-123');
        expect(movePage.input('Head').getValue(), 'heads').to.equal('23');
    });

    it('Not able to set negative value in Weight', () => {
        movePage.setShipment('0', '-123');
        expect(movePage.input('Weight').getValue(), 'avgWeight').to.equal('23');
    });

    it('Not able to set letters in Heads', () => {
        movePage.setFixRemoving('qwer1ty2345 ~!@#$%^&*()');
        expect(movePage.input('Head').getValue(), 'heads').to.equal('');
    });

    it('Not able to set letters in Weight', () => {
        movePage.setShipment('0', 'qwer1ty2345 ~!@#$%^&*()');
        expect(movePage.input('Weight').getValue(), 'avgWeight').to.equal('');
    });

    it('Not able to report with empty mandatory Heads field', () => {
        movePage.setShipment('0', '10', 'good');
        expect(movePage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Not able to report with empty mandatory Heads field in case of several ones', () => {
        movePage.setShipment('10', '10', 'good')
            .addRow().clickSelectParam()
            .setTransfer()
            .addRow().clickSelectParam() //this step because of bug
            .setSale('20').resetIndex();

        expect(movePage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

});