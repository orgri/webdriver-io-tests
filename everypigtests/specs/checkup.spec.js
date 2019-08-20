const admin = require('../pageobjects/admin.page');
const checkupPage = require('../pageobjects/checkup.page');

describe('Daily Checkup Navigation', () => {
    const farmName = 'TA_Farm_0000';
    let groupName, dcStatus;

    it('Open', () => {
        checkupPage.open().waitLoader();

        expect($$(checkupPage.farmRow), 'farms on page').to.have.lengthOf(25);
    });

    it('Set pagination', () => {
        checkupPage.setElemsOnPage(100).waitLoader()
            .pagination.scrollIntoView({ block: 'center' });

        expect($$(checkupPage.farmRow), 'farms on page').to.have.lengthOf(100);
    });

    it('Search farm', () => {
        checkupPage.setSearch(farmName).waitLoader();

        expect($$(checkupPage.farmRow), 'farms on page').to.have.lengthOf(1);
    });

    it('Choose farm', () => {
        checkupPage.chooseFarm(farmName).waitLoader();

        expect(checkupPage.farmName.getText(), 'farm name').to.equal(farmName);
    });

    it('Groups on page', () => {
        expect($$(checkupPage.groupRow), 'groups on page').to.have.lengthOf(101);
    });

    it('Check In', function () {
        if (checkupPage.checkinBtn.getProperty('disabled')) {
            this.skip();
        } else {
            checkupPage.clickCheckin().waitLoader();

            expect(checkupPage.checkinState.getText(), 'checkinState').to.equal('You\'re checked in at this farm');
        }
    });

    it('Choose group', () => {
        let i = 0, rows = $$(checkupPage.groupRow);
        do {
            dcStatus = rows[i].$('.button').getText();
            i++;
        } while (dcStatus === 'Update')
        groupName = checkupPage.getString(rows[i - 1].$('.group-name'), /(?<=Group\s•\s)(.+)/u);
        checkupPage.chooseGroup(groupName).waitLoader();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Submit is not displayed', () => {
        expect(checkupPage.submitBtn.isDisplayed(), 'submitButton.isDisplayed').to.equal(false);
    });

    it('Group info Tab', () => {
        checkupPage.clickGroupInfoTab().waitLoader();

        expect($(checkupPage.collapseWrapper).getText(), 'checkup section existing').to.equal(groupName);
    });

    it('Checkup Tab', () => {
        checkupPage.clickCheckupTab().waitLoader();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Leave checkup', () => {
        checkupPage.clickFarmfeed().waitLoader();
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
            checkupPage.clickToModal('Cancel').waitLoader();

            expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
        }
    });

    it('Yes to confirmation', function () {
        if (dcStatus === 'Up-to-date') {
            this.skip();
        } else {
            checkupPage.clickFarmfeed().waitLoader().clickToModal('Yes').waitLoader();

            expect(browser.getUrl(), 'checkup url').to.match(/(\/farmfeed)$/);
        }
    });

});

