module.exports = class Page {
    constructor() {
        this.baseUrl = browser.config.baseUrl;
    }

    get myUrl() { return browser.getUrl(); }
    get onNet() { return $(".NetworkNotificationBox*=Back Online"); }
    get offNet() { return $(".NetworkNotificationBox*=No Internet Connection"); }
    get synced() { return $(".NetworkNotificationBox*=Syncing data"); }
    get invis() { return $(".NetworkNotificationBox.visible"); }
    get isMobile() { return $('.AppContainer.isMobile').isExisting(); }
    get isOffNet() { return this.offNet.isExisting(); }
    get notification() { return $('.rrt-text'); }
    get mediaUploader() { return $('.MediaUploader'); }
    get removeMediaButton() { return this.mediaUploader.$('.asset-wrapper').$('.fa.fa-trash-o'); }
    get image() { return this.mediaUploader.$('.asset-wrapper').$('.image'); }
    get audio() { return this.mediaUploader.$('.asset-wrapper').$('.soundwave'); }
    get pagination() { return $('.CustomSelect  '); }
    get nextPageBtn() { return $('.paginate_button.next'); }
    get prevPageBtn() { return $('.paginate_button.previous'); }
    get barnsheets() { return $('.sidebar').$('.item-name*=Barn'); }

    get checkup() {
        return isMobile
            ? $('.main-footer a[href="/daily-checkup"]')
            : $('.sidebar').$('.item-name*=Checkup');
    }
    get farmfeed() {
        return isMobile
            ? $('.main-footer a[href="/farmfeed"]')
            : $('.sidebar').$('.item-name*=Farmfeed');
    }

    get inputFile() {
        return isMobile ? $$('input[type="file"]')[1] : $$('input[type="file"]')[0];
    }

    clickCheckup() { return this.checkup.waitClick() && this.waitLoader(); }
    clickBarnSheets() { return this.barnsheets.waitClick() && this.waitLoader(); }
    clickFarmfeed() { return this.farmfeed.waitClick() && this.waitLoader(); }
    clickNextPage() { return this.nextPageBtn.waitClick() && this.waitLoader(); }
    clickPrevPage() { return this.prevPageBtn.waitClick() && this.waitLoader(); }

    setElemsOnPage(number) {
        return this.pagination.waitClick()
            .$('option=' + number).waitClick() && this.waitLoader();
    }

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
        this.onNet.waitForExist(100000);
        browser.pause(browser.config.syncTimeout);
        return this;
    }

    waitForOff() {
        this.offNet.waitForExist();
        browser.pause(browser.config.syncTimeout);
        return this;
    }

    waitLoader() {
        if ($('.preloader.is-active').isExisting()) {
            browser.waitUntil(() => {
                return !($('.preloader.is-active').isExisting())
            }, 15000, 'Wait loader time is exceeded 10000ms');
        }
        return this;
    }

    waitUploader() {
        browser.waitUntil(() => {
            return (this.notification.isExisting() || this.removeMediaButton.isExisting())
        }, 90000, 'Time to upload is exceeded 90000ms');
        return this;
    }

    uploadMedia(file) {
        const path = require('path')
        const pathToMedia = path.resolve(browser.config.mediaPath, file);
        const idx = isMobile ? "2" : "1";
        const script = "document.getElementsByTagName('input')[IDX].style.display = 'block'".replace(/IDX/, idx);
        browser.execute(script);
        this.inputFile.waitForDisplayed();
        this.inputFile.waitSetValue(pathToMedia);
        this.waitUploader();
        this.notification.isExisting() && browser.pause(5000);
        return this;
    }

    netOff() {
        browser.setNetworkConditions({ latency: 0, throughput: 0, offline: true });
        this.waitForOff();
        return this;
    }

    netOn(sync = true) {
        browser.deleteNetworkConditions();
        sync && this.waitForSync();
        return this;
    }

    reload() {
        browser.refresh();
        return this.waitLoader();
    }

    getArray(selector, regex) { return selector.map(el => (el.getText().match(regex) || [])[0]); }
    getString(selector, regex) { return (selector.getText().match(regex) || [])[0]; }
    getNumber(selector) { return (selector.getText().match(/[0-9]+/u) || ['0'])[0]; }
    getFloat(selector) { return (selector.getText().match(/[\d\.]+/u) || ['0'])[0]; }

}
