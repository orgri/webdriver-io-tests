const admin = require('../pageobjects/admin.page');
const sheetsPage = require('../pageobjects/barnsheets.page');

const farmName = 'TA_Farm_0000';
let groupName = 'TA_PigGroup_0000_0001';
let groupUrl = 'https://dev.everypig.com/barnsheets/groups/6859';

describe('Barnsheets Navigation', () => {

    before(function () {
        sheetsPage.open();
    });

    it('Search farm', () => {
        sheetsPage.setSearch(farmName).waitLoader();
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
        groupName = $$('*=TA_PigGroup')[tdata.rand(sheetsPage.tableRows.length - 2)].getText();
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

    before(function () {
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
    let idx = undefined;
    let date = undefined;
    const options = { month: 'short', day: 'numeric' }; //year: 'numeric', 
    let localDate = undefined;
    let invBefore = undefined;
    let weightBefore = undefined;
    let deaths = undefined;
    let totalMoved = 0;
    let test = tdata.randMovesData();
    const headMoves = test.heads[0] - test.heads[1];
    const corrected = test.heads[2] - test.heads[3] + test.heads[4];

    before(function () {
        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();
        localDate = new Date(date).toLocaleDateString("en-US", options);

        invBefore = +sheetsPage.inventoryCell(sheetsPage.checkupRows[idx + 1].getText());
        weightBefore = sheetsPage.weightCell(date);
        deaths = (sheetsPage.deathsCell(date) === '-') ? 0 : (+sheetsPage.deathsCell(date));
        totalMoved = (invBefore + headMoves + corrected - deaths) + '';
        tdata.toStringVal(test);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader().chooseSection('Move');
        movePage.setShipment(test.heads[0], test.weight, test.condition)
            .addRow().clickSelectParam().setTransfer(test.heads[1])
            .addRow().clickSelectParam().setFixAdding(test.heads[2])
            .addRow().clickSelectParam().setFixRemoving(test.heads[3])
            .addRow().clickSelectParam().setFixAdding(test.heads[4])
            .setComment(test.comment).submit();
        sheetsPage.waitLoader();
    });

    it('Moves changes(amount)', () => {
        expect(sheetsPage.moveInfo.amount, 'amount of moves').to.equal(test.amount);
    });
    it('Moves changes(added heads 0)', () => {
        expect(sheetsPage.moveInfo.added[0], 'added heads').to.equal(test.heads[0]);
    });
    it('Moves changes(weight)', () => {
        expect(sheetsPage.moveInfo.weight[0], 'weight').to.equal(test.weight + ' lbs');
    });
    it('Moves changes(condition)', () => {
        expect(sheetsPage.moveInfo.condition[0].toLowerCase(), 'condition').to.equal(test.condition);
    });
    it('Moves changes(removed heads 0)', () => {
        expect(sheetsPage.moveInfo.removed[0], 'removed heads').to.equal(test.heads[1]);
    });
    it('Moves changes(added heads 1)', () => {
        expect(sheetsPage.moveInfo.added[1], 'added heads').to.equal(test.heads[2]);
    });
    it('Moves changes(removed heads 1)', () => {
        expect(sheetsPage.moveInfo.removed[1], 'removed heads').to.equal(test.heads[3]);
    });
    it('Moves changes(added heads 2)', () => {
        expect(sheetsPage.moveInfo.added[2], 'added heads').to.equal(test.heads[4]);
    });
    it('Moves changes(comment)', () => {
        expect(sheetsPage.moveInfo.comment, 'commment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(pigs in)', () => {
        expect(sheetsPage.pigsinCell(date), 'pigs in (before save)').to.equal(test.heads[0]);
    });
    it('Table changes(pigs out)', () => {
        expect(sheetsPage.pigsoutCell(date), 'pigs out (before save)').to.equal(test.heads[1]);
    });
    it('Table changes(correct)', () => {
        expect(sheetsPage.correctCell(date), 'correct (before save)').to.equal(corrected + '');
    });
    it('Table changes(inventory)', () => {
        expect(sheetsPage.inventoryCell(date), 'inventory (before save)').to.equal(totalMoved);
    });
    it('Table changes(weight)', () => {
        expect(sheetsPage.weightCell(date), 'weight (before save)').to.not.equal(weightBefore);
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(pigs in)', () => {
        expect(sheetsPage.pigsinCell(date), 'pigs in (after save)').to.equal(test.heads[0]);
    });
    it('Table changes(pigs out)', () => {
        expect(sheetsPage.pigsoutCell(date), 'pigs out (after save)').to.equal(test.heads[1]);
    });
    it('Table changes(correct)', () => {
        expect(sheetsPage.correctCell(date), 'correct (after save)').to.equal(corrected + '');
    });
    it('Table changes(inventory)', () => {
        expect(sheetsPage.inventoryCell(date), 'inventory (after save)').to.equal(totalMoved);
    });
    it('Table changes(weight)', () => {
        expect(sheetsPage.weightCell(date), 'weight (after save)').to.not.equal(weightBefore);
    });
    it('Pig movements Tab', () => {
        sheetsPage.clickMovesTab().waitLoader();
        expect(sheetsPage.moveTabInfo(localDate).amount, 'amount of moves').to.equal('2');
    });

    it('Shipment (heads)', () => {
        expect(sheetsPage.moveTabInfo(localDate).heads[1], 'added heads').to.equal(test.heads[0]);
    });

    it('Shipment (weight)', () => {
        expect(sheetsPage.moveTabInfo(localDate).weight[1], 'weight').to.equal(test.weight);
    });
    it('Shipment (condition)', () => {
        expect(sheetsPage.moveTabInfo(localDate).condition[1].toLowerCase(), 'condition').to.equal(test.condition);
    });

    it('Transferred heads', () => {
        expect(sheetsPage.moveTabInfo(localDate).heads[0], 'removed heads').to.equal(test.heads[1]);
    });
});

describe('Edit Deaths', () => {
    const deathPage = require('../pageobjects/deaths.page');

    let idx = undefined;
    let date = undefined;
    let invBefore = undefined;
    let mrBefore = undefined;
    let test = tdata.randDeathsData();

    before(function () {
        admin.openPrefs().setOnMortReason();

        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();

        invBefore = +sheetsPage.inventoryCell(sheetsPage.checkupRows[idx + 1].getText());
        weightBefore = sheetsPage.weightCell(date);
        mrBefore = sheetsPage.mrCell(date);
        tdata.toStringVal(test);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader().chooseSection('Dead');
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
        expect(sheetsPage.deathInfo.amount, 'amount of deaths').to.equal(test.amount)
    });

    for (let i = 0, length = test.reasons.length; i < length; i++) {
        it('Deaths changes(reason ' + i + ')', () => {
            expect(sheetsPage.deathInfo.reason[i], 'reason').to.equal(test.reasons[i]);
        });
        it('Deaths changes(chronic ' + i + ')', () => {
            expect(sheetsPage.deathInfo.chronic[i], 'chronic').to.equal(test.chronic[i]);
        });
        it('Deaths changes(acute ' + i + ')', () => {
            expect(sheetsPage.deathInfo.acute[i], 'acute').to.equal(test.acute[i]);
        });
        it('Deaths changes(euthanas ' + i + ')', () => {
            expect(sheetsPage.deathInfo.ethanas[i], 'euthanas').to.equal(test.euthanas[i]);
        });
    }
    it('Deaths changes(comment)', () => {
        expect(sheetsPage.deathInfo.comment, 'comment deaths').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });
    it('Table changes(deaths)', () => {
        expect(sheetsPage.deathsCell(date), 'deathsCell (before save)').to.equal(test.amount);
    });
    it('Table changes(inventory)', () => {
        let inv = invBefore - (+test.amount) + '';
        expect(sheetsPage.inventoryCell(date), 'inventory (before save)').to.equal(inv);
    });
    it('Table changes(mr)', () => {
        expect(sheetsPage.mrCell(date), 'mr (before save)').to.not.equal(mrBefore);
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });
    it('Table changes(deaths)', () => {
        expect(sheetsPage.deathsCell(date), 'deathsCell (after save)').to.equal(test.amount);
    });
    it('Table changes(inventory)', () => {
        let inv = invBefore - (+test.amount) + '';
        expect(sheetsPage.inventoryCell(date), 'inventory (after save)').to.equal(inv);
    });
    it('Table changes(mr)', () => {
        expect(sheetsPage.mrCell(date), 'mr (after save)').to.not.equal(mrBefore);
    });

});

describe('Edit Treats', () => {
    const treatPage = require('../pageobjects/medications.page');

    let idx = undefined;
    let date = undefined;
    let treatsBefore = undefined;
    const test = tdata.randTreatsData();

    before(function () {
        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();

        treatsBefore = +sheetsPage.inventoryCell(date);
        tdata.toStringVal(test);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader().chooseSection('Medication');
        treatPage.setWithCcsDosage(test.treats[0], test.heads[0], test.dosage[0])
            .addRow().setWithGalsDosage(test.treats[1], test.heads[1], test.dosage[1], test.gals)
            .addRow().setWithMlsDosage(test.treats[2], test.heads[2], test.dosage[2])
            .addRow().setWithoutDosage(test.treats[3], test.heads[3]).setTotal(test.total)
            .setComment(test.comment).submit();
        sheetsPage.waitLoader();
    });

    it('Treats changes(amount)', () => {
        sheetsPage.section('Medic').scrollIntoView({ block: 'center' });
        expect(sheetsPage.treatInfo.amount, 'amount of treats').to.equal(test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('Treats changes(name ' + i + ')', () => {
            expect(sheetsPage.treatInfo.name[i], 'name of treat').to.equal(test.treats[i]);
        });
        it('Treats changes(heads ' + i + ')', () => {
            expect(sheetsPage.treatInfo.heads[i], 'heads').to.equal(test.heads[i]);
        });
        if (i < 3) {
            it('Treats changes(dosage ' + i + ')', () => {
                expect(sheetsPage.treatInfo.dosage[i], 'dosage of treat').to.equal(test.dosage[i]);
            });
        }
    }

    it('Treats changes(gals)', () => {
        expect(sheetsPage.treatInfo.gals[0], 'gals').to.equal(test.gals);
    });

    it('Treats changes(comment)', () => {
        expect(sheetsPage.treatInfo.comment, 'comment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(total treats)', () => {
        expect(sheetsPage.treatsCell(date), 'treatsCell (before save)').to.equal(test.total);
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });
    it('Table changes(total treats)', () => {
        expect(sheetsPage.treatsCell(date), 'treatsCell (after save)').to.equal(test.total);
    });

    it('Treatments tab', () => {
        sheetsPage.clickTreatsTab().waitLoader();
    });

    it('Set pagination', () => {
        sheetsPage.setElemsOnPage(10).waitLoader();
        expect(sheetsPage.tableRows, 'length').to.have.lengthOf(11);
        sheetsPage.setElemsOnPage(100).waitLoader();
        expect(sheetsPage.tableRows, 'length').to.have.lengthOf.above(10);
    });

    it('Treatments Tab (amount)', () => {
        test.dosage.push('-'); // need for next testcases
        expect(sheetsPage.tableItemsWith(date), 'amount of treats').to.have.lengthOf(+test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('Treatments Tab Table(name ' + i + ')', () => {
            expect(sheetsPage.cell(date, 0, i).getText(), 'name of treat').to.be.oneOf(test.treats);
        });
        it('Treatments Tab Table(heads ' + i + ')', () => {
            expect(sheetsPage.cell(date, 3, i).getText(), 'heads').to.be.oneOf(test.heads);
        });
        it('Treatments Tab Table(dosage ' + i + ')', () => {
            let dosage = sheetsPage.cell(date, 2, i).getText().match(/[\d\.-]+/u)[0];
            expect(dosage, 'dosage of treat').to.be.oneOf(test.dosage);
        });
    }

});

describe('Edit Symptoms', () => {
    const symptomPage = require('../pageobjects/symptoms.page');

    let idx = undefined;
    let date = undefined;
    let symptBefore = undefined;
    const test = tdata.randSymptData();

    before(function () {
        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();

        symptBefore = +sheetsPage.inventoryCell(date);
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader().chooseSection('Symptom');
        symptomPage.setSymptom(test.sympt[0])
            .addRow().setSymptom(test.sympt[1])
            .addRow().setSymptom(test.sympt[2])
            .addRow().setSymptom(test.sympt[3])
            .setComment(test.comment).submit();
        sheetsPage.waitLoader();
    });

    it('Sympt changes(amount)', () => {
        sheetsPage.section('Sympt').scrollIntoView({ block: 'center' });
        expect(sheetsPage.symptInfo.amount, 'amount of symptoms').to.equal(test.amount + '');
    });
    for (let i = 0; i < test.amount; i++) {
        it('Sympt changes(name ' + i + ')', () => {
            expect(sheetsPage.symptInfo.name[i], 'name of symptoms i').to.equal(test.sympt[i]);
        });
    }
    it('Sympt changes(comment)', () => {
        expect(sheetsPage.symptInfo.comment, 'comment').to.equal(test.comment);
    });

    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(total symptoms)', () => {
        expect(sheetsPage.symptsCell(date), 'symptsCell (before save)').to.equal(test.amount + '');
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });
    it('Table changes(total symptoms)', () => {
        expect(sheetsPage.symptsCell(date), 'symptsCell (before save)').to.equal(test.amount + '');
    });

});

describe('Edit Temps', () => {
    const tempsPage = require('../pageobjects/temps.page');

    let idx = undefined;
    let date = undefined;
    const high = tdata.randHighTemp;
    const low = tdata.randLowTemp;
    const comment = tdata.randComment;

    before(function () {
        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader().chooseSection('Temps');

        tempsPage.setTemps(high + '', low + '').setComment(comment).submit();
        sheetsPage.waitLoader();
    });

    it('Temps changes(high temp)', () => {
        sheetsPage.section('Temps').scrollIntoView({ block: 'center' });
        expect(sheetsPage.tempsInfo.high, 'high temp').to.equal(high + '');
    });
    it('Temps changes(low temp)', () => {
        expect(sheetsPage.tempsInfo.low, 'low temp').to.equal(low + '');
    });
    it('Temps changes(comment)', () => {
        expect(sheetsPage.tempsInfo.comment, 'comment temp').to.equal(comment);
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

    let idx = undefined;
    let date = undefined;
    const consumed = tdata.randWater;
    const comment = tdata.randComment;

    before(function () {
        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader().chooseSection('Water Usage');
        waterPage.setGals(consumed + '').setComment(comment).submit();
        sheetsPage.waitLoader();
    });

    it('Water changes(consumed)', () => {
        sheetsPage.section('Water Usage').scrollIntoView({ block: 'center' });
        expect(sheetsPage.waterInfo.consumed, 'water consumed').to.equal(consumed + '');
    });
    it('Water changes(comment)', () => {
        expect(sheetsPage.waterInfo.comment, 'comment water').to.equal(comment);
    });
    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });

});

describe('Edit Media', () => {
    let idx = undefined;
    let date = undefined;
    const photo = tdata.randPhoto;

    before(function () {
        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader().chooseSection('Media').waitLoader()
            .uploadMedia(photo)
            .uploadMedia(tdata.randVideo)
            .uploadMedia(tdata.randAudio)
            .submit().waitLoader();
    });
    it('Media changes(nOfAudio)', () => {
        sheetsPage.section('Media').scrollIntoView({ block: 'center' });

        expect(sheetsPage.nOfAudio, 'nOfAudio').to.equal('1');
    });
    it('Media changes(nOfMedia)', () => {
        expect(sheetsPage.nOfMedia, 'nOfMedia').to.equal('2');
    });
    it('Save and review', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(media label)', () => {
        expect(sheetsPage.mediaLabel(date), 'mediaLabel (before save)').to.equal('Media');
    });

    it('Save edits', () => {
        sheetsPage.clickSave().waitLoader();
    });

    it('Table changes(media label)', () => {
        expect(sheetsPage.mediaLabel(date), 'mediaLabel (after save)').to.equal('Media');
    });

    it('Media tab', () => {
        sheetsPage.clickMediaTab().waitLoader();
    });

    it('Open image', () => {
        sheetsPage.clickOnImg(photo);
        expect(sheetsPage.mediaViewer.isDisplayed(), 'mediaViewer').to.equal(true);
    });

    it('Scale minus image', () => {
        sheetsPage.clickScaleMinus();
        expect(+sheetsPage.scale.getText().slice(0,-1), 'scale percent').to.be.below(100);
    });

    it('Scale original image', () => {
        sheetsPage.clickScaleOrig();
        expect(+sheetsPage.scale.getText().slice(0,-1), 'scale percent').to.equal(100);
    });

    it('Scale plus image', () => {
        sheetsPage.clickScalePlus();
        expect(+sheetsPage.scale.getText().slice(0,-1), 'scale percent').to.be.above(100);
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

    let idx = undefined;
    let date = undefined;
    const test = tdata.randDiagnosData();

    before(function () {
        sheetsPage.open(groupUrl).waitForOpen();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();
    });

    it('Make changes to checkup', () => {
        sheetsPage.clickMenuCell(date).waitLoader().clickOption('Edit Diagnosis').waitLoader();

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
    });

    for (let i = 0, length = test.diseases.length - 1; i <= length; i++) {
        //const dInfo = sheetsPage.diagnosInfo;
        it('Diagnosis tab (diseases ' + i + ')', () => {
            expect(sheetsPage.diagnosInfo.name[length - i], 'name').to.equal(test.diseases[i]);
        });
        it('Diagnosis tab (type ' + i + ')', () => {
            expect(sheetsPage.diagnosInfo.type[length - i], 'type').to.equal(test.types[i]);
        });
        it('Diagnosis tab (comment ' + i + ')', () => {
            expect(sheetsPage.diagnosInfo.comment[length - i], 'comment').to.equal(test.comments[i]);
        });
    }

    it('Open Diagnosis edit', () => {
        sheetsPage.clickDiagnosMenu().clickOption('Edit Diagnosis').waitLoader();
    });

    it('Collapse diagnosis info', () => {
        dBar.clickGroupInfoTab().clickDiagnosInfoCol();
    });

    it('Changes (amount)', () => {
        expect(dBar.info.amount, 'amount').to.equal(test.amount + '');
    });

    for (let i = 0, length = test.diseases.length; i < length; i++) {
        it('Changes (diseases ' + i + ')', () => {
            expect(dBar.info.name[i], 'name').to.equal(test.diseases[i]);
        });
        it('Changes (type ' + i + ')', () => {
            expect(dBar.info.type[i], 'type').to.equal(test.types[i]);
        });
        it('Changes (comment ' + i + ')', () => {
            expect(dBar.info.comment[i], 'comment').to.equal(test.comments[i]);
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
    });

    it('View (diseases 0)', () => {
        expect(sheetsPage.diagnosInfo.name[0], 'name').to.equal(test.diseases[0]);
    });
    it('View (type 0)', () => {
        expect(sheetsPage.diagnosInfo.type[0], 'type').to.equal(test.types[0]);
    });
    it('View (comment 0)', () => {
        expect(sheetsPage.diagnosInfo.comment[0], 'comment').to.equal(test.comments[0]);
    });

});

describe('Edit full checkup', () => {
    let idx = undefined;
    let date = undefined;
    let invBefore = undefined;
    const test = tdata.randCheckupData;
    const nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0];
    const diffInv = tdata.calcDiffMoves(test) - nOfDeaths;

    tdata.toStringVal(test);

    before(function () {
        admin.openPrefs().setOffMortReason();

        sheetsPage.clickBarnSheets().waitForOpen().clickFarmsTab()
            .setSearch(farmName).waitLoader().choose(farmName)
            .setElemsOnPage(50).waitLoader();

        let groupName = $$('*=TA_PigGroup')[tdata.rand(sheetsPage.tableRows.length - 2)].getText();
        sheetsPage.choose(groupName).waitLoader();
        groupUrl = browser.getUrl();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 1) ? idx + 1 : idx;
        date = sheetsPage.checkupRows[idx].getText();

        invBefore = +sheetsPage.inventoryCell(sheetsPage.checkupRows[idx + 1].getText());
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date).waitLoader();

        checkupID = browser.getUrl().match(/([0-9]+)/)[0];

        sheetsPage.createCheckup(test);
    });

    it('Moves changes', () => {
        sheetsPage.closeBtn.isExisting() && sheetsPage.close().waitLoader();

        expect(sheetsPage.moveInfo.amount, 'amount of moves').to.equal(test.moves.amount);
        const heads = [].concat(sheetsPage.moveInfo.added, sheetsPage.moveInfo.removed);
        expect(heads, 'heads of moves').to.have.members(test.moves.heads);
    });

    it('Treats changes', () => {
        sheetsPage.section('Medic').scrollIntoView({ block: 'center' });
        expect(sheetsPage.treatInfo.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(sheetsPage.treatInfo.name, 'name of treat').to.have.members(test.treats.name);
        expect(sheetsPage.treatInfo.heads, 'heads of treats').to.have.members(test.treats.heads);
    });

    it('Sympts changes', () => {
        sheetsPage.section('Sympt').scrollIntoView({ block: 'center' });
        expect(sheetsPage.symptInfo.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(sheetsPage.symptInfo.name, 'name of symptoms').to.have.members(test.sympts.name);
    });

    it('Deaths changes', () => {
        sheetsPage.section('Dead').scrollIntoView({ block: 'center' });
        expect(sheetsPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');
    });

    it('Temps changes', () => {
        sheetsPage.section('Temps').scrollIntoView({ block: 'center' });
        expect(sheetsPage.tempsInfo.high, 'high temp').to.equal(test.temps.high);
        expect(sheetsPage.tempsInfo.low, 'low temp').to.equal(test.temps.low);
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
        sheetsPage.clickSave().waitLoader()
            .clickSave().waitLoader();
    });

    it('Table changes(deaths)', () => {
        expect(sheetsPage.deathsCell(date), 'deathsCell (after save)').to.equal(nOfDeaths + '');
    });

    it('Table changes(sympts)', () => {
        expect(sheetsPage.symptsCell(date), 'symptsCell (after save)').to.equal(test.sympts.amount);
    });

    it('Table changes(treats)', () => {
        let treats = Math.max(...test.treats.heads) + '';
        expect(sheetsPage.treatsCell(date), 'treatsCell (after save)').to.equal(treats);
    });

    it('Table changes(inventory)', () => {
        let inv = invBefore + diffInv + '';
        expect(sheetsPage.inventoryCell(date), 'invCell (after save)').to.equal(inv);
    });
});

describe('Edit few checkups', () => {
    let idx = undefined;
    const test = tdata.randArrayCheckups(3);
    let date = [];
    let diffInv = [0, 0, 0];
    let invBefore = undefined;
    let nOfDeaths = [0, 0, 0];
    let inventory = [];

    test.forEach((el, i) => {
        nOfDeaths[i] = (+el.deaths.chronic[0]) + (+el.deaths.acute[0]) + (+el.deaths.euthanas[0]);
        diffInv[i] = tdata.calcDiffMoves(el) - nOfDeaths[i];
        inventory[i] = diffInv.reduce((accum, currVal) => accum + currVal, 0);
    });

    tdata.toStringVal(test);

    before(function () {
        sheetsPage.clickBarnSheets().waitForOpen().clickFarmsTab()
            .setSearch(farmName).waitLoader().choose(farmName)
            .setElemsOnPage(50).waitLoader();

        let groupName = $$('*=TA_PigGroup')[tdata.rand(sheetsPage.tableRows.length - 2)].getText();
        sheetsPage.choose(groupName).waitLoader();
        groupUrl = browser.getUrl();

        idx = tdata.rand(sheetsPage.tableRows.length - 3);
        idx = (idx < 3) ? idx + 3 : idx;
        for (i = 0; i < 3; i++) {
            date.push(sheetsPage.checkupRows[idx - i].getText());
        }
        invBefore = +sheetsPage.inventoryCell(sheetsPage.checkupRows[idx + 1].getText());
        sheetsPage.choose(date[0]).waitLoader();
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
            expect(sheetsPage.deathsCell(date[i]), 'deathsCell (after save)').to.equal(nOfDeaths[i] + '');
        });

        it('Table changes(sympts), ' + (i + 1) + '-checkup', () => {
            expect(sheetsPage.symptsCell(date[i]), 'symptsCell (after save)').to.equal(test[i].sympts.amount);
        });

        it('Table changes(treats), ' + (i + 1) + '-checkup', () => {
            let treats = Math.max(...test[i].treats.heads) + '';
            expect(sheetsPage.treatsCell(date[i]), 'treatsCell (after save)').to.equal(treats);
        });

        it('Table changes(inventory), ' + (i + 1) + '-checkup', () => {
            let inv = invBefore + inventory[i] + '';
            expect(sheetsPage.inventoryCell(date[i]), 'invCell (after save)').to.equal(inv);
        });
    }

    for (let i = 0, length = test.length - 1; i <= length; i++) {
        it('Display changes ' + (i + 1) + '-checkup', () => {
            sheetsPage.choose(date[i]).waitLoader();

            expect(sheetsPage.moveInfo.amount, 'amount of moves').to.equal(test[i].moves.amount);
        });

        it('Choose and Close section, ' + (i + 1) + '-checkup', () => {
            sheetsPage.chooseSection('Move').close().waitLoader();
        });

        it('Moves changes, ' + (i + 1) + '-checkup', () => {
            expect(sheetsPage.moveInfo.amount, 'amount of moves').to.equal(test[i].moves.amount);
            const heads = [].concat(sheetsPage.moveInfo.added, sheetsPage.moveInfo.removed);
            expect(heads, 'heads of moves').to.have.members(test[i].moves.heads);
        });

        it('Treats changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Medic').scrollIntoView({ block: 'center' });
            expect(sheetsPage.treatInfo.amount, 'amount of treats').to.equal(test[i].treats.amount);
            expect(sheetsPage.treatInfo.name, 'name of treat').to.have.members(test[i].treats.name);
            expect(sheetsPage.treatInfo.heads, 'heads of treats').to.have.members(test[i].treats.heads);
        });

        it('Sympts changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Sympt').scrollIntoView({ block: 'center' });
            expect(sheetsPage.symptInfo.amount, 'amount of symptoms').to.equal(test[i].sympts.amount);
            expect(sheetsPage.symptInfo.name, 'name of symptoms').to.have.members(test[i].sympts.name);
        });

        it('Deaths changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Dead').scrollIntoView({ block: 'center' });
            expect(sheetsPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths[i] + '');
        });

        it('Temps changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Temps').scrollIntoView({ block: 'center' });
            expect(sheetsPage.tempsInfo.high, 'high temp').to.equal(test[i].temps.high);
            expect(sheetsPage.tempsInfo.low, 'low temp').to.equal(test[i].temps.low);
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
