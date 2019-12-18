const admin = require('../pageobjects/admin.page');
const dcPage = require('../pageobjects/checkup.page');

describe('Daily Checkup Navigation', () => {
    const farmName = 'TA_Farm_0000';
    let dcStatus;

    before(function () {
        admin.openPrefs('DC').setOn('Water Usage').setOn('Temp Tracking');
    });

    it('Open', () => {
        dcPage.open();

        expect($$(dcPage.farmRow), 'farms on page').to.have.lengthOf(25);
    });

    it('Set pagination', () => {
        dcPage.setElemsOnPage(100)
            .pagination.scrollIntoView({ block: 'center' });

        expect($$(dcPage.farmRow), 'farms on page').to.have.lengthOf(100);
    });

    tdata.specialChars.forEach((el) => {
        it('Search special chars: ' + el, () => {
            //just check whether page crashes or not, need to clarify expected behaviour
            dcPage.open();
            dcPage.setSearch(el);

            expect(dcPage.inputSearch.isExisting(), 'search').to.equal(true);
        });
    });

    it('Search farm', () => {
        dcPage.setSearch(farmName);

        expect($$(dcPage.farmRow), 'farms on page').to.have.lengthOf(1);
    });

    it('Choose farm', () => {
        dcPage.chooseFarm(farmName);

        expect(dcPage.farmName.getText(), 'farm name').to.equal(farmName);
    });

    it('Groups on page', () => {
        expect($$(dcPage.groupRow), 'groups on page').to.have.lengthOf.above(100);
    });

    it('Check In', function () {
        if (dcPage.checkinBtn.getProperty('disabled')) {
            this.skip();
        } else {
            dcPage.clickCheckin();

            expect(dcPage.checkinState.getText(), 'checkinState').to.equal('You\'re checked in at this farm');
        }
    });

    it('Choose group', () => {
        let i = 0, rows = $$(dcPage.groupRow);
        do {
            dcStatus = rows[i].$('.button').getText();
            i++;
        } while (dcStatus !== 'Start' && i < rows.length);
        dcPage.setGroup(rows[--i]).chooseGroup(dcPage.group);

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Submit is not displayed', () => {
        expect(dcPage.submitBtn.isDisplayed(), 'submitButton.isDisplayed').to.equal(false);
    });

    it('Group info Tab', () => {
        dcPage.clickSubTab('Group Info');

        expect($(dcPage.collapseWrapper).getText(), 'checkup section existing').to.equal(dcPage.group);
    });

    it('Checkup Tab', () => {
        dcPage.clickSubTab('Checkup');

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Leave checkup', () => {
        dcPage.clickFarmfeed();
        if (dcStatus === 'Update') {
            expect(dcPage.modalWrapper.isExisting(), 'modal window existing').to.equal(false);
        } else {
            expect(dcPage.modalWrapper.isExisting(), 'modal window existing').to.equal(true);
        }
    });

    it('Cancel to confirmation', function () {
        if (dcStatus === 'Update') {
            this.skip();
        } else {
            dcPage.clickToModal('Cancel');

            expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        }
    });

    it('Yes to confirmation', function () {
        if (dcStatus === 'Update') {
            this.skip();
        } else {
            dcPage.clickFarmfeed().clickToModal('Yes');

            expect(browser.getUrl(), 'checkup url').to.match(/(\/farmfeed)$/);
            expect($('.FarmfeedPost').isExisting(), 'farmfeed post').to.equal(true);
        }
    });

    it('Clear Search farm', () => {
        dcPage.clickCheckup().clearSearch();

        expect($$(dcPage.farmRow), 'farms on page').to.have.lengthOf(25);
    });
});

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
        const rows = $$(dcPage.groupRow);
        for (let i = 0; i < rows.length; i++) {
            let status = rows[i].$('.button').getText();

            expect(status, 'button status').to.equal('Update');
        }
    });
});

describe('All Good to Group', () => {
    let group;

    before(function () {
        admin.openPrefs('DC').setOff('Water Usage').setOff('Temp Tracking');
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

describe('Create full checkup', () => {
    let rslt;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0];

    before(function () {
        admin.openPrefs().setOff('Track Mortality Reasons')
            .openPrefs('DC').setOn('Water Usage').setOn('Temp Tracking');
    });

    it('Choose random group', () => {
        dcPage.randCheckup();
        tdata.toStringVal(test);

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create checkup', () => {
        dcPage.createCheckup(test).submitDC().clickToModal('OK');

        expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Moves report', () => {
        dcPage.openCurrent();
        rslt = dcPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(heads, 'heads of moves').to.have.members(test.moves.heads);
    });

    it('Deaths report', () => {
        dcPage.section(1).scrollIntoView({block: 'center'});

        expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Treats report', () => {
        dcPage.section(2).scrollIntoView({block: 'center'});
        rslt = dcPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);
    });

    it('Sympts report', () => {
        dcPage.section(3).scrollIntoView({block: 'center'});
        rslt = dcPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);
    });

    it('Temps report', () => {
        dcPage.section(4).scrollIntoView({block: 'center'});
        rslt = dcPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);
    });

    it('Water report', () => {
        dcPage.section(5).scrollIntoView({block: 'center'});
        rslt = dcPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'comment').to.equal(test.water.comment);
    });

    it('Main comment report', () => {
        expect($(dcPage.comment).getText(), 'main comment').to.equal(test.comment);
    });

    it('Media report', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        let rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });
});

