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
    get navWrapper() { return isMobile ? '.StickyFooter' : '.center-box-footer'; }

    record() {
        return this.clickOn(this.recordBtn);
    }

    continue() {
        return this.clickBtn('Continue', this.navWrapper);
    }

    save() {
        return this.clickBtn('Save', this.navWrapper);
    }

    waitForOpen() {
        return this.recordBtn.waitForExist() && this;
    }
}

module.exports = new AudioPage();
