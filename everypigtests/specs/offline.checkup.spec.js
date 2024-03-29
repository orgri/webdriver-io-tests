const admin = require('../pageobjects/admin.page');
const dcPage = require('../pageobjects/checkup.page');

describe('Daily Checkup Navigation (offline)', () => {
    const farmName = 'TA_Farm_0000';

    before(function () {
        admin.openPrefs('DC').setOn('Water Usage').setOn('Temp Tracking');
    });

    it('Open', () => {
        dcPage.open().netOff().clickCheckup();

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
            dcPage.netOn(false).open().netOff().clickCheckup();
            dcPage.setSearch(el);

            expect($('.DailyCheckupHome').isExisting(), 'search').to.equal(true);
        });
    });

    it('Search farm', () => {
        dcPage.netOn(false).open().netOff().clickCheckup();
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

    it('Choose group', () => {
        let i = 0, btns, rows = $$(dcPage.groupRow);
        do {
            btns = dcPage.getArray(rows[i++].$$('.button'));
        } while (!btns.includes('Start') && i < rows.length);
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
        
        expect(browser.getUrl(), 'farmfeed url').to.match(/(\/farmfeed)$/);
    });

    it('Back to checkup', () => {
        dcPage.clickCheckup().chooseFarm(farmName).chooseGroup(dcPage.group);

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)(fake).+$/);
    });

    it('Back to Farms', () => {
        if (isMobile) {
            dcPage.close();
        } else {
            dcPage.clickTopTab('Daily Checkup');
        }

        expect($(dcPage.farmRow).isExisting(), 'farmRow.isExisting').to.equal(true);
    });

    it('Choose Up-to-date group', () => {
        //TODO: improve and fix when no such group with Update
        dcPage.randCheckup('Update');

        expect(dcPage.offlineWarning.isExisting(), 'no checkup warning existing').to.equal(true);
    });
});

