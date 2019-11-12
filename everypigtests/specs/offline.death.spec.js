const checkupPage = require('../pageobjects/checkup.page');
const deathPage = require('../pageobjects/deaths.page');
const admin = require('../pageobjects/admin.page');

describe('Report death (offline)', () => {
    before(function () {
        admin.netOn(false).openPrefs().setOff('Track Mortality Reasons');
    });

    beforeEach(function () {
        if ($(checkupPage.sectionWrapper).isExisting()) {
            checkupPage.chooseSection(1, 'Deaths');
        } else if (this.currentTest.title !== 'Choose group') {
            checkupPage.currentDC().chooseSection(1, 'Deaths');
        }
    });

    it('Choose group', () => {
        checkupPage.open().netOff().randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    if (!isMobile) {
        it('Cancel report', () => {
            deathPage.setMortalities('1', '2', '3').cancel();
    
            expect(checkupPage.isEmpty(1), 'isEmpty(1)').to.equal(true);
        });
    }

    it('Close report', () => {
        deathPage.setMortalities('1', '1', '1').close();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);

        checkupPage.section(3).scrollIntoView({block: "center"});

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

    it.skip('Chronic Death Alert', () => {
        let deaths = tdata.randManyDeaths + '';

        deathPage.setMortalities(deaths, '0', '0').submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        let rslt = checkupPage.deathInfo,
            total = +deathPage.pigs,
            percent = (+deaths * 100 / (total + (+rslt.amount))).toFixed(2) * 1 + '';

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.chronic, 'chronic').to.equal(percent);
    });

    it.skip('Acute Death Alert', () => {
        let deaths = tdata.randManyDeaths + '';

        deathPage.setMortalities('0', deaths, '0').submit();
        checkupPage.section(1).scrollIntoView({ block: 'center' });
        let rslt = checkupPage.deathInfo,
            total = +deathPage.pigs,
            percent = (+deaths * 100 / (total + (+rslt.amount))).toFixed(2) * 1 + '';

        expect(rslt.amount, 'amount of deaths').to.equal(deaths);
        expect(rslt.acute, 'acute').to.equal(percent);
    });

    it.skip('Euthanasia Death Alert', () => {
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

describe('Death reason page, navigation (offline)', () => {
    before(function () {
        isMobile || this.skip();
        admin.netOn(false).openPrefs().setOn('Track Mortality Reasons');
    });

    it('Choose group', () => {
        checkupPage.open().netOff().randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Choose deaths', () => {
        checkupPage.chooseSection(1, 'Deaths');

        expect(browser.getUrl(), 'deaths url').to.match(/(\/report-deaths)$/);
    });

    it('Opens picker', () => {
        expect(deathPage.mobileRow(tdata.randReason).isExisting(), 'mobileRow(Reason).isExisting').to.equal(true);
    });

    it('Check and uncheck death reason', () => {
        let reason = tdata.randReason;

        deathPage.mSetReportParam(reason).mSetReportParam(reason);

        expect(deathPage.isSelected(reason), 'isSelected()').to.equal(false);
    });

    tdata.specialChars.forEach((el) => {
        it('Search special chars: ' + el, () => {
            //just check whether page crashes or not, need to clarify expected behaviour
            checkupPage.inputSearch.isExisting() 
                || checkupPage.netOn(false).open().netOff()
                    .currentDC().chooseSection(1, 'Deaths');
            checkupPage.setSearch(el);

            expect(checkupPage.inputSearch.isExisting(), 'search').to .equal(true);
        });
    });

    it('Search when choosing death reasons', () => {
        let reason = tdata.randReason;
        deathPage.setSearch(reason);

        expect(deathPage.mobileRow(reason).isExisting(), 'mobileRow(Reason 1).isExisting').to.equal(true) &&
            expect(deathPage.mRows, 'mRows').to.have.lengthOf(1) &&
            expect(deathPage.mRows[0].getText(), 'mRows[0]').to.have.string(reason);
    });

    it('Not able to tap Next without choosed death reason', () => {
        expect(deathPage.isNextDisabled, 'isNextDisabled').to.equal(true);
    });

    it('Back to checkup', () => {
        deathPage.mBack();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });
});

describe('Report death reason (offline)', () => {
    before(function () {
        admin.netOn(false).openPrefs().setOn('Track Mortality Reasons');
    });

    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.currentDC().chooseSection(1, 'Deaths');
    });

    it('Choose group', () => {
        checkupPage.open().netOff().randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Close report', () => {
        deathPage.setMortWithReason(tdata.randReason, '1', '1', '1').close();
        
        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);

        checkupPage.section(3).scrollIntoView({block: "center"});

        expect(checkupPage.isEmpty(1), 'isEmpty(1)').to.equal(true);
    });

    if (!isMobile) {
        it('Cancel report', () => {
            deathPage.setMortWithReason(tdata.randReason, '1', '1', '1').cancel();
    
            expect(checkupPage.isEmpty(1), 'isEmpty(1)').to.equal(true);
        });
    }

    it('Report chronic death', () => {
        let reason = tdata.randReason,
            deaths = tdata.randDeaths + '';

        deathPage.setMortWithReason(reason, deaths, '0', '0').submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

        expect(rslt.reason[0], 'reason').to.equal(reason);
        expect(rslt.chronic[0], 'chronic').to.equal(deaths);
    });

    it('Report acute death', () => {
        let reason = tdata.randReason,
            deaths = tdata.randDeaths + '';

        deathPage.setMortWithReason(reason, '0', deaths, '0').submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

        expect(rslt.reason[0], 'reason').to.equal(reason);
        expect(rslt.acute[0], 'acute').to.equal(deaths);
    });

    it('Report euthanasia death', () => {
        let reason = tdata.randReason,
            deaths = tdata.randDeaths + '';

        deathPage.setMortWithReason(reason, '0', '0', deaths).submit();
        checkupPage.reasonCollapse();
        const rslt = checkupPage.deathInfo;

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
});

describe('Report few death reasons (offline)', () => {
    let rslt;
    const test = tdata.randDeathsData();

    before(function () {
        admin.netOn(false).openPrefs().setOn('Track Mortality Reasons');
    });

    beforeEach(function () {
        switch (this.currentTest.title) {
            case 'Choose random group':
            case 'Fill report':
                this.currentTest.retries(1);
        }

        this.currentTest._currentRetry > 0
            && this.currentTest.title === 'Fill report'
            && checkupPage.netOn(false).open().netOff()
                .randCheckup().chooseSection(1);
    });

    it('Choose random group', () => {
        checkupPage.open().netOff().randCheckup();
        tdata.toStringVal(test);

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Choose deaths', () => {
        checkupPage.chooseSection(1, 'Deaths');

        expect(browser.getUrl(), 'deaths url').to.match(/(\/report-deaths)$/);
    });

    it('Fill report', () => {
        deathPage.setMortWithReason(test.reasons[0], test.chronic[0])
            .addRow().setMortWithReason(test.reasons[1], '0', test.acute[1])
            .addRow().setMortWithReason(test.reasons[2], '0', '0', test.euthanas[2])
            .setComment(test.comment).submit();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)(fake).+$/);
    });

    it('Collapse reasons', () => {
        checkupPage.reasonCollapse(0).reasonCollapse(1).reasonCollapse(2);
    });

    it('Amount', () => {
        rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(test.amount)
    });

    for (let i = 0, length = test.reasons.length; i < length; i++) {
        it('Reason(' + i + ')', () => {
            expect(rslt.reason[i], 'reason').to.equal(test.reasons[i]);
        });

        it('Chronic(' + i + ')', () => {
            expect(rslt.chronic[i], 'chronic').to.equal(test.chronic[i]);
        });

        it('Acute(' + i + ')', () => {
            expect(rslt.acute[i], 'acute').to.equal(test.acute[i]);
        });

        it('Euthanasia(' + i + ')', () => {
            expect(rslt.ethanas[i], 'euthanas').to.equal(test.euthanas[i]);
        });
    }

    it('Comment', () => {
        expect(rslt.comment, 'comment deaths').to.equal(test.comment);
    });

    it('Net on(sync)', () => {
        checkupPage.netOn();
    });

    it('Collapse reasons', () => {
        checkupPage.currentDC().reasonCollapse(0)
            .reasonCollapse(1).reasonCollapse(2);
    });

    it('Amount after sync', () => {
        rslt = checkupPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(test.amount)
    });

    for (let i = 0, length = test.reasons.length; i < length; i++) {
        it('Reason(' + i + ') after sync', () => {
            expect(rslt.reason[i], 'reason').to.equal(test.reasons[i]);
        });

        it('Chronic(' + i + ') after sync', () => {
            expect(rslt.chronic[i], 'chronic').to.equal(test.chronic[i]);
        });

        it('Acute(' + i + ') after sync', () => {
            expect(rslt.acute[i], 'acute').to.equal(test.acute[i]);
        });

        it('Euthanasia(' + i + ') after sync', () => {
            expect(rslt.ethanas[i], 'euthanas').to.equal(test.euthanas[i]);
        });
    }

    it('Comment after sync', () => {
        expect(rslt.comment, 'comment deaths').to.equal(test.comment);
    });
});
