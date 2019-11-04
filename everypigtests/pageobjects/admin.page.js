// admin.page.js
const Page = require('./page');

class AdminPage extends Page {
    section(str) { return $('.setting-section*=' + str); }
    switch(str) { return this.section(str).$('<label>'); }

    openPrefs(tab = 'Settings') {
        if (tab === 'Settings')
            browser.url(this.baseUrl + '/admin/preferences/settings');
        else if (tab === 'DC')
            browser.url(this.baseUrl + '/admin/preferences/daily-checkup');
        else if (tab === 'Integrations')
            browser.url(this.baseUrl + '/admin/preferences/integrations');

        return this.waitLoader();
    }

    setOn(str) {
        this.section(str).scrollIntoView({ block: "center" });
        if (this.section(str).$('span*=OFF').isExisting()) {
            this.switch(str).click();
            this.section(str).$('span*=ON').waitForExist();
        }
        expect(this.section(str).$('span*=ON').isExisting(), 'section.(ON).isExisting').to.equal(true);
        return this;
    }

    setOff(str) {
        this.section(str).scrollIntoView({ block: "center" });
        if (this.section(str).$('span*=ON').isExisting()) {
            this.switch(str).click();
            this.section(str).$('span*=OFF').waitForExist();
        }
        expect(this.section(str).$('span*=OFF').isExisting(), 'section.(OFF).isExisting').to.equal(true);
        return this;
    }
}

module.exports = new AdminPage();
