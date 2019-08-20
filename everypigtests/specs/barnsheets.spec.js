const admin = require('../pageobjects/admin.page');
const sheetsPage = require('../pageobjects/barnsheets.page');

describe('Barnsheets Navigation', () => {
    const farmName = 'TA_Farm_0000';
    const groupName = 'TA_PigGroup_0000_0001';

    it('Open and Search farm', () => {
        sheetsPage.open().setSearch(farmName).waitLoader();
        expect(sheetsPage.tableItemsWith(farmName), 'tableItemsWith(farmName) length')
            .to.have.lengthOf(sheetsPage.tableRows.length - 1);
    });

    it('Choose farm', () => {
        sheetsPage.choose(farmName).waitLoader();
        expect($('.farm-info-wrapper h1').getText(), 'farmName').to.equal(farmName);
    });

    it('Set pagination', () => {
        sheetsPage.setElemsOnPage(10).waitLoader();

        expect(sheetsPage.tableRows, 'length').to.have.lengthOf(11);

        sheetsPage.setElemsOnPage(100).waitLoader();

        expect(sheetsPage.tableRows, 'length').to.have.lengthOf.above(10);
    });

    it('Search group', () => {
        sheetsPage.setSearch(groupName).waitLoader();

        expect(sheetsPage.tableItemsWith(groupName), 'tableItemsWith(groupName) length')
            .to.have.lengthOf(sheetsPage.tableRows.length - 1);
    });

    it('Choose group', () => {
        sheetsPage.choose(groupName).waitLoader();
        groupUrl = browser.getUrl();
        expect($('.group-info-wrapper .group-name').getText(), 'groupName').to.equal(groupName);
    });

    it('Treatments tab', () => {
        sheetsPage.clickTreatsTab().waitLoader();
    });
    it('Diagnosis tab', () => {
        sheetsPage.clickDiagnosTab().waitLoader();
    });
    it('Pig movements tab', () => {
        sheetsPage.clickMovesTab().waitLoader();
    });
    it('Media tab', () => {
        sheetsPage.clickMediaTab().waitLoader();
    });
    it('Daily Checkups tab', () => {
        sheetsPage.clickDcTab().waitLoader();
    });

});

describe('Barnsheets Tabs and Sorting', () => {

    it('Open', () => {
        sheetsPage.clickBarnSheets().waitForOpen();
    });

    it('Farms tab', () => {
        sheetsPage.clickFarmsTab().waitLoader();
    });

    it('Filter by Disabled', () => {
        sheetsPage.clickFilterBy('Disabled').waitLoader();
    });

    it('Filter by Active', () => {
        sheetsPage.clickFilterBy('Active').waitLoader();
    });

    it('Filter by All Farms', () => {
        sheetsPage.clickFilterBy('All Farms').waitLoader();
    });

    it('Sort by farm type', () => {
        sheetsPage.clickSortBy('Type').waitLoader();
    });

    it('Sort by Open Groups', () => {
        sheetsPage.clickSortBy('Open Groups').waitLoader();
    });

    it('Sort by Inventory', () => {
        sheetsPage.clickSortBy('Inventory').waitLoader();
    });

    it('Sort by Compliance', () => {
        sheetsPage.clickSortBy('Compliance').waitLoader();
    });

    it('Sort by Mort. Rate', () => {
        sheetsPage.clickSortBy('Mort. Rate').waitLoader();
    });

    it('Sort by farm', () => {
        sheetsPage.clickSortBy('Farm').waitLoader();
    });

    it('Set pagination', () => {
        sheetsPage.setElemsOnPage(100).waitLoader();
    });

    it('Next page', () => {
        sheetsPage.clickNextPage().waitLoader();
    });

    it('Previous page', () => {
        sheetsPage.clickPrevPage().waitLoader();
    });

    it('Groups tab', () => {
        sheetsPage.clickBarnSheets().clickGroupsTab().waitLoader();
    });

    it('Filter by Closed', () => {
        sheetsPage.clickFilterBy('Closed').waitLoader();
    });

    it('Filter by Open', () => {
        sheetsPage.clickFilterBy('Open').waitLoader();
    });

    it('Filter by All Groups', () => {
        sheetsPage.clickFilterBy('All Groups').waitLoader();
    });

    it('Sort by farm type', () => {
        sheetsPage.clickSortBy('Type').waitLoader();
    });

    it('Sort by Group ID', () => {
        sheetsPage.clickSortBy('Group').waitLoader();
    });

    it('Sort by Inventory', () => {
        sheetsPage.clickSortBy('Inventory').waitLoader();
    });

    it('Sort by farm', () => {
        sheetsPage.clickSortBy('Farm').waitLoader();
    });

    it('Sort by Start Date', () => {
        sheetsPage.clickSortBy('Start').waitLoader();
    });

    it('Sort by Pigs In', () => {
        sheetsPage.clickSortBy('Pigs In').waitLoader();
    });

    it('Sort by Mort. Rate', () => {
        sheetsPage.clickSortBy('Mort. Rate').waitLoader();
    });

    it('Sort by Est. Avg. Wt', () => {
        sheetsPage.clickSortBy('Est. Avg.').waitLoader();
    });

    it('Sort by Compliance', () => {
        sheetsPage.clickSortBy('Compliance').waitLoader();
    });

    it('Sort by Status', () => {
        sheetsPage.clickSortBy('Status').waitLoader();
    });

    it('Companies tab', () => {
        sheetsPage.clickCompaniesTab().waitLoader();
    });

    it('Filter by Active', () => {
        sheetsPage.clickFilterBy('Active').waitLoader();
    });

    it('Filter by Incomplete', () => {
        sheetsPage.clickFilterBy('Incomplete').waitLoader();
    });

    it('Filter by All Companies', () => {
        sheetsPage.clickFilterBy('All Companies').waitLoader();
    });

    it('Choose company', () => {
        sheetsPage.choose('TA_Tenant').waitLoader();
    });
});