describe('Update checkup', () => {
    let rslt;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0];

    before(function () {
        admin.openPrefs().setOff('Track Mortality Reasons')
            .openPrefs('DC').setOn('Water Usage').setOn('Temp Tracking');
    });

    it('Choose random group', () => {
        dcPage.randCheckup();
        tdata.toStringVal(test);

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create empty checkup', () => {
        const length = $$(dcPage.sectionWrapper).length;
        for (let i = 0; i < length; i++) {
            dcPage.clickNoToReport(i);
        }
        dcPage.submitDC().clickToModal('OK');

        expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Empty report', () => {
        dcPage.currentDC();

        expect(dcPage.isAllEmpty(), 'isAllEmpty').to.equal(true);
    });

    it('Make changes', () => {
        dcPage.createCheckup(test).submitDC().clickToModal('OK');

        expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Moves report', () => {
        dcPage.openCurrent();
        rslt = dcPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(heads, 'heads of moves').to.have.members(test.moves.heads);
    });

    it('Deaths report', () => {
        dcPage.section(1).scrollIntoView({block: 'center'});

        expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Treats report', () => {
        dcPage.section(2).scrollIntoView({block: 'center'});
        rslt = dcPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);
    });

    it('Sympts report', () => {
        dcPage.section(3).scrollIntoView({block: 'center'});
        rslt = dcPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);
    });

    it('Temps report', () => {
        dcPage.section(4).scrollIntoView({block: 'center'});
        rslt = dcPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);
    });

    it('Water report', () => {
        dcPage.section(5).scrollIntoView({block: 'center'});
        rslt = dcPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'comment').to.equal(test.water.comment);
    });

    it('Main comment report', () => {
        expect($(dcPage.comment).getText(), 'main comment').to.equal(test.comment);
    });

    it('Media report', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        let rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });
});

describe('Media in DC', () => {
    const audioPage = require('../pageobjects/audio.page');
    const comment = tdata.randComment;
    const files = [tdata.randVideo, tdata.randPhoto, tdata.randPhoto, tdata.randAudio];
    let rslt;

    it('Choose random group', () => {
        dcPage.randCheckup();

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Upload media', () => {
        dcPage.clearMedia().uploadMedia(files);
    });

    it('Amount', () => {
        dcPage.reload().mediaUploader.scrollIntoView({block: 'center'});
        rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('4');
    });

    if (isChrome && !isIOS) {

        it('Choose audio', () => {
            dcPage.clickAudio();

            expect(browser.getUrl(), 'waters url').to.match(/(\/record-audio)$/);
        });

        it('Record audio', () => {
            audioPage.record();
            browser.pause(5000);
            audioPage.record().continue().setComment(comment).save();

            expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
        });

        it('Amount audio', () => {
            dcPage.mediaUploader.scrollIntoView({block: 'center'});
            rslt = dcPage.audioInfo;

            expect(rslt.sum, 'nOfAudio').to.equal(2);
        });

        it('Audio comment', () => {
            expect(rslt.comment[0], 'audioComment').to.equal(comment);
        });
    }
});

describe('Head Treated conflict', () => {
    const treatPage = require('../pageobjects/medications.page');
    const deathPage = require('../pageobjects/deaths.page');

    it('Choose group', () => {
        dcPage.randCheckup('Update');

        expect(dcPage.isDCSectionExist, 'checkup section').to.equal(true);
    });

    it('Create conflict', () => {
        dcPage.chooseSection(2);
        treatPage.setTreat(tdata.randTreat, 999999, tdata.randDosage, tdata.randGals)
            .submit();

        dcPage.chooseSection(1);
        deathPage.setMortalities('10').submit();
        //movePage.setTransfer('10').submit();

        expect(dcPage.modalWrapper.isExisting(), 'modal window').to.equal(true);
    });

    it('Redirect to treats', () => {
        dcPage.clickToModal('Continue');

        expect(treatPage.input('Head Treated').isExisting(), 'treat page').to.equal(true);
    });

    it('Empty deaths', () => {
        treatPage.submit();
        dcPage.section(1).scrollIntoView({block: 'center'});

        expect(dcPage.isEmpty(1), 'isEmpty deaths').to.equal(true);
    });
});


