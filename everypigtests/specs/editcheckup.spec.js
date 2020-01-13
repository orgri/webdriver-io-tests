const admin = require('../pageobjects/admin.page');
const sheetsPage = require('../pageobjects/barnsheets.page');

describe('Edit Moves', () => {
    const movePage = require('../pageobjects/movements.page');
    const options = { month: 'short', day: 'numeric' }; //year: 'numeric', 
    let date, localDate, invBefore, weightBefore, deaths, totalMoved = 0,
        test = tdata.randMovesData(), rslt;
    const headMoves = test.heads[0] - test.heads[1],
        corrected = test.heads[2] - test.heads[3] + test.heads[4];

    it('Choose random group', () => {
        tdata.toStringVal(test);
        date = sheetsPage.chooseRandGroup().getRandDates();
        localDate = new Date(date[1]).toLocaleDateString("en-US", options);
        invBefore = +sheetsPage.inventoryCell(date[0]);
        weightBefore = sheetsPage.weightCell(date[1]);
        //deaths = (sheetsPage.deathsCell(date[1]) === '-') ? 0 : (+sheetsPage.deathsCell(date));
        deaths = sheetsPage.deathsCell(date[1]) ? 0 : (+sheetsPage.deathsCell(date));
        totalMoved = (invBefore + headMoves + corrected - deaths) + '';

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).chooseSection('Move');
        movePage.setShipment(test.heads[0], test.weight, test.condition)
            .addRow().clickSelect().setTransfer(test.heads[1])
            .addRow().clickSelect().setFixAdding(test.heads[2])
            .addRow().clickSelect().setFixRemoving(test.heads[3])
            .addRow().clickSelect().setFixAdding(test.heads[4])
            .setComment(test.comment).submit();
        rslt = sheetsPage.moveInfo;

        expect(rslt.amount, 'amount of moves').to.equal(test.amount);
    });

    it('added heads 0', () => {
        expect(rslt.added[0], 'added heads').to.equal(test.heads[0]);
    });

    it('weight', () => {
        expect(rslt.weight[0], 'weight').to.equal(test.weight);
    });

    it('condition', () => {
        expect(rslt.condition[0].toLowerCase(), 'condition').to.equal(test.condition);
    });

    it('removed heads 0', () => {
        expect(rslt.removed[0], 'removed heads').to.equal(test.heads[1]);
    });

    it('added heads 1', () => {
        expect(rslt.added[1], 'added heads').to.equal(test.heads[2]);
    });

    it('removed heads 1', () => {
        expect(rslt.removed[1], 'removed heads').to.equal(test.heads[3]);
    });

    it('added heads 2', () => {
        expect(rslt.added[2], 'added heads').to.equal(test.heads[4]);
    });

    it('comment', () => {
        expect(rslt.comment, 'commment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave();
    });

    it('Table changes(pigs in before)', () => {
        expect(sheetsPage.pigsinCell(date[1]), 'pigs in (before save)').to.equal(test.heads[0]);
    });

    it('Table changes(pigs out before)', () => {
        expect(sheetsPage.pigsoutCell(date[1]), 'pigs out (before save)').to.equal(test.heads[1]);
    });

    it('Table changes(correct before)', () => {
        expect(sheetsPage.correctCell(date[1]), 'correct (before save)').to.equal(corrected + '');
    });

    it('Table changes(inventory before)', () => {
        expect(sheetsPage.inventoryCell(date[1]), 'inventory (before save)').to.equal(totalMoved);
    });

    it('Table changes(weight before)', () => {
        expect(sheetsPage.weightCell(date[1]), 'weight (before save)').to.not.equal(weightBefore);
    });

    it('Save edits', () => {
        sheetsPage.clickSave();
    });

    it('Table changes(pigs in)', () => {
        expect(sheetsPage.pigsinCell(date[1]), 'pigs in (after save)').to.equal(test.heads[0]);
    });

    it('Table changes(pigs out)', () => {
        expect(sheetsPage.pigsoutCell(date[1]), 'pigs out (after save)').to.equal(test.heads[1]);
    });

    it('Table changes(correct)', () => {
        expect(sheetsPage.correctCell(date[1]), 'correct (after save)').to.equal(corrected + '');
    });

    it('Table changes(inventory)', () => {
        expect(sheetsPage.inventoryCell(date[1]), 'inventory (after save)').to.equal(totalMoved);
    });

    it('Table changes(weight)', () => {
        expect(sheetsPage.weightCell(date[1]), 'weight (after save)').to.not.equal(weightBefore);
    });

    it('Pig movements Tab', () => {
        sheetsPage.clickSubTab('Pig Movements');
        rslt = sheetsPage.moveTabInfo(localDate);

        expect(rslt.amount, 'amount of moves').to.equal('2');
    });

    it('Shipment (heads)', () => {
        expect(rslt.heads[1], 'added heads').to.equal(test.heads[0]);
    });

    it('Shipment (weight)', () => {
        expect(rslt.weight[0], 'weight').to.equal(test.weight);
    });
    it('Shipment (condition)', () => {
        expect(rslt.condition[0].toLowerCase(), 'condition').to.equal(test.condition);
    });

    it('Transferred heads', () => {
        expect(rslt.heads[0], 'removed heads').to.equal(test.heads[1]);
    });
});

