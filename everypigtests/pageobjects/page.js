module.exports = class Page {    
    constructor() {
        this.baseUrl = browser.config.baseUrl;
    }

    get myUrl() { return browser.getUrl(); }
    get onNet() { return $(".NetworkNotificationBox*=Back Online"); }
    get offNet() { return $(".NetworkNotificationBox*=No Internet Connection"); }
    get synced() { return $(".NetworkNotificationBox*=Syncing data"); }
    get checkup() { return $('.sidebar').$('.item-name*=Checkup'); }
    get mCheckup() { return $('.main-footer.hide-for-large').$('.title=Checkup'); }
    get barnsheets() { return $('.sidebar').$('.item-name*=Barn'); }
    get invis() { return $(".NetworkNotificationBox.visible"); }
    get isMobile() { return $('.AppContainer.isMobile').isExisting(); }
    get isOffNet() { return this.offNet.isExisting(); }
    get notification() { return $('.rrt-text'); }
    get inputFile() { return isMobile ? $$('input[type="file"]')[1] : $$('input[type="file"]')[0]; }
    get mediaUploader() { return $('.MediaUploader'); }
    get removeMediaButton() { return this.mediaUploader.$('.asset-wrapper').$('.fa.fa-trash-o'); }
    get image() { return this.mediaUploader.$('.asset-wrapper').$('.image'); }
    get audio() { return this.mediaUploader.$('.asset-wrapper').$('.soundwave'); }
    get pagination() { return $('.CustomSelect  '); }
    get nextPageBtn() { return $('.paginate_button.next'); }
    get prevPageBtn() { return $('.paginate_button.previous'); }

    clickCheckup() { this.isMobile ? this.mCheckup.waitAndClick() : this.checkup.waitAndClick(); }
    clickBarnSheets() { return this.barnsheets.waitAndClick() && this; }
    setElemsOnPage(number) { return this.pagination.waitAndClick().$('option=' + number).waitAndClick() && this; }
    clickNextPage() { return this.nextPageBtn.waitAndClick() && this; }
    clickPrevPage() { return this.prevPageBtn.waitAndClick() && this; }

    pause(timeout) {
        if (timeout === undefined) {
            browser.pause(browser.config.pauseTimeout);
        } else {
            browser.pause(timeout);
        }
        return this;
    }

    waitForSync() {
        browser.pause(browser.config.syncTimeout);
        this.onNet.waitForExist();
        browser.pause(browser.config.syncTimeout);
        return this;
    }

    waitForOff() {
        this.offNet.waitForExist();
        browser.pause(browser.config.syncTimeout);
        return this;
    }

    uploadMedia(file) {
        const path = require('path')
        const pathToMedia = path.resolve(browser.config.mediaPath, file);
        const idx = isMobile ? "2" : "1";
        const script = "document.getElementsByTagName('input')[IDX].style.display = 'block'".replace(/IDX/, idx);
        browser.execute(script);
        this.inputFile.waitForDisplayed();
        this.inputFile.setValueAndWait(pathToMedia);
        this.removeMediaButton.waitForExist();
        return this;
    }
    getArray(selector, regex) { return selector.map(el => (el.getText().match(regex) || [])[0]); }
    getString(selector, regex) { return (selector.getText().match(regex) || [])[0]; }
    getNumber(selector) { return selector.getText().match(/[0-9]+/)[0]; }
    getFloat(selector) { return selector.getText().match(/[\d+\.]+/u)[0]; }

}
