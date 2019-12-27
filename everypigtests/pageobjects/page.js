const fs = require('fs');

module.exports = class Page {
    constructor() {
        this.baseUrl = browser.config.baseUrl;
    }

    get myUrl() { return browser.getUrl(); }

    get root() {
        return $('#root');
    }

    get header() {
        return $('.main-header');
    }
    get onNet() { return $('.NetworkNotificationBox*=Back Online'); }
    get offNet() { return $('.NetworkNotificationBox*=No Internet Connection'); }
    get synced() { return $('.NetworkNotificationBox*=Syncing data'); }
    get invis() { return $('.NetworkNotificationBox.visible'); }
    get isMobile() { return $('.AppContainer.isMobile').isExisting(); }
    get isOffNet() { return this.offNet.isExisting(); }
    get notification() { return $('.rrt-text'); }
    get nothingBox() { return $('.nothing-box'); }
    get mediaUploader() { return $('.MediaUploader'); }
    get uploadProgress() { return $('[class^=upload-progress]'); }
    get removeMediaButton() { return this.mediaUploader.$('.asset-wrapper').$('.fa.fa-trash-o'); }
    get image() { return this.mediaUploader.$('.asset-wrapper').$('.image'); }
    get audio() { return this.mediaUploader.$('.asset-wrapper').$('.soundwave'); }
    get pagination() { return $('.CustomSelect  '); }
    get nextPageBtn() { return $('.paginate_button.next'); }
    get prevPageBtn() { return $('.paginate_button.previous'); }

    get sidebar() {
        return $('.sidebar');
    }

    get headerbar() {
        return $('.header-navigation');
    }

    get topbar() {
        return $('.Breadcrumbs');
    }

    get subbar() {
        return $('.Subnavigation');
    }
    get modalWrapper() { return $('.ModalsContainer.isOpen'); }

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
    clickFarmfeed() { return this.farmfeed.waitClick() && this.waitLoader(); }

    get arrow() {
        return '.fa.fa-angle-down';
    }

    get dropdownMenu() {
        let selector = $('.dropdown-layout.isOpen');
        return selector.isExisting() ? selector : $('.dropdown.active');
    }

    /********************************* Input *************************************/

    get collapseWrapper() { return '[class^="collapse_"]'; }

    clickSidebar(item) {
        return this.sidebar.$('span=' + item).waitClick() && this.waitLoader();
    }

    clickNextPage() { return this.nextPageBtn.waitClick() && this.waitLoader(); }
    clickPrevPage() { return this.prevPageBtn.waitClick() && this.waitLoader(); }

    clickHeaderTab(item) {
        return this.headerbar.$('span=' + item).waitClick() && this.waitLoader();
    }

    clickSubTab(item) {
        return this.subbar.$('span*=' + item).waitClick() && this.waitLoader();
    }

    clickTopTab(item) {
        return this.topbar.$('a*=' + item).waitClick() && this.waitLoader();
    }

    clickToModal(str) { return this.modalWrapper.$('.button=' + str).waitClick() && this.waitLoader(); }
    closeModal() { return this.modalWrapper.$('.close-button').waitClick() && this.waitLoader(); }

    setSearch(str, wrap = this.root) {
        if (typeof wrap === 'string') { wrap = $(wrap); }
        const selector = wrap.$('input[placeholder^="Search"]');
        return selector.waitSetValue(str) && this.waitLoader();
    }

    clearSearch() { return $('.clear-icon').waitClick() && this.waitLoader(); }

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

    open(path = this.baseUrl) {
        browser.url(path);
        this.waitLoader();
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
            }, 60000, 'Wait loader time is exceeded 60000ms');
        }
        return this;
    }

    waitUploader() {
        const n = $$('[class^=upload-progress]').length;
        browser.waitUntil(() => {
            return (this.notification.isExisting()
                || !this.uploadProgress.isExisting())
        }, 90000, 'Time to upload is exceeded 90000ms');
        browser.pause(n * 3000); // due to converting all formats to mp4 by backend
        return this;
    }

    clickBtn(str, wrapper = this.root) {
        if (typeof wrapper === 'string') { wrapper = $(wrapper); }
        return wrapper.$('.button=' + str).$('span').waitClick()
            && this.waitLoader();
    }

    convertFile(file) {
        const fs = require('fs');
        const path = require('path');
        const archiver = require('archiver');
        const localFilePath = path.resolve(browser.config.mediaPath, file);

        const zipData = [];
        const source = fs.createReadStream(localFilePath);

        return new Promise((resolve, reject) => {
            archiver('zip')
                .on('error', err => reject(err))
                .on('data', data => zipData.push(data))
                .on('end', () => browser.uploadFile(Buffer.concat(zipData)
                    .toString('base64')).then(resolve, reject))
                .append(source, { name: path.basename(localFilePath) })
                .finalize((err) => {
                    if (err) {
                        reject(err);
                    }
                });
        });
    }

    netOff() {
        browser.pause(2 * browser.config.syncTimeout);
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
    getClassName(str) { return '.' + $(str).getProperty('classList')[0]; }
    getString(selector, regex = /.+/u) { return (selector.getText().match(regex) || [])[0]; }
    getFloat(selector) { return (selector.getText().match(/(\d+.\d+)|(\d+)/u) || ['0'])[0]; }
    getNumber(selector) { return (selector.getText().match(/[0-9\-]+/u) || ['0'])[0]; }

    getArray(selector, regex = /.+/u) {
        return selector.map(el => (el.getText().match(regex) || [])[0])
            .filter(el => el !== undefined);
    }

    clickOn(selector, wrapper = this.root) {
        if (typeof wrapper === 'string') { wrapper = $(wrapper); }
        if (typeof selector === 'string') { selector = wrapper.$(selector); }

        return selector.waitClick() && this.waitLoader();
    }

    /********************************* Tables *************************************/

    get tableWrapper() { return $('.FlexTable'); }
    get tableRow() { return '.table-row'; }
    get tableItem() { return '.FlexTableItem'; }
    get tableColumns() { return $(this.tableRow).$$(this.tableItem); }
    get tableHeader() { return $('div[class^=panel-heading]'); }
    get sortWrapper() { return '.allow-sort-column'; }
    get filterWrapper() { return $('div[class^="table-filter"]'); }
    get dots() { return '.fa.fa-dots-three-horizontal'; }

    isExist(input) {
        let exist = false;
        if (typeof input === 'string')
            exist = $('span=' + input).isExisting();
        if (typeof input === 'object')
            exist = input.isExisting();
        return exist;
    }

    uploadMedia(files, wrapper = '#root') {
        files = [].concat(files).flatMap(el => path.resolve(browser.config.mediaPath, el));
        const idx = isMobile ? '1' : '0';
        browser.execute(`document.querySelectorAll('${wrapper} input[type=file]')[${idx}].style.display = 'block'`);
        this.inputFile.waitForDisplayed();
        try {
            this.inputFile.setValue(files.join('\n'));
        } catch (err) {
            //console.error(err); //not throw, because of Safari issue
        } finally {
            return this.waitUploader();
        }
    }

    clickSortBy(str) {
        return this.tableItemsWith(str)[0].$(this.sortWrapper)
            .$('span').waitClick() && this.waitLoader();
    }

    clickFilterBy(item) {
        return this.filterWrapper.$('.filter_*=' + item).waitClick()
            && this.waitLoader();
    }

    clickDots(wrapper = this.root) {
        return wrapper.$(this.dots).waitClick()
            && this.waitLoader();
    }

    tableItemsWith(str) {
        str = str ? ('*=' + str) : '';
        return $$(this.tableItem + str);
    }

    tableRowsWith(str) {
        if (str) {
            return $$(this.tableRow + '*=' + str)
                .filter((el, index) => index % 2 === 0); //filter scratch because it finds extra child .table-row-item class
        } else {
            return $$(this.tableRow);
        }
    }

    cell(str, column = 0, row = 0) { return this.tableRowsWith(str)[row].$$(this.tableItem)[column]; }

    clickCell(str, column, row) { return this.cell(str, column, row).waitClick() && this.waitLoader(); }

    clickMenuCell(str, row) {
        let col = this.tableColumns.length - 1;
        return this.clickDots(this.cell(str, col, row));
    }

    clickArrow(wrapper = this.root) {
        return wrapper.$(this.arrow).$('..').waitClick()
            && this.waitLoader();
    }

    clickOption(str) {
        return this.dropdownMenu.$('li*=' + str).waitClick() && this.waitLoader();
    }

    calendarDay(str) {
        return $('div[data-visible=true]').$('.CalendarDay=' + str);
    }

    isDayAvailable(day) {
        return !this.calendarDay(day).getAttribute('aria-label').includes('Not available');
    }

    prevMonth() {
        return $('button[aria-label^="Move backward"]').waitClick() && this;
    }

    nextMonth() {
        return $('button[aria-label^="Move forward"]').waitClick() && this;
    }

    setDay(day = '15') {
        return this.calendarDay(day).waitClick() && this;
    }

    setDate(day) {
        this.isDayAvailable(day) || this.prevMonth().prevMonth().nextMonth();
        this.setDay(day);
        return this;
    }

    /********************************* Media *************************************/

    get scale() { return $('.current-scale.visible'); }
    get mediaViewer() { return $('.mediaViewer.is-open'); }

    clickOnImg() { return $('.bg-image').waitClick() && this.waitLoader(); }
    clickScalePlus() { return $('.fa.fa-search-plus').waitClick() && this; }
    clickScaleMinus() { return $('.fa.fa-search-minus').waitClick() && this; }
    clickScaleOrig() { return $('.fa.fa-maximize').waitClick() && this; }
    clickNextImg() { return $('div[class*="nav-next"]').waitClick() && this; }
    clickPrevImg() { return $('div[class*="nav-prev"]').waitClick() && this; }
    clickCloseView() { return $('.header-btn__close').waitClick() && this; }

    checkFileExists(file, timeout) {
        const filePath = path.join(browser.config.downloadPath, file);
        browser.call(() => {
            return new Promise((resolve, reject) => {

                const timer = setTimeout(() => {
                    watcher.close();
                    reject(new Error(`${file} 
                        'does not exist and was not created during the timeout'`));
                }, timeout);

                fs.access(filePath, fs.constants.R_OK, (err) => {
                    if (!err) {
                        clearTimeout(timer);
                        watcher.close();
                        resolve();
                    }
                });

                const dir = path.dirname(filePath);
                const watcher = fs.watch(dir, (eventType, filename) => {
                    if (eventType === 'rename' && filename === file) {
                        clearTimeout(timer);
                        watcher.close();
                        resolve();
                    }
                });
            });
        });
        fs.unlinkSync(filePath);
    }
};
