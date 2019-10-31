const admin = require('../pageobjects/admin.page');
const checkupPage = require('../pageobjects/checkup.page');

describe('Daily Checkup Navigation', () => {
    const farmName = 'TA_Farm_0000';
    let dcStatus;

    it('Open', () => {
        checkupPage.open();

        expect($$(checkupPage.farmRow), 'farms on page').to.have.lengthOf(25);
    });

    it('Set pagination', () => {
        checkupPage.setElemsOnPage(100)
            .pagination.scrollIntoView({ block: 'center' });

        expect($$(checkupPage.farmRow), 'farms on page').to.have.lengthOf(100);
    });

    tdata.specialChars.forEach((el) => {
        it('Search special chars: ' + el, () => {
            //just check whether page crashes or not, need to clarify expected behaviour
            checkupPage.open();
            checkupPage.setSearch(el);

            expect(checkupPage.inputSearch.isExisting(), 'search').to.equal(true);
        });
    });

    it('Search farm', () => {
        checkupPage.setSearch(farmName);

        expect($$(checkupPage.farmRow), 'farms on page').to.have.lengthOf(1);
    });

    it('Choose farm', () => {
        checkupPage.chooseFarm(farmName);

        expect(checkupPage.farmName.getText(), 'farm name').to.equal(farmName);
    });

    it('Groups on page', () => {
        expect($$(checkupPage.groupRow), 'groups on page').to.have.lengthOf(101);
    });

    it('Check In', function () {
        if (checkupPage.checkinBtn.getProperty('disabled')) {
            this.skip();
        } else {
            checkupPage.clickCheckin();

            expect(checkupPage.checkinState.getText(), 'checkinState').to.equal('You\'re checked in at this farm');
        }
    });

    it('Choose group', () => {
        let i = 0, rows = $$(checkupPage.groupRow);
        do {
            dcStatus = rows[i].$('.button').getText();
            i++;
        } while (dcStatus !== 'Start');
        checkupPage.setGroup(rows[--i]).chooseGroup(checkupPage.group);

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Submit is not displayed', () => {
        expect(checkupPage.submitBtn.isDisplayed(), 'submitButton.isDisplayed').to.equal(false);
    });

    it('Group info Tab', () => {
        checkupPage.clickGroupInfoTab();

        expect($(checkupPage.collapseWrapper).getText(), 'checkup section existing').to.equal(checkupPage.group);
    });

    it('Checkup Tab', () => {
        checkupPage.clickCheckupTab();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Leave checkup', () => {
        checkupPage.clickFarmfeed();
        if (dcStatus === 'Update') {
            expect(checkupPage.modalWrapper.isExisting(), 'modal window existing').to.equal(false);
        } else {
            expect(checkupPage.modalWrapper.isExisting(), 'modal window existing').to.equal(true);
        }
    });

    it('Cancel to confirmation', function () {
        if (dcStatus === 'Update') {
            this.skip();
        } else {
            checkupPage.clickToModal('Cancel');

            expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
        }
    });

    it('Yes to confirmation', function () {
        if (dcStatus === 'Update') {
            this.skip();
        } else {
            checkupPage.clickFarmfeed().clickToModal('Yes');

            expect(browser.getUrl(), 'checkup url').to.match(/(\/farmfeed)$/);
        }
    });

    it('Clear Search farm', () => {
        checkupPage.clickCheckup().clearSearch();

        expect($$(checkupPage.farmRow), 'farms on page').to.have.lengthOf(25);
    });
});

describe('Media in DC', () => {
    const audioPage = require('../pageobjects/audio.page');
    const comment = tdata.randComment;
    let rslt;

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Upload media', () => {
        checkupPage.clearMedia()
            .uploadMedia(tdata.randPhoto)
            .uploadMedia(tdata.randVideo)
            .uploadMedia(tdata.randAudio);
    });

    it('Amount', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    if (isChrome && !isIOS) {

        it('Choose audio', () => {
            checkupPage.clickAudio();

            expect(browser.getUrl(), 'waters url').to.match(/(\/record-audio)$/);
        });

        it('Record audio', () => {
            audioPage.record();
            browser.pause(5000);
            audioPage.record().continue().setComment(comment).save();

            expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
        });

        it('Amount', () => {
            checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
            rslt = checkupPage.mediaInfo;

            expect(rslt.amount, 'nOfMedia').to.equal('4');
        });

        it('Comment', () => {
            expect(rslt.audioNote, 'audioComment').to.equal(comment);
        });
    }
});

describe('Create empty checkup', () => {

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create checkup', () => {
        const length = $$(checkupPage.sectionWrapper).length
        for (let i = 0; i < length; i++) {
            checkupPage.clickNoToReport(i);
        }
        checkupPage.submitDC().clickToModal('OK');

        expect($(checkupPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Moves report', () => {
        checkupPage.openCurrent();

        expect(checkupPage.isEmpty(0), 'isEmpty').to.equal(true);
    });

    it('Deaths report', () => {
        checkupPage.section(1).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(1), 'isEmpty').to.equal(true);
    });

    it('Treats report', () => {
        checkupPage.section(2).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(2), 'isEmpty').to.equal(true);
    });

    it('Sympts report', () => {
        checkupPage.section(3).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
    });

    it('Temps report', () => {
        checkupPage.section(4).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(4), 'isEmpty').to.equal(true);
    });

    it('Water report', () => {
        checkupPage.section(5).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(5), 'isEmpty').to.equal(true);
    });

    it('Main comment report', () => {
        expect($(checkupPage.comment).isExisting(), 'main comment').to.equal(false);
    });

    it('Media report', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        let rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('0');
    });

});

describe('Create full checkup', () => {
    let rslt;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0];

    it('Choose random group', () => {
        admin.openPrefs().setOffMortReason();
        checkupPage.chooseRandCheckup();
        tdata.toStringVal(test);

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create checkup', () => {
        checkupPage.createCheckup(test).submitDC().clickToModal('OK');

        expect($(checkupPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Moves report', () => {
        checkupPage.openCurrent();
        rslt = checkupPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(heads, 'heads of moves').to.have.members(test.moves.heads);
    });

    it('Deaths report', () => {
        checkupPage.section(1).scrollIntoView({ block: 'center' });

        expect(checkupPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Treats report', () => {
        checkupPage.section(2).scrollIntoView({ block: 'center' });
        rslt = checkupPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);
    });

    it('Sympts report', () => {
        checkupPage.section(3).scrollIntoView({ block: 'center' });
        rslt = checkupPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);
    });

    it('Temps report', () => {
        checkupPage.section(4).scrollIntoView({ block: 'center' });
        rslt = checkupPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);
    });

    it('Water report', () => {
        checkupPage.section(5).scrollIntoView({ block: 'center' });
        rslt = checkupPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'comment').to.equal(test.water.comment);
    });

    it('Main comment report', () => {
        expect($(checkupPage.comment).getText(), 'main comment').to.equal(test.comment);
    });

    it('Media report', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        let rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });
});