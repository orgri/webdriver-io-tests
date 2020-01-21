// diagnosis.bar.js
var ReportPage = require('./report.page');

class DiagnosisBar extends ReportPage {
    constructor() {
        super();
        this.row = '[class^="diagnosis-field"]';
    }

    get box() { return $('.DiagnosisSidebar'); }
    get addRowBtn() { return isMobile ? $('.add-disease') : $('[class^="add-diagnosis"]'); }
    get trashBtn() { return '.fa-trash-o'; }
    get closeBtn() { return isMobile ? 'i.back-link' : '.cancel-button'; }
    get diagnosTab() { return this.box.$('.item=Diagnose'); }
    get groupInfoTab() { return this.box.$('.item=Group Info'); }
    get groupInfoColl() { return $('.group-info-collapse'); }
    get diagnosCollapse() { return $('.diagnose-collapse'); }
    get diagnosWrapper() { return '[class^=diagnosis-info-row]'; }
    get info() { return super.diagnosInfo(this.diagnosCollapse, this.diagnosWrapper); }

    clickGroupInfoTab() {
        return this.clickOn(this.groupInfoTab);
    }

    clickDiagnosInfoCol() {
        return this.clickOn(this.diagnosCollapse);
    }

    setType(type, id) {
        return this.clickOn(this.block(id).$(`span*=${type}`));
    }

    setAlert(id) {
        return this.clickOn(this.block(id).$('.unchecked'));
    }

    setDiagnos(name, type, comment) {
        if (isMobile) {
            this.setPicker(name).clickBtn('Next');
        } else {
            this.setDropdown(name);
        }
        (type === undefined) || this.setType(type, this.index);
        (comment === undefined) || this.addNote(this.index);
        (comment === undefined) || this.setComment(comment, this.index);
        return this;
    }
}

module.exports = new DiagnosisBar();

