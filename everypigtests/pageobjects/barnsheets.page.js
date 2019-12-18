// barnsheets.page.js
const ReportPage = require('./report.page');

class BarnSheetsPage extends ReportPage {

    /*********************************************** Navigation ******************************************************/

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
    get deathReasons() { return this.section('Dead').$$(this.reasonWrapper); }
    get mainComment() { return (this.section('NotesNotes').getText().match(/(?<=Edit(\n|))(.)+?(?=(\n|)See)/g) || [])[0]; }
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

    get moveInfo() { return super.moveInfo(this.section('Movement'), '[class^=info-row_]'); }
    get deathInfo() { return super.deathInfo(this.section('Dead'), '[class^=item_]'); }
    get treatInfo() { return super.treatInfo(this.section('Medication'), '.content-row'); }
    get symptInfo() { return super.symptInfo(this.section('Symptom'), '.content-row'); }
    get tempsInfo() { return super.tempsInfo(this.section('Temps'), '.content-row'); }
    get waterInfo() { return super.waterInfo(this.section('Water'), '.content-row'); }
    get mediaInfo() { return super.mediaInfo(this.section('Media')); }
    get audioInfo() { return super.audioInfo(this.section('Audio')); }
    get diagnosInfo() { return super.diagnosInfo(this.root, '.diagnose-name', '.diagnose-note > :last-child'); }

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
            .uploadMedia([data.files.video, data.files.pic, data.files.audio])
            .submit();
    }
    /********************************************** Treatments tab *****************************************************/

    get chart() { return $('.chart-block'); }

    /********************************************** Diagnosis tab *****************************************************/

    clickDiagnosMenu(index = 0) { return $$('.UserPanel')[index].$('.user-actions').waitClick() && this.waitLoader(); }

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
        const selector = $$('.UserPanel*=' + date);
        const reHeads = /(?<=(Transferred|Placed)(\n|))([\d.\-]+)/;
        const reWeight = /(?<=Weight|Weight\n)([\d.\-]+)/;
        const reCondition = /(?<=Arrival|Arrival\n)([a-zA-Z]+)/;

        return {
            amount : selector.length + '',
            heads : this.getArray(selector, reHeads),
            weight : this.getArray(selector, reWeight),
            condition : this.getArray(selector, reCondition)
        }
    }

    /********************************************** Media tab *****************************************************/

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
