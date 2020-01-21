// login.page.js
const Page = require('./page');
const user = require('./credentials');

class LoginPage extends Page {
    get loginUrl() { return this.baseUrl + '/login'; }
    get inputEmail() { return $('input[name="email"]'); }
    get inputPassword() { return $('input[name="password"]'); }
    get signinButton() { return $('#login-submit'); }

    open(path = this.loginUrl) {
        return super.open(path);
    }

    signin() {
        return this.signinButton.click() && this;
    }

    login(email, pass) {
        do {
            this.open();
            this.inputEmail.waitSetValue(email);
            this.inputPassword.waitSetValue(pass);
            this.signin();
            browser.pause(15000);
        } while (!this.header.isDisplayed());
        this.waitForSync();
        return this;
    }

    asAdmin() {
        return this.login(user.admin, user.password);
    }
}

module.exports = new LoginPage();
