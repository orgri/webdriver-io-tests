// checkup.page.js
var ReportPage = require('./report.page');

class CheckupPage extends ReportPage {
    constructor() {
        super();
        this.id = '0';
        this.farm,
        this.group
    }

/********************************************** Navigation *****************************************************/
    get checkupUrl() { return this.baseUrl + '/daily-checkup/'; }
    get farmRow() { return '.DailyCheckupsFarmRow'; }
    get groupRow() { return '.DailyCheckupsGroupRow'; }
    get rowDC() { return '.row-content'; }
    get farmName() { return isMobile ? $('.main-header h1') : $('.farm-information h1'); }
    get groupName() { return isMobile ? $('.main-header h1') : $('.Breadcrumbs .nowActive'); }
    get backLink() { return $('.main-header').$('.back-link'); }
    get modalWrapper() { return $('.ModalsContainer.isOpen'); }
    get offlineWarning() { return $('.offline-no-checkup-warning'); }

    setId() { this.id = (this.myUrl.match(/[0-9]+$/) || ['0'])[0]; return this; }
    setFarm() { this.farm = this.farmName.getText(); return this; }
    setGroup(row) { this.group = this.getString(row.$('.group-name'), /(?<=Group\s•\s)(.+)/u); return this;}
    rowWith(str) { return $(this.rowDC + '*=' + str); }
    clickGroupInfoTab() { return $('.item=Group Info').waitClick() && this.waitLoader(); }
    clickCheckupTab() { return $('.item=Checkup').waitClick() && this.waitLoader(); }
    clickToModal(str) {return this.modalWrapper.$('.button=' + str).waitClick() && this.waitLoader(); }
    isPageOf(regex) { return browser.getUrl().includes(regex); }

    chooseFarm(name) {
        return $(this.farmRow + '*=' + name)
            .$$('.button').slice(-1)[0].waitClick() && this.waitLoader();
    }

    chooseGroup(name) {
        return $(this.groupRow + '*=' + name)
            .$$('.button').slice(-1)[0].waitClick() && this.waitLoader();
    }
 
    open(path = this.checkupUrl) {
        browser.url(path);
        this.waitLoader();
        return this;
    }

    openCurrent() { return this.open(this.checkupUrl + this.id) && this.waitLoader(); }

    chooseRandCheckup() {
        !this.offNet.isExisting() && this.open();
        this.clickCheckup().setElemsOnPage(100);
        const rows = $$(this.rowDC + ' .button');
        rows[tdata.rand(rows.length - 1)].waitClick();
        this.waitLoader().setFarm();
        const openGroups = $$(this.rowDC + ' .red-marker').length / 2;
        if (openGroups === 0) {
            this.chooseRandCheckup();
        } else {
            const id = tdata.rand(openGroups - 1);
            if (rows[id].getText() === 'Start') {
                this.setGroup($$(this.rowDC)[id]);
                rows[id].waitClick();
            } else {
                this.chooseRandCheckup();
            }
        }
        return this.waitLoader().setId();
    }

/********************************************** Checkup *****************************************************/

    get sectionWrapper() { return '.checkup-segment'; }
    get collapseWrapper() { return 'div[class^="collapse_"]'; }
    get treatWrapper() { return 'div[class^="treatment-line"]'; }
    get symptWrapper() { return 'div[class^="symptom-row"]'; }
    get contentWrapper() { return 'div[class^="line"]'; }
    get checkinState() { return $('.checked-in-state'); }
    get dcStatus() { return '.group-status'; }
    get reComment() { return /(?<=Notes\n)(.|\n)+?(?=\nSee)/g; }
    get noBtn() { return '.button=No'; }
    get submitBtn() { return $('.button.big-button'); }

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

    isMoveExist(type) { return this.section(0).$('.info-row*=' + type).isExisting(); }

    moveRowInfo(type) {
        return (this.isMoveExist(type)) ?
            this.section(0).$$('.info-row*=' + type)
                .map(el => el.$('.float-right').getText().toLowerCase()) : [];
    }

    get isReasonExist() { return this.section(1).$(this.collapseWrapper).isExisting(); }
    get reasons() { return this.section(1).$$(this.collapseWrapper); }
    reasonCollapse(idx = 0) { return this.reasons[idx].waitClick() && this.waitLoader(); }

    deathRowInfo(type) {
        return (this.isReasonExist)
            ? this.reasons.map(el => this.getNumber( el.$('span*=' + type) ) )
            : this.getNumber(this.section(1).$('.item*=' + type).$('div[class^="value"]'));
    }

    get moveInfo() {
        let obj = new Object();

        obj.amount = this.getNumber(this.section(0));
        obj.added = this.moveRowInfo('Added');
        obj.removed = this.moveRowInfo('Removed');
        obj.weight = this.moveRowInfo('Weight');
        obj.condition = this.moveRowInfo('Condition');
        obj.comment = this.getString(this.section(0), this.reComment);

        return obj;
    }

    get deathInfo() {
        let obj = new Object();
        const reReason = /(.+)(?=\s\u2022)/u;

        obj.amount = this.getNumber(this.section(1));
        obj.reason = this.isReasonExist ? this.getArray(this.reasons, reReason) : undefined;
        obj.acute = this.deathRowInfo('Acute');
        obj.chronic = this.deathRowInfo('Chronic');
        obj.ethanas = this.deathRowInfo('Euthanasia');
        obj.comment = this.getString(this.section(1), this.reComment);

        return obj;
    }

    get treatInfo() {
        let obj = new Object();
        const selector = this.section(2).$$(this.treatWrapper);
        const reName = /(.+?)(?=(\s\u2022)|(\n\d+))/u;
        const reDosage = /(?<=\u2022\s)(\d+\.\d+)/u;
        const reHeads = /(\d+)$/u;
        const reGals = /(\d+)(?=\sgal)/u;

        obj.amount = this.getNumber(this.section(2));
        obj.name = this.getArray(selector, reName).filter(el => el !== undefined);
        obj.dosage = this.getArray(selector, reDosage).filter(el => el !== undefined)
        obj.heads = this.getArray(selector, reHeads).filter(el => el !== undefined);
        obj.gals = this.getArray(selector, reGals).filter(el => el !== undefined);
        obj.comment = this.getString(this.section(2), this.reComment);

        return obj;
    }

    get symptInfo() {
        let obj = new Object();
        const selector = this.section(3).$$(this.symptWrapper);
        const reName = /(.+)(?=\n)/u;
        const rePercent = /(\d+)%/u;

        obj.amount = this.getNumber(this.section(3));
        obj.name = this.getArray(selector, reName);
        obj.percent = this.getArray(selector, rePercent);
        obj.comment = this.getString(this.section(3), this.reComment);

        return obj;
    }

    get tempsInfo() {
        let obj = new Object();
        const selector = this.section(4).$$(this.contentWrapper);

        obj.high = this.getFloat(selector[0]);
        obj.low = this.getFloat(selector[1]);
        obj.comment = this.getString(this.section(4), this.reComment);

        return obj;
    }

    get waterInfo() {
        let obj = new Object();
        const selector = this.section(5);
        obj.consumed = this.getFloat(selector.$(this.contentWrapper));
        obj.comment = this.getString(selector, this.reComment);

        return obj;
    }

    get mediaInfo() {
        let obj = new Object();
        const reComment = /(?<=Note\n)(.+)/g;

        obj.amount = this.getNumber(this.mediaUploader);
        obj.audioNote = this.getString(this.mediaUploader, reComment);

        return obj;
    }

    clear() {
        this.removeComment();
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

    clearSection(input) {
        this.openCurrent().waitLoader().chooseSection(0).waitLoader();
        super.clear().waitLoader();
        return this;
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
            (i === 0) || movePage.addRow().clickSelectParam();
            movePage.setMovement(data.moves.type[i],
                data.moves.heads[i], data.moves.weight[i], data.moves.condition[i]);
        }
        movePage.setComment(data.moves.comment).submit().waitLoader();

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
        deathPage.setComment(data.deaths.comment).submit().waitLoader();

        this.chooseSection(2);
        for (let i = 0, n = +data.treats.amount; i < n; i++) {
            (i === 0) || treatPage.addRow();
            treatPage.setTreat(data.treats.name[i], data.treats.heads[i],
                data.treats.dosage[i], data.treats.gals[i]);
        }
        treatPage.setComment(data.treats.comment).submit().waitLoader();

        this.chooseSection(3);
        for (let i = 0; i < +data.sympts.amount; i++) {
            (i === 0) || symptomPage.addRow();
            symptomPage.setSymptom(data.sympts.name[i]);
        }
        symptomPage.setComment(data.sympts.comment).submit().waitLoader();

        this.chooseSection(4);
        tempsPage.setTemps(data.temps.high, data.temps.low).submit().waitLoader();

        this.chooseSection(5);
        waterPage.setGals(data.water.consumed).submit().waitLoader();

        this.section('Media').isExisting() && this.chooseSection('Media').waitLoader();
        this.clearMedia().uploadMedia(data.files.pic)
            .uploadMedia(data.files.video)
            .uploadMedia(data.files.audio);

        this.isPageOf('/barnsheets/') && this.submit().waitLoader()
            .chooseSection(6, 'Notes').waitLoader();
        this.setComment(data.comment);
        this.isPageOf('/barnsheets/') && this.submit().waitLoader(); 

        return this;
    }
}

module.exports = new CheckupPage();