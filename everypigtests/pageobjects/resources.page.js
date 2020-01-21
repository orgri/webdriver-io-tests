// resources.page.js
var ReportPage = require('./report.page');

class ResourcesPage extends ReportPage {
    constructor() {
        super();
        this.row = '[class^=asset-item-row]';
    }

    get url() { return this.baseUrl + '/tenant-assets'; }
    get input() { return $$('input[type=text]'); }
    get assetBox() { return $$('[class^=asset-item-box]'); }
    get tenantRes() { return $('.TenantResources'); }
    get uploadList() { return $('[class^=uploads-list_]'); }
    get assetType() { return this.cell('', 1); }
    get addWrapper() { return isMobile ? '.StickyFooter' : '[class^=resources-sub-nav]'; }
    get tableRow() { return '.table-row:not(.show-for-large)'; } //tableRow is changed to avoid header of table

    assetName(idx = 0) {
        return isMobile
            ? $$(`${this.row} [class^=name]`)[idx]
            : this.cell('',0, idx).$('[class^=asset-name]');
    }

    clickAddLink() {
        return this.clickOn('.add-resource-square=Link');
    }

    clickGrigView() {
        return this.clickOn('i.fa.fa-grid-two-up');
    }

    clickListView() {
        return this.clickOn('i.fa.fa-ulist');
    }

    clickBtn(str, wrapper) {
        wrapper = (str === 'Add') ? this.addWrapper : wrapper;
        return super.clickBtn(str, wrapper);
    }

    clickMenuCell(str, row = 0) {
        const wrap = $$(this.row)[row];
        return isMobile ? this.clickDots(wrap) : super.clickMenuCell(str, row);
    }

    setName(str) {
        return this.input[0].waitSetValue(str) && this;
    }

    setUrl(str) {
        return this.input[1].waitSetValue(str) && this;
    }

    waitUpload() {
        return this.uploadList.waitForExist(undefined, true) && this;
    }
}

module.exports = new ResourcesPage();
