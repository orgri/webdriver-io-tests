// checkup.page.js
var Page = require('./page');

class AdminPage extends Page {
    get mortReasonSection() { return $('.setting-section*=Track Mortality Reasons'); }
    get mortReasonSwitch() { return this.mortReasonSection.$('<label>'); }

    openPrefs() {
        browser.url(this.baseUrl + '/admin/preferences/settings');
        return this;
    }

    setOnMortReason() {
        this.mortReasonSwitch.scrollIntoView({ block: "center" });
        if (this.mortReasonSection.$('span*=OFF').isExisting()) {
            this.mortReasonSwitch.click();
            this.mortReasonSection.$('span*=ON').waitForExist();
        }
        expect(this.mortReasonSection.$('span*=ON').isExisting(), 'mortReasonSection.(ON).isExisting').to.equal(true);
        return this;
    }

    setOffMortReason() {
        this.mortReasonSwitch.scrollIntoView({ block: "center" });
        if (this.mortReasonSection.$('span*=ON').isExisting()) {
            this.mortReasonSwitch.click();
            this.mortReasonSection.$('span*=OFF').waitForExist();
        }
        expect(this.mortReasonSection.$('span*=OFF').isExisting(), 'mortReasonSection.(OFF).isExisting').to.equal(true);
        return this;
    }
}

module.exports = new AdminPage();
