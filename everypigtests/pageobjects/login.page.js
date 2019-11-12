// login.page.js
const Page = require('./page');
const user = require('./credentials');

class LoginPage extends Page {
    get inputEmail() { return $('input[name="email"]'); }
    get inputPassword() { return $('input[name="password"]'); }
    get signinButton() { return $('#login-submit'); }

    open() { return browser.url('https://dev.everypig.com/login') || this; }

    signin() {
        return this.signinButton.click() && this;
    }

    login(email, pass) {
        this.open();
        this.inputEmail.waitSetValue(email);
        this.inputPassword.waitSetValue(pass);
        this.signin();
        browser.pause(30000);
        this.header.isDisplayed() || this.login(email, pass);
        this.waitForSync();
        return this;
    }

    asAdmin() { return this.login(user.admin, user.password); }
}

module.exports = new LoginPage();
