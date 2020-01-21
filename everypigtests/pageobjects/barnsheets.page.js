// barnsheets.page.js
const ReportPage = require('./report.page');

class BarnSheetsPage extends ReportPage {
    /*********************************************** Navigation ******************************************************/
    get barnsheetsUrl() { return this.baseUrl + '/barnsheets'; }
    get farmName() { return $('.farm-information h1'); }
    get groupName() { return $('.group-info-wrapper .group-name'); }
    get companyName() { return $('.CompanyProfileHeader .company-name'); }

    open(path = this.barnsheetsUrl) {
        return super.open(path);
    }

    waitForOpen() {
        return $(this.tableItem).waitForExist() && this;
    }

    /********************************************* Barnsheets Tables ****************************************************/

    get tableRows() { return $$(this.tableRow); }
    get sectionWrapper() { return '.Section'; }
    get sectionHeader() { return '.Header'; }
    get checkupRows() { return $$('span[class="name-icon"] a[href*="/barnsheets/daily-checkup/"]'); }
    get isCheckup() { return $(this.sectionWrapper).isExisting(); }

    groupHeader(str) {
        return $('.group-name=' + str);
    }

    clickCell(str, selector) {
        return this.clickOn(this.tableItemsWith(str)[0].$(selector));
    }

    isCellExist(date, str) {
        return $(this.tableRow + '*=' + date).$(this.tableItem + '*=' + str).isExisting();
    }

    dateCell(date) {
        return this.cell(date).getText();
    }

    mediaLabel(date) {
        return this.cell(date).$('.media-label').getText();
    }

    deathsCell(date) {
        return this.getNumber(this.cell(date, 1));
    }

    treatsCell(date) {
        return this.getNumber(this.cell(date, 2));
    }

    symptsCell(date) {
        return this.getNumber(this.cell(date, 3));
    }

    pigsinCell(date) {
        return this.getNumber(this.cell(date, 4));
    }

    pigsoutCell(date) {
        return this.getNumber(this.cell(date, 5));
    }

    correctCell(date) {
        return this.getNumber(this.cell(date, 6));
    }

    inventoryCell(date) {
        return this.getNumber(this.cell(date, 7));
    }

    mrCell(date) {
        return this.getNumber(this.cell(date, 8));
    }

    weightCell(date) {
        return this.getNumber(this.cell(date, 9));
    }

    chooseRandGroup(farmPrefix = 'TA_Farm_0000', groupPrefix = 'TA_PigGroup') {
        this.open().clickSubTab('Farms').setElemsOnPage(100);
        let rows = this.tableItemsWith(farmPrefix);
        this.clickOn(rows[tdata.rand(rows.length - 1)].$('a'));
        rows = this.tableItemsWith(groupPrefix);
        if (rows.length === 0) {
            this.chooseRandGroup();
        } else {
            this.setElemsOnPage(100).waitLoader();
            rows = this.tableItemsWith(groupPrefix);
            this.clickOn(rows[tdata.rand(rows.length - 1)].$('a'));
        }
        return this;
    }

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

    clickRight() {
        return this.clickOn(this.rightButton);
    }

    clickLeft() {
        return this.clickOn(this.leftButton);
    }

    clickEscape() {
        return this.clickOn(this.escapeButton);
    }

    clickSave() {
        return this.clickOn(this.saveButton);
    }

    clickCloseDC() {
        return this.clickOn(this.closeDCButton);
    }

    section(type) {
        return $(this.sectionHeader + '*=' + type).$('..');
    }

    chooseSection(item) {
        this.section(item).isExisting() &&
            this.clickOn($(this.sectionHeader + '*=' + item).$('.button'));
        this.clear().clearMedia();
        return this;
    }

    get moveInfo() { return super.moveInfo(this.section('Movement'), '[class^=info-row_]'); }
    get deathInfo() { return super.deathInfo(this.section('Dead'), '[class^=item_]'); }
    get treatInfo() { return super.treatInfo(this.section('Medication'), '.content-row'); }
    get symptInfo() { return super.symptInfo(this.section('Symptom'), '.content-row'); }
    get tempsInfo() { return super.tempsInfo(this.section('Temps'), '.content-row'); }
    get waterInfo() { return super.waterInfo(this.section('Water'), '.content-row'); }
    get mediaInfo() { return super.mediaInfo(this.section('Media')); }
    get audioInfo() { return super.audioInfo(this.section('Audio')); }
    get diagnosInfo() { return super.diagnosInfo(this.root, '.diagnose-name', '.diagnose-note > :last-child'); }
    get noteInfo() { return super.noteInfo(this.section('Notes')); }

    createCheckup(data) {
        const movePage = require('../pageobjects/movements.page');
        const deathPage = require('../pageobjects/deaths.page');
        const symptomPage = require('../pageobjects/symptoms.page');
        const treatPage = require('../pageobjects/medications.page');
        const tempsPage = require('../pageobjects/temps.page');
        const waterPage = require('../pageobjects/water.page');

        this.chooseSection('Move');
        data.moves.type.forEach((el, i) => {
            (i === 0) || movePage.addRow();
            movePage.clickSelect().setMovement(data.moves.type[i],
                data.moves.heads[i], data.moves.weight[i], data.moves.condition[i]);
        });
        movePage.setComment(data.moves.comment).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Dead');
        if ($(this.rowIndex).isExisting()) {
            data.deaths.reasons.forEach((el, i) => {
                (i === 0) || deathPage.addRow();
                deathPage.setMortWithReason(data.deaths.reasons[i],
                    data.deaths.chronic[i], data.deaths.acute[i], data.deaths.euthanas[i]);
            });
        } else {
            deathPage.setMortalities(data.deaths.chronic[0], data.deaths.acute[0], data.deaths.euthanas[0]);
        }
        deathPage.setComment(data.deaths.comment).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Medic');
        data.treats.name.forEach((el, i) => {
            (i === 0) || treatPage.addRow();
            treatPage.setTreat(data.treats.name[i], data.treats.heads[i],
                data.treats.dosage[i], data.treats.gals[i]);
        });
        //treatPage.setTotal(total + '');
        treatPage.setComment(data.treats.comment).submit();
        this.isSubmitDisabled && this.close();

        this.chooseSection('Sympt');
        data.sympts.name.forEach((el, i) => {
            (i === 0) || symptomPage.addRow();
            symptomPage.setSymptom(data.sympts.name[i]);
        });
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

    clickDiagnosMenu(index = 0) {
        return this.clickOn($$('.UserPanel')[index].$('.user-actions'));
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
}

module.exports = new BarnSheetsPage();
