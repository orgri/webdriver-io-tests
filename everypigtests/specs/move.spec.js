const checkupPage = require('../pageobjects/checkup.page');
const movePage = require('../pageobjects/movements.page');

describe('Moves page, navigation', () => {

    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(0, 'Move');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    if (isMobile) {
        it('Opens picker', () => {
            expect(movePage.mobileRow('Ship').isExisting(), 'mobileRow(Ship).isExisting').to.equal(true);
        });

        it('Check and uncheck movement', () => {
            movePage.setPicker('Shipment').setPicker('Shipment');

            expect(movePage.isSelected('Shipment'), 'isSelected(Shipment)').to.equal(false);
        });

        it('Search special chars', () => {
            //just check whether page crashes or not, need to clarify expected behaviour
            checkupPage.setSearch('&').setSearch('%').setSearch('#').setSearch('\\')
                .setSearch('/').setSearch('\"').setSearch('$').setSearch('?')
                .setSearch('^').setSearch('|').setSearch(':').setSearch('*');
    
            expect($('.MobilePortalSelector').isExisting(), 'picker isExisting').to.equal(true);
        });

        it('Search when choosing movements', () => {
            movePage.setSearch('Sale');

            expect(movePage.mobileRow('Sale').isExisting(), 'mobileRow(Sale).isExisting').to.equal(true);
            expect(movePage.pickerRows, 'pickerRows').to.have.lengthOf(1);
            expect(movePage.pickerRows[0].getText(), 'pickerRows[0]').to.match(/Sale/);
        });

        it('Not able to tap Next without choosed movement', () => {
            expect(movePage.isNextDisabled, 'isNextDisabled').to.equal(true);
        });

        it('Back to checkup', () => {
            movePage.back();

            expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        });
    }
});

describe('Moves page, input', () => {

    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(0, 'Move');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect(checkupPage.isCheckup, 'checkup section existing').to.equal(true);
    });

    it('Not able to set Heads bigger than 99999', () => {
        movePage.setTransfer('1234567890');
        expect(movePage.input('Head').getValue(), 'heads').to.equal('12345');
    });

    it.skip('Not able to set Weight bigger than ?', () => {
        movePage.setShipment('0', '1234567890');
        expect(movePage.input('Weight').getValue(), 'avgWeight').to.equal('12345');
    });

    it('Not able to set negative value in Heads', () => {
        movePage.setSale('-123');
        expect(movePage.input('Head').getValue(), 'heads').to.equal('23');
    });

    it.skip('Not able to set negative value in Weight', () => {
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
            .addRow().clickSelect()
            .setTransfer()
            .addRow().clickSelect() //this step because of bug
            .setSale('20').resetIndex();

        expect(movePage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

});

describe('Report single move', () => {

    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(0, 'Move');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    }, 1);

    if (!isMobile) {
        it('Cancel report with changes', function () {
            movePage.setMovement(tdata.randMoveType, tdata.randHeads,
                tdata.randWeight, tdata.randCondition)
                .setComment(tdata.randComment)
                .clickBtn('Cancel');
            checkupPage.section(0).scrollIntoView({ block: "center" });

            expect(checkupPage.isEmpty(0), 'isEmpty').to.equal(true);
        });
    }

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
        expect(rslt.weight[0], 'avgWeight').to.equal(weight);
        expect(rslt.condition[0].toLowerCase(), 'condition').to.equal(condition);
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

        movePage.setFixRemoving(heads[0]).clickSelect()
            .setShipment(heads[1], weight).submit();
        checkupPage.section(0).scrollIntoView({ block: "center" });

        const rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.added[0], 'pigs added').to.equal(heads[1]);
        expect(rslt.weight[0], 'avgWeight').to.equal(weight);
    });

});

describe('Report few moves', () => {
    const test = tdata.randMovesData();
    let rslt;

    it('Choose random group', () => {
        checkupPage.randCheckup();
        tdata.toStringVal(test);

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Choose movements', () => {
        checkupPage.chooseSection(0, 'Moves');

        expect(browser.getUrl(), 'movements url').to.match(/(\/pig-movements)$/);
    });

    it('Fill report', () => {
        movePage.setShipment(test.heads[0], test.weight, test.condition)
            .addRow().clickSelect().setTransfer(test.heads[1])
            .addRow().clickSelect().setFixAdding(test.heads[2])
            .addRow().clickSelect().setFixRemoving(test.heads[3])
            .addRow().clickSelect().setFixAdding(test.heads[4])
            .setComment(test.comment).submit();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('Amount', () => {
        rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount of moves').to.equal(test.amount);
    });

    it('Pigs added heads(0)', () => {
        expect(rslt.added[0], 'added heads').to.equal(test.heads[0]);
    });

    it('Pigs avg. weight', () => {
        expect(rslt.weight[0], 'weight').to.equal(test.weight);
    });

    it('Pigs condition', () => {
        expect(rslt.condition[0].toLowerCase(), 'condition').to.equal(test.condition);
    });

    it('Pigs removed heads(0)', () => {
        expect(rslt.removed[0], 'removed heads').to.equal(test.heads[1]);
    });

    it('Pigs added heads(1)', () => {
        expect(rslt.added[1], 'added heads').to.equal(test.heads[2]);
    });

    it('Pigs removed heads(1)', () => {
        expect(rslt.removed[1], 'removed heads').to.equal(test.heads[3]);
    });

    it('Pigs added heads(2)', () => {
        expect(rslt.added[2], 'added heads').to.equal(test.heads[4]);
    });

    it('Comment', () => {
        expect(rslt.comment, 'commment').to.equal(test.comment);
    });

});
