const admin = require('../pageobjects/admin.page');
const sheetsPage = require('../pageobjects/barnsheets.page');

describe('Barnsheets Navigation', () => {
    const farmName = 'TA_Farm_0000';
    const groupName = 'TA_PigGroup_0000_0001';

    it('Open', () => {
        sheetsPage.open();

        expect($(sheetsPage.tableRow).isExisting(), 'table-row').to.equal(true);
    });

    it('Search special chars (groups)', () => {
        //just check whether page crashes or not, need to clarify expected behaviour
        sheetsPage.setSearch('&').setSearch('%').setSearch('#').setSearch('\\')
            .setSearch('/').setSearch('\"').setSearch('$').setSearch('?')
            .setSearch('^').setSearch('|').setSearch(':').setSearch('*');

        expect($('.BarnsheetsHome').isExisting(), 'is barnsheets exist').to.equal(true);
    });

    it('Search farm', () => {
        sheetsPage.setSearch(farmName);

        expect(sheetsPage.tableItemsWith(farmName), 'tableItemsWith(farmName) length')
            .to.have.lengthOf(sheetsPage.tableRows.length - 1);
    });

    it('Choose farm', () => {
        sheetsPage.clickCell(farmName, 'a span');

        expect(sheetsPage.farmName.getText(), 'farmName').to.equal(farmName);
    });

    it('Set pagination', () => {
        sheetsPage.setElemsOnPage(10);

        expect(sheetsPage.tableRows, 'table rows').to.have.lengthOf(11);

        sheetsPage.setElemsOnPage(100);

        expect(sheetsPage.tableRows, 'table rows').to.have.lengthOf.above(10);
    });

    it('Search special chars (farms)', () => {
        //just check whether page crashes or not, need to clarify expected behaviour
        sheetsPage.setSearch('&').setSearch('%').setSearch('#').setSearch('\\')
            .setSearch('/').setSearch('\"').setSearch('$').setSearch('?')
            .setSearch('^').setSearch('|').setSearch(':').setSearch('*');

        expect($('.BarnsheetsFarmGroups').isExisting(), 'is barnsheets farm exist').to.equal(true);
    });

    it('Search group', () => {
        sheetsPage.setSearch(groupName);

        expect(sheetsPage.tableItemsWith(groupName), 'tableItemsWith(groupName) length')
            .to.have.lengthOf(sheetsPage.tableRows.length - 1);
    });

    it('Choose group', () => {
        sheetsPage.choose(groupName);
        groupUrl = browser.getUrl();

        expect(sheetsPage.groupName.getText(), 'groupName').to.equal(groupName);
    });

    it('Treatments tab', () => {
        sheetsPage.clickSubTab('Treatments');

        expect(sheetsPage.chart.isExisting(), 'isChart').to.equal(true);
    });

    it('Diagnosis tab', () => {
        sheetsPage.clickSubTab('Diagnosis History');

        expect(browser.getUrl(), 'diagnosis tab url')
            .to.match(/(\/barnsheets\/groups\/)([0-9]+)(\/diagnoses)$/);
    });

    it('Pig movements tab', () => {
        sheetsPage.clickSubTab('Pig Movements');

        expect($('.UserPanel').isExisting(), 'is UserPanel').to.equal(true);
    });

    it('Media tab', () => {
        sheetsPage.clickSubTab('Media');

        expect(browser.getUrl(), 'media tab url')
            .to.match(/(\/barnsheets\/groups\/)([0-9]+)(\/media)$/);
    });

    it('Daily Checkups tab', () => {
        sheetsPage.clickSubTab('Daily Checkups');

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

});

describe('Barnsheets Tabs and Sorting', () => {

    it('Open', () => {
        sheetsPage.clickSidebar('Barn Sheets');

        expect(browser.getUrl(), 'barnsheet url').to.match(/(\/barnsheets\/groups)$/);
    });

    it('Farms tab', () => {
        sheetsPage.clickSubTab('Farms');

        expect(sheetsPage.tableColumns, 'tableColumns number').to.have.lengthOf(8);
    });

/*******************************************************************************
Check correctness of data filtering and sorting by end-to-end tests
is costly in time, thats why is checked only UI activity changes.
These fuctionality must be checked by Unit tests.
*******************************************************************************/

    it('Filter by Disabled', () => {
        sheetsPage.clickFilterBy('Disabled');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('Disabled');
    });

    it('Filter by Active', () => {
        sheetsPage.clickFilterBy('Active');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('Active');
    });

    it('Filter by All Farms', () => {
        sheetsPage.clickFilterBy('All Farms');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('All Farms');
    });

    it('Sort by farm type', () => {
        sheetsPage.clickSortBy('Type');

        expect(sheetsPage.cell(0, 1, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Open Groups', () => {
        sheetsPage.clickSortBy('Open Groups');

        expect(sheetsPage.cell(0, 2, 1).getAttribute('class'), 
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Inventory', () => {
        sheetsPage.clickSortBy('Inventory');

        expect(sheetsPage.cell(0, 3, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Compliance', () => {
        sheetsPage.clickSortBy('Compliance');

        expect(sheetsPage.cell(0, 6, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Mort. Rate', () => {
        sheetsPage.clickSortBy('Mort. Rate');

        expect(sheetsPage.cell(0, 4, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by farm', () => {
        sheetsPage.clickSortBy('Farm');

        expect(sheetsPage.cell(0, 0, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Set pagination', () => {
        sheetsPage.setElemsOnPage(100);

        expect(sheetsPage.tableRows, 'length').to.have.lengthOf(101);
    });

    it('Next page', () => {
        sheetsPage.clickNextPage();

        expect(sheetsPage.tableRows, 'length').to.have.lengthOf.below(101);
    });

    it('Previous page', () => {
        sheetsPage.clickPrevPage();

        expect(sheetsPage.tableRows, 'length').to.have.lengthOf(101);
    });

    it('Groups tab', () => {
        sheetsPage.clickSidebar('Barn Sheets').clickSubTab('Groups');

        expect(sheetsPage.tableColumns, 'tableColumns number').to.have.lengthOf(12);
    });

    it('Filter by Closed', () => {
        sheetsPage.clickFilterBy('Closed');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('Closed');
    });

    it('Filter by Open', () => {
        sheetsPage.clickFilterBy('Open');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('Open');
    });

    it('Filter by All Groups', () => {
        sheetsPage.clickFilterBy('All Groups');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('All Groups');
    });

    it('Sort by farm type(groups tab)', () => {
        sheetsPage.clickSortBy('Type');

        expect(sheetsPage.cell(0, 2, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Group ID(groups tab)', () => {
        sheetsPage.clickSortBy('Group');

        expect(sheetsPage.cell(0, 0, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Inventory(groups tab)', () => {
        sheetsPage.clickSortBy('Inventory');

        expect(sheetsPage.cell(0, 5, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by farm(groups tab)', () => {
        sheetsPage.clickSortBy('Farm');

        expect(sheetsPage.cell(0, 1, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Start Date(groups tab)', () => {
        sheetsPage.clickSortBy('Start');

        expect(sheetsPage.cell(0, 3, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Pigs In(groups tab)', () => {
        sheetsPage.clickSortBy('Pigs In');

        expect(sheetsPage.cell(0, 4, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Mort. Rate(groups tab)', () => {
        sheetsPage.clickSortBy('Mort. Rate');

        expect(sheetsPage.cell(0, 6, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Est. Avg. Wt(groups tab)', () => {
        sheetsPage.clickSortBy('Est. Avg.');

        expect(sheetsPage.cell(0, 7, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Compliance(groups tab)', () => {
        sheetsPage.clickSortBy('Compliance');

        expect(sheetsPage.cell(0, 9, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Status(groups tab)', () => {
        sheetsPage.clickSortBy('Status');

        expect(sheetsPage.cell(0, 10, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Companies tab', () => {
        sheetsPage.clickSubTab('Companies');

        expect(browser.getUrl(), 'companies tab url')
            .to.match(/(\/barnsheets\/companies)$/);
    });

    it('Filter by Active', () => {
        sheetsPage.clickFilterBy('Active');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('Active');
    });

    it('Filter by Incomplete', () => {
        sheetsPage.clickFilterBy('Incomplete');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('Incomplete');
    });

    it('Filter by All Companies', () => {
        sheetsPage.clickFilterBy('All Companies');

        expect(sheetsPage.filterWrapper.$('div[class*=active]').getText(),
            'active filter tab').to.have.string('All Companies');
    });

    it('Sort by farms(companies tab)', () => {
        sheetsPage.clickSortBy('Farms');

        expect(sheetsPage.cell(0, 1, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Open Groups(companies tab)', () => {
        sheetsPage.clickSortBy('Open Groups');

        expect(sheetsPage.cell(0, 2, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Inventory(companies tab)', () => {
        sheetsPage.clickSortBy('Inventory');

        expect(sheetsPage.cell(0, 3, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Compliance(companies tab)', () => {
        sheetsPage.clickSortBy('Compliance');

        expect(sheetsPage.cell(0, 6, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by Mort. Rate(companies tab)', () => {
        sheetsPage.clickSortBy('Mort. Rate');

        expect(sheetsPage.cell(0, 4, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Sort by company(companies tab)', () => {
        sheetsPage.clickSortBy('Company');

        expect(sheetsPage.cell(0, 0, 1).getAttribute('class'),
            'attribute class=sorted' ).to.match(/sorted$/);
    });

    it('Choose company', () => {
        sheetsPage.clickCell('TA_Tenant', '<a>');

        expect(sheetsPage.companyName.getText(), 'tenant name').to.equal('TA_Tenant');
    });
});

describe('Download', () => {
    let groupName;
    it('Choose random group', () => {
        sheetsPage.chooseRandGroup();
        groupName = sheetsPage.groupName.getText();

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Daily Checkup Data', () => {
        const href = sheetsPage.cell('', 0, 1).$('.color-primary a')
            .getAttribute('href').match(/[0-9]+/u)[0],
            file = 'daily-checkup-' + href + '.csv';

        sheetsPage.clickMenuCell('', 1).clickOption('Download Data')
            .checkFileExists(file, 30000);
    });

    it('Barn Sheet Data', () => {
        const file = 'barnsheets-' + groupName + '.csv';
        sheetsPage.clickTopTab('TA_Farm_').clickMenuCell(groupName)
            .clickOption('Download Barn Sheet')
            .checkFileExists(file, 30000);
    });

    it('Mortality Data', () => {
        const file = 'mortality-report-' + groupName + '.csv';
        sheetsPage.clickMenuCell(groupName)
            .clickOption('Download Mortality Data')
            .checkFileExists(file, 30000);
    });

    it('Treatment Data', () => {
        const file = 'treatments-' + groupName + '.csv';
        sheetsPage.clickMenuCell(groupName)
            .clickOption('Download Treatment Data')
            .checkFileExists(file, 30000);
    });

    it('Symptom Data', () => {
        const file = 'symptoms-' + groupName + '.csv';
        sheetsPage.clickMenuCell(groupName)
            .clickOption('Download Symptom Data')
            .checkFileExists(file, 30000);
    });

    it('Movement Data', () => {
        const file = 'pig-migrations-' + groupName + '.csv';
        sheetsPage.clickMenuCell(groupName)
            .clickOption('Download Movement Data')
            .checkFileExists(file, 30000);
    });

});

describe('Edit full checkup', () => {
    let date, invBefore, rslt;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0],
        diffInv = tdata.calcDiffMoves(test) - nOfDeaths;

    it('Choose random group', () => {
        admin.openPrefs().setOff('Track Mortality Reasons');
        date = sheetsPage.chooseRandGroup().getRandDates();
        invBefore = +sheetsPage.inventoryCell(date[0]);
        tdata.toStringVal(test);

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Make changes to checkup', () => {
        sheetsPage.choose(date[1]).createCheckup(test);

        expect(browser.getUrl(), 'barnsheet url')
            .to.match(/(\/barnsheets\/daily-checkup\/)([\d]+)/);
    });

    it('Moves changes', () => {
        sheetsPage.closeBtn.isExisting() && sheetsPage.close();
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
        rslt = sheetsPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('2');
    });

    it('Audio changes', () => {
        sheetsPage.section('Audio').scrollIntoView({ block: 'center' });
        rslt = sheetsPage.audioInfo;

        expect(rslt.amount, 'nOfAudio').to.equal('1');
    });

    it('Save changes', () => {
        sheetsPage.clickSave().clickSave();
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
        tdata.toStringVal(test);

        expect(sheetsPage.tableHeader.getText(), 'table header')
            .to.equal('Daily Checkups');
    });

    it('Choose checkup', () => {
        sheetsPage.choose(date[1]);

        expect(sheetsPage.section('Move').isExisting(), 'isSection(Move)').to.equal(true);
    });

    for (let i = 0, length = test.length - 1; i <= length; i++) {
        it((i + 1) + '-checkup', () => {
            sheetsPage.closeBtn.isExisting() && sheetsPage.close();
            (i === 0) || sheetsPage.rightButton.isExisting() && sheetsPage.clickRight();
            sheetsPage.createCheckup(test[i]);

            expect(browser.getUrl(), 'barnsheet url')
                .to.match(/(\/barnsheets\/daily-checkup\/)([\d]+)/);
        });
    }

    it('Save edits', () => {
        sheetsPage.closeBtn.isExisting() && sheetsPage.close();
        sheetsPage.clickSave();
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
            sheetsPage.choose(date[i + 1]);

            expect(sheetsPage.moveInfo.amount, 'amount of moves').to.equal(test[i].moves.amount);
        });

        it('Choose and Close section, ' + (i + 1) + '-checkup', () => {
            sheetsPage.chooseSection('Move').close();
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
            rslt = sheetsPage.mediaInfo;

            expect(rslt.amount, 'nOfMedia').to.equal('2');
        });

        it('Audio changes, ' + (i + 1) + '-checkup', () => {
            sheetsPage.section('Audio').scrollIntoView({ block: 'center' });
            rslt = sheetsPage.audioInfo;

            expect(rslt.amount, 'nOfAudio').to.equal('1');
        });

        it('Close, ' + (i + 1) + '-checkup', () => {
            sheetsPage.clickCloseDC();
        });
    }
});
