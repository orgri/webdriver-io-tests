const checkupPage = require('../pageobjects/checkup.page');
const deathPage = require('../pageobjects/deaths.page');
const admin = require('../pageobjects/admin.page');

describe('Report mortalities', () => {

    after(function () {
        checkupPage.clearSection(1, 'Death').submit();
    });

    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest.title == 'Choose group'
            || checkupPage.openCurrent().chooseSection(1, 'Death');
    });

    it('Choose group', () => {
        admin.openPrefs().setOffMortReason();
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Cancel report', function () {
        if (deathPage.isMobile) {
            this.skip();
        } else {
            deathPage.setMortalities('1', '1', '1').cancel();

            expect(checkupPage.isEmpty(1), 'isEmpty(1)').to.equal(true);
        }
    });

    it('Close report', () => {
        deathPage.setMortalities('1', '1', '1').close();

        expect(checkupPage.isEmpty(1), 'isEmpty(1)').to.equal(true);
    });

    it('Report chronic death', () => {
        let deaths = tdata.randDeaths + '';
        deathPage.setMortalities(deaths, '0', '0').submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.chronic, 'chronic').to.equal(deaths);
    });

    it('Report acute death', () => {
        let deaths = tdata.randDeaths + '';
        deathPage.setMortalities('0', deaths, '0').submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.acute, 'acute').to.equal(deaths);
    });

    it('Report euthanasia death', () => {
        let deaths = tdata.randDeaths + '';
        deathPage.setMortalities('0', '0', deaths).submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.ethanas, 'ethanas').to.equal(deaths);
    });

    it('Chronic Death Alert', () => {
        let deaths = tdata.randManyDeaths + '';

        deathPage.setMortalities(deaths, '0', '0').submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        let rslt = checkupPage.deathInfo,
            total = +deathPage.pigs,
            percent = (+deaths * 100 / (total + (+rslt.amount))).toFixed(2) * 1 + '';

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.chronic, 'chronic').to.equal(percent);
    });

    it('Acute Death Alert', () => {
        let deaths = tdata.randManyDeaths + '';

        deathPage.setMortalities('0', deaths, '0').submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        let rslt = checkupPage.deathInfo,
            total = +deathPage.pigs,
            percent = (+deaths * 100 / (total + (+rslt.amount))).toFixed(2) * 1 + '';

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.acute, 'acute').to.equal(percent);
    });

    it('Euthanasia Death Alert', () => {
        let deaths = tdata.randManyDeaths + '';

        deathPage.setMortalities('0', '0', deaths).submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        let rslt = checkupPage.deathInfo,
            total = +deathPage.pigs,
            percent = (+deaths * 100 / (total + (+rslt.amount))).toFixed(2) * 1 + '';

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.ethanas, 'ethanas').to.equal(percent);
    });

});

