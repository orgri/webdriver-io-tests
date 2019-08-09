// diagnosis.bar.js
var ReportPage = require('./report.page');

class DiagnosisBar extends ReportPage {
    constructor() {
        super();
        this.row = 'div[class^="diagnosis-field"]';
    }

    get addRowBtn() { return $('div[class^="add-diagnosis"]'); }
    get trashBtn() { return '.fa-trash-o'; }
    get closeBtn() { return $('.cancel-button'); }
    get cancelBtn() { return $('.button=Cancel'); }
    get saveBtn() { return $('button*=Save'); }
    get selectWrapper() { return '.ReactSelect'; }
    get box() { return $('.DiagnosisSidebar'); }
    get diagnosTab() { return this.box.$('.item=Diagnose'); }
    get groupInfoTab() { return this.box.$('.item=Group Info'); }
    get groupInfoColl() { return $('.group-info-collapse'); }
    get diagnosInfoColl() { return $('.diagnose-collapse'); }

    clickSave() { return this.saveBtn.waitAndClick() && this; }
    clickGroupInfoTab() { return this.groupInfoTab.waitAndClick() && this; }
    clickDiagnosInfoCol() { return this.diagnosInfoColl.waitAndClick() && this; }

    setType(type, index) { return this.paramRow(index).$('span*=' + type).waitAndClick() && this; }
    setAlert(index) { return this.paramRow(index).$('.unchecked').waitAndClick() && this; }
    addNote(index) { return this.paramRow(index).$(this.addNoteBtn).waitAndClick() && this; }
    setComment(text, index) {
        this.paramRow(index).$(this.commentClosed).isExisting() && this.addNote(index);
        this.paramRow(index).$(this.comment).setValueAndWait(text);
        return this;
    }

    setDiagnos(name, type, comment) {
        this.setReportParam(name);
        (type == undefined) || this.setType(type);
        (comment == undefined) || this.addNote();
        (comment == undefined) || this.setComment(comment);
        return this;
    }

    get info() {
        let data = new Object();
        const dRows = this.diagnosInfoColl.$$('div[class^=diagnosis-info-row]');
        const dNote = this.diagnosInfoColl.$$('div[class^=diagnosis-note-row]');
        const reName = /.+/u;
        const reType = /(?<=\n)(.+)(?=\sDiagnosis)/g;
        const reComment = /(?<=Notes:\s)(.|\n)+?(?=\nSee)/g;

        data.amount = this.getNumber(this.diagnosInfoColl);
        data.name = this.getArray(dRows, reName); //this.diagnosInfoRows.map(el => (el.getText().match(reName) || [])[0]);
        data.type = this.getArray(dRows, reType); //this.diagnosInfoRows.map(el => (el.getText().match(reType) || [])[0]);
        data.comment = this.getArray(dNote, reComment); //this.diagnosNoteRows.map(el => (el.getText().match(reComment) || [])[0]);

        return data;
    }

}

module.exports = new DiagnosisBar();