describe('Edit Moves', () => {
    const movePage = require('../pageobjects/movements.page');
    const options = { month: 'short', day: 'numeric' }; //year: 'numeric', 
    let date, localDate, invBefore, weightBefore, deaths, totalMoved = 0,
        test = tdata.randMovesData(), rslt;
    const headMoves = test.heads[0] - test.heads[1],
        corrected = test.heads[2] - test.heads[3] + test.heads[4];

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();
        localDate = new Date(date[1]).toLocaleDateString("en-US", options);
        invBefore = +sheetsPage.inventoryCell(date[0]);
        weightBefore = sheetsPage.weightCell(date[1]);
        deaths = (sheetsPage.deathsCell(date[1]) === '-') ? 0 : (+sheetsPage.deathsCell(date));
        totalMoved = (invBefore + headMoves + corrected - deaths) + '';
        tdata.toStringVal(test);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Move');
        movePage.setShipment(test.heads[0], test.weight, test.condition)
            .addRow().clickSelectParam().setTransfer(test.heads[1])
            .addRow().clickSelectParam().setFixAdding(test.heads[2])
            .addRow().clickSelectParam().setFixRemoving(test.heads[3])
            .addRow().clickSelectParam().setFixAdding(test.heads[4])
            .setComment(test.comment).submit();
        sheetsPage.waitLoader();
        rslt = sheetsPage.moveInfo;

        expect(rslt.amount, 'amount of moves').to.equal(test.amount);
    });

    it('Moves changes(added heads 0)', () => {
        expect(rslt.added[0], 'added heads').to.equal(test.heads[0]);
    });

    it('Moves changes(weight)', () => {
        expect(rslt.weight[0], 'weight').to.equal(test.weight + ' lbs');
    });

    it('Moves changes(condition)', () => {
        expect(rslt.condition[0].toLowerCase(), 'condition').to.equal(test.condition);
    });

    it('Moves changes(removed heads 0)', () => {
        expect(rslt.removed[0], 'removed heads').to.equal(test.heads[1]);
    });

    it('Moves changes(added heads 1)', () => {
        expect(rslt.added[1], 'added heads').to.equal(test.heads[2]);
    });

    it('Moves changes(removed heads 1)', () => {
        expect(rslt.removed[1], 'removed heads').to.equal(test.heads[3]);
    });

    it('Moves changes(added heads 2)', () => {
        expect(rslt.added[2], 'added heads').to.equal(test.heads[4]);
    });

    it('Moves changes(comment)', () => {
        expect(rslt.comment, 'commment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(pigs in)', () => {
        expect(sheetsPage.pigsinCell(date[1]), 'pigs in (before save)').to.equal(test.heads[0]);
    });

    it('Table changes(pigs out)', () => {
        expect(sheetsPage.pigsoutCell(date[1]), 'pigs out (before save)').to.equal(test.heads[1]);
    });

    it('Table changes(correct)', () => {
        expect(sheetsPage.correctCell(date[1]), 'correct (before save)').to.equal(corrected + '');
    });

    it('Table changes(inventory)', () => {
        expect(sheetsPage.inventoryCell(date[1]), 'inventory (before save)').to.equal(totalMoved);
    });

    it('Table changes(weight)', () => {
        expect(sheetsPage.weightCell(date[1]), 'weight (before save)').to.not.equal(weightBefore);
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
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
        sheetsPage.clickMovesTab().waitLoader();
        rslt = sheetsPage.moveTabInfo(localDate);

        expect(rslt.amount, 'amount of moves').to.equal('2');
    });

    it('Shipment (heads)', () => {
        expect(rslt.heads[1], 'added heads').to.equal(test.heads[0]);
    });

    it('Shipment (weight)', () => {
        expect(rslt.weight[1], 'weight').to.equal(test.weight);
    });
    it('Shipment (condition)', () => {
        expect(rslt.condition[1].toLowerCase(), 'condition').to.equal(test.condition);
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
        admin.openPrefs().setOnMortReason();
        date = sheetsPage.chooseRandGroup().getRandDates();
        invBefore = +sheetsPage.inventoryCell(date[0]);
        weightBefore = sheetsPage.weightCell(date[1]);
        mrBefore = sheetsPage.mrCell(date[1]);
        tdata.toStringVal(test);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Dead');
        deathPage.setMortWithReason(test.reasons[0], test.chronic[0])
            .addRow().setMortWithReason(test.reasons[1], '0', test.acute[1])
            .addRow().setMortWithReason(test.reasons[2], '0', '0', test.euthanas[2])
            .setComment(test.comment).submit();
        sheetsPage.waitLoader();
    });

    it('Collapse reasons', () => {
        sheetsPage.deathReasonCollapse(0).deathReasonCollapse(1)
            .deathReasonCollapse(2).waitLoader();
    });

    it('Deaths changes(amount)', () => {
        rslt = sheetsPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(test.amount)
    });

    for (let i = 0, length = test.reasons.length; i < length; i++) {
        it('Deaths changes(reason ' + i + ')', () => {
            expect(rslt.reason[i], 'reason').to.equal(test.reasons[i]);
        });

        it('Deaths changes(chronic ' + i + ')', () => {
            expect(rslt.chronic[i], 'chronic').to.equal(test.chronic[i]);
        });

        it('Deaths changes(acute ' + i + ')', () => {
            expect(rslt.acute[i], 'acute').to.equal(test.acute[i]);
        });

        it('Deaths changes(euthanas ' + i + ')', () => {
            expect(rslt.ethanas[i], 'euthanas').to.equal(test.euthanas[i]);
        });
    }

    it('Deaths changes(comment)', () => {
        expect(rslt.comment, 'comment deaths').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(deaths)', () => {
        expect(sheetsPage.deathsCell(date[1]), 'deathsCell (before save)').to.equal(test.amount);
    });

    it('Table changes(inventory)', () => {
        let inv = invBefore - (+test.amount) + '';

        expect(sheetsPage.inventoryCell(date[1]), 'inventory (before save)').to.equal(inv);
    });

    it('Table changes(mr)', () => {
        expect(sheetsPage.mrCell(date[1]), 'mr (before save)').to.not.equal(mrBefore);
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
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
        date = sheetsPage.chooseRandGroup().getRandDates();
        tdata.toStringVal(test);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Medication');
        treatPage.setWithCcsDosage(test.treats[0], test.heads[0], test.dosage[0])
            .addRow().setWithGalsDosage(test.treats[1], test.heads[1], test.dosage[1], test.gals)
            .addRow().setWithMlsDosage(test.treats[2], test.heads[2], test.dosage[2])
            .addRow().setWithoutDosage(test.treats[3], test.heads[3]).setTotal(test.total)
            .setComment(test.comment).submit();
        sheetsPage.waitLoader().section('Medic').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('Treats changes(name ' + i + ')', () => {
            expect(rslt.name[i], 'name of treat').to.equal(test.treats[i]);
        });

        it('Treats changes(heads ' + i + ')', () => {
            expect(rslt.heads[i], 'heads').to.equal(test.heads[i]);
        });

        if (i < 3) {
            it('Treats changes(dosage ' + i + ')', () => {
                expect(rslt.dosage[i], 'dosage of treat').to.equal(test.dosage[i]);
            });
        }
    }

    it('Treats changes(gals)', () => {
        expect(rslt.gals[0], 'gals').to.equal(test.gals);
    });

    it('Treats changes(comment)', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(total treats)', () => {
        expect(sheetsPage.treatsCell(date[1]), 'treatsCell (before save)').to.equal(test.total);
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });
    it('Table changes(total treats)', () => {
        expect(sheetsPage.treatsCell(date[1]), 'treatsCell (after save)').to.equal(test.total);
    });

    it('Treatments tab', () => {
        sheetsPage.clickTreatsTab().waitLoader();
    });

    it('Set pagination', () => {
        sheetsPage.setElemsOnPage(100).waitLoader();
    });

    it('Treatments Tab (amount)', () => {
        test.dosage.push('-'); // need for next testcases

        expect(sheetsPage.tableItemsWith(date[1]), 'amount of treats').to.have.lengthOf(+test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('Treatments Tab Table(name ' + i + ')', () => {
            expect(sheetsPage.cell(date[1], 0, i).getText(), 'name of treat').to.be.oneOf(test.treats);
        });

        it('Treatments Tab Table(heads ' + i + ')', () => {
            expect(sheetsPage.cell(date[1], 3, i).getText(), 'heads').to.be.oneOf(test.heads);
        });

        it('Treatments Tab Table(dosage ' + i + ')', () => {
            let dosage = sheetsPage.cell(date[1], 2, i).getText().match(/[\d\.-]+/u)[0];

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
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Symptom');
        symptomPage.setSymptom(test.sympt[0])
            .addRow().setSymptom(test.sympt[1])
            .addRow().setSymptom(test.sympt[2])
            .addRow().setSymptom(test.sympt[3])
            .setComment(test.comment).submit();
        sheetsPage.waitLoader().section('Sympt').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.amount + '');
    });

    for (let i = 0; i < test.amount; i++) {
        it('Sympt changes(name ' + i + ')', () => {
            expect(rslt.name[i], 'name of symptoms i').to.equal(test.sympt[i]);
        });
    }

    it('Sympt changes(comment)', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(total symptoms)', () => {
        expect(sheetsPage.symptsCell(date[1]), 'symptsCell (before save)').to.equal(test.amount + '');
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
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
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Temps');
        tempsPage.setTemps(high + '', low + '').setComment(comment).submit();
        sheetsPage.waitLoader().section('Temps').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.tempsInfo;
    });

    it('Temps changes(high temp)', () => {
        expect(rslt.high, 'high temp').to.equal(high + '');
    });

    it('Temps changes(low temp)', () => {
        expect(rslt.low, 'low temp').to.equal(low + '');
    });

    it('Temps changes(comment)', () => {
        expect(rslt.comment, 'comment temp').to.equal(comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });
});

describe('Edit Water usage', () => {
    const waterPage = require('../pageobjects/water.page');
    let date, rslt;
    const consumed = tdata.randWater, comment = tdata.randComment;

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Water Usage');
        waterPage.setGals(consumed + '').setComment(comment).submit();
        sheetsPage.waitLoader().section('Water Usage').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.waterInfo;
    });

    it('Water changes(consumed)', () => {
        expect(rslt.consumed, 'water consumed').to.equal(consumed + '');
    });

    it('Water changes(comment)', () => {
        expect(rslt.comment, 'comment water').to.equal(comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });
});

describe('Edit Media', () => {
    let date, scale;
    const photo = tdata.randArrayPhoto(2);

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().chooseSection('Media').waitLoader()
            .uploadMedia(photo[0]).uploadMedia(photo[1])
            .uploadMedia(tdata.randVideo)
            .uploadMedia(tdata.randAudio)
            .submit().waitLoader().section('Media').scrollIntoView({ block: 'center' });
    });

    it('Media changes(nOfAudio)', () => {
        expect(sheetsPage.nOfAudio, 'nOfAudio').to.equal('1');
    });

    it('Media changes(nOfMedia)', () => {
        expect(sheetsPage.nOfMedia, 'nOfMedia').to.equal('3');
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(media label)', () => {
        expect(sheetsPage.mediaLabel(date[1]), 'mediaLabel (before save)').to.equal('Media');
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(media label)', () => {
        expect(sheetsPage.mediaLabel(date[1]), 'mediaLabel (after save)').to.equal('Media');
    });

    it('Media tab', () => {
        sheetsPage.clickMediaTab().waitLoader();
    });

    it('Open image', () => {
        sheetsPage.clickOnImg();
        scale = +sheetsPage.clickScaleOrig().scale.getText().slice(0, -1);

        expect(sheetsPage.mediaViewer.isDisplayed(), 'mediaViewer').to.equal(true);
    });

    it('Scale minus image', () => {
        sheetsPage.clickScaleMinus();

        expect(+sheetsPage.scale.getText().slice(0, -1), 'scale percent').to.be.below(scale);
    });

    it('Scale original image', () => {
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

    it('Close image', () => {
        sheetsPage.clickCloseImg();

        expect(sheetsPage.mediaViewer.isDisplayed(), 'mediaViewer').to.equal(false);
    });

});

describe('Edit Diagnosis', () => {
    const dBar = require('../pageobjects/diagnosis.bar');
    let date, rslt;
    const test = tdata.randDiagnosData();

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates();
    });

    it('Make changes to checkup', () => {
        sheetsPage.clickMenuCell(date[1]).waitLoader().clickOption('Edit Diagnosis').waitLoader();
        dBar.clear().setDiagnos(test.diseases[0], test.types[0], test.comments[0]).setAlert()
            .addRow().setDiagnos(test.diseases[1], test.types[1], test.comments[1])
            .addRow().setDiagnos(test.diseases[2], test.types[2], test.comments[2])
            .clickSave();
    });

    it('Notification about update Diagnosis', () => {
        expect(sheetsPage.notification.getText(), 'notification').to.have.string('successfully updated');
    });

    it('Open Diagnosis tab', () => {
        sheetsPage.clickDiagnosTab().waitLoader();
        rslt = sheetsPage.diagnosInfo;
    });

    for (let i = 0, length = test.diseases.length - 1; i <= length; i++) {
        it('Diagnosis tab (diseases ' + i + ')', () => {
            expect(rslt.name[length - i], 'name').to.equal(test.diseases[i]);
        });

        it('Diagnosis tab (type ' + i + ')', () => {
            expect(rslt.type[length - i], 'type').to.equal(test.types[i]);
        });

        it('Diagnosis tab (comment ' + i + ')', () => {
            expect(rslt.comment[length - i], 'comment').to.equal(test.comments[i]);
        });
    }

    it('Open Diagnosis edit', () => {
        sheetsPage.clickDiagnosMenu().clickOption('Edit Diagnosis').waitLoader();
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
            expect(rslt.type[i], 'type').to.equal(test.types[i]);
        });

        it('Changes (comment ' + i + ')', () => {
            expect(rslt.comment[i], 'comment').to.equal(test.comments[i]);
        });
    }

    it('Close Diagnosis Bar', () => {
        dBar.close();
    });

    it('Delete Diagnosis', () => {
        sheetsPage.clickDiagnosMenu().clickOption('Delete Diagnosis').waitLoader()
            .clickDiagnosMenu().clickOption('Delete Diagnosis').waitLoader().pause();
    });

    it('Notification about update Diagnosis', () => {
        expect(sheetsPage.notification.getText(), 'notification').to.have.string('successfully updated');
    });

    it('Absence of deleted diagnosis', () => {
        expect(sheetsPage.diagnosInfo.name[0], 'name').to.equal(test.diseases[0]);
    });

    it('View Checkup', () => {
        sheetsPage.clickDiagnosMenu().clickOption('View Checkup').waitLoader();

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

describe('Edit full checkup', () => {
    let date, invBefore, rslt;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0],
        diffInv = tdata.calcDiffMoves(test) - nOfDeaths;

    it('Choose random group', () => {
        admin.openPrefs().setOffMortReason();
        date = sheetsPage.chooseRandGroup().getRandDates();
        invBefore = +sheetsPage.inventoryCell(date[0]);
        tdata.toStringVal(test);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).waitLoader().createCheckup(test);
    });

    it('Moves changes', () => {
        sheetsPage.closeBtn.isExisting() && sheetsPage.close().waitLoader();
        rslt = sheetsPage.moveInfo;
        const heads = [].concat(rslt.added, rslt.removed);

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(heads, 'heads of moves').to.have.members(test.moves.heads);
    });

    it('Treats changes', () => {
        sheetsPage.section('Medic').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);
    });

    it('Sympts changes', () => {
        sheetsPage.section('Sympt').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);
    });

    it('Deaths changes', () => {
        sheetsPage.section('Dead').scrollIntoView({ block: 'center' });

        expect(sheetsPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Temps changes', () => {
        sheetsPage.section('Temps').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
    });

    it('Water changes', () => {
        sheetsPage.section('Water Usage').scrollIntoView({ block: 'center' });

        expect(sheetsPage.waterInfo.consumed, 'water consumed').to.equal(test.water.consumed);
    });

    it('Main comment changes', () => {
        expect(sheetsPage.mainComment, 'main comment').to.equal(test.comment);
    });

    it('Media changes', () => {
        sheetsPage.section('Media').scrollIntoView({ block: 'center' });

        expect(sheetsPage.nOfMedia, 'nOfMedia').to.equal('2');
    });

    it('Audio changes', () => {
        sheetsPage.section('Audio').scrollIntoView({ block: 'center' });

        expect(sheetsPage.nOfAudio, 'nOfAudio').to.equal('1');
    });

    it('Save changes', () => {
        sheetsPage.clickSave().waitLoader().clickSave().waitLoader();
    });

    it('Table changes(deaths)', () => {
        expect(sheetsPage.deathsCell(date[1]), 'deathsCell (after save)').to.equal(nOfDeaths + '');
    });

    it('Table changes(sympts)', () => {
        expect(sheetsPage.symptsCell(date[1]), 'symptsCell (after save)').to.equal(test.sympts.amount);
    });

    it('Table changes(treats)', () => {
        let treats = Math.max(...test.treats.heads) + '';

        expect(sheetsPage.treatsCell(date[1]), 'treatsCell (after save)').to.equal(treats);
    });

    it('Table changes(inventory)', () => {
        let inv = invBefore + diffInv + '';

        expect(sheetsPage.inventoryCell(date[1]), 'invCell (after save)').to.equal(inv);
    });
});

