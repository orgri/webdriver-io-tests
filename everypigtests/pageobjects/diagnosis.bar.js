// diagnosis.bar.js
var ReportPage = require('./report.page');

class DiagnosisBar extends ReportPage {
    constructor() {
        super();
        this.row = '[class^="diagnosis-field"]';
    }

    get addRowBtn() { return isMobile ? $('.add-disease') : $('[class^="add-diagnosis"]'); }
    get trashBtn() { return '.fa-trash-o'; }
    get closeBtn() { return $('.cancel-button'); }
    get cancelBtn() { return $('.button=Cancel'); }
    get saveBtn() { return $('button*=Save'); }
    get box() { return $('.DiagnosisSidebar'); }
    get diagnosTab() { return this.box.$('.item=Diagnose'); }
    get groupInfoTab() { return this.box.$('.item=Group Info'); }
    get groupInfoColl() { return $('.group-info-collapse'); }
    get diagnosCollapse() { return $('.diagnose-collapse'); }
    get diagnosWrapper() { return '[class^=diagnosis-info-row]'; }

    clickSave() { return this.saveBtn.waitClick() && this.waitLoader(); }
    clickGroupInfoTab() { return this.groupInfoTab.waitClick() && this.waitLoader(); }
    clickDiagnosInfoCol() { return this.diagnosCollapse.waitClick() && this.waitLoader(); }

    get info() { return super.diagnosInfo(this.diagnosCollapse, this.diagnosWrapper); }

    setType(type, index) {
        return this.block(index).$('span*=' + type).waitClick() && this;
    }

    setAlert(index) {
        return this.block(index).$('.unchecked').waitClick() && this;
    }

    addNote(index) {
        return this.block(index).$(this.addNoteBtn).waitClick() && this;
    }

    setComment(text, index) {
        this.block(index).$(this.commentClosed).isExisting() && this.addNote(index);
        this.block(index).$(this.comment).waitSetValue(text);
        return this;
    }

    setDiagnos(name, type, comment) {
        if(isMobile) {
            this.setPicker(name)
                .clickBtn('Next');
        } else {
            this.setDropdown(name);
        }
        (type === undefined) || this.setType(type);
        (comment === undefined) || this.addNote();
        (comment === undefined) || this.setComment(comment);
        return this;
    }

}

module.exports = new DiagnosisBar();