describe('Report mortalities with reasons', () => {

    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest.title == 'Choose group'
            || checkupPage.openCurrent().chooseSection(1, 'Death');
    });

    after(function () {
        checkupPage.clearSection(1, 'Death').submit();
    });

    it('Choose group', () => {
        admin.openPrefs().setOnMortReason();
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    if (isMobile) {
        it('Opens picker', () => {
            expect(deathPage.mobileRow(tdata.randReason).isExisting(), 'mobileRow(Reason).isExisting').to.equal(true);
        });

        it('Search when choosing death reasons', () => {
            let reason = tdata.randReason;
            deathPage.setSearch(reason);

            expect(deathPage.mobileRow(reason).isExisting(), 'mobileRow(Reason 1).isExisting').to.equal(true) &&
                expect(deathPage.mRows, 'mRows').to.have.lengthOf(1) &&
                expect(deathPage.mRows[0].getText(), 'mRows[0]').to.have.string(reason);
        });

        it('Check and uncheck death reason', () => {
            let reason = tdata.randReason;

            deathPage.mSetReportParam(reason).mSetReportParam(reason);

            expect(deathPage.isSelected(reason), 'isSelected()').to.equal(false);
        });

        it('Not able to tap Next without choosed death reason', () => {
            expect(deathPage.isNextDisabled, 'isNextDisabled').to.equal(true);
        });

        it('Back to checkup', () => {
            deathPage.mBack();

            expect(browser.getUrl(), 'treats url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
        });
    }

    it('Cancel report', function () {
        if (deathPage.isMobile) {
            this.skip();
        } else {
            deathPage.setMortWithReason(tdata.randReason, '1', '1', '1').cancel();

            expect(checkupPage.isEmpty(1), 'isEmpty(1)').to.equal(true);
        }
    });

    it('Close report', () => {
        deathPage.setMortWithReason(tdata.randReason, '1', '1', '1').close();

        expect(checkupPage.isEmpty(1), 'isEmpty(1)').to.equal(true);
    });

    it('Report chronic death', () => {
        let reason = tdata.randReason,
            deaths = tdata.randDeaths + '';

        deathPage.setMortWithReason(reason, deaths, '0', '0').submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.reason[0], 'reason').to.equal(reason);
        expect(rslt.chronic[0], 'chronic').to.equal(deaths);
    });

    it('Report acute death', () => {
        let reason = tdata.randReason,
            deaths = tdata.randDeaths + '';

        deathPage.setMortWithReason(reason, '0', deaths, '0').submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.reason[0], 'reason').to.equal(reason);
        expect(rslt.acute[0], 'acute').to.equal(deaths);
    });

    it('Report euthanasia death', () => {
        let reason = tdata.randReason,
            deaths = tdata.randDeaths + '';

        deathPage.setMortWithReason(reason, '0', '0', deaths).submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.reason[0], 'reason').to.equal(reason);
        expect(rslt.ethanas[0], 'ethanas').to.equal(deaths);
    });

    it('Change death reason', () => {
        let reason = tdata.randReason,
            deaths = tdata.randDeaths + '';

        deathPage.setMortWithReason(tdata.randReason, '0', '1', '0')
            .clickSelectParam().setMortWithReason(reason, '0', deaths, '0')
            .submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.reason[0], 'reason').to.equal(reason);
        expect(rslt.acute[0], 'acute').to.equal(deaths);
    });

    it('Full report with reason', () => {
        let reason = tdata.randReason,
            deaths = tdata.randArrayDeaths(3),
            nOfDeaths = deaths[0] + deaths[1] + deaths[2] + '';
        tdata.toStringVal(deaths);
        deathPage.setMortWithReason(reason, deaths[0], deaths[1], deaths[2]).submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(nOfDeaths);
        expect(rslt.reason[0], 'reason').to.equal(reason);
        expect(rslt.chronic[0], 'chronic').to.equal(deaths[0]);
        expect(rslt.acute[0], 'acute').to.equal(deaths[1]);
        expect(rslt.ethanas[0], 'ethanas').to.equal(deaths[2]);
    });
});

