const resPage = require('../pageobjects/resources.page');

describe('Resources', () => {
    beforeEach(function () {
        this.currentTest.retries(1);
        this.currentTest._currentRetry > 0 && resPage.reload();
    });

    it('Open', () => {
        resPage.clickResources();

        expect(browser.getUrl(), 'url').match(/\/tenant-assets/);
    });

    it('Add link', () => {
        const link = 'www.example.com', name = tdata.randComment;
        resPage.clickBtn('Add').clickAddLink()
            .setName(name).setUrl(link).clickToModal('Create');

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(name);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('Weblink');
    });

    it('Edit link', () => {
        const link = 'example.com', name = tdata.randComment;
        resPage.clickMenuCell('', 1).clickOption('Edit Link')
            .setName(name).setUrl(link).clickToModal('Save');

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(name);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('Weblink');
    });

    it('Add video', () => {
        const video = tdata.randVideo;
        resPage.clickBtn('Add').uploadMedia(video).waitUpload();
        //browser.pause(3000);

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(video);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('Video');
    });

    it('Download video', () => {
        resPage.clickMenuCell('', 1).clickOption('Download');
        const file = resPage.cell('',0,1).getText();
        
        resPage.checkFileExists(file, 30000);
    });

    it('Edit video name', () => {
        const name = resPage.cell('',0,1).getText() + '_edited';
        resPage.clickMenuCell('', 1).clickOption('Edit Name')
            .setName(name).clickToModal('Save');

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(name);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('Video');
    });

    it('Open video', () => {
        resPage.cell('',0,1).$('div[class^="asset-name"]').waitClick();
        resPage.waitLoader();

        expect(resPage.mediaViewer.$('video').isExisting(), 'mediaViewer').to.equal(true);
        
        browser.pause(1500);
        resPage.mediaViewer.doubleClick();
        browser.pause(1500);
        resPage.mediaViewer.doubleClick();

        resPage.clickCloseView();

        expect(resPage.mediaViewer.isExisting(), 'mediaViewer').to.equal(false);
    });


    it('Add photo', () => {
        const photo = tdata.randPhoto;
        resPage.clickBtn('Add').uploadMedia(photo).waitUpload();
        browser.pause(1500);

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(photo);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('Image');
    });

    it('Download photo', () => {
        resPage.clickMenuCell('', 1).clickOption('Download');
        const file = resPage.cell('',0,1).getText();
        
        resPage.checkFileExists(file, 30000);
    });

    it('Edit photo name', () => {
        const name = resPage.cell('',0,1).getText() + '_edited';
        resPage.clickMenuCell('', 1).clickOption('Edit Name')
            .setName(name).clickToModal('Save');

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(name);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('Image');
    });

    it('Open photo', () => {
        resPage.cell('',0,1).$('div[class^="asset-name"]').waitClick();
        resPage.waitLoader();

        expect(resPage.mediaViewer.$('img').isExisting(), 'mediaViewer').to.equal(true);

        browser.pause(1500);
        resPage.clickScalePlus().clickScalePlus()
            .clickScaleOrig().clickScaleMinus().clickScaleMinus();

        resPage.clickCloseView();

        expect(resPage.mediaViewer.isExisting(), 'mediaViewer').to.equal(false);
    });

    it('Add document', () => {
        const doc = tdata.randDoc;
        resPage.clickBtn('Add').uploadMedia(doc).waitUpload();
        browser.pause(1500);

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(doc);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('DOC');
    });

    it('Download document', () => {
        resPage.cell('',0,1).$('div[class^="asset-name"]').waitClick();
        const file = resPage.cell('',0,1).getText();
        
        resPage.checkFileExists(file, 30000);
    });

    it('Edit document name', () => {
        const name = resPage.cell('',0,1).getText() + '_edited';
        resPage.clickMenuCell('', 1).clickOption('Edit Name')
            .setName(name).clickToModal('Save');

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(name);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('DOC');
    });

    it('Add pdf', () => {
        const pdf = tdata.randPdf;
        resPage.clickBtn('Add').uploadMedia(pdf).waitUpload();
        browser.pause(1500);

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(pdf);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('PDF');
    });

    it('Download pdf', () => {
        resPage.clickMenuCell('', 1).clickOption('Download');
        const file = resPage.cell('',0,1).getText();
        
        resPage.checkFileExists(file, 30000);
    });

    it('Edit pdf name', () => {
        const name = resPage.cell('',0,1).getText() + '_edited';
        resPage.clickMenuCell('', 1).clickOption('Edit Name')
            .setName(name).clickToModal('Save');

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(name);
        expect(resPage.cell('',1,1).getText(), 'type').to.equal('PDF');
    });

    it('Open pdf', () => {
        resPage.cell('',0,1).$('div[class^="asset-name"]').waitClick();
        resPage.waitLoader();

        expect(resPage.mediaViewer.$('.react-pdf__Document').isExisting(), 'mediaViewer').to.equal(true);

        resPage.clickScalePlus().clickScalePlus().clickScaleOrig()
            .clickScaleMinus().clickScaleMinus();
        //browser.pause(1500);

        $('div[data-page-number="2"]').scrollIntoView({block: "center"});
        $('div[data-page-number="3"]').scrollIntoView({block: "center"});

        resPage.clickCloseView();

        expect(resPage.mediaViewer.isExisting(), 'mediaViewer').to.equal(false);
    });

    it('Add unsupported file format', () => {
        const file = tdata.randAudio;
        resPage.clickBtn('Add').uploadMedia(file);

        expect(resPage.notification.getText(), 'error text').to.have
            .string(file + ' has type not allowed, please upload files of type')
        expect(resPage.cell('',0,1).getText(), 'name').to.not.equal(file);
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

        let idx = --resPage.tableRowsWith('').length,
            first = resPage.cell('',0,1).getText(),
            last = resPage.cell('',0,idx).getText();

        expect(first <= last, 'fist <= last').to.equal(true);

        resPage.clickSortBy('Name');

        first = resPage.cell('',0,1).getText();
        last = resPage.cell('',0,idx).getText();

        expect(first >= last, 'first >= last').to.equal(true);
    });

    it('Sort by type', () => {
        resPage.clickSortBy('Type');

        let idx = --resPage.tableRowsWith('').length,
            first = resPage.cell('',1,1).getText(),
            last = resPage.cell('',1,idx).getText();

        expect(first <= last, 'first <= last').to.equal(true);

        resPage.clickSortBy('Type');

        first = resPage.cell('',1,1).getText();
        last = resPage.cell('',1,idx).getText();

        expect(first >= last, 'first >= last').to.equal(true);
    });

    it('Sort by date', () => {
        resPage.clickSortBy('Date');

        let idx = --resPage.tableRowsWith('').length,
            first = resPage.cell('',2,1).getText(),
            last = resPage.cell('',2,idx).getText();

        expect(first <= last, 'first <= last').to.equal(true);

        resPage.clickSortBy('Date');

        first = resPage.cell('',2,1).getText();
        last = resPage.cell('',2,idx).getText();

        expect(first >= last, 'first >= last').to.equal(true);
    });

    it('Search', () => {
        let idx = --resPage.tableRowsWith('').length,
            last = resPage.cell('',0,idx).getText();

        resPage.setSearch(last);

        expect(resPage.cell('',0,1).getText(), 'name').to.equal(last);
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
        const rows = resPage.tableRowsWith('').length,
            idx = tdata.rand(rows - 2) + 1;
            file = resPage.cell('', 0, idx).getText();
        resPage.clickMenuCell('', idx).clickOption('Remove')
        const fileAfter = resPage.cell('', 0, idx).getText();

        expect(resPage.notification.getText(), 'error text')
            .to.equal('Asset has been deleted!');

        resPage.notification.waitForExist(undefined, true);

        expect(fileAfter, 'filename').to.not.equal(file);
    });

});