describe('Report Movements', () => {
    const movePage = require('../pageobjects/movements.page');
    const test = tdata.randMovesData();
    let rslt = undefined;

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();
        tdata.toStringVal(test);
    });

    it('Choose movements', () => {
        checkupPage.chooseSection(0, 'Moves');

        expect(browser.getUrl(), 'movements url').to.match(/(\/pig-movements)$/);
    });

    it('Fill report', () => {
        movePage.setShipment(test.heads[0], test.weight, test.condition)
            .addRow().clickSelectParam().setTransfer(test.heads[1])
            .addRow().clickSelectParam().setFixAdding(test.heads[2])
            .addRow().clickSelectParam().setFixRemoving(test.heads[3])
            .addRow().clickSelectParam().setFixAdding(test.heads[4])
            .setComment(test.comment).submit().waitLoader();

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
        expect(rslt.weight[0], 'weight').to.equal(test.weight + ' lbs');
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

describe('Report Deaths', () => {
    const deathPage = require('../pageobjects/deaths.page');
    let rslt;
    const test = tdata.randDeathsData();

    it('Choose random group', () => {
        admin.openPrefs().setOnMortReason();
        checkupPage.chooseRandCheckup().setId();
        tdata.toStringVal(test);
    });

    it('Choose deaths', () => {
        checkupPage.chooseSection(1, 'Deaths');

        expect(browser.getUrl(), 'deaths url').to.match(/(\/report-deaths)$/);
    });

    it('Fill report', () => {
        deathPage.setMortWithReason(test.reasons[0], test.chronic[0])
            .addRow().setMortWithReason(test.reasons[1], '0', test.acute[1])
            .addRow().setMortWithReason(test.reasons[2], '0', '0', test.euthanas[2])
            .setComment(test.comment).submit().waitLoader();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('Collapse reasons', () => {
        checkupPage.reasonCollapse(0).reasonCollapse(1).reasonCollapse(2).waitLoader();
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

});

describe('Report Treats', () => {
    const treatPage = require('../pageobjects/medications.page');
    let rslt;
    const test = tdata.randTreatsData();

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();
        tdata.toStringVal(test);
    });

    it('Choose mediacations', () => {
        checkupPage.chooseSection(2);

        expect(browser.getUrl(), 'treats url').to.match(/(\/report-treatments)$/);
    });

    it('Fill report', () => {
        treatPage.setWithCcsDosage(test.treats[0], test.heads[0], test.dosage[0])
            .addRow().setWithGalsDosage(test.treats[1], test.heads[1], test.dosage[1], test.gals)
            .addRow().setWithMlsDosage(test.treats[2], test.heads[2], test.dosage[2])
            .addRow().setWithoutDosage(test.treats[3], test.heads[3]).setTotal(test.total)
            .setComment(test.comment).submit().waitLoader();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('Amount', () => {
        checkupPage.section(2).scrollIntoView({ block: 'center' });
        rslt = checkupPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.amount);
    });


    for (let i = 0; i < +test.amount; i++) {
        it('Treat(' + i + ')', () => {
            expect(rslt.name[i], 'name of treat').to.equal(test.treats[i]);
        });

        it('Heads(' + i + ')', () => {
            expect(rslt.heads[i], 'heads').to.equal(test.heads[i]);
        });

        if (i < 3) {
            it('Dosage(' + i + ')', () => {
                expect(rslt.dosage[i], 'dosage of treat').to.equal(test.dosage[i]);
            });
        }
    }

    it('Gals', () => {
        expect(rslt.gals[0], 'gals').to.equal(test.gals);
    });

    it('Comment', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });
});

describe('Report Symptoms', () => {
    const symptomPage = require('../pageobjects/symptoms.page');
    let rslt;
    const test = tdata.randSymptData();

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();
    });

    it('Choose symptoms', () => {
        checkupPage.chooseSection(3);

        expect(browser.getUrl(), 'symptoms url').to.match(/(\/report-symptoms)$/);
    });

    it('Fill report', () => {
        symptomPage.setSymptom(test.sympt[0])
            .addRow().setSymptom(test.sympt[1])
            .addRow().setSymptom(test.sympt[2])
            .addRow().setSymptom(test.sympt[3])
            .setComment(test.comment).submit().waitLoader();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('Amount', () => {
        checkupPage.section(3).scrollIntoView({ block: 'center' });

        rslt = checkupPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.amount + '');
    });

    for (let i = 0; i < test.amount; i++) {
        it('Symptom(' + i + ')', () => {
            expect(rslt.name[i], 'name of symptoms i').to.equal(test.sympt[i]);
        });
    }

    it('Comment', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });
});

describe('Report Temps', () => {
    const tempsPage = require('../pageobjects/temps.page');
    let rslt;
    const high = tdata.randHighTemp, low = tdata.randLowTemp,
        comment = tdata.randComment;

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();
    });

    it('Choose temps', () => {
        checkupPage.chooseSection(4);

        expect(browser.getUrl(), 'temps url').to.match(/(\/report-temps)$/);
    });

    it('Fill report', () => {
        tempsPage.setTemps(high + '', low + '').setComment(comment).submit().waitLoader();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('High temp', () => {
        checkupPage.section(4).scrollIntoView({ block: 'center' });
        rslt = checkupPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(high + '');
    });

    it('Low temp', () => {
        expect(rslt.low, 'low temp').to.equal(low + '');
    });

    it('Comment', () => {
        expect(rslt.comment, 'comment temp').to.equal(comment);
    });
});

describe('Report Water usage', () => {
    const waterPage = require('../pageobjects/water.page');
    let rslt;
    const consumed = tdata.randWater, comment = tdata.randComment;

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();
    });

    it('Choose water usage', () => {
        checkupPage.chooseSection(5);

        expect(browser.getUrl(), 'waters url').to.match(/(\/report-water-usage)$/);
    });

    it('Fill report', () => {
        waterPage.setGals(consumed + '').setComment(comment).submit().waitLoader();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('Water consumed', () => {
        checkupPage.section(5).scrollIntoView({ block: 'center' });
        rslt = checkupPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(consumed + '');
    });

    it('Comment', () => {
        expect(rslt.comment, 'comment water').to.equal(comment);
    });

});

describe('Add Media', () => {
    const audioPage = require('../pageobjects/audio.page');
    const comment = tdata.randComment;
    let rslt;

    it('Choose random group', () => {
        checkupPage.chooseRandCheckup();
    });

    it('Upload media', () => {
        checkupPage.clearMedia()
            .uploadMedia(tdata.randPhoto)
            .uploadMedia(tdata.randVideo)
            .uploadMedia(tdata.randAudio).waitLoader();
    });

    it('Amount', () => {
        checkupPage.mediaUploader.scrollIntoView({ block: 'center' });
        rslt = checkupPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    if (!isIOS || !isSafari) {

        it('Choose audio', () => {
            checkupPage.clickAudio();

            expect(browser.getUrl(), 'waters url').to.match(/(\/record-audio)$/);
        });

        it('Record audio', () => {
            audioPage.record();
            browser.pause(5000);
            audioPage.record().continue().setComment(comment).save().waitLoader();

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
        checkupPage.chooseRandCheckup(true);
    });

    it('Create checkup', () => {
        const length = $$(checkupPage.sectionWrapper).length
        for (let i = 0; i < length; i++) {
            checkupPage.clickNoToReport(i);
        }
    });

    it('Moves report', () => {
        //checkupPage.closeBtn.isExisting() && checkupPage.close().waitLoader();
        checkupPage.openCurrent().waitLoader();

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
        checkupPage.chooseRandCheckup(true);
        tdata.toStringVal(test);
    });

    it('Create checkup', () => {
        checkupPage.createCheckup(test).submitDC().clickToModal('OK');
    });

    it('Moves report', () => {
        checkupPage.openCurrent().waitLoader();
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
    });

    it('Water report', () => {
        checkupPage.section(5).scrollIntoView({ block: 'center' });

        expect(checkupPage.waterInfo.consumed, 'water consumed').to.equal(test.water.consumed);
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