describe('Mortalities page, invalid input)', () => {

    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest.title == 'Choose group'
            || checkupPage.openCurrent().chooseSection(1, 'Death');
    });

    after(function () {
        checkupPage.clearSection(1, 'Death').submit();
    });

    it('Choose group', () => {
        admin.openPrefs().setOffMortReason();
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Not able to set Chronic bigger than 99999', () => {
        deathPage.setMortalities('1234567890');

        expect(deathPage.input('Chronic').getValue(), 'chronic').to.equal('12345');
    });

    it('Not able to set Acute bigger than 99999', () => {
        deathPage.setMortalities('0', '1234567890');

        expect(deathPage.input('Acute').getValue(), 'acute').to.equal('12345');
    });

    it('Not able to set Euthanasia bigger than 99999', () => {
        deathPage.setMortalities('0', '0', '1234567890');

        expect(deathPage.input('Euthanasia').getValue(), 'euthanasia').to.equal('12345');
    });

    it('Not able to report number of deaths bigger than total pigs', () => {
        let total = deathPage.pigs;
        deathPage.setMortalities(total, '10');

        expect(deathPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Warning about number of deaths bigger than total pigs', () => {
        let total = deathPage.pigs;
        deathPage.setMortalities(total, '0', '10');

        expect(deathPage.message.getText(), 'message').to.match(/Warning/);
    });

    it('Not able to set negative value in Chronic', () => {
        deathPage.setMortalities('-123');

        expect(deathPage.input('Chronic').getValue(), 'chronic').to.equal('123');
    });

    it('Not able to set negative value in Acute', () => {
        deathPage.setMortalities('0', '-123');

        expect(deathPage.input('Acute').getValue(), 'acute').to.equal('123');
    });

    it('Not able to set negative value in Euthanasia', () => {
        deathPage.setMortalities('0', '0', '-123');

        expect(deathPage.input('Euthanasia').getValue(), 'euthanasia').to.equal('123');
    });

    it('Not able to set letters in Chronic', () => {
        deathPage.setMortalities('qwerty ~!@#$%^&*()');

        expect(deathPage.input('Chronic').getValue(), 'chronic').to.equal('0');
    });

    it('Not able to set letters in Acute', () => {
        deathPage.setMortalities('0', 'qwerty ~!@#$%^&*()');

        expect(deathPage.input('Acute').getValue(), 'acute').to.equal('0');
    });

    it('Not able to set letters in Euthanasia', () => {
        deathPage.setMortalities('0', '0', 'qwerty ~!@#$%^&*()');

        expect(deathPage.input('Euthanasia').getValue(), 'euthanasia').to.equal('0');
    });

    it('Not able to submit report without changes', () => {
        deathPage.setMortalities('1', '1', '1').submit();
        checkupPage.chooseSection(1, 'Death');
        deathPage.setMortalities('1', '1', '1');

        expect(deathPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

});

describe('Mortalities page with reasons, invalid input)', () => {

    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest.title == 'Choose group'
            || checkupPage.openCurrent().chooseSection(1, 'Death');
    });

    after(function () {
        checkupPage.clearSection(1, 'Death').submit();
    });

    it('Choose group', () => {
        admin.openPrefs().setOnMortReason();
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Not able to set Chronic bigger than 99999', () => {
        deathPage.setMortWithReason(tdata.randReason, '1234567890');

        expect(deathPage.input('Chronic').getValue(), 'chronic').to.equal('12345');
    });

    it('Not able to set Acute bigger than 99999', () => {
        deathPage.setMortWithReason(tdata.randReason, '0', '1234567890');

        expect(deathPage.input('Acute').getValue(), 'acute').to.equal('12345');
    });

    it('Not able to set Euthanasia bigger than 99999', () => {
        deathPage.setMortWithReason(tdata.randReason, '0', '0', '1234567890');

        expect(deathPage.input('Euthanasia').getValue(), 'euthanasia').to.equal('12345');
    });

    it('Not able to report number of deaths bigger than total pigs', () => {
        let total = deathPage.pigs;
        deathPage.setMortWithReason(tdata.randReason, total, '10', '10');

        expect(deathPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Warning about number of deaths bigger than total pigs', () => {
        let total = deathPage.pigs;
        deathPage.setMortWithReason(tdata.randReason, total, '10', '10');

        expect(deathPage.message.getText(), 'message').to.match(/Warning/);
    });

    it('Not able to set negative value in Chronic', () => {
        deathPage.setMortWithReason(tdata.randReason, '-123');

        expect(deathPage.input('Chronic').getValue(), 'chronic').to.equal('123');
    });

    it('Not able to set negative value in Acute', () => {
        deathPage.setMortWithReason(tdata.randReason, '0', '-123');

        expect(deathPage.input('Acute').getValue(), 'acute').to.equal('123');
    });

    it('Not able to set negative value in Euthanasia', () => {
        deathPage.setMortWithReason(tdata.randReason, '0', '0', '-123');

        expect(deathPage.input('Euthanasia').getValue(), 'euthanasia').to.equal('123');
    });

    it('Not able to set letters in Chronic', () => {
        deathPage.setMortWithReason(tdata.randReason, '-qwerty ~!@#$%^&*()');

        expect(deathPage.input('Chronic').getValue(), 'chronic').to.equal('0');
    });

    it('Not able to set letters in Acute', () => {
        deathPage.setMortWithReason(tdata.randReason, '0', '-qwerty ~!@#$%^&*()');

        expect(deathPage.input('Acute').getValue(), 'acute').to.equal('0');
    });

    it('Not able to set letters in Euthanasia', () => {
        deathPage.setMortWithReason(tdata.randReason, '0', '0', '-qwerty ~!@#$%^&*()');

        expect(deathPage.input('Euthanasia').getValue(), 'euthanasia').to.equal('0');
    });

    it('Not able to submit report without changes', () => {
        let reason = tdata.randReason;

        deathPage.setMortWithReason(reason, '1', '1', '1').submit();
        checkupPage.chooseSection(1, 'Death');
        deathPage.clickSelectParam().setMortWithReason(tdata.randReason, '1', '1', '1')
            .clickSelectParam().setMortWithReason(reason, '1', '1', '1');

        expect(deathPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

});