describe('Create full checkup (offline)', () => {
    let rslt;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0];

    before(function () {
        admin.netOn(false).openPrefs().setOff('Track Mortality Reasons')
            .openPrefs('DC').setOn('Water Usage').setOn('Temp Tracking');
    });

    beforeEach(function () {
            switch (this.currentTest.title) {
                case 'Choose random group':
                case 'Create checkup':
                    this.currentTest.retries(1);
            }
    
            this.currentTest._currentRetry > 0
                && this.currentTest.title === 'Create checkup'
            && dcPage.netOn(false).open().netOff().randCheckup();
        });

    it('Choose random group', () => {
        dcPage.open().netOff().randCheckup();
        tdata.toStringVal(test);

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create checkup', () => {
        dcPage.createCheckup(test).submitDC().clickToModal('Got it');

        expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Moves report', () => {
        dcPage.chooseGroup(dcPage.group).waitLoader();
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
        expect(rslt.comment, 'water consumed').to.equal(test.water.comment);
    });

    it('Main comment', () => {
        expect(dcPage.noteInfo, 'main comment').to.equal(test.comment);
    });

    it('Media report', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        let rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    it('Net on(sync)', () => {
        dcPage.netOn();
    });

    it('Moves report after sync', () => {
        dcPage.currentDC();
        rslt = dcPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(heads, 'heads of moves').to.have.members(test.moves.heads);
    });

    it('Deaths report after sync', () => {
        dcPage.section(1).scrollIntoView({block: 'center'});

        expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Treats report after sync', () => {
        dcPage.section(2).scrollIntoView({block: 'center'});
        rslt = dcPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);
    });

    it('Sympts report after sync', () => {
        dcPage.section(3).scrollIntoView({block: 'center'});
        rslt = dcPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);
    });

    it('Temps report after sync', () => {
        dcPage.section(4).scrollIntoView({block: 'center'});
        rslt = dcPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);
    });

    it('Water report after sync', () => {
        dcPage.section(5).scrollIntoView({block: 'center'});
        rslt = dcPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'water consumed').to.equal(test.water.comment);
    });

    it('Main comment report after sync', () => {
        expect(dcPage.noteInfo, 'main comment').to.equal(test.comment);
    });

    it('Media report after sync', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        let rslt = dcPage.mediaInfo;

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
        admin.netOn(false).openPrefs().setOff('Track Mortality Reasons');
        dcPage.open().netOff();
    });

    test.forEach((el, i) => {
        it('Choose random group', () => {
            dcPage.randCheckup();
            farm.push(dcPage.farm);
            group.push(dcPage.group);
            tdata.toStringVal(test);

            expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        });

        it('Create checkup-' + i, () => {
            dcPage.createCheckup(test[i]).submitDC().clickToModal('Got it');

            expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
        });

        it('Moves report-' + i, () => {
            dcPage.chooseGroup(dcPage.group).waitLoader();
            rslt = dcPage.moveInfo;
            const heads = [].concat(rslt.added, rslt.removed);

            expect(rslt.amount, 'amount of moves').to.equal(test[i].moves.amount);
            expect(heads, 'heads of moves').to.have.members(test[i].moves.heads);
        });

        it('Deaths report-' + i, () => {
            dcPage.section(1).scrollIntoView({block: 'center'});

            expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths[i] + '');
        });

        it('Treats report-' + i, () => {
            dcPage.section(2).scrollIntoView({block: 'center'});
            rslt = dcPage.treatInfo;

            expect(rslt.amount, 'amount of treats').to.equal(test[i].treats.amount);
            expect(rslt.name, 'name of treat').to.have.members(test[i].treats.name);
            expect(rslt.heads, 'heads of treats').to.have.members(test[i].treats.heads);
        });

        it('Sympts report-' + i, () => {
            dcPage.section(3).scrollIntoView({block: 'center'});
            rslt = dcPage.symptInfo;

            expect(rslt.amount, 'amount of symptoms').to.equal(test[i].sympts.amount);
            expect(rslt.name, 'name of symptoms').to.have.members(test[i].sympts.name);
        });

        it('Temps report-' + i, () => {
            dcPage.section(4).scrollIntoView({block: 'center'});
            rslt = dcPage.tempsInfo;

            expect(rslt.high, 'high temp').to.equal(test[i].temps.high);
            expect(rslt.low, 'low temp').to.equal(test[i].temps.low);
            expect(rslt.comment, 'comment').to.equal(test[i].temps.comment);
        });

        it('Water report-' + i, () => {
            dcPage.section(5).scrollIntoView({block: 'center'});
            rslt = dcPage.waterInfo;

            expect(rslt.consumed, 'water consumed').to.equal(test[i].water.consumed);
            expect(rslt.comment, 'water consumed').to.equal(test[i].water.comment);
        });

        it('Main comment-' + i, () => {
            expect(dcPage.noteInfo, 'main comment').to.equal(test[i].comment);
        });

        it('Media report-' + i, () => {
            dcPage.mediaUploader.scrollIntoView({block: 'center'});
            let rslt = dcPage.mediaInfo;

            expect(rslt.amount, 'nOfMedia').to.equal('3');
        });
    });

    it('Net on(sync)', () => {
        dcPage.netOn();
    });

    test.forEach((el, i) => {
        it('Moves report (after sync)-' + i, () => {
            dcPage.currentDC(farm[i], group[i]);//.waitForSync();
            rslt = dcPage.moveInfo;
            const heads = [].concat(rslt.added, rslt.removed);

            expect(rslt.amount, 'amount of moves').to.equal(test[i].moves.amount);
            expect(heads, 'heads of moves').to.have.members(test[i].moves.heads);
        });

        it('Deaths report (after sync)-' + i, () => {
            dcPage.section(1).scrollIntoView({block: 'center'});

            expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths[i] + '');
        });

        it('Treats report (after sync)-' + i, () => {
            dcPage.section(2).scrollIntoView({block: 'center'});
            rslt = dcPage.treatInfo;

            expect(rslt.amount, 'amount of treats').to.equal(test[i].treats.amount);
            expect(rslt.name, 'name of treat').to.have.members(test[i].treats.name);
            expect(rslt.heads, 'heads of treats').to.have.members(test[i].treats.heads);
        });

        it('Sympts report (after sync)-' + i, () => {
            dcPage.section(3).scrollIntoView({block: 'center'});
            rslt = dcPage.symptInfo;

            expect(rslt.amount, 'amount of symptoms').to.equal(test[i].sympts.amount);
            expect(rslt.name, 'name of symptoms').to.have.members(test[i].sympts.name);
        });

        it('Temps report (after sync)-' + i, () => {
            dcPage.section(4).scrollIntoView({block: 'center'});
            rslt = dcPage.tempsInfo;

            expect(rslt.high, 'high temp').to.equal(test[i].temps.high);
            expect(rslt.low, 'low temp').to.equal(test[i].temps.low);
            expect(rslt.comment, 'comment').to.equal(test[i].temps.comment);
        });

        it('Water report (after sync)-' + i, () => {
            dcPage.section(5).scrollIntoView({block: 'center'});
            rslt = dcPage.waterInfo;

            expect(rslt.consumed, 'water consumed').to.equal(test[i].water.consumed);
            expect(rslt.comment, 'water consumed').to.equal(test[i].water.comment);
        });

        it('Main comment (after sync)-' + i, () => {
            expect(dcPage.noteInfo, 'main comment').to.equal(test[i].comment);
        });

        it('Media report (after sync)-' + i, () => {
            dcPage.mediaUploader.scrollIntoView({block: 'center'});
            let rslt = dcPage.mediaInfo;

            expect(rslt.amount, 'nOfMedia').to.equal('3');
        });
    });
});

