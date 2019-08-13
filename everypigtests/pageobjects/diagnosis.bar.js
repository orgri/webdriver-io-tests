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

    clickSave() { return this.saveBtn.waitClick() && this; }
    clickGroupInfoTab() { return this.groupInfoTab.waitClick() && this; }
    clickDiagnosInfoCol() { return this.diagnosInfoColl.waitClick() && this; }

    setType(type, index) { return this.paramRow(index).$('span*=' + type).waitClick() && this; }
    setAlert(index) { return this.paramRow(index).$('.unchecked').waitClick() && this; }
    addNote(index) { return this.paramRow(index).$(this.addNoteBtn).waitClick() && this; }
    setComment(text, index) {
        this.paramRow(index).$(this.commentClosed).isExisting() && this.addNote(index);
        this.paramRow(index).$(this.comment).waitSetValue(text);
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
        data.name = this.getArray(dRows, reName);
        data.type = this.getArray(dRows, reType);
        data.comment = this.getArray(dNote, reComment);

        return data;
    }

}

module.exports = new DiagnosisBar();