describe('Edit few checkups', () => {
    let date, diffInv = [0, 0, 0], invBefore, nOfDeaths = [0, 0, 0], inventory = [];
    const test = tdata.randArrayCheckups(3);

    test.forEach((el, i) => {
        nOfDeaths[i] = (+el.deaths.chronic[0]) + (+el.deaths.acute[0]) + (+el.deaths.euthanas[0]);
        diffInv[i] = tdata.calcDiffMoves(el) - nOfDeaths[i];
        inventory[i] = diffInv.reduce((accum, currVal) => accum + currVal, 0);
    });

    it('Choose random group', () => {
        date = sheetsPage.chooseRandGroup().getRandDates(3);
        invBefore = +sheetsPage.inventoryCell(date[0]);
        sheetsPage.choose(date[1]).waitLoader();
        tdata.toStringVal(test);
    });

    for (let i = 0, length = test.length - 1; i <= length; i++) {
        it((i + 1) + '-checkup', () => {
            sheetsPage.closeBtn.isExisting() && sheetsPage.close().waitLoader();
            (i === 0) || sheetsPage.rightButton.isExisting() && sheetsPage.clickRight();
            sheetsPage.waitLoader().createCheckup(test[i]);
        });
    }

    it('Save edits', () => {
        sheetsPage.closeBtn.isExisting() && sheetsPage.close().waitLoader();
        sheetsPage.clickSave().waitLoader();
    });

    for (let i = 0, length = test.length - 1; i <= length; i++) {
        it('Table changes(deaths), ' + (i + 1) + '-checkup', () => {
            expect(sheetsPage.deathsCell(date[i + 1]), 'deathsCell (after save)').to.equal(nOfDeaths[i] + '');
        });

        it('Table changes(sympts), ' + (i + 1) + '-checkup', () => {
            expect(sheetsPage.symptsCell(date[i + 1]), 'symptsCell (after save)').to.equal(test[i].sympts.amount);
        });

        it('Table changes(treats), ' + (i + 1) + '-checkup', () => {
            let treats = Math.max(...test[i].treats.heads) + '';

            expect(sheetsPage.treatsCell(date[i + 1]), 'treatsCell (after save)').to.equal(treats);
        });

        it('Table changes(inventory), ' + (i + 1) + '-checkup', () => {
            let inv = invBefore + inventory[i] + '';

            expect(sheetsPage.inventoryCell(date[i + 1]), 'invCell (after save)').to.equal(inv);
        });
    }

    for (let i = 0, length = test.length - 1; i <= length; i++) {
        it('Display changes ' + (i + 1) + '-checkup', () => {
            sheetsPage.choose(date[i + 1]).waitLoader();

            expect(sheetsPage.moveInfo.amount, 'amount of moves').to.equal(test[i].moves.amount);
        });

        it('Choose and Close section, ' + (i + 1) + '-checkup', () => {
            sheetsPage.chooseSection('Move').close().waitLoader();
        });

        it('Moves changes, ' + (i + 1) + '-checkup', () => {
            rslt = sheetsPage.moveInfo;
            const heads = [].concat(rslt.added, rslt.removed);

            expect(rslt.amount, 'amount of moves').to.equal(test[i].moves.amount);
            expect(heads, 'heads of moves').to.have.members(test[i].moves.heads);
        });

        it('Treats changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Medic').scrollIntoView({ block: 'center' });
            rslt = sheetsPage.treatInfo;

            expect(rslt.amount, 'amount of treats').to.equal(test[i].treats.amount);
            expect(rslt.name, 'name of treat').to.have.members(test[i].treats.name);
            expect(rslt.heads, 'heads of treats').to.have.members(test[i].treats.heads);
        });

        it('Sympts changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Sympt').scrollIntoView({ block: 'center' });
            rslt = sheetsPage.symptInfo;

            expect(rslt.amount, 'amount of symptoms').to.equal(test[i].sympts.amount);
            expect(rslt.name, 'name of symptoms').to.have.members(test[i].sympts.name);
        });

        it('Deaths changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Dead').scrollIntoView({ block: 'center' });

            expect(sheetsPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths[i] + '');
        });

        it('Temps changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Temps').scrollIntoView({ block: 'center' });
            rslt = sheetsPage.tempsInfo;

            expect(rslt.high, 'high temp').to.equal(test[i].temps.high);
            expect(rslt.low, 'low temp').to.equal(test[i].temps.low);
        });

        it('Water changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Water Usage').scrollIntoView({ block: 'center' });

            expect(sheetsPage.waterInfo.consumed, 'water consumed').to.equal(test[i].water.consumed);
        });

        it('Main comment changes, ' + (i + 1) + '-checkup', () => {
            expect(sheetsPage.mainComment, 'main comment').to.equal(test[i].comment);
        });

        it('Media changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Media').scrollIntoView({ block: 'center' });

            expect(sheetsPage.nOfMedia, 'nOfMedia').to.equal('2');
        });

        it('Audio changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Audio').scrollIntoView({ block: 'center' });

            expect(sheetsPage.nOfAudio, 'nOfAudio').to.equal('1');
        });

        it('Close, ' + (i + 1) + '-checkup', () => {
            sheetsPage.clickCloseDC().waitLoader();
        });
    }
});
