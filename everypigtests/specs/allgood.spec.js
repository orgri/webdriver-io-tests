const admin = require('../pageobjects/admin.page');
const dcPage = require('../pageobjects/checkup.page');

describe('All Good to Farm', () => {
    let farm;

    before(function () {
        admin.openPrefs('DC').setOff('Water Usage').setOff('Temp Tracking');

        dcPage.clickCheckup().setElemsOnPage(100);
        dcPage.rowWith('All Good').isExisting() || this.skip();
    });

    it('Choose farm', () => {
        farm = dcPage.rowWith('All Good');
        dcPage.setFarm(farm);

        expect($(dcPage.farmRow).isExisting(), 'farm row').to.equal(true);
    });

    it('Close modal confirmation', () => {
        dcPage.clickBtn('All Good', farm).closeModal();

        expect(farm.$('.button').getText(), 'button status').to.equal('All Good');
    });

    it('Confirm', () => {
        dcPage.clickBtn('All Good', farm).clickToModal('Yes, I Confirm');

        expect(farm.$('.button').getText(), 'button status').to.equal('Update');
    });

    it('Groups statuses', () => {
        dcPage.chooseFarm();
        $$(dcPage.groupRow).forEach((el) => {
            let status = dcPage.getString(el.$$('.button').slice(-1)[0]);

            expect(status, 'button status').to.equal('Update');
        });
    });
});

describe('All Good to Group', () => {
    let group;

    before(function () {
        admin.openPrefs('DC').setOff('Water Usage').setOff('Temp Tracking');

        dcPage.clickCheckup().setElemsOnPage(100).chooseFarm('TA_Farm_0000');
        dcPage.rowWith('Reconcile').isExisting() && this.skip();
    });

    it('Choose group', () => {
        group = dcPage.randGroup('All Good').rowWith(dcPage.group);

        expect($(dcPage.groupRow).isExisting(), 'group row').to.equal(true);
    });

    it('Close modal confirmation', () => {
        dcPage.clickBtn('All Good', group).closeModal();

        expect(group.$('.button').getText(), 'button status').to.equal('All Good');
    });

    it('Confirm', () => {
        dcPage.clickBtn('All Good', group).clickToModal('Yes, I Confirm');

        expect(group.$('.button').getText(), 'button status').to.equal('Update');
    });

    it('Empty checkup', () => {
        dcPage.setGroup(group).chooseGroup();
        expect(dcPage.isEmpty(0), 'isEmpty move').to.equal(true);

        dcPage.section(1).scrollIntoView({block: 'center'});
        expect(dcPage.isEmpty(1), 'isEmpty deaths').to.equal(true);

        dcPage.section(2).scrollIntoView({block: 'center'});
        expect(dcPage.isEmpty(2), 'isEmpty treats').to.equal(true);

        dcPage.section(3).scrollIntoView({block: 'center'});
        expect(dcPage.isEmpty(3), 'isEmpty symptoms').to.equal(true);

        expect($(dcPage.comment).isExisting(), 'main comment exists').to.equal(false);

        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        let rslt = dcPage.mediaInfo;
        expect(rslt.amount, 'nOfMedia').to.equal('0');
    });
});
