// checkup.page.js
const ReportPage = require('./report.page');

class CheckupPage extends ReportPage {
    constructor() {
        super();
        this.id = '0';
        this.farm;
        this.group;
    }
/********************************************** Navigation *****************************************************/
    get checkupUrl() { return this.baseUrl + '/daily-checkup/'; }
    get farmRow() { return '.DailyCheckupsFarmRow'; }
    get groupRow() { return '.DailyCheckupsGroupRow'; }
    get rowDC() { return '.row-content'; }
    get farmName() { return isMobile ? $('.main-header h1') : $('.farm-information h1'); }
    get groupName() { return isMobile ? $('.main-header h1') : $('.Breadcrumbs .nowActive'); }
    get modalWrapper() { return $('.ModalsContainer.isOpen'); }
    get offlineWarning() { return $('.offline-no-checkup-warning'); }

    open(path = this.checkupUrl) {
        return super.open(path);
    }

    setId() {
        this.id = (this.myUrl.match(/[0-9]+$/) || ['0'])[0];
        return this;
    }

    setFarm(row) {
        this.farm = this.getString(row.$('.farm-name'));
        return this;
    }

    setGroup(row) {
        this.group = this.getString(row.$('.group-name'), /(?<=Group\s•\s)(.+)/u);
        return this;
    }

    rowWith(str) {
        return $(this.rowDC + '*=' + str);
    }

    isPageOf(regex) {
        return browser.getUrl().includes(regex);
    }

    chooseFarm(name = this.farm) {
        return this.clickOn($(`${this.farmRow}*=${name}`).$$('.button').slice(-1)[0]);
    }

    chooseGroup(name = this.group) {
        return this.clickOn($(`${this.groupRow}*=${name}`).$$('.button').slice(-1)[0]);
    }

    currentDC(farm = this.farm, group = this.group) {
        this.clickCheckup();
        this.modalWrapper.isExisting() && this.clickToModal('Yes');
        return this.setSearch(farm).chooseFarm(farm).chooseGroup(group);
    }

    openCurrent() {
        return this.open(this.checkupUrl + this.id);
    }

    randFarm() {
        !this.isOffNet && this.open();
        this.clickCheckup().setElemsOnPage(100);
        const rows = $$(this.rowDC + '*=Pending');
        const id = this.isOffNet
            ? tdata.rand(rows.length - 1, rows.length / 2)
            : tdata.rand(rows.length / 2 - 1);
        this.setFarm(rows[id]);
        return this;
    }

    randGroup(status = 'Start') {
        let rows, btns, id = 0;
        do {
            this.randFarm().chooseFarm();
            rows = $$(this.groupRow);
            btns = $$('.button=' + status);
        } while (btns.length === 0);
        do {
            btns = this.getArray(rows[id++].$$('.button'));
        } while (!btns.includes(status));
        this.setGroup(rows[id - 1]);
        return this;
    }

    randCheckup(status) {
        return this.randGroup(status).chooseGroup().setId();
    }
    /********************************************** Checkup *****************************************************/
    get sectionWrapper() { return '.checkup-segment'; }
    get collapseWrapper() { return 'div[class^=collapse_]'; }
    get moveWrapper() { return '[class^=info-row_]'; }
    get deathWrapper() { return '[class^=item_]'; }
    get treatWrapper() { return '[class^=treatment-line]'; }
    get symptWrapper() { return '[class^=symptom-row]'; }
    get contentWrapper() { return '[class^=line_]'; }
    get checkinState() { return $('.checked-in-state'); }
    get dcStatus() { return '.group-status'; }
    get reComment() { return /(?<=Notes(\n|))(.)+?(?=(\n|)See)/g; }
    get noBtn() { return '.button=No'; }
    get submitBtn() { return $('.button.big-button'); }
    get reasons() { return this.section(1).$$(this.collapseWrapper); }
    get pigsUnderCare() { return $$('.PigsUnderCareLine').slice(-1)[0].$('strong').getText(); }
    get audioBtn() { return isMobile ? $$('a[href$="/record-audio"]')[1] : $$('a[href$="/record-audio"]')[0]; }
    get isCheckup() { return $(this.sectionWrapper).isExisting(); }

    get openGroups() {
        return $('.farm-actions').$('.stat-box*=Open Groups')
            .$('div[class^="stat-value"]').getText().match(/^(.+)(?=\/)/u)[0];
    }

    get checkinBtn() {
        return isMobile
            ? $('.panel').$('.checkin-btn')
            : $('.FarmProfileHeader').$('.checkin-btn');
    }

    clickCheckin() {
        return this.clickOn(this.checkinBtn);
    }

    clickAudio() {
        return this.clickOn(this.audioBtn);
    }

    submitDC() {
        return this.clickOn(this.submitBtn);
    }

    clickNoToReport(id) {
        return this.clickOn(this.section(id).$(this.noBtn));
    }

    section(id) {
        //TODO, try to avoid these scratches
        let sections = $$(this.sectionWrapper);
        let selector = $(this.sectionWrapper);
        if (typeof id === 'number' && sections.length) {
            selector =  sections[id];
        } else if (typeof id === 'string') {
            selector = $(this.sectionWrapper + '*=' + id);
        }
        return selector;
    }

    chooseSection(id) {
        expect(this.section(id).isExisting(), `there is no checkup section on: ${this.myUrl}`).to.equal(true);
        return this.clickOn(this.section(id).$$('.button').slice(-1)[0]).clear();
    }

    isEmpty(id) {
        return this.section(id).$(this.noBtn).isExisting()
            || (this.getNumber(this.section(id)) === '0'
                && !this.getString(this.section(id), this.reComment));
    }

    isAllEmpty() {
        return $$(this.sectionWrapper).reduce((is, val, idx) => {
            return is && this.isEmpty(idx);
        }, true);
    }

    get moveInfo() { return super.moveInfo(this.section('Movement'), this.moveWrapper); }
    get deathInfo() { return super.deathInfo(this.section('Mortal'), this.deathWrapper); }
    get treatInfo() { return super.treatInfo(this.section('Medication'), this.treatWrapper); }
    get symptInfo() { return super.symptInfo(this.section('Symptom'), this.symptWrapper); }
    get tempsInfo() { return super.tempsInfo(this.section('Temps'), this.contentWrapper); }
    get waterInfo() { return super.waterInfo(this.section('Water'), this.contentWrapper); }
    get mediaInfo() { return super.mediaInfo(this.mediaUploader); }
    get audioInfo() { return super.audioInfo(this.mediaUploader); }
    get noteInfo() { return super.noteInfo(this.comment, 'textarea'); }

    noToAllReports() {
        return $$(this.sectionWrapper).forEach((el, idx) => this.clickNoToReport(idx)) || this;
    }

    createCheckup(data) {
        const movePage = require('../pageobjects/movements.page');
        const deathPage = require('../pageobjects/deaths.page');
        const symptomPage = require('../pageobjects/symptoms.page');
        const treatPage = require('../pageobjects/medications.page');
        const tempsPage = require('../pageobjects/temps.page');
        const waterPage = require('../pageobjects/water.page');

        this.chooseSection(0);
        data.moves.type.forEach((el, i) => {
            (i === 0) || movePage.addRow().clickSelect();
            movePage.setMovement(data.moves.type[i],
                data.moves.heads[i], data.moves.weight[i], data.moves.condition[i]);
        });
        movePage.setComment(data.moves.comment).submit().closeModal();
        this.isCheckup || this.close();

        this.chooseSection(1);
        if ($(this.rowIndex).isExisting()) {
            data.deaths.reasons.forEach((el, i) => {
                (i === 0) || deathPage.addRow();
                deathPage.setMortWithReason(data.deaths.reasons[i],
                    data.deaths.chronic[i], data.deaths.acute[i], data.deaths.euthanas[i]);
            });
        } else {
            deathPage.setMortalities(
                data.deaths.chronic[0], data.deaths.acute[0], data.deaths.euthanas[0]);
        }
        deathPage.setComment(data.deaths.comment).submit().closeModal();
        this.isCheckup || this.close();

        this.chooseSection(2);
        data.treats.name.forEach((el, i) => {
            (i === 0) || treatPage.addRow();
            treatPage.setTreat(data.treats.name[i], data.treats.heads[i],
                data.treats.dosage[i], data.treats.gals[i]);
        });
        treatPage.setComment(data.treats.comment).submit().closeModal();
        this.isCheckup || this.close();

        this.chooseSection(3);
        data.sympts.name.forEach((el, i) => {
            (i === 0) || symptomPage.addRow();
            symptomPage.setSymptom(data.sympts.name[i]);
        });
        symptomPage.setComment(data.sympts.comment).submit().closeModal();
        this.isCheckup || this.close();

        this.chooseSection(4);
        tempsPage.setTemps(data.temps.high, data.temps.low)
            .setComment(data.temps.comment).submit().closeModal();
        this.isCheckup || this.close();

        this.chooseSection(5);
        waterPage.setGals(data.water.consumed)
            .setComment(data.water.comment).submit().closeModal();
        this.isCheckup || this.close();

        this.section('Media').isExisting() && this.chooseSection('Media');
        this.clearMedia().uploadMedia([data.files.video, data.files.pic, data.files.audio]);

        this.isPageOf('/barnsheets/') && this.submit().chooseSection(6, 'Notes');
        this.removeComment().setComment(data.comment);
        this.isPageOf('/barnsheets/') && this.submit();

        return this;
    }
}

module.exports = new CheckupPage();
