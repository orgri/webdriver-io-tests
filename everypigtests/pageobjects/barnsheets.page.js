// barnsheets.page.js
var ReportPage = require('./report.page');

class BarnSheetsPage extends ReportPage {

/********************************************** Navigation *****************************************************/

    get groupsTab() { return $('a[href*="/barnsheets/groups"]'); }
    get farmsTab() { return $('a[href*="/barnsheets/farms"]'); }
    get companiesTab() { return $('a[href*="/barnsheets/companies"]'); }
    get treatsTab() { return $('a[href*="/treatments"]'); }
    get diagnosTab() { return $('a[href*="/diagnoses"]'); }
    get pigMovesTab() { return $('a[href*="/pig-movements"]'); }
    get mediaTab() { return $('div[class="scrollable-content"] a[href*="/media"]'); }
    get dcTab() { return $('.item=Daily Checkups'); }

    clickTreatsTab() { return this.treatsTab.waitAndClick() && this; }
    clickDiagnosTab() { return this.diagnosTab.waitAndClick() && this; }
    clickMovesTab() { return this.pigMovesTab.waitAndClick() && this; }
    clickMediaTab() { return this.mediaTab.waitAndClick() && this; }
    clickDcTab() { return this.dcTab.waitAndClick() && this; }
    clickFarmsTab() { return this.farmsTab.waitAndClick() && this; }
    clickGroupsTab() { return this.groupsTab.waitAndClick() && this; }
    clickCompaniesTab() { return this.companiesTab.waitAndClick() && this; }

    open(path) {
        if (path === undefined) {
            browser.url(this.baseUrl + '/barnsheets');
            this.waitForOpen();
        } else {
            browser.url(path);
        }
        return this;
    }

    waitForOpen() { return $(this.tableItem).waitForExist() && this; }
    waitLoader() {
        if ($('.preloader.is-active').isExisting()) {
            browser.waitUntil(() => {
                return !($('.preloader.is-active').isExisting())
            }, 5000, 'loader');
        }
        return this;
    }

/********************************************* Barnsheets Tables ****************************************************/

    get inputSearch() { return $('input[placeholder="Search..."]'); }
    get tableRow() { return '.table-row'; }
    get tableRows() { return $$(this.tableRow); }
    get tableItem() { return '.FlexTableItem'; }
    get sortWrapper() { return '.allow-sort-column'; }
    get filterWrapper() { return $('div[class^="table-filter"]'); }
    get sectionWrapper() { return '.Section'; }
    get sectionHeader() { return '.Header'; }
    get checkupRows() { return $$('span[class="name-icon"] a[href*="/barnsheets/daily-checkup/"]'); }
    get isCheckupsTable() { return $(this.tableRow + '=Date').isExisting(); }
    get dropdownMenu() { return $('.dropdown-layout.isOpen'); }

    tableItemsWith(str) { return $$(this.tableItem + '*=' + str); }
    tableRowsWith(str) {
        return $$(this.tableRow + '*=' + str)
            .filter((el, index) => index % 2 === 0); //filter scratch because it finds extra child .table-row-item class
    }

    setSearch(name) { return this.inputSearch.setValueAndWait(name) && this; }
    clickSortBy(item) { return $(this.sortWrapper + '*=' + item).waitAndClick() && this; }
    clickFilterBy(item) { return this.filterWrapper.$('span*=' + item).waitAndClick() && this; }
    groupHeader(name) { return $('.group-name=' + name); }

    choose(name) { return $('*=' + name).waitAndClick() && this; }

    isCellExist(date, str) { return $(this.tableRow + '*=' + date).$(this.tableItem + '*=' + str).isExisting() ; }
    cell(date, column = 0, row = 0) { return this.tableRowsWith(date)[row].$$(this.tableItem)[column]; }
    dateCell(date) { return this.cell(date).getText(); }
    mediaLabel(date) { return this.cell(date).$('.media-label').getText(); }
    deathsCell(date) { return this.cell(date, 1).getText(); }
    treatsCell(date) { return this.cell(date, 2).getText(); }
    symptsCell(date) { return this.cell(date, 3).getText(); }
    pigsinCell(date) { return this.cell(date, 4).getText(); }
    pigsoutCell(date) { return this.cell(date, 5).getText(); }
    correctCell(date) { return this.cell(date, 6).getText(); }
    inventoryCell(date) { return this.cell(date, 7).getText(); }
    mrCell(date) { return this.cell(date, 8).getText(); }
    weightCell(date) { return this.cell(date, 9).getText(); }

    clickMenuCell(date) { return this.cell(date, 10).$('.fa.fa-dots-three-horizontal').waitAndClick() && this; }
    clickOption(option) { return this.dropdownMenu.$('.list-item-li' + '=' + option).waitAndClick() && this; }

/********************************************* Edit Checkup page ****************************************************/

    get rightButton() { return $('.CheckupNavigation .fa.fa-arrow-right'); }
    get leftButton() { return $('.CheckupNavigation .fa.fa-arrow-left'); }
    get closeDCButton() { return $('.close-checkup'); }
    get saveButton() { return isMobile ? $$('.button*=Save')[1] : $$('.button*=Save')[0]; }
    get escapeButton() { return $('.edit-mode-off'); }
    get reasonWrapper() { return 'div[class*="reason-collapse"]'; }
    get isReasonExist() { return this.section('Dead').$(this.reasonWrapper).isExisting(); }
    get deathReasons() { return this.section('Dead').$$(this.reasonWrapper); }
    get mainComment() { return (this.section('Notes Notes').getText().match(/(?<=Edit\n)(.|\n)+?(?=\nSee)/g) || [])[0]; }
    get nOfMedia() { return this.section('Media').getText().match(/[0-9]+/)[0]; }
    get nOfAudio() { return this.section('Audio').getText().match(/[0-9]+/)[0]; }
    get reComment() { return /(?<=Notes\n)(.|\n)+?(?=\nSee)/g; }

    clickRight() { return this.rightButton.waitAndClick() && this; }
    clickLeft() { return this.leftButton.waitAndClick() && this; }
    clickEscape() { return this.escapeButton.waitAndClick() && this; }
    clickSave() { return this.saveButton.waitAndClick() && this; }
    clickCloseDC() { return this.closeDCButton.waitAndClick() && this; }

    section(type) { return $(this.sectionWrapper + '*=' + type); }
    chooseSection(item) {
        this.section(item).isExisting() &&
            $(this.sectionHeader + '*=' + item).$('.button').waitAndClick();
        this.clear();
        return this;
    }

    isMoveExist(type) { return this.section('Move').$('.info-row*=' + type).isExisting(); }
    deathReasonCollapse(idx = 0) { return this.deathReasons[idx].waitAndClick() && this; }

    moveRowInfo(type) {
        return (this.isMoveExist(type)) ?
            this.section('Move').$$('.info-row*=' + type)
                .map(el => el.$('.float-right').getText()) : [];
    }

    deathRowInfo(type) {
        const reNumber = /(\d+)$/u;
        return (this.isReasonExist) ?
            this.deathReasons.map(el => (el.$('span*=' + type).getText().match(reNumber) || [])[0]) :
            (this.section('Dead').$('.item*=' + type).$('div[class^="value"]').getText().match(reNumber) || [])[0];
    }

    get moveInfo() {
        let obj = new Object();

        obj.amount = this.getNumber(this.section('Move'));//.getText().match(/[0-9]+/)[0];
        obj.added = this.moveRowInfo('Added');
        obj.removed = this.moveRowInfo('Removed');
        obj.weight = this.moveRowInfo('Weight');
        obj.condition = this.moveRowInfo('Condition');
        obj.comment = this.getString(this.section('Move'), this.reComment);//.getText().match(reComment) || [])[0];

        return obj;
    }

    get deathInfo() {
        let obj = new Object();
        const reReason = /(.+)(?=\s\u2022)/u;

        obj.amount = this.getNumber(this.section('Dead'));
        obj.reason = this.isReasonExist ? this.getArray(this.deathReasons, reReason) : undefined;
        obj.acute = this.deathRowInfo('Acute');
        obj.chronic = this.deathRowInfo('Chronic');
        obj.ethanas = this.deathRowInfo('Euthanasia');
        obj.comment = this.getString(this.section('Dead'), this.reComment);

        return obj;
    }

    get treatInfo() {
        let obj = new Object();
        const selector = this.section('Medic').$$('.content-row');
        const reName = /(.+?)(?=(\s\u2022)|(\n\d+))/u;
        const reDosage = /(?<=\u2022\s)(\d+\.\d+)/u;
        const reHeads = /(\d+)$/u;
        const reGals = /(\d+)(?=\sgal)/u;

        obj.amount = this.getNumber(this.section('Medic'));
        obj.name = this.getArray(selector, reName).filter(el => el !== undefined);
        obj.dosage = this.getArray(selector, reDosage).filter(el => el !== undefined)
        obj.heads = this.getArray(selector, reHeads).filter(el => el !== undefined);
        obj.gals = this.getArray(selector, reGals).filter(el => el !== undefined);
        obj.comment = this.getString(this.section('Medic'), this.reComment);

        return obj;
    }

    get symptInfo() {
        let obj = new Object();
        const selector = this.section('Sympt').$$('.content-row');
        const reName = /(.+)(?=\n)/u;
        const rePercent = /(\d+)%/u;

        obj.amount = this.getNumber(this.section('Sympt'));
        obj.name = this.getArray(selector, reName);
        obj.percent = this.getArray(selector, rePercent);
        obj.comment = this.getString(this.section('Sympt'), this.reComment);

        return obj;
    }

    get tempsInfo() {
        let obj = new Object();
        const selector = this.section('Temps').$$('.content-row');

        obj.high = this.getFloat(selector[0]);
        obj.low = this.getFloat(selector[1]);
        obj.comment = this.getString(this.section('Temps'), this.reComment);

        return obj;
    }

    get waterInfo() {
        let obj = new Object();
        const selector = this.section('Water Usage');
        obj.consumed = this.getFloat(selector.$('.content-row'));
        obj.comment = this.getString(selector, this.reComment);

        return obj;
    }

    clear() {
        this.removeComment().clearMedia();
        const rows = $$(this.rowIndex).length;
        for (let i = 0; i < rows - 1; i++) {
            this.deleteRow();
        }
        return this;
    }

    clearMedia() {
        const rows = $$('asset-wrapper').length;
        for (let i = 0; i < rows; i++) {
            this.removeMediaButton.waitAndClick();
            browser.pause(500);
        }
        return this;
    }

    createCheckup(data) {
        const movePage = require('../pageobjects/movements.page');
        const deathPage = require('../pageobjects/deaths.page');
        const symptomPage = require('../pageobjects/symptoms.page');
        const treatPage = require('../pageobjects/medications.page');
        const tempsPage = require('../pageobjects/temps.page');
        const waterPage = require('../pageobjects/water.page');

        this.waitLoader().chooseSection('Move');
        for (let i = 0, n = +data.moves.amount; i < n; i++) {
            (i === 0) || movePage.addRow();
            movePage.clickSelectParam().setMovement(data.moves.type[i],
                data.moves.heads[i], data.moves.weight[i], data.moves.condition[i]);
        }
        movePage.setComment(data.moves.comment).submit();

        this.waitLoader().chooseSection('Dead');
        if ($(this.rowIndex).isExisting()) {
            for (let i = 0, n = data.deaths.reasons.length; i < n; i++) {
                (i === 0) || deathPage.addRow();
                deathPage.setMortWithReason(data.deaths.reasons[i],
                    data.deaths.chronic[i], data.deaths.acute[i], data.deaths.euthanas[i]);
            }
        } else {
            deathPage.setMortalities(data.deaths.chronic[0], data.deaths.acute[0], data.deaths.euthanas[0]);
        }
        deathPage.setComment(data.deaths.comment).submit();

        this.waitLoader().chooseSection('Medic');
        for (let i = 0, n = +data.treats.amount; i < n; i++) {
            (i === 0) || treatPage.addRow();
            treatPage.setTreat(data.treats.name[i], data.treats.heads[i],
                data.treats.dosage[i], data.treats.gals[i]);
        }
        //treatPage.setTotal(total + '');
        treatPage.setComment(data.treats.comment).submit();

        this.waitLoader().chooseSection('Sympt');
        for (let i = 0; i < +data.sympts.amount; i++) {
            (i === 0) || symptomPage.addRow();
            symptomPage.setSymptom(data.sympts.name[i]);
        }
        symptomPage.setComment(data.sympts.comment).submit();

        this.waitLoader().chooseSection('Temps');
        tempsPage.setTemps(data.temps.high, data.temps.low).submit();

        this.waitLoader().chooseSection('Water');
        waterPage.setGals(data.water.consumed).submit();

        this.waitLoader().chooseSection('Notes').setComment(data.comment).submit().waitLoader();

        this.chooseSection('Media').waitLoader()
            .uploadMedia(data.files.pic)
            .uploadMedia(data.files.video)
            .uploadMedia(data.files.audio)
            .submit().waitLoader();
    }

/********************************************** Diagnosis tab *****************************************************/

    get block() { return '.UserPanel'; }
    clickDiagnosMenu(index = 0) { return $$(this.block)[index].$('.user-actions').waitAndClick() && this; }

    get diagnosInfo() {
        let obj = new Object();
        const reName = /.+/u;
        const reType = /(?<=\n)(.+)/g;
        const reComment = /(?<=Notes:\s+)(?=\w)(.|\n)+[^\nSee translation]/g;

        obj.name = this.getArray($$('.diagnose-name'), reName);
        obj.type = this.getArray($$('.diagnose-name'), reType);
        obj.comment = this.getArray($$('.diagnose-note'), reComment);

        return obj;
    }

/********************************************** Movements tab *****************************************************/

    moveTabInfo(date) {
        let data = new Object();
        const selector = $$(this.block + '*=' + date);
        const reHeads = /(?<=(Head Transferred|Head Placed)\n)(\d+)/u;
        const reWeight =/(?<=(Est. Avg. Weight)\n)([\d\.]+)/u;
        const reCondition = /(?<=(Condition at Arrival)\n)(.+)/u;

        data.amount = selector.length + '';
        data.heads = this.getArray(selector, reHeads);
        data.weight = this.getArray(selector, reWeight);
        data.condition = this.getArray(selector, reCondition);

        return data;
    }

/**********************************************Media tab*****************************************************/

    get scale() { return $('.current-scale.visible'); }
    get mediaViewer() { return $('.mediaViewer.is-open'); }

    clickOnImg(name) { return $('div[style*="NAME"]'.replace(/NAME/, name)).waitAndClick() && this; }
    clickScalePlus() { return $('.fa.fa-search-plus').waitAndClick() && this; }
    clickScaleMinus() { return $('.fa.fa-search-minus').waitAndClick() && this; }
    clickScaleOrig() { return $('.fa.fa-maximize').waitAndClick() && this; }
    clickNextImg() { return $('div[class*="nav-next"]').waitAndClick() && this; }
    clickPrevImg() { return $('div[class*="nav-prev"]').waitAndClick() && this; }
    clickCloseImg() { return $('.header-btn__close').waitAndClick() && this; }

}

module.exports = new BarnSheetsPage();