describe('Edit Deaths', () => {
    const deathPage = require('../pageobjects/deaths.page');
    let date, invBefore, mrBefore, rslt;
    const test = tdata.randDeathsData();

    it('Choose random group', () => {
        tdata.toStringVal(test);
        admin.openPrefs().setOn('Track Mortality Reasons');
        date = sheetsPage.chooseRandGroup().getRandDates();
        invBefore = +sheetsPage.inventoryCell(date[0]);
        weightBefore = sheetsPage.weightCell(date[1]);
        mrBefore = sheetsPage.mrCell(date[1]);

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).chooseSection('Dead');
        deathPage.setMortWithReason(test.reasons[0], test.chronic[0], '0', '0')
            .addRow().setMortWithReason(test.reasons[1], '0', test.acute[1], '0')
            .addRow().setMortWithReason(test.reasons[2], '0', '0', test.euthanas[2])
            .setComment(test.comment).submit();

        expect(browser.getUrl(), 'barnsheet url').to.match(/(\/barnsheets\/daily-checkup\/)([\d]+)/);
    });

    it('amount', () => {
        rslt = sheetsPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(test.amount)
    });

    for (let i = 0, length = test.reasons.length; i < length; i++) {
        it('reason ' + i, () => {
            expect(rslt.reason[i], 'reason').to.equal(test.reasons[i]);
        });

        it('chronic ' + i, () => {
            expect(rslt.chronic[i], 'chronic').to.equal(test.chronic[i]);
        });

        it('acute ' + i, () => {
            expect(rslt.acute[i], 'acute').to.equal(test.acute[i]);
        });

        it('euthanasia ' + i, () => {
            expect(rslt.euthanas[i], 'euthanas').to.equal(test.euthanas[i]);
        });
    }

    it('comment', () => {
        expect(rslt.comment, 'comment deaths').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave();
    });

    it('Table changes(deaths before)', () => {
        expect(sheetsPage.deathsCell(date[1]), 'deathsCell (before save)').to.equal(test.amount);
    });

    it('Table changes(inventory before)', () => {
        let inv = invBefore - (+test.amount) + '';

        expect(sheetsPage.inventoryCell(date[1]), 'inventory (before save)').to.equal(inv);
    });

    it('Table changes(mr before)', () => {
        expect(sheetsPage.mrCell(date[1]), 'mr (before save)').to.not.equal(mrBefore);
    });

    it('Save edits', () => {
        sheetsPage.clickSave();
    });

    it('Table changes(deaths)', () => {
        expect(sheetsPage.deathsCell(date[1]), 'deathsCell (after save)').to.equal(test.amount);
    });

    it('Table changes(inventory)', () => {
        let inv = invBefore - (+test.amount) + '';

        expect(sheetsPage.inventoryCell(date[1]), 'inventory (after save)').to.equal(inv);
    });

    it('Table changes(mr)', () => {
        expect(sheetsPage.mrCell(date[1]), 'mr (after save)').to.not.equal(mrBefore);
    });
});

