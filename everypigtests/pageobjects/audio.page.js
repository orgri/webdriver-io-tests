// checkup.page.js
//import Page from './page';
var ReportPage = require('./report.page');

class AudioPage extends ReportPage {

    get recordBtn() { return $('.button.main-control'); }
    get playBtn() { return $('.control-button .fa-play'); }
    get stopBtn() { return $('.control-button .fa-stop'); }
    get cancelBtn() { return $('.cancel-button'); }
    get time() { return $('.recording-time').getText(); }
    get isSubmitDisabled() { return $('.button.disabled=Continue').isExisting(); }
    get isCancelDisabled() { return $('.cancel-button.disabled').isExisting(); }
    get isPlayDisabled() { return $('.control-button.disabled .fa-play').isExisting(); }

    get continueBtn() {
        return isMobile ? $$('.button=Continue')[1] : $$('.button=Continue')[0];
    }
    get saveBtn() {
        return isMobile ? $$('.button=Save')[1] : $$('.button=Save')[0];
    }

    record() { return this.recordBtn.waitClick() && this; }
    continue() { return this.continueBtn.waitClick() && this.waitLoader(); }
    save() { return this.saveBtn.waitClick() && this.waitLoader(); }

    waitForOpen() { return this.recordBtn.waitForExist() && this; }

}

module.exports = new AudioPage();