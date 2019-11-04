// resources.page.js
var ReportPage = require('./report.page');

class ResourcesPage extends ReportPage {
    get url() { return this.baseUrl + '/tenant-assets'; }
    get inputWrapper() { return $$('input[type=text]'); }
    get assetBox() { return $$('div[class^=asset-item-box]'); }
    get tenantRes() { return $('.TenantResources'); }
    get uploadList() { return $('div[class^="uploads-list_"]'); }

    clickAddLink() { return $('.add-resource-square=Link').waitClick() && this.waitLoader(); }
    clickGrigView() { return $('i.fa.fa-grid-two-up').waitClick() && this.waitLoader(); }
    clickListView() { return $('i.fa.fa-ulist').waitClick() && this.waitLoader(); }

    setName(str) { return this.inputWrapper[0].waitSetValue(str) && this; }
    setUrl(str) { return this.inputWrapper[1].waitSetValue(str) && this; }

    waitUpload() { return this.uploadList.waitForExist(undefined, true) && this; }
}

module.exports = new ResourcesPage();