describe('Edit Treats', () => {
    const treatPage = require('../pageobjects/medications.page');
    let date, rslt;
    const test = tdata.randTreatsData();

    it('Choose random group', () => {
        tdata.toStringVal(test);
        date = sheetsPage.chooseRandGroup().getRandDates();

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).chooseSection('Medication');
        treatPage.setWithCcsDosage(test.treats[0], test.heads[0], test.dosage[0])
            .addRow().setWithGalsDosage(test.treats[1], test.heads[1], test.dosage[1], test.gals)
            .addRow().setWithMlsDosage(test.treats[2], test.heads[2], test.dosage[2])
            .addRow().setWithoutDosage(test.treats[3], test.heads[3]).setTotal(test.total)
            .setComment(test.comment).submit();
        sheetsPage.section('Medic').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('name ' + i, () => {
            expect(rslt.name[i], 'name of treat').to.equal(test.treats[i]);
        });

        it('heads ' + i, () => {
            expect(rslt.heads[i], 'heads').to.equal(test.heads[i]);
        });

        if (i < 3) {
            it('dosage ' + i, () => {
                expect(rslt.dosage[i], 'dosage of treat').to.equal(test.dosage[i]);
            });
        }
    }

    it('gals', () => {
        expect(rslt.gals[0], 'gals').to.equal(test.gals);
    });

    it('comment', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave();
    });

    it('Table changes(total treats before)', () => {
        expect(sheetsPage.treatsCell(date[1]), 'treatsCell (before save)').to.equal(test.total);
    });

    it('Save edits', () => {
        sheetsPage.clickSave();
    });
    it('Table changes(total treats)', () => {
        expect(sheetsPage.treatsCell(date[1]), 'treatsCell (after save)').to.equal(test.total);
    });

    it('Treatments tab', () => {
        sheetsPage.clickSubTab('Treatments');

        expect(sheetsPage.chart.isExisting(), 'isChart').to.equal(true);
    });

    it('Set pagination', () => {
        sheetsPage.setElemsOnPage(100);
    });

    it('Treatments Tab (amount)', () => {
        test.dosage.push('-'); // need for next testcases

        expect(sheetsPage.tableItemsWith(date[1]), 'amount of treats').to.have.lengthOf(+test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('Treatments Tab Table(name ' + i + ')', () => {
            expect(sheetsPage.cell(date[1], 0, i).$('<a>').getText(), 'name of treat').to.be.oneOf(test.treats);
        });

        it('Treatments Tab Table(heads ' + i + ')', () => {
            expect(sheetsPage.cell(date[1], 3, i).$$('span')[2].getText(), 'heads').to.be.oneOf(test.heads);
        });

        it('Treatments Tab Table(dosage ' + i + ')', () => {
            let dosage = sheetsPage.cell(date[1], 2, i).getText().match(/[\d.-]+/u)[0];

            expect(dosage, 'dosage of treat').to.be.oneOf(test.dosage);
        });
    }
});

describe('Edit Symptoms', () => {
    const symptomPage = require('../pageobjects/symptoms.page');
    let date, rslt;
    const test = tdata.randSymptData();

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).chooseSection('Symptom');
        symptomPage.setSymptom(test.sympt[0])
            .addRow().setSymptom(test.sympt[1])
            .addRow().setSymptom(test.sympt[2])
            .addRow().setSymptom(test.sympt[3])
            .setComment(test.comment).submit();
        sheetsPage.section('Sympt').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.amount + '');
    });

    for (let i = 0; i < test.amount; i++) {
        it('name ' + i, () => {
            expect(rslt.name[i], 'name of symptoms i').to.equal(test.sympt[i]);
        });
    }

    it('comment', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave();
    });

    it('Table changes(total symptoms before)', () => {
        expect(sheetsPage.symptsCell(date[1]), 'symptsCell (before save)').to.equal(test.amount + '');
    });

    it('Save edits', () => {
        sheetsPage.clickSave();
    });

    it('Table changes(total symptoms)', () => {
        expect(sheetsPage.symptsCell(date[1]), 'symptsCell (before save)').to.equal(test.amount + '');
    });
});

