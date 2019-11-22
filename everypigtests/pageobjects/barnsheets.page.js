// barnsheets.page.js
var ReportPage = require('./report.page');

class BarnSheetsPage extends ReportPage {

    /********************************************** Navigation *****************************************************/
    get barnsheetsUrl() { return this.baseUrl + '/barnsheets'; }
    get farmName() { return $('.farm-information h1'); }
    get groupName() { return $('.group-info-wrapper .group-name'); }
    get companyName() { return $('.CompanyProfileHeader .company-name'); }

    open(path = this.barnsheetsUrl) {
        browser.url(path);
        this.waitLoader();
        return this;
    }

    waitForOpen() { return $(this.tableItem).waitForExist() && this; }

    /********************************************* Barnsheets Tables ****************************************************/

    get tableRows() { return $$(this.tableRow); }
    get sectionWrapper() { return '.Section'; }
    get sectionHeader() { return '.Header'; }
    get checkupRows() { return $$('span[class="name-icon"] a[href*="/barnsheets/daily-checkup/"]'); }
    get isCheckupsTable() { return $(this.tableRow + '=Date').isExisting(); }

    groupHeader(str) { return $('.group-name=' + str); }
    choose(str) { return $('*=' + str).waitClick() && this.waitLoader(); }
    clickCell(str, selector) { return this.tableItemsWith(str)[0].$(selector).waitClick() && this.waitLoader(); }
    isCellExist(date, str) { return $(this.tableRow + '*=' + date).$(this.tableItem + '*=' + str).isExisting(); }
    dateCell(date) { return this.cell(date).getText(); }
    mediaLabel(date) { return this.cell(date).$('.media-label').getText(); }
    deathsCell(date) { return this.getNumber(this.cell(date, 1)); }
    treatsCell(date) { return this.getNumber(this.cell(date, 2)); }
    symptsCell(date) { return this.getNumber(this.cell(date, 3)); }
    pigsinCell(date) { return this.getNumber(this.cell(date, 4)); }
    pigsoutCell(date) { return this.getNumber(this.cell(date, 5)); }
    correctCell(date) { return this.getNumber(this.cell(date, 6)); }
    inventoryCell(date) { return this.getNumber(this.cell(date, 7)); }
    mrCell(date) { return this.getNumber(this.cell(date, 8)); }
    weightCell(date) { return this.getNumber(this.cell(date, 9)); }

    getRandDates(number = 1) {
        let idx = tdata.rand(this.tableRows.length - 2);
        idx = idx < number ? number : idx;
        return Array.from(Array(number + 1), (val, index) =>
            this.checkupRows[idx - index].getText());
    }

    /********************************************* Edit Checkup page ****************************************************/

    get rightButton() { return $('.CheckupNavigation .fa.fa-arrow-right'); }
    get leftButton() { return $('.CheckupNavigation .fa.fa-arrow-left'); }
    get closeDCButton() { return $('.close-checkup'); }
    get saveButton() { return isMobile ? $$('.button*=Save')[1] : $$('.button*=Save')[0]; }
    get escapeButton() { return $('.edit-mode-off'); }
    get reasonWrapper() { return 'div[class*="reason-collapse"]'; }
    get isReasonExist() { return this.section('Dead').$(this.reasonWrapper).isExisting(); }
    get deathReasons() { return this.section('Dead').$$(this.reasonWrapper); }
    get mainComment() { return (this.section('NotesNotes').getText().match(/(?<=Edit(\n|))(.)+?(?=(\n|)See)/g) || [])[0]; }
    get nOfMedia() { return this.section('Media').getText().match(/[0-9]+/)[0]; }
    get nOfAudio() { return this.section('Audio').getText().match(/[0-9]+/)[0]; }
    get reComment() { return /(?<=Notes(\n|))(.)+?(?=(\n|)See)/g; }

    clickRight() { return this.rightButton.waitClick() && this.waitLoader(); }
    clickLeft() { return this.leftButton.waitClick() && this.waitLoader(); }
    clickEscape() { return this.escapeButton.waitClick() && this.waitLoader(); }
    clickSave() { return this.saveButton.waitClick() && this.waitLoader(); }
    clickCloseDC() { return this.closeDCButton.waitClick() && this.waitLoader(); }
    section(type) { return $(this.sectionWrapper + '*=' + type); }

