const resPage = require('../pageobjects/resources.page');

describe('Resources', () => {
    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest._currentRetry > 0 && resPage.reload();
        //because Sorting functionality is not available in mobile view
        isMobile && this.currentTest.title.includes('Sort') && this.skip();
    });

    it('Open', () => {
        isMobile ? resPage.clickDots('.main-footer').clickMobileMenu('Resources')
            : resPage.clickSidebar('Resources');

        expect(browser.getUrl(), 'url').match(/\/tenant-assets/);
    });

    it('Add link', () => {
        const link = 'www.example.com', name = tdata.randComment;
        resPage.clickBtn('Add')
            .clickAddLink()
            .setName(name)
            .setUrl(link)
            .clickToModal('Create');

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('Weblink');
    });

    it('Edit link', () => {
        const link = 'example.com', name = tdata.randComment;
        resPage.clickMenuCell()
            .clickOption('Edit Link')
            .setName(name)
            .setUrl(link)
            .clickToModal('Save');

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('Weblink');
    });

    it('Add video', () => {
        const name = tdata.randVideo;
        resPage.clickBtn('Add')
            .uploadMedia(name).waitUpload().pause(1500);

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('Video');
    });

    it('Download video', () => {
        resPage.clickMenuCell()
            .clickOption('Download');
        const file = resPage.assetName().getText();

        resPage.checkFileExists(file, 30000);
    });

    it('Edit video name', () => {
        const name = resPage.assetName().getText() + '_edited';
        resPage.clickMenuCell()
            .clickOption('Edit Name')
            .setName(name)
            .clickToModal('Save');

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('Video');
    });

    it('Open video', () => {
        resPage.clickOn(resPage.assetName());

        expect(resPage.mediaViewer.$('video').isExisting(), 'mediaViewer').to.equal(true);

        resPage.pause(1500).mediaViewer.doubleClick();
        resPage.pause(1500).mediaViewer.doubleClick();
        resPage.clickCloseView();

        expect(resPage.mediaViewer.isExisting(), 'mediaViewer').to.equal(false);
    });

    it('Add photo', () => {
        const name = tdata.randPhoto;
        resPage.clickBtn('Add')
            .uploadMedia(name).waitUpload().pause(1500);

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('Image');
    });

    it('Download photo', () => {
        resPage.clickMenuCell()
            .clickOption('Download');
        const file = resPage.assetName().getText();

        resPage.checkFileExists(file, 30000);
    });

    it('Edit photo name', () => {
        const name = resPage.assetName().getText() + '_edited';
        resPage.clickMenuCell()
            .clickOption('Edit Name')
            .setName(name)
            .clickToModal('Save');

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('Image');
    });

    it('Open photo', () => {
        resPage.clickOn(resPage.assetName()).pause(1500);

        expect(resPage.mediaViewer.$('img').isExisting(), 'mediaViewer').to.equal(true);

        isMobile || resPage.clickScalePlus().clickScalePlus()
            .clickScaleOrig().clickScaleMinus().clickScaleMinus();
        resPage.clickCloseView();

        expect(resPage.mediaViewer.isExisting(), 'mediaViewer').to.equal(false);
    });

    it('Add document', () => {
        const name = tdata.randDoc;
        resPage.clickBtn('Add')
            .uploadMedia(name).waitUpload().pause(1500);

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('DOC');
    });

    it('Download document', () => {
        resPage.clickOn(resPage.assetName()).pause(1500);
        const file = resPage.assetName().getText();

        resPage.checkFileExists(file, 30000);
    });

    it('Edit document name', () => {
        const name = resPage.assetName().getText() + '_edited';
        resPage.clickMenuCell()
            .clickOption('Edit Name')
            .setName(name)
            .clickToModal('Save');

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('DOC');
    });

    it('Add pdf', () => {
        const name = tdata.randPdf;
        resPage.clickBtn('Add')
            .uploadMedia(name).waitUpload().pause(1500);

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('PDF');
    });

    it('Download pdf', () => {
        resPage.clickMenuCell()
            .clickOption('Download');
        const file = resPage.assetName().getText();

        resPage.checkFileExists(file, 30000);
    });

    it('Edit pdf name', () => {
        const name = resPage.assetName().getText() + '_edited';
        resPage.clickMenuCell().clickOption('Edit Name')
            .setName(name).clickToModal('Save');

        expect(resPage.assetName().getText(), 'name').to.equal(name);
        isMobile || expect(resPage.assetType.getText(), 'type').to.equal('PDF');
    });

    it('Open pdf', () => {
        resPage.clickOn(resPage.assetName()).pause(1500);

        expect(resPage.mediaViewer.$('.react-pdf__Document').isExisting(), 'mediaViewer').to.equal(true);

        isMobile || resPage.clickScalePlus().clickScalePlus().clickScaleOrig()
            .clickScaleMinus().clickScaleMinus();

        $('[data-page-number="2"]').scrollIntoView({block: "center"});
        $('[data-page-number="3"]').scrollIntoView({block: "center"});

        resPage.clickCloseView();

        expect(resPage.mediaViewer.isExisting(), 'mediaViewer').to.equal(false);
    });

    it('Add unsupported file format', () => {
        const file = tdata.randAudio;
        resPage.clickBtn('Add')
            .uploadMedia(file);

        expect(resPage.notification.getText(), 'error text').to.have
            .string(file + ' has type not allowed, please upload files of type');
        expect(resPage.assetName().getText(), 'name').to.not.equal(file);
    });

    it('Grid view', () => {
        resPage.reload().clickGrigView();

        expect(resPage.assetBox[0].isExisting(), 'asset-box').to.equal(true);
    });

    it('List view', () => {
        resPage.clickListView();

        expect(resPage.assetBox, 'asset-box').to.have.lengthOf(0);
    });

    it('Sort by name', () => {
        resPage.clickSortBy('Name');

        let idx = --resPage.tableRowsWith().length,
            first = resPage.assetName().getText(),
            last = resPage.assetName(idx).getText();

        expect(first <= last, `${first} <= ${last}`).to.equal(true);

        resPage.clickSortBy('Name');

        first = resPage.assetName().getText();
        last = resPage.assetName(idx).getText();

        expect(first >= last, `${first} >= ${last}`).to.equal(true);
    });

    it('Sort by type', () => {
        resPage.clickSortBy('Type');

        let idx = --resPage.tableRowsWith().length,
            first = resPage.cell('',1).getText(),
            last = resPage.cell('',1, idx).getText();

        expect(first <= last, `${first} <= ${last}`).to.equal(true);

        resPage.clickSortBy('Type');

        first = resPage.cell('',1).getText();
        last = resPage.cell('',1, idx).getText();

        expect(first >= last, `${first} >= ${last}`).to.equal(true);
    });

    it('Sort by date', () => {
        resPage.clickSortBy('Date');

        let idx = --resPage.tableRowsWith().length,
            first = resPage.cell('',2).getText(),
            last = resPage.cell('',2, idx).getText();

        expect(first <= last, `${first} <= ${last}`).to.equal(true);

        resPage.clickSortBy('Date');

        first = resPage.cell('',2).getText();
        last = resPage.cell('',2, idx).getText();

        expect(first >= last, `${first} >= ${last}`).to.equal(true);
    });

    it('Search', () => {
        let idx = --(isMobile ? $$(resPage.row) : resPage.tableRowsWith()).length,
            last = resPage.assetName(idx).getText();

        resPage.setSearch(last);

        expect(resPage.assetName().getText(), 'name').to.equal(last);
    });

    it('Search special chars', () => {
        //just check whether page crashes or not, need to clarify expected behaviour
        resPage.setSearch('&').setSearch('%').setSearch('#').setSearch('\\')
            .setSearch('/').setSearch('\"').setSearch('$').setSearch('?')
            .setSearch('^').setSearch('|').setSearch(':').setSearch('*');

        expect(resPage.tenantRes.isExisting(), 'resources').to .equal(true);
    });

    it('Remove', () => {
        resPage.reload();
        let idx = --(isMobile ? $$(resPage.row) : resPage.tableRowsWith()).length,
            file = resPage.assetName(idx).getText();
        resPage.clickMenuCell('', idx).clickOption('Remove');
        const fileAfter = resPage.assetName(idx - 1).getText();

        expect(resPage.notification.getText(), 'error text')
            .to.equal('Asset has been deleted!');

        resPage.notification.waitForExist(undefined, true);

        expect(fileAfter, 'filename').to.not.equal(file);
    });

});