describe('Edit Temps', () => {
    const tempsPage = require('../pageobjects/temps.page');
    let date, rslt;
    const high = tdata.randHighTemp, low = tdata.randLowTemp,
        comment = tdata.randComment;

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).chooseSection('Temps');
        tempsPage.setTemps(high + '', low + '').setComment(comment).submit();
        sheetsPage.section('Temps').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.tempsInfo;

        expect(browser.getUrl(), 'barnsheet url').to.match(/(\/barnsheets\/daily-checkup\/)([\d]+)/);
    });

    it('high temp', () => {
        expect(rslt.high, 'high temp').to.equal(high + '');
    });

    it('low temp', () => {
        expect(rslt.low, 'low temp').to.equal(low + '');
    });

    it('comment', () => {
        expect(rslt.comment, 'comment temp').to.equal(comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave();
    });

    it('Save edits', () => {
        sheetsPage.clickSave();
    });
});

describe('Edit Water usage', () => {
    const waterPage = require('../pageobjects/water.page');
    let date, rslt;
    const consumed = tdata.randWater, comment = tdata.randComment;

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Water Usage');
        waterPage.setGals(consumed + '').setComment(comment).submit();
        sheetsPage.section('Water Usage').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.waterInfo;

        expect(browser.getUrl(), 'barnsheet url').to.match(/(\/barnsheets\/daily-checkup\/)([\d]+)/);
    });

    it('consumed', () => {
        expect(rslt.consumed, 'water consumed').to.equal(consumed + '');
    });

    it('comment', () => {
        expect(rslt.comment, 'comment water').to.equal(comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave();
    });

    it('Save edits', () => {
        sheetsPage.clickSave();
    });
});

describe('Edit Media', () => {
    let date, scale;
    const files = [tdata.randVideo, tdata.randPhoto, tdata.randPhoto, tdata.randAudio];

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Choose media', () => {
        sheetsPage.choose(date[1]).chooseSection('Media');

        expect(sheetsPage.mediaUploader.isExisting(), 'media uploader').to.equal(true);
    });

    it('Make changes to checkup', () => {
        sheetsPage.reload().clearMedia()
            .uploadMedia(files).submit();

        expect(browser.getUrl(), 'barnsheet url').to.match(/(\/barnsheets\/daily-checkup\/)([\d]+)/);
    }, 1);

    it('Number of audio', () => {
        sheetsPage.section('Audio').scrollIntoView({ block: 'center' });
        let rslt = sheetsPage.audioInfo;

        expect(rslt.amount, 'nOfAudio').to.equal('1');
    });

    it('Number of media', () => {
        sheetsPage.section('Media').scrollIntoView({ block: 'center' });
        let rslt = sheetsPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    it('Save and review', () => {
        sheetsPage.clickSave();
    });

    it('Media label before', () => {
        expect(sheetsPage.mediaLabel(date[1]), 'mediaLabel (before save)').to.equal('Media');
    });

    it('Save edits', () => {
        sheetsPage.clickSave();
    });

    it('Media label', () => {
        expect(sheetsPage.mediaLabel(date[1]), 'mediaLabel (after save)').to.equal('Media');
    });

    it('Media tab', () => {
        sheetsPage.clickSubTab('Media');

        expect(browser.getUrl(), 'media tab url')
            .to.match(/(\/barnsheets\/groups\/)([0-9]+)(\/media)/);
    });

    it('Open image', () => {
        sheetsPage.clickOnImg();

        expect(sheetsPage.mediaViewer.isDisplayed(), 'mediaViewer').to.equal(true);
    });

    if (!isMobile) {
        it('Scale minus image', () => {
            scale = +sheetsPage.clickScaleOrig().scale.getText().slice(0, -1);
            sheetsPage.clickScaleMinus();

            expect(+sheetsPage.scale.getText().slice(0, -1), 'scale percent').to.be.below(scale);
        });

        it('Scale original image', () => {
            if (!sheetsPage.mediaViewer.isDisplayed()) {
                sheetsPage.reload().clickOnImg();
                browser.pause(2500);
            }
            sheetsPage.clickScaleOrig();

            expect(+sheetsPage.scale.getText().slice(0, -1), 'scale percent').to.equal(scale);
        });

        it('Scale plus image', () => {
            sheetsPage.clickScalePlus();

            expect(+sheetsPage.scale.getText().slice(0, -1), 'scale percent').to.be.above(scale);
        });

        it('Next image', () => {
            sheetsPage.clickNextImg();
        });

        it('Previous image', () => {
            sheetsPage.clickPrevImg();
        });
    }

    it('Close image', () => {
        sheetsPage.clickCloseView();

        expect(sheetsPage.mediaViewer.isDisplayed(), 'mediaViewer').to.equal(false);
    });

});

