const fs = require('fs');

module.exports = class Page {
    constructor() {
        this.baseUrl = browser.config.baseUrl;
    }

    get netBox() { return '.NetworkNotificationBox'; }
    get myUrl() { return browser.getUrl(); }
    get root() { return $('#root'); }
    get header() { return $('.main-header'); }
    get onNet() { return $(this.netBox + '*=Back Online'); }
    get offNet() { return $(this.netBox + '*=No Internet Connection'); }
    get synced() { return $(this.netBox + '*=Syncing data'); }
    get invis() { return $(this.netBox + '.visible'); }
    get isMobile() { return $('.AppContainer.isMobile').isExisting(); }
    get isOffNet() { return this.offNet.isExisting(); }
    get notification() { return $('.rrt-text'); }
    get notifCloseBtn() { return $('.close-toastr'); }
    get nothingBox() { return $('.nothing-box'); }
    get pagination() { return $('.CustomSelect  '); }
    get nextPageBtn() { return $('.paginate_button.next'); }
    get prevPageBtn() { return $('.paginate_button.previous'); }
    get sideBar() { return $('.sidebar'); }
    get headerBar() { return $('.header-navigation'); }
    get topBar() { return $('.Breadcrumbs'); }
    get subBar() { return $('.Subnavigation'); }
    get modalWrapper() { return $('.ModalsContainer.isOpen'); }
    get arrow() { return '.fa.fa-angle-down'; }
    get dots() { return '.fa.fa-dots-three-horizontal'; }

    get checkup() {
        return isMobile
            ? $('.main-footer a[href="/daily-checkup"]')
            : this.sideBar.$('.item-name*=Checkup');
    }

    get farmfeed() {
        return isMobile
            ? $('.main-footer a[href="/farmfeed"]')
            : this.sideBar.$('.item-name*=Farmfeed');
    }

    get dropdownMenu() {
        let selector = $('.dropdown-layout.isOpen');
        return selector.isExisting() ? selector : $('.dropdown.active');
    }

    open(path = this.baseUrl) {
        browser.url(path);
        this.pause(1000).waitLoader();
        //to avoid test failure in mobile view due to notification overlay
        this.notifCloseBtn.isExisting() && this.clickOn(this.notifCloseBtn);
        return this;
    }

    reload() {
        browser.refresh();
        this.pause(1000).waitLoader();
        this.notifCloseBtn.isExisting() && this.clickOn(this.notifCloseBtn);
        return this;
    }

    pause(timeout = browser.config.pauseTimeout) {
        browser.pause(timeout);
        return this;
    }

    waitForSync() {
        this.pause(browser.config.syncTimeout)
            .onNet.waitForExist(100000);
        this.pause(browser.config.syncTimeout);
        return this;
    }

    waitForOff() {
        this.offNet.waitForExist();
        browser.pause(browser.config.syncTimeout);
        return this;
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

    waitLoader() {
        if ($$('.preloader.is-active').length) {
            browser.waitUntil(() => {
                return !($$('.preloader.is-active').length)
            }, 60000, 'Wait loader time is exceeded 60000ms');
        }
        return this;
    }

    clickOn(selector, wrapper = this.root) {
        if (typeof wrapper === 'string') { wrapper = $(wrapper); }
        if (typeof selector === 'string') { selector = wrapper.$(selector); }
        return selector.waitClick() && this.waitLoader();
    }

    clickBtn(str, wrapper = this.root) {
        if (typeof wrapper === 'string') { wrapper = $(wrapper); }
        const btn = wrapper.$('.button=' + str).$('span');
        return this.clickOn(btn);
    }

    clickCheckup() {
        return this.clickOn(this.checkup);
    }

    clickFarmfeed() {
        return this.clickOn(this.farmfeed);
    }

    clickSidebar(item) {
        return this.clickOn('span=' + item, this.sideBar);
    }

    clickHeaderTab(item) {
        return this.clickOn('span=' + item, this.headerBar);
    }

    clickSubTab(item) {
        return this.clickOn('span=' + item, this.subBar);
    }

    clickTopTab(item) {
        return this.clickOn('a*=' + item, this.topBar);
    }

    clickNextPage() {
        return this.clickOn(this.nextPageBtn);
    }

    clickPrevPage() {
        return this.clickOn(this.prevPageBtn);
    }

    clickToModal(str) {
        return this.clickBtn(str, this.modalWrapper);
    }

    closeModal() {
        this.modalWrapper.isExisting() && this.clickOn('.close-button', this.modalWrapper);
        return this;
    }

    clickMobileMenu(item) {
        const wrap = this.getClassName('[class^=section-row_]');
        return this.clickOn(`${wrap}=${item}`);
    }

    setElemsOnPage(number) {
        return this.clickOn(this.pagination.waitClick().$('option=' + number));
    }

    clickOption(str) {
        return this.clickOn('li*=' + str, this.dropdownMenu);
    }

    clickArrow(wrapper = this.root) {
        return this.clickOn(wrapper.$(this.arrow).$('..'));
    }

    clickDots(wrapper = this.root) {
        return this.clickOn(this.dots, wrapper);
    }

    isExist(input) {
        let exist = false;
        if (typeof input === 'string')
            exist = $(input.includes('=') ? input : `span=${input}`).isExisting();
        if (typeof input === 'object')
            exist = input.isExisting();
        return exist;
    }
    /********************************* Input *************************************/
    get collapseWrapper() { return '[class^="collapse_"]'; }

    get inputFile() {
        const input = 'input[type=file]';
        const idx = (isMobile && $$(input).length > 1) ? 1 : 0;
        return $$(input)[idx];
    }

    setSearch(str, wrap = this.root) {
        if (typeof wrap === 'string') { wrap = $(wrap); }
        const selector = wrap.$('input[placeholder^="Search..."]');
        return selector.waitSetValue(str) && this.waitLoader();
    }

    clearSearch() {
        return this.clickOn('.clear-icon');
    }

    getClassName(str) {
        return $(str).isExisting() ? `.${$(str).getProperty('classList')[0]}` : str;
    }

    getString(selector, regex = /.+/u) {
        return (selector.getText().match(regex) || [])[0];
    }

    getFloat(selector) {
        return (selector.getText().match(/(\d+.\d+)|(\d+)/u) || ['0'])[0];
    }

    getNumber(selector) {
        return (selector.getText().match(/[0-9\-]+/u) || ['0'])[0];
    }

    getArray(selector, regex = /.+/u) {
        return selector.map(el => (el.getText().match(regex) || [])[0])
            .filter(el => el !== undefined);
    }

    type(text, selector = 'textarea') {
        if (typeof selector === 'string') { selector = $(selector); }
        selector.waitSetValue(text);
        return this;
    }

    calendarDay(str) {
        return $('div[data-visible=true]').$('.CalendarDay=' + str);
    }

    setDay(day = '15') {
        return this.clickOn(this.calendarDay(day));
    }

    prevMonth() {
        return this.clickOn('button[aria-label^="Move backward"]');
    }

    nextMonth() {
        return this.clickOn('button[aria-label^="Move forward"]');
    }

    isDayAvailable(day) {
        return !this.calendarDay(day).getAttribute('aria-label').includes('Not available');
    }

    setDate(day) {
        this.isDayAvailable(day) || this.prevMonth().prevMonth().nextMonth();
        this.setDay(day);
        return this;
    }
    /********************************* Tables *************************************/
    get tableWrapper() { return $('.FlexTable'); }
    get tableRow() { return '.table-row'; }
    get tableItem() { return '.FlexTableItem'; }
    get tableColumns() { return $(this.tableRow).$$(this.tableItem); }
    get tableHeader() { return $('[class^=panel-heading]'); }
    get sortWrapper() { return '.allow-sort-column'; }
    get filterWrapper() { return $('[class^="table-filter"]'); }

    clickSortBy(str) {
        return this.clickOn('span', `${this.sortWrapper}*=${str}`);
    }

    clickFilterBy(item) {
        return this.clickOn('.filter_*=' + item, this.filterWrapper);
    }

    tableItemsWith(str) {
        str = str ? `*=${str}` : '';
        return $$(`${this.tableItem}${str}`);
    }

    tableRowsWith(str) {
        if (str) {
            const selector = this.getClassName(this.tableRow);
            return $$(`${selector}*=${str}`)
                .filter((el, index) => index % 2 === 0); //filter scratch because it finds extra child .table-row-item class
        } else {
            return $$(this.tableRow);
        }
    }

    cell(str, column = 0, row = 0) {
        return this.tableRowsWith(str)[row].$$(this.tableItem)[column];
    }

    clickCell(str, column, row) {
        return this.clickOn(this.cell(str, column, row));
    }

    clickMenuCell(str, row) {
        const col = isMobile ? 0 : this.tableColumns.length - 1;
        return this.clickDots(this.cell(str, col, row));
    }
    /********************************* Media *************************************/
    get mediaUploader() { return $('.MediaUploader'); }
    get uploadProgress() { return $('[class^=upload-progress]'); }
    get rmvMediaBtn() { return this.mediaUploader.$('.asset-wrapper .fa.fa-trash-o'); }
    get image() { return this.mediaUploader.$('.asset-wrapper .image'); }
    get audio() { return this.mediaUploader.$('.asset-wrapper .soundwave'); }
    get scale() { return $('.current-scale.visible'); }
    get mediaViewer() { return $('.mediaViewer.is-open'); }

    clickOnImg() {
        return this.clickOn('.bg-image');
    }

    clickScalePlus() {
        return this.clickOn('.fa.fa-search-plus');
    }

    clickScaleMinus() {
        return this.clickOn('.fa.fa-search-minus');
    }

    clickScaleOrig() {
        return this.clickOn('.fa.fa-maximize');
    }

    clickNextImg() {
        return this.clickOn('div[class*="nav-next"]');
    }

    clickPrevImg() {
        return this.clickOn('div[class*="nav-prev"]');
    }

    clickCloseView() {
        return this.clickOn('.header-btn__close');
    }

    uploadMedia(files, wrapper = '#root') {
        files = [].concat(files).flatMap(el => path.resolve(browser.config.mediaPath, el));
        const input = 'input[type=file]';
        const idx = (isMobile && $$(input).length > 1) ? 1 : 0;
        browser.execute(`document.querySelectorAll('${wrapper} ${input}')[${idx}].style.display = 'block'`);
        $$(input)[idx].waitForDisplayed();
        try {
            $$(input)[idx].setValue(files.join('\n'));
        } catch (err) {
            //console.error(err); //not throw, because of Safari issue
        } finally {
            return this.waitUploader();
        }
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
};
