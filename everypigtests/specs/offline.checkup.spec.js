const admin = require('../pageobjects/admin.page');
const checkupPage = require('../pageobjects/checkup.page');

describe('Daily Checkup Navigation (offline)', () => {
    const farmName = 'TA_Farm_0000';

    it('Open', () => {
        checkupPage.open().netOff().clickCheckup();

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
            checkupPage.netOn(false).open().netOff().clickCheckup();
            checkupPage.setSearch(el);

            expect(checkupPage.inputSearch.isExisting(), 'search').to .equal(true);
        });
    });

    it('Search farm', () => {
        checkupPage.netOn(false).open().netOff().clickCheckup();
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

    it('Choose group', () => {
        let i = 0, dcStatus, rows = $$(checkupPage.groupRow);
        do {
            dcStatus = rows[i].$('.button').getText();
            i++;
        } while (dcStatus !== 'Start')
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
        
        expect(browser.getUrl(), 'farmfeed url').to.match(/(\/farmfeed)$/);
    });

    it('Back to checkup', () => {
        checkupPage.clickCheckup().chooseFarm(farmName).chooseGroup(checkupPage.group);

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)(fake).+$/);
    });

    it('Back to Farms', () => {
        if (isMobile) {
            checkupPage.close();
        } else {
            checkupPage.clickDCTab();
        }

        expect($(checkupPage.farmRow).isExisting(), 'farmRow.isExisting').to.equal(true);
    });

    it('Choose Up-to-date group', () => {
        //TODO: improve and fix when no such group with Update
        checkupPage.clickCheckup().chooseFarm(farmName);
        let i = 0, dcStatus, rows = $$(checkupPage.groupRow);
        do {
            dcStatus = rows[i].$('.button').getText();
            i++;
        } while (dcStatus !== 'Update');
        checkupPage.setGroup(rows[--i]).chooseGroup(checkupPage.group);

        expect(checkupPage.offlineWarning.isExisting(), 'no checkup warning existing').to.equal(true);
    });
});

describe('Media in DC (offline)', () => {
    const audioPage = require('../pageobjects/audio.page');
    const comment = tdata.randComment;
    let rslt;

    beforeEach(function () {
        switch (this.currentTest.title) {
            case 'Choose random group':
                this.currentTest.retries(1);
        }
    });

    it('Choose random group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();

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

    if (!isIOS) {
        it('Choose audio', () => {
            checkupPage.clickAudio();

            expect(browser.getUrl(), 'waters url').to.match(/(\/record-audio)$/);
        });

        it('Record audio', () => {
            audioPage.record();
            browser.pause(5000);
            audioPage.record().continue().setComment(comment).save();

            expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)(fake).+$/);
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

    it('Net on(sync)', () => {
        checkupPage.netOn();
    });

    it('Amount after sync', () => {
        checkupPage.currentDC().mediaUploader.scrollIntoView({ block: 'center' });
        rslt = checkupPage.mediaInfo;

        isIOS || expect(rslt.amount, 'nOfMedia').to.equal('4');
        isIOS && expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    it('Comment after sync', () => {
        isIOS || expect(rslt.audioNote, 'audioComment').to.equal(comment);
    });

});

describe('Create empty checkup (offline)', () => {
    beforeEach(function () {
        switch (this.currentTest.title) {
            case 'Choose random group':
            case 'Create checkup':
                this.currentTest.retries(1);
        }

        this.currentTest._currentRetry > 0
            && this.currentTest.title == 'Create checkup'
            && checkupPage.netOn(false).open().netOff().chooseRandCheckup();
    });

    it('Choose random group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create checkup', () => {
        const length = $$(checkupPage.sectionWrapper).length
        for (let i = 0; i < length; i++) {
            checkupPage.clickNoToReport(i);
        }
        checkupPage.submitDC().clickToModal('Got it');

        expect($(checkupPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Moves report', () => {
        checkupPage.chooseGroup(checkupPage.group);

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

    it('Main comment', () => {
        expect($(checkupPage.comment).isExisting(), 'main comment').to.equal(false);
    });

    it('Media report', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        let rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('0');
    });

    it('Net on(sync)', () => {
        checkupPage.netOn();
    });

    it('Moves report after sync', () => {
        checkupPage.currentDC();

        expect(checkupPage.isEmpty(0), 'isEmpty').to.equal(true);
    });

    it('Deaths report after sync', () => {
        checkupPage.section(1).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(1), 'isEmpty').to.equal(true);
    });

    it('Treats report after sync', () => {
        checkupPage.section(2).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(2), 'isEmpty').to.equal(true);
    });

    it('Sympts report after sync', () => {
        checkupPage.section(3).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
    });

    it('Temps report after sync', () => {
        checkupPage.section(4).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(4), 'isEmpty').to.equal(true);
    });

    it('Water report after sync', () => {
        checkupPage.section(5).scrollIntoView({ block: 'center' });

        expect(checkupPage.isEmpty(5), 'isEmpty').to.equal(true);
    });

    it('Main comment report after sync', () => {
        expect($(checkupPage.comment).isExisting(), 'main comment').to.equal(false);
    });

    it('Media report after sync', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        let rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('0');
    });

});

describe('Create full checkup (offline)', () => {
    let rslt;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0];

        beforeEach(function () {
            switch (this.currentTest.title) {
                case 'Choose random group':
                case 'Create checkup':
                    this.currentTest.retries(1);
            }
    
            this.currentTest._currentRetry > 0
                && this.currentTest.title == 'Create checkup'
                && checkupPage.netOn(false).open().netOff().chooseRandCheckup();
        });

    it('Choose random group', () => {
        admin.netOn(false).openPrefs().setOffMortReason();
        checkupPage.open().netOff().chooseRandCheckup();
        tdata.toStringVal(test);

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create checkup', () => {
        checkupPage.createCheckup(test).submitDC().clickToModal('Got it');

        expect($(checkupPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Moves report', () => {
        checkupPage.chooseGroup(checkupPage.group).waitLoader();
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
        expect(rslt.comment, 'water consumed').to.equal(test.water.comment);
    });

    it('Main comment', () => {
        expect($(checkupPage.comment).getText(), 'main comment').to.equal(test.comment);
    });

    it('Media report', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        let rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    it('Net on(sync)', () => {
        checkupPage.netOn();
    });

    it('Moves report after sync', () => {
        checkupPage.currentDC();
        rslt = checkupPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(heads, 'heads of moves').to.have.members(test.moves.heads);
    });

    it('Deaths report after sync', () => {
        checkupPage.section(1).scrollIntoView({ block: 'center' });

        expect(checkupPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Treats report after sync', () => {
        checkupPage.section(2).scrollIntoView({ block: 'center' });
        rslt = checkupPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);
    });

    it('Sympts report after sync', () => {
        checkupPage.section(3).scrollIntoView({ block: 'center' });
        rslt = checkupPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);
    });

    it('Temps report after sync', () => {
        checkupPage.section(4).scrollIntoView({ block: 'center' });
        rslt = checkupPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);
    });

    it('Water report after sync', () => {
        checkupPage.section(5).scrollIntoView({ block: 'center' });
        rslt = checkupPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'water consumed').to.equal(test.water.comment);
    });

    it('Main comment report after sync', () => {
        expect($(checkupPage.comment).getText(), 'main comment').to.equal(test.comment);
    });

    it('Media report after sync', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        let rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

});

describe('Create 3 checkups (offline)', () => {
    let rslt, farm = [], group = [], nOfDeaths = [0,0,0];
    const test = tdata.randArrayCheckups(3);
    test.forEach((el, i) => {
        nOfDeaths[i] = (+el.deaths.chronic[0]) + (+el.deaths.acute[0]) + (+el.deaths.euthanas[0]);
    });

    before(function () {
        admin.netOn(false).openPrefs().setOffMortReason();
        checkupPage.open().netOff();
    });

    for(let i = 0; i < 3; i++) {
        it('Choose random group', () => {
            checkupPage.chooseRandCheckup();
            farm.push(checkupPage.farm);
            group.push(checkupPage.group);
            tdata.toStringVal(test);

            expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        });

        it('Create checkup-' + i, () => {
            checkupPage.createCheckup(test[i]).submitDC().clickToModal('Got it');

            expect($(checkupPage.groupRow).isExisting(), 'groups existing').to.equal(true);
        });

        it('Moves report-' + i, () => {
            checkupPage.chooseGroup(checkupPage.group).waitLoader();
            rslt = checkupPage.moveInfo;
            const heads = [].concat(rslt.added, rslt.removed);

            expect(rslt.amount, 'amount of moves').to.equal(test[i].moves.amount);
            expect(heads, 'heads of moves').to.have.members(test[i].moves.heads);
        });

        it('Deaths report-' + i, () => {
            checkupPage.section(1).scrollIntoView({block: 'center'});

            expect(checkupPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths[i] + '');
        });

        it('Treats report-' + i, () => {
            checkupPage.section(2).scrollIntoView({block: 'center'});
            rslt = checkupPage.treatInfo;

            expect(rslt.amount, 'amount of treats').to.equal(test[i].treats.amount);
            expect(rslt.name, 'name of treat').to.have.members(test[i].treats.name);
            expect(rslt.heads, 'heads of treats').to.have.members(test[i].treats.heads);
        });

        it('Sympts report-' + i, () => {
            checkupPage.section(3).scrollIntoView({block: 'center'});
            rslt = checkupPage.symptInfo;

            expect(rslt.amount, 'amount of symptoms').to.equal(test[i].sympts.amount);
            expect(rslt.name, 'name of symptoms').to.have.members(test[i].sympts.name);
        });

        it('Temps report-' + i, () => {
            checkupPage.section(4).scrollIntoView({block: 'center'});
            rslt = checkupPage.tempsInfo;

            expect(rslt.high, 'high temp').to.equal(test[i].temps.high);
            expect(rslt.low, 'low temp').to.equal(test[i].temps.low);
            expect(rslt.comment, 'comment').to.equal(test[i].temps.comment);
        });

        it('Water report-' + i, () => {
            checkupPage.section(5).scrollIntoView({block: 'center'});
            rslt = checkupPage.waterInfo;

            expect(rslt.consumed, 'water consumed').to.equal(test[i].water.consumed);
            expect(rslt.comment, 'water consumed').to.equal(test[i].water.comment);
        });

        it('Main comment-' + i, () => {
            expect($(checkupPage.comment).getText(), 'main comment').to.equal(test[i].comment);
        });

        it('Media report-' + i, () => {
            checkupPage.mediaUploader.scrollIntoView({block: 'center'});
            let rslt = checkupPage.mediaInfo;

            expect(rslt.amount, 'nOfMedia').to.equal('3');
        });
    }

    it('Net on(sync)', () => {
        checkupPage.netOn();
    });

    for(let i = 0; i < 3; i++) {
        it('Moves report (after sync)-' + i, () => {
            checkupPage.currentDC(farm[i], group[i]);//.waitForSync();
            rslt = checkupPage.moveInfo;
            const heads = [].concat(rslt.added, rslt.removed);

            expect(rslt.amount, 'amount of moves').to.equal(test[i].moves.amount);
            expect(heads, 'heads of moves').to.have.members(test[i].moves.heads);
        });

        it('Deaths report (after sync)-' + i, () => {
            checkupPage.section(1).scrollIntoView({block: 'center'});

            expect(checkupPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths[i] + '');
        });

        it('Treats report (after sync)-' + i, () => {
            checkupPage.section(2).scrollIntoView({block: 'center'});
            rslt = checkupPage.treatInfo;

            expect(rslt.amount, 'amount of treats').to.equal(test[i].treats.amount);
            expect(rslt.name, 'name of treat').to.have.members(test[i].treats.name);
            expect(rslt.heads, 'heads of treats').to.have.members(test[i].treats.heads);
        });

        it('Sympts report (after sync)-' + i, () => {
            checkupPage.section(3).scrollIntoView({block: 'center'});
            rslt = checkupPage.symptInfo;

            expect(rslt.amount, 'amount of symptoms').to.equal(test[i].sympts.amount);
            expect(rslt.name, 'name of symptoms').to.have.members(test[i].sympts.name);
        });

        it('Temps report (after sync)-' + i, () => {
            checkupPage.section(4).scrollIntoView({block: 'center'});
            rslt = checkupPage.tempsInfo;

            expect(rslt.high, 'high temp').to.equal(test[i].temps.high);
            expect(rslt.low, 'low temp').to.equal(test[i].temps.low);
            expect(rslt.comment, 'comment').to.equal(test[i].temps.comment);
        });

        it('Water report (after sync)-' + i, () => {
            checkupPage.section(5).scrollIntoView({block: 'center'});
            rslt = checkupPage.waterInfo;

            expect(rslt.consumed, 'water consumed').to.equal(test[i].water.consumed);
            expect(rslt.comment, 'water consumed').to.equal(test[i].water.comment);
        });

        it('Main comment (after sync)-' + i, () => {
            expect($(checkupPage.comment).getText(), 'main comment').to.equal(test[i].comment);
        });

        it('Media report (after sync)-' + i, () => {
            checkupPage.mediaUploader.scrollIntoView({block: 'center'});
            let rslt = checkupPage.mediaInfo;

            expect(rslt.amount, 'nOfMedia').to.equal('3');
        });
    }
});