describe('Edit Diagnosis', () => {
    const dBar = require('../pageobjects/diagnosis.bar');
    let date, rslt;
    const test = tdata.randDiagnosData();

    before(function () {
        // because of bug related to common_name of diseases: mobile picker displays name of disease
        // instead of common_name
        isMobile && this.skip();
    });

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        isMobile ? sheetsPage.clickBtn('Edit Diagnosis', sheetsPage.tableRowsWith(date[1])[0])
            : sheetsPage.clickMenuCell(date[1]).clickOption('Edit Diagnosis');
        dBar.clear().setDiagnos(test.diseases[0], test.types[0], test.comments[0]).setAlert()
            .addRow().setDiagnos(test.diseases[1], test.types[1], test.comments[1])
            .addRow().setDiagnos(test.diseases[2], test.types[2], test.comments[2])
            .clickBtn(isMobile ? 'Continue' : 'Save Diagnoses');

        expect(browser.getUrl(), 'barnsheet url').to.match(/(\/barnsheets\/groups\/)([\d]+)/);
    });

    it('Notification about update Diagnosis', () => {
        expect(sheetsPage.notification.getText(), 'notification').to.have.string('successfully updated');
    });

    it('Open Diagnosis tab', () => {
        sheetsPage.clickSubTab('Diagnosis History');
        rslt = sheetsPage.diagnosInfo;

        expect(browser.getUrl(), 'diagnosis tab url')
        .to.match(/(\/barnsheets\/groups\/)([0-9]+)(\/diagnoses)$/);
    });

    for (let i = 0, length = test.diseases.length - 1; i <= length; i++) {
        it('diseases ' + i, () => {
            expect(rslt.name[length - i], 'name').to.equal(test.diseases[i]);
        });

        it('type ' + i, () => {
            expect(rslt.type[length - i], 'type').to.equal(test.types[i]);
        });

        it('comment ' + i, () => {
            expect(rslt.comment[length - i], 'comment').to.equal(test.comments[i]);
        });
    }

    it('Open Diagnosis edit', () => {
        sheetsPage.clickDiagnosMenu().clickOption('Edit Diagnosis');
    });

    it('Collapse diagnosis info', () => {
        dBar.clickGroupInfoTab().clickDiagnosInfoCol();
        rslt = dBar.info;
    });

    it('Changes (amount)', () => {
        expect(rslt.amount, 'amount').to.equal(test.amount + '');
    });

    for (let i = 0, length = test.diseases.length; i < length; i++) {
        it('Changes (diseases ' + i + ')', () => {
            expect(rslt.name[i], 'name').to.equal(test.diseases[i]);
        });

        it('Changes (type ' + i + ')', () => {
            expect(rslt.type[i], 'type').to.equal(test.types[i] + ' Diagnosis');
        });

        it('Changes (comment ' + i + ')', () => {
            expect(rslt.comment[i], 'comment').to.equal(test.comments[i]);
        });
    }

    it('Close Diagnosis Bar', () => {
        dBar.close();
    });

    it('Delete Diagnosis', () => {
        sheetsPage.clickDiagnosMenu().clickOption('Delete Diagnosis')
            .clickDiagnosMenu().clickOption('Delete Diagnosis').pause();
    });

    it('Notification about update Diagnosis', () => {
        expect(sheetsPage.notification.getText(), 'notification').to.have.string('successfully updated');
    });

    it('Absence of deleted diagnosis', () => {
        expect(sheetsPage.diagnosInfo.name[0], 'name').to.equal(test.diseases[0]);
    });

    it('View Checkup', () => {
        sheetsPage.clickDiagnosMenu().clickOption('View Checkup');

        rslt = sheetsPage.diagnosInfo;
    });

    it('View (diseases 0)', () => {
        expect(rslt.name[0], 'name').to.equal(test.diseases[0]);
    });

    it('View (type 0)', () => {
        expect(rslt.type[0], 'type').to.equal(test.types[0]);
    });

    it('View (comment 0)', () => {
        expect(rslt.comment[0], 'comment').to.equal(test.comments[0]);
    });

});