describe('Update checkup (offline)', () => {
    let rslt;
    const test = tdata.randArrayCheckups(2),
        nOfDeaths = test[1].deaths.chronic[0] + test[1].deaths.acute[0] + test[1].deaths.euthanas[0];

    before(function () {
        admin.netOn(false).openPrefs().setOff('Track Mortality Reasons');
    });

    it('Choose random group', () => {
        dcPage.open().netOff().randCheckup();
        tdata.toStringVal(test);

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create empty checkup', () => {
        dcPage.noToAllReports().submitDC().clickToModal('Got it');

        expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Empty report', () => {
        dcPage.currentDC();

        expect(dcPage.isAllEmpty(), 'isAllEmpty').to.equal(true);
    });

    test.forEach((data, i) => {
        it('Make changes ' + i, () => {
            dcPage.currentDC().createCheckup(data).submitDC().clickToModal('OK');

            expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
        });
    });

    it('Moves report', () => {
        dcPage.currentDC();
        rslt = dcPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test[1].moves.amount);
        expect(heads, 'heads of moves').to.have.members(test[1].moves.heads);
    });

    it('Deaths report', () => {
        dcPage.section(1).scrollIntoView({block: 'center'});

        expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Treats report', () => {
        dcPage.section(2).scrollIntoView({block: 'center'});
        rslt = dcPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test[1].treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test[1].treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test[1].treats.heads);
    });

    it('Sympts report', () => {
        dcPage.section(3).scrollIntoView({block: 'center'});
        rslt = dcPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test[1].sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test[1].sympts.name);
    });

    it('Temps report', () => {
        dcPage.section(4).scrollIntoView({block: 'center'});
        rslt = dcPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test[1].temps.high);
        expect(rslt.low, 'low temp').to.equal(test[1].temps.low);
        expect(rslt.comment, 'comment').to.equal(test[1].temps.comment);
    });

    it('Water report', () => {
        dcPage.section(5).scrollIntoView({block: 'center'});
        rslt = dcPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test[1].water.consumed);
        expect(rslt.comment, 'water consumed').to.equal(test[1].water.comment);
    });

    it('Main comment', () => {
        expect(dcPage.noteInfo, 'main comment').to.equal(test[1].comment);
    });

    it('Media report', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        let rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    it('Net on(sync)', () => {
        dcPage.netOn();
    });

    it('Moves report after sync', () => {
        dcPage.currentDC();
        rslt = dcPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test[1].moves.amount);
        expect(heads, 'heads of moves').to.have.members(test[1].moves.heads);
    });

    it('Deaths report after sync', () => {
        dcPage.section(1).scrollIntoView({block: 'center'});

        expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Treats report after sync', () => {
        dcPage.section(2).scrollIntoView({block: 'center'});
        rslt = dcPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test[1].treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test[1].treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test[1].treats.heads);
    });

    it('Sympts report after sync', () => {
        dcPage.section(3).scrollIntoView({block: 'center'});
        rslt = dcPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test[1].sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test[1].sympts.name);
    });

    it('Temps report after sync', () => {
        dcPage.section(4).scrollIntoView({block: 'center'});
        rslt = dcPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test[1].temps.high);
        expect(rslt.low, 'low temp').to.equal(test[1].temps.low);
        expect(rslt.comment, 'comment').to.equal(test[1].temps.comment);
    });

    it('Water report after sync', () => {
        dcPage.section(5).scrollIntoView({block: 'center'});
        rslt = dcPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test[1].water.consumed);
        expect(rslt.comment, 'water consumed').to.equal(test[1].water.comment);
    });

    it('Main comment report after sync', () => {
        expect(dcPage.noteInfo, 'main comment').to.equal(test[1].comment);
    });

    it('Media report after sync', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        let rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
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
        dcPage.netOn(false).open().netOff().randCheckup();

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Upload media', () => {
        dcPage.clearMedia()
            .uploadMedia(tdata.randPhoto)
            .uploadMedia(tdata.randVideo)
            .uploadMedia(tdata.randAudio);
    });

    it('Amount', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    if (!isIOS) {
        it('Choose audio', () => {
            dcPage.clickAudio();

            expect(browser.getUrl(), 'waters url').to.match(/(\/record-audio)$/);
        });

        it('Record audio', () => {
            audioPage.record();
            browser.pause(5000);
            audioPage.record().continue().setComment(comment).save();

            expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)(fake).+$/);
        });

        it('Amount audio', () => {
            dcPage.mediaUploader.scrollIntoView({block: 'center'});
            rslt = dcPage.audioInfo;

            expect(rslt.sum, 'sum').to.equal(2);
        });

        it('Audio comment', () => {
            expect(rslt.comment[0], 'audioComment').to.equal(comment);
        });
    }

    it('Net on(sync)', () => {
        dcPage.netOn();
    });

    it('Amount audio after sync', () => {
        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        rslt = dcPage.audioInfo;

        isIOS || expect(rslt.sum, 'sum').to.equal(2);
        isIOS && expect(rslt.sum, 'sum').to.equal(1);
    });

    it('Audio comment after sync', () => {
        isIOS || expect(rslt.comment[0], 'audioComment').to.equal(comment);
    });

    it('Amount media after sync', () => {
        rslt = dcPage.mediaInfo;

        isIOS || expect(rslt.amount, 'nOfMedia').to.equal('4');
        isIOS && expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

});

describe('Deaths and Treats conflict (offline)', () => {
    const treatPage = require('../pageobjects/medications.page');
    const deathPage = require('../pageobjects/deaths.page');

    it('Choose group', () => {
        dcPage.netOn(false).open().netOff().randCheckup();

        expect(dcPage.isCheckup, 'checkup section').to.equal(true);
    });

    it('Create conflict', () => {
        dcPage.chooseSection(2);
        treatPage.setTreat(tdata.randTreat, 999999, tdata.randDosage, tdata.randGals)
            .submit();

        dcPage.chooseSection(1);
        deathPage.setMortalities('1').submit();

        expect(dcPage.isCheckup, 'checkup section').to.equal(true);
    });

    it('Net on(sync)', () => {
        dcPage.netOn();
    });

    it('Deaths report after sync', () => {
        dcPage.currentDC().section(1).scrollIntoView({block: 'center'});

        expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal('1');
    });

    it('Empty treats', () => {
        dcPage.section(2).scrollIntoView({block: 'center'});

        expect(dcPage.isEmpty(2), 'isEmpty treats').to.equal(true);
    });
});
