const checkupPage = require('../pageobjects/checkup.page');
const shipPage = require('../pageobjects/shipment.page');

describe('Create shipment', () => {
    let rslt;

    it('Choose group', () => {
        checkupPage.randGroup('Start Group');

        expect(checkupPage.farmName.getText(), 'farm name').to.equal(checkupPage.farm);
    });

    it('Start Group', () => {
        checkupPage.clickBtn('Start Group');

        if (isMobile)
            expect(shipPage.mWrapper.isExisting(), 'mobile Wrapper').to.equal(true);
        else
            expect(browser.getUrl(), 'shipment url')
                .to.match(/(\/daily-checkup\/groups\/)([0-9]+)(\/create-shipment)$/);
    });

    it('Close shipment', () => {
        if (isMobile) {
            shipPage.clickOn('input[type=text]')
                .setDate('15').clickBtn('Save').clickBtn('Next')
                .fillValue(tdata.randHeads).clickBtn('Next')
                .fillValue(tdata.randWeight).clickBtn('Next')
                .setCondition('average').clickBtn('Next')
                .setBarn().clickBtn('Next').setComment(tdata.randComment)
                .close();
        } else {
            shipPage.clickOn('#date').setDate('15').setHeads(tdata.randHeads).setAvgWeight(tdata.randWeight)
                .setCondition('average').setComment(tdata.randComment)
                .close();
        }

        expect($(checkupPage.groupRow).isExisting(), 'groups page').to.equal(true);
    });

    it('Mandatory comment when poor condition', () => {
        checkupPage.clickBtn('Start Group');
        if (isMobile) {
            shipPage.clickBtn('Next')
                .fillValue(tdata.randHeads).clickBtn('Next')
                .fillValue(tdata.randWeight).clickBtn('Next')
                .setCondition('poor').clickBtn('Next')
                .setComment(tdata.randComment).clickBtn('Next')
                .setBarn().clickBtn('Next').removeComment()
                .clickBtn('Start Group', shipPage.mWrapper);
        } else {
            shipPage.setHeads('1000').setAvgWeight('10')
                .setCondition('poor')
                .submit();
        }
        expect(shipPage.notification.getText(), 'notification')
            .to.equal('Fill note about poor pigs group condition.');
    });

    it('Start shipment', () => {
        if (isMobile) {
            shipPage.clickEdit().clickBtn('Next')
                .fillValue('1000').clickBtn('Next')
                .fillValue('10').clickBtn('Next')
                .setCondition('good').clickBtn('Next')
                .setBarn().clickBtn('Next').setComment('Start group')
                .clickBtn('Start Group', shipPage.mWrapper);
        } else {
            shipPage.setHeads('1000').setAvgWeight('10')
                .setCondition('good').setComment('Start group')
                .submit();
        }
        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Finish checkup', () => {
        const length = $$(checkupPage.sectionWrapper).length;
        for (let i = 1; i < length; i++) {
            checkupPage.clickNoToReport(i);
        }
        checkupPage.submitDC().clickToModal('OK');

        expect($(checkupPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Checkup moves Amount', () => {
        checkupPage.currentDC();
        rslt = checkupPage.moveInfo;

        expect(rslt.amount, 'amount of moves').to.equal('1');
    });

    it('Checkup Pigs added heads', () => {
        expect(rslt.added[0], 'added heads').to.equal('1000');
    });

    it('Checkup Pigs avg. weight', () => {
        expect(rslt.weight[0], 'weight').to.equal('10');
    });

    it('Checkup Pigs condition', () => {
        expect(rslt.condition[0].toLowerCase(), 'condition').to.equal('good');
    });

    it('Checkup moves Comment', () => {
        expect(rslt.comment, 'commment').to.equal('Start group');
    });

    it.skip('Not able to start group with pigs > 999 999', () => {
        if (isMobile) {
            shipPage.clickBtn('Next')
                .fillValue('10000000').clickBtn('Next')
                .fillValue(tdata.randWeight).clickBtn('Next')
                .setCondition('average').clickBtn('Next')
                .setBarn().clickBtn('Next').setComment(tdata.randComment)
                .submit();
        } else {
            shipPage.setHeads('10000000').setAvgWeight(tdata.randWeight)
                .setCondition('average').setComment(tdata.randComment)
                .submit();
        }

        expect(checkupPage.box.isExisting(), 'shipment page').to.equal(true);
    });

    it.skip('Not able to start group with weight > 999 999', () => {
        if (isMobile) {
            shipPage.clickBtn('Next')
                .fillValue('1000').clickBtn('Next')
                .fillValue('10000000').clickBtn('Next')
                .setCondition('average').clickBtn('Next')
                .setBarn().clickBtn('Next').setComment(tdata.randComment)
                .submit();
        } else {
            shipPage.setHeads('1000').setAvgWeight('10000000')
                .setCondition('average').setComment(tdata.randComment)
                .submit();
        }

        expect(checkupPage.box.isExisting(), 'shipment page').to.equal(true);
    });
});
