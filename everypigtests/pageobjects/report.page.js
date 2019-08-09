// report.page.js
var Page = require('./page');

module.exports = class ReportPage extends Page {
    constructor() {
        super();
        this.index = 0;
        this.pagename = 'pagename';
        this.row = '.pagename-row';
    }

/********************************************** Navigation *****************************************************/

    get cancelBtn() { return $('.button=Cancel'); }
    get closeBtn() { return $('.close-center-box'); }
    get submitBtn() { return $('.button.submit'); }
    get submitBtnDisabled() { return $('.button.submit.disabled'); }
    get mNextBtn() { return $('.button=Next'); }
    get mNextBtnDisabled() { return $('.button.primary.disabled'); }
    get mSubmitBtn() { return $('.StickyFooter').$('.button*=Continue'); }
    get mSubmitBtnDisabled() { return $('.button.primary.disabled.sticky-footer'); }
    get mSearch() { return $('input[placeholder="Search..."]'); }
    get mClose() { return $('.back-link.hide-for-large'); }
    get mBackLink() { return $('div[class^="mobile-header"]').$('a[class^="back-link"]'); }
    get isNextDisabled() { return this.mNextBtnDisabled.isExisting(); }
    get isSubmitDisabled() {
        return (this.isMobile) ? this.mSubmitBtnDisabled.isExisting()
            : this.submitBtnDisabled.isExisting();
    }

    waitForOpen() {
        this.box.waitForExist(5000, false,
            "this.box" + ' still not existing after ' + 5000 + 'ms on ' + browser.getUrl());
        this.box.waitForDisplayed();
        return this;
    }
    close() {
        if (this.isMobile) {
            this.box.scrollIntoView(true);
            this.mClose.waitAndClick();
        } else {
            this.closeBtn.waitAndClick();
        }
        return this;
    }
    cancel() { return this.cancelBtn.waitAndClick() && this; }
    submit() {
        this.resetIndex();
        if (this.isSubmitDisabled) {
            return this;
        } else if (this.isMobile) {
            this.mSubmitBtn.waitAndClick();
        } else if (this.submitBtn.isExisting()) {
            this.submitBtn.waitAndClick();
        }
        return this;
    }
    mBack() { return this.mBackLink.waitAndClick() && this; }
    mClickNext() {
        this.mNextBtn.isExisting() && this.mNextBtn.isDisplayed()
            && this.mNextBtn.waitAndClick();
        return this;
    }

/********************************************** Report Actions *****************************************************/

    get box() { return $('.CenterBoxComponent'); }
    get mPigsUnderCare() { return $$('.PigsUnderCareLine.mobile')[0].getText().match(/[0-9]+$/)[0]; }
    get pigsUnderCare() { return $$('.PigsUnderCareLine').slice(-1)[0].getText().match(/[0-9]+$/)[0]; }
    get pigs() { return (this.isMobile) ? this.mPigsUnderCare : this.pigsUnderCare; }
    get addNoteBtn() { return ('.link*=Add A Note'); }
    get addRowBtn() { return $('.add-' + this.pagename); }
    get trashBtn() { return '.trash-cell'; }
    get comment() { return ('.comment.opened textarea'); }
    get commentClosed() { return ('.comment.closed'); }
    get removeCommentBtn() { return ('.remove-comment.visible'); }
    get mRowPicker() { return '.MobileRow'; }
    get mRows() { return $$(this.mRowPicker); }
    get rowIndex() { return '.row-index'; }
    get selectIcon() { return '.icon.selected'; }
    get selectWrapper() { return ('.select-' + this.pagename + '-wrapper'); }
    get inputWrapper() { return '.wrapper'; }
    get labelWrapper() { return '.wrapper'; }

    paramRow(index) {
        if ($(this.row).isExisting()) {
            if (index === undefined || index >= $$(this.row).length) {
                return $$(this.row)[this.index];
            } else {
                return $$(this.row)[index];
            }
        } else {
            return $('#root');
        }
    }

    mobileRow(text) { return $(this.mRowPicker + '*=' + text); }
    input(name, index) { return this.paramRow(index).$(this.inputWrapper + '*=' + name).$('<input>'); }
    inputLabel(name, index) { return this.paramRow(index).$(this.labelWrapper + '*=' + name); }
    clickSelectParam(index) { return this.paramRow(index).$(this.selectWrapper).waitAndClick() && this; }
    selectInput(index) { return this.paramRow(index).$('<input>'); }
    isSelected(text) { return this.mobileRow(text).$(this.selectIcon).isExisting(); }

    setReportParam(type, index) {
        this.waitForOpen().clickSelectParam(index);
        expect(this.selectInput(index).getAttribute('aria-expanded'), 'isExpanded').to.equal('true');

        this.selectInput(index).setValueAndWait(type);
        expect(this.selectInput(index).getAttribute('value'), 'inputValue of select').to.equal(type);

        browser.keys('Tab');
        expect(this.selectInput(index)
            .getAttribute('aria-activedescendant'), 'There is no option corresponding to input ' + type)
            .to.not.have.string('null');
        return this;
    }

    mSetReportParam(type) {
        $(this.mRowPicker).waitForExist(5000);
        this.mobileRow(type).waitAndClick();
        return this;
    }

    addRow() {
        this.addRowBtn.waitAndClick();
        this.index++;
        return this;
    }

    addNote() {
        $(this.addNoteBtn).waitAndClick();
        $(this.comment).waitForExist();
        return this;
    }

    setComment(text) {
        $(this.commentClosed).isExisting() && this.addNote();
        $(this.comment).setValueAndWait(text);
        return this;
    }

    removeComment() {
        $(this.removeCommentBtn).isExisting() && $(this.removeCommentBtn).isDisplayed()
            && $(this.removeCommentBtn).waitAndClick();
        return this;
    }

    deleteRow(index) {
        if ($(this.trashBtn).isDisplayed()) {
            this.paramRow(index).$(this.trashBtn).waitAndClick();
            this.index > 0 && this.index--;
        }
        return this;
    }

    clear() {
        this.removeComment();
        const rows = $$(this.row).length;
        for (let i = 0; i < rows; i++) {
            this.deleteRow();
        }
        this.submit();
        return this;
    }

    resetIndex() { this.index = 0; }
    mSetSearch(text) { return this.mSearch.setValueAndWait(text) && this; }

}