    chooseSection(item) {
        this.section(item).isExisting() &&
            $(this.sectionHeader + '*=' + item).$('.button').waitClick();
        this.waitLoader().clear();
        return this;
    }

    deathReasonCollapse(idx = 0) { return this.deathReasons[idx].waitClick() && this.waitLoader(); }

    get moveInfo() {
        let obj = {};

        obj.amount = this.getNumber(this.section('Move'));
        obj.added = this.moveRowInfo('Added');
        obj.removed = this.moveRowInfo('Removed');
        obj.weight = this.moveRowInfo('Weight');
        obj.condition = this.moveRowInfo('Condition');
        obj.comment = this.getString(this.section('Move'), this.reComment);

        return obj;
    }

    deathRowInfo(type) {
        const reNumber = /(\d+)$/u;
        return (this.isReasonExist) ?
            this.deathReasons.map(el => (el.$('span*=' + type)
                .getText().match(reNumber) || [])[0]) :
            (this.section('Dead').$('.item*=' + type).$('div[class^="value"]')
                .getText().match(reNumber) || [])[0];
    }

    get diagnosInfo() {
        let obj = {};
        const noteSelector = $(this.sectionWrapper).isExisting()
            ? $$('.diagnose-note span[class^=Translation_] > span')
            : $$('.diagnose-note .italic');

        obj.name = this.getArray($$('.diagnose-name .name'));
        obj.type = this.getArray($$('.diagnose-name span span'));
        obj.comment = this.getArray(noteSelector);

        return obj;
    }

    get deathInfo() {
        let obj = {};
        const reReason = /(.+?)(?=\s\u2022)/u;

        obj.amount = this.getNumber(this.section('Dead'));
        obj.reason = this.isReasonExist ? this.getArray(this.deathReasons, reReason) : undefined;
        obj.acute = this.deathRowInfo('Acute');
        obj.chronic = this.deathRowInfo('Chronic');
        obj.ethanas = this.deathRowInfo('Euthanasia');
        obj.comment = this.getString(this.section('Dead'), this.reComment);

        return obj;
    }

    get treatInfo() {
        let obj = {};
        const selector = this.section('Medic').$$('.content-row');
        const reName = /(.+?)(?=(\s\u2022)|(\d+|\n\d+)$)/u;
        const reDosage = /(?<=\u2022\s)(\d+\.\d+)/u;
        const reHeads = /(\d+)$/u;
        const reGals = /(\d+)(?=\sgal)/u;

        obj.amount = this.getNumber(this.section('Medic'));
        obj.name = this.getArray(selector, reName).filter(el => el !== undefined);
        obj.dosage = this.getArray(selector, reDosage).filter(el => el !== undefined);
        obj.heads = this.getArray(selector, reHeads).filter(el => el !== undefined);
        obj.gals = this.getArray(selector, reGals).filter(el => el !== undefined);
        obj.comment = this.getString(this.section('Medic'), this.reComment);

        return obj;
    }

    get symptInfo() {
        let obj = {};
        const selector = this.section('Sympt').$$('.content-row');
        const reName = /[^\n\d%]+/u;
        const rePercent = /(\d+)%/u;

        obj.amount = this.getNumber(this.section('Sympt'));
        obj.name = this.getArray(selector, reName);
        obj.percent = this.getArray(selector, rePercent);
        obj.comment = this.getString(this.section('Sympt'), this.reComment);

        return obj;
    }

    get tempsInfo() {
        let obj = {};
        const selector = this.section('Temps').$$('.content-row');

        obj.high = this.getFloat(selector[0]);
        obj.low = this.getFloat(selector[1]);
        obj.comment = this.getString(this.section('Temps'), this.reComment);

        return obj;
    }

    get waterInfo() {
        let obj = {};
        const selector = this.section('Water Usage');
        obj.consumed = this.getFloat(selector.$('.content-row'));
        obj.comment = this.getString(selector, this.reComment);

        return obj;
    }

    moveRowInfo(type) {
        return (this.isExist(this.section('Move').$('.info-row*=' + type))) ?
            this.section('Move').$$('.info-row*=' + type)
                .map(el => el.$('.float-right').getText()) : [];
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
            this.removeMediaButton.waitClick();
            browser.pause(1000);
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

        this.chooseSection('Move');
        for (let i = 0, n = +data.moves.amount; i < n; i++) {
            (i === 0) || movePage.addRow();
            movePage.clickSelect().setMovement(data.moves.type[i],
                data.moves.heads[i], data.moves.weight[i], data.moves.condition[i]);
        }
        movePage.setComment(data.moves.comment).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Dead');
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
        this.isSubmitDisabled && this.close();

        this.chooseSection('Medic');
        for (let i = 0, n = +data.treats.amount; i < n; i++) {
            (i === 0) || treatPage.addRow();
            treatPage.setTreat(data.treats.name[i], data.treats.heads[i],
                data.treats.dosage[i], data.treats.gals[i]);
        }
        //treatPage.setTotal(total + '');
        treatPage.setComment(data.treats.comment).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Sympt');
        for (let i = 0; i < +data.sympts.amount; i++) {
            (i === 0) || symptomPage.addRow();
            symptomPage.setSymptom(data.sympts.name[i]);
        }
        symptomPage.setComment(data.sympts.comment).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Temps');
        tempsPage.setTemps(data.temps.high, data.temps.low).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Water');
        waterPage.setGals(data.water.consumed).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Notes').setComment(data.comment).submit();

        this.chooseSection('Media')
            .uploadMedia(data.files.pic)
            .uploadMedia(data.files.video)
            .uploadMedia(data.files.audio)
            .submit();
    }
    /********************************************** Treatments tab *****************************************************/

    get chart() { return $('.chart-block'); }

    /********************************************** Diagnosis tab *****************************************************/

    get block() { return '.UserPanel'; }
    clickDiagnosMenu(index = 0) { return $$(this.block)[index].$('.user-actions').waitClick() && this.waitLoader(); }

    chooseRandGroup(farmPrefix = 'TA_Farm_0000', groupPrefix = 'TA_PigGroup') {
        this.open().clickSubTab('Farms').setElemsOnPage(100);
        let rows = this.tableItemsWith(farmPrefix);
        rows[tdata.rand(rows.length - 1)].$('a').waitClick() && this.waitLoader();
        rows = this.tableItemsWith(groupPrefix);
        if (rows.length === 0) {
            this.chooseRandGroup();
        } else {
            this.setElemsOnPage(100).waitLoader();
            rows = this.tableItemsWith(groupPrefix);
            rows[tdata.rand(rows.length - 1)].$('a').waitClick() && this.waitLoader();
        }
        return this;
    }

    /********************************************** Movements tab *****************************************************/

    moveTabInfo(date) {
        let data = {};
        const selector = $$(this.block + '*=' + date);
        const reHeads = /(?<=(Head Transferred|Head Placed)(\n|))(\d+)/u;
        const reWeight = /(?<=(Est. Avg. Weight)(\n|))([\d.]+)/u;
        const reCondition = /(?<=(Condition at Arrival)(\n|))(.+)/u;

        data.amount = selector.length + '';
        data.heads = this.getArray(selector, reHeads);
        data.weight = this.getArray(selector, reWeight);
        data.condition = this.getArray(selector, reCondition);

        return data;
    }

    /**********************************************Media tab*****************************************************/

    get scale() { return $('.current-scale.visible'); }
    get mediaViewer() { return $('.mediaViewer.is-open'); }

    clickOnImg() { return $('.bg-image').waitClick() && this.waitLoader(); }
    clickScalePlus() { return $('.fa.fa-search-plus').waitClick() && this; }
    clickScaleMinus() { return $('.fa.fa-search-minus').waitClick() && this; }
    clickScaleOrig() { return $('.fa.fa-maximize').waitClick() && this; }
    clickNextImg() { return $('div[class*="nav-next"]').waitClick() && this; }
    clickPrevImg() { return $('div[class*="nav-prev"]').waitClick() && this; }
    clickCloseView() { return $('.header-btn__close').waitClick() && this; }

}

module.exports = new BarnSheetsPage();
