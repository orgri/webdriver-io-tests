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
    get box() { return $('.DiagnosisSidebar'); }
    get diagnosTab() { return this.box.$('.item=Diagnose'); }
    get groupInfoTab() { return this.box.$('.item=Group Info'); }
    get groupInfoColl() { return $('.group-info-collapse'); }
    get diagnosInfoColl() { return $('.diagnose-collapse'); }

    clickSave() { return this.saveBtn.waitClick() && this.waitLoader(); }
    clickGroupInfoTab() { return this.groupInfoTab.waitClick() && this.waitLoader(); }
    clickDiagnosInfoCol() { return this.diagnosInfoColl.waitClick() && this.waitLoader(); }

    get info() {
        let data = {};
        const name = this.diagnosInfoColl.$$('div[class^=diagnosis-info-row] .semibold');
        const type = this.diagnosInfoColl.$$('div[class^=diagnosis-info-row] span span');
        const dNote = this.diagnosInfoColl.$$('div[class^=diagnosis-note-row] span[class^=Translation] > span');
        const reType = /(.+)(?=\sDiagnosis)/g;

        data.amount = this.getNumber(this.diagnosInfoColl);
        data.name = this.getArray(name);
        data.type = this.getArray(type, reType);
        data.comment = this.getArray(dNote);

        return data;
    }

    setType(type, index) {
        return this.inputBlock(index).$('span*=' + type).waitClick() && this;
    }

    setAlert(index) {
        return this.inputBlock(index).$('.unchecked').waitClick() && this;
    }

    addNote(index) {
        return this.inputBlock(index).$(this.addNoteBtn).waitClick() && this;
    }

    setComment(text, index) {
        this.inputBlock(index).$(this.commentClosed).isExisting() && this.addNote(index);
        this.inputBlock(index).$(this.comment).waitSetValue(text);
        return this;
    }

    setDiagnos(name, type, comment) {
        this.setDropdown(name);
        (type === undefined) || this.setType(type);
        (comment === undefined) || this.addNote();
        (comment === undefined) || this.setComment(comment);
        return this;
    }

}

module.exports = new DiagnosisBar();

