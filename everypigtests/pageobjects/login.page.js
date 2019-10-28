// login.page.js
var Page = require('./page');
var user = require('./credentials');

class LoginPage extends Page {
    get inputEmail() { return $('input[name="email"]'); }
    get inputPassword() { return $('input[name="password"]'); }
    get signinButton() { return $('#login-submit'); }
    get header() { return $('.main-header'); }

    open() { return browser.url('https://dev.everypig.com/login') || this; }
    signin() { return this.signinButton.waitClick() && this; }

    login(email, pass) {
        this.open();
        this.inputEmail.waitSetValue(email);
        this.inputPassword.waitSetValue(pass);
        this.signin().waitForLogin();
        browser.pause(10000);
        return this;
    }

    waitForLogin() { 
        this.header.waitForDisplayed(60000);
        this.waitForSync();
        return this;
    }

    asAdmin() { return this.login(user.admin, user.password); }
}

module.exports = new LoginPage();