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

    setId() { this.id = (this.myUrl.match(/[0-9]+$/) || ['0'])[0]; return this; }

    setFarm(row) {
        this.farm = this.getString(row.$('.farm-name'));
        return this;
    }

    setGroup(row) {
        this.group = this.getString(row.$('.group-name'), /(?<=Group\s•\s)(.+)/u);
        return this;
    }

    rowWith(str) { return $(this.rowDC + '*=' + str); }
    clickToModal(str) {return this.modalWrapper.$('.button=' + str).waitClick() && this.waitLoader(); }
    isPageOf(regex) { return browser.getUrl().includes(regex); }

    chooseFarm(name = this.farm) {
        return $(this.farmRow + '*=' + name)
            .$$('.button').slice(-1)[0].waitClick() && this.waitLoader();
    }

    chooseGroup(name = this.group) {
        return $(this.groupRow + '*=' + name)
            .$$('.button').slice(-1)[0].waitClick() && this.waitLoader();
    }

    currentDC(farm = this.farm, group = this.group) {
        this.clickCheckup();
        this.modalWrapper.isExisting() && this.clickToModal('Yes');
        return this.setSearch(farm).chooseFarm(farm).chooseGroup(group);
    }

    open() { super.open(this.checkupUrl); }
    openCurrent() { return this.open(this.checkupUrl + this.id) && this.waitLoader(); }

    randFarm() {
        !this.offNet.isExisting() && this.open(this.checkupUrl);
        this.clickCheckup().setElemsOnPage(100);
        const rows = $$(this.rowDC + '*=Pending');
        this.setFarm(rows[tdata.rand(rows.length - 1)]);
        return this;
    }

    randGroup(status = 'Start') {
        let rows, btns, id = 0, text;
        do {
            this.randFarm().chooseFarm();
            rows = $$(this.groupRow);
            btns = $$('.button=' + status);
        } while (btns.length === 0);
        do {
            text = rows[id++].$('.button').getText();
            //TODO: avoid this scratch
            text = (status === 'Start' && text === 'All Good') ? 'Start' : text;
        } while (text !== status);
        this.setGroup(rows[id - 1]);
        return this;
    }

    randCheckup(status) { return this.randGroup(status).chooseGroup().setId(); }

/********************************************** Checkup *****************************************************/

    get sectionWrapper() { return '.checkup-segment'; }
    get collapseWrapper() { return 'div[class^="collapse_"]'; }
    get moveWrapper() { return '[class^=info-row_]'; }
    get deathWrapper() { return '[class^=item_]'; }
    get treatWrapper() { return '[class^="treatment-line"]'; }
    get symptWrapper() { return '[class^="symptom-row"]'; }
    get contentWrapper() { return '[class^="line_"]'; }
    get checkinState() { return $('.checked-in-state'); }
    get dcStatus() { return '.group-status'; }
    get reComment() { return /(?<=Notes(\n|))(.)+?(?=(\n|)See)/g; }
    get noBtn() { return '.button=No'; }
    get submitBtn() { return $('.button.big-button'); }

    get isDCSectionExist() { return $(this.sectionWrapper).isExisting(); }

    get pigsUnderCare() {
        return $$('.PigsUnderCareLine').slice(-1)[0].$('<strong>').getText();
    }

    get audioBtn() {
        return isMobile
            ? $$('a[href$="/record-audio"]')[1] : $$('a[href$="/record-audio"]')[0];
    }

    get openGroups() {
        return $('.farm-actions').$('.stat-box*=Open Groups')
            .$('div[class^="stat-value"]').getText().match(/^(.+)(?=\/)/u)[0];
    }

    get checkinBtn() {
        return (isMobile)
            ? $('.panel').$('.checkin-btn')
            : $('.FarmProfileHeader').$('.checkin-btn');
    }

    clickCheckin() { return this.checkinBtn.waitClick() && this.waitLoader(); }
    clickAudio() { return this.audioBtn.waitClick() && this.waitLoader(); }
    submitDC() { return this.submitBtn.waitClick() && this.waitLoader(); }

    clickNoToReport(input) {
        this.section(input).$(this.noBtn).waitClick();
        this.waitLoader();
        return this;
    }

    section(input) {
        //TODO, try to avoid these scratches
        const sections = $$(this.sectionWrapper);
        if (typeof input === 'number' && input < sections.length ) {
            return sections[input];
        } else {
            return $(this.sectionWrapper + '*=' + input);
        }
    }

    chooseSection(input) {
        this.waitLoader().section(input).$$('.button').slice(-1)[0].waitClick();
        this.waitLoader().clear();
        return this;
    }

    isEmpty(input) {
        return this.section(input).$(this.noBtn).isExisting()
            || (this.getNumber(this.section(input)) === '0'
                && !this.getString(this.section(input), this.reComment));
    }

    isAllEmpty() {
        return $$(this.sectionWrapper).reduce((is, val, idx) => {
            return is && this.isEmpty(idx);
        }, true);
    }

    get reasons() { return this.section(1).$$(this.collapseWrapper); }
    reasonCollapse(idx = 0) { return this.reasons[idx].waitClick() && this.waitLoader(); }

    get moveInfo() { return super.moveInfo(this.section('Movement'), this.moveWrapper); }
    get deathInfo() { return super.deathInfo(this.section('Mortal'), this.deathWrapper); }
    get treatInfo() { return super.treatInfo(this.section('Medication'), this.treatWrapper); }
    get symptInfo() { return super.symptInfo(this.section('Symptom'), this.symptWrapper); }
    get tempsInfo() { return super.tempsInfo(this.section('Temps'), this.contentWrapper); }
    get waterInfo() { return super.waterInfo(this.section('Water'), this.contentWrapper); }
    get mediaInfo() { return super.mediaInfo(this.mediaUploader); }
    get audioInfo() { return super.audioInfo(this.mediaUploader); }

    clear() {
        this.removeComment();
        const rows = $$(this.rowIndex).length;
        for (let i = 0; i < rows - 1; i++) {
            this.deleteRow();
        }
        return this;
    }

    clearMedia() {
        const rows = $$('.asset-wrapper').length;
        for (let i = 0; i < rows; i++) {
            this.removeMediaButton.waitClick();
            browser.pause(1000);
        }
        return this;
    }

    clearSection(input) {
        this.openCurrent().waitLoader().chooseSection(input).waitLoader();
        super.clear().waitLoader();
        return this;
    }

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

        this.waitLoader().chooseSection(0);
        for (let i = 0, n = +data.moves.amount; i < n; i++) {
            (i === 0) || movePage.addRow().clickSelect();
            movePage.setMovement(data.moves.type[i],
                data.moves.heads[i], data.moves.weight[i], data.moves.condition[i]);
        }
        movePage.setComment(data.moves.comment).submit();
        this.modalWrapper.isExisting() && this.closeModal();
        this.isDCSectionExist || this.close();

        this.chooseSection(1);
        if ($(this.rowIndex).isExisting()) {
            for (let i = 0, n = data.deaths.reasons.length; i < n; i++) {
                (i === 0) || deathPage.addRow();
                deathPage.setMortWithReason(data.deaths.reasons[i],
                    data.deaths.chronic[i], data.deaths.acute[i], data.deaths.euthanas[i]);
            }
        } else {
            deathPage.setMortalities(
                data.deaths.chronic[0], data.deaths.acute[0], data.deaths.euthanas[0]);
        }
        deathPage.setComment(data.deaths.comment).submit();
        this.modalWrapper.isExisting() && this.closeModal();
        this.isDCSectionExist || this.close();

        this.chooseSection(2);
        for (let i = 0, n = +data.treats.amount; i < n; i++) {
            (i === 0) || treatPage.addRow();
            treatPage.setTreat(data.treats.name[i], data.treats.heads[i],
                data.treats.dosage[i], data.treats.gals[i]);
        }
        treatPage.setComment(data.treats.comment).submit();
        this.isDCSectionExist || this.close();

        this.chooseSection(3);
        for (let i = 0; i < +data.sympts.amount; i++) {
            (i === 0) || symptomPage.addRow();
            symptomPage.setSymptom(data.sympts.name[i]);
        }
        symptomPage.setComment(data.sympts.comment).submit();
        this.isDCSectionExist || this.close();

        this.chooseSection(4);
        tempsPage.setTemps(data.temps.high, data.temps.low)
            .setComment(data.temps.comment).submit();
        this.isDCSectionExist || this.close();

        this.chooseSection(5);
        waterPage.setGals(data.water.consumed)
            .setComment(data.water.comment).submit();
        this.isDCSectionExist || this.close();

        this.section('Media').isExisting() && this.chooseSection('Media');
        this.clearMedia().uploadMedia([data.files.video, data.files.pic, data.files.audio]);

        this.isPageOf('/barnsheets/') && this.submit().chooseSection(6, 'Notes');
        this.removeComment().setComment(data.comment);
        this.isPageOf('/barnsheets/') && this.submit();

        return this;
    }
}

module.exports = new CheckupPage();
