// report.page.js
const Page = require('./page');

module.exports = class ReportPage extends Page {
    constructor() {
        super();
        this.index = 0;
        this.pagename = 'root';
        this.row = '#root';
        this.inputWrapper = '#root';
        this.labelWrapper = '#root';
        this.selectWrapper = '.ReactSelect';
    }

/********************************************** Navigation *****************************************************/

    get cancelBtn() { return $('.button=Cancel'); }
    get closeBtn() { return $('.close-center-box'); }
    get submitBtn() { return $('.button.submit'); }
    get submitBtnDisabled() { return $('.button.submit.disabled'); }
    get mNextBtn() { return $('.button=Next'); }
    get mNextBtnDisabled() { return $('.button.primary.disabled'); }
    get mSubmitBtn() { return $('.StickyFooter').$('.button*=Continue'); }
    get mSubmitBtnDisabled() { return $('.button.primary.disabled'); }
    get mClose() { return $('.back-link.hide-for-large'); }
    get backLink() { return $('div[class^="mobile-header"]').$('a[class^="back-link"]'); }
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
        if (isMobile) {
            this.box.isDisplayed() && this.box.scrollIntoView(true);
            this.mClose.waitClick();
        } else {
            this.closeBtn.waitClick();
        }
        return this.waitLoader();
    }

    cancel() { return this.cancelBtn.waitClick() && this.waitLoader(); }

    submit() {
        this.resetIndex();
        if (this.isSubmitDisabled) {
            return this;
        } else if (this.isMobile) {
            this.mSubmitBtn.waitClick();
        } else if (this.submitBtn.isExisting()) {
            this.submitBtn.waitClick();
        }
        return this.waitLoader();
    }

    mBack() { return this.backLink.waitClick() && this.waitLoader(); }

    mClickNext() {
        this.mNextBtn.isExisting() && this.mNextBtn.isDisplayed()
            && this.mNextBtn.waitClick();
        return this.waitLoader();
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
    clickSelectParam(index) { return this.paramRow(index).$(this.selectWrapper).waitClick() && this; }
    selectInput(index) { return this.paramRow(index).$('<input>'); }
    isSelected(text) { return this.mobileRow(text).$(this.selectIcon).isExisting(); }

    setReportParam(type, index) {
        this.waitForOpen().clickSelectParam(index);
        expect(this.selectInput(index).getAttribute('aria-expanded'), 'isExpanded').to.equal('true');

        this.selectInput(index).waitSetValue(type);
        expect(this.selectInput(index).getAttribute('value'), 'inputValue of select').to.equal(type);

        browser.keys('Tab');
        expect(this.selectInput(index)
            .getAttribute('aria-activedescendant'), 'There is no option corresponding to input ' + type)
            .to.not.have.string('null');
        return this;
    }

    mSetReportParam(type) {
        this.waitLoader();
        $(this.mRowPicker).isExisting() || this.clickSelectParam();
        this.mobileRow(type).waitClick();
        return this;
    }

    addRow() {
        this.addRowBtn.waitClick();
        this.index++;
        return this;
    }

    addNote() {
        $(this.addNoteBtn).waitClick();
        $(this.comment).waitForExist();
        return this;
    }

    setComment(text) {
        $(this.commentClosed).isExisting() && this.addNote();
        $(this.comment).waitSetValue(text);
        return this;
    }

    removeComment() {
        $(this.removeCommentBtn).isExisting() && $(this.removeCommentBtn).isDisplayed()
            && $(this.removeCommentBtn).waitClick();
        return this;
    }

    deleteRow(index) {
        if ($(this.trashBtn).isDisplayed()) {
            this.paramRow(index).$(this.trashBtn).waitClick();
            this.index > 0 && this.index--;
        }
        return this;
    }

    clear() {
        this.removeComment();
        const rows = $$(this.rowIndex).length;
        for (let i = 0; i < rows; i++) {
            this.deleteRow();
        }
        this.submit();
        return this;
    }

    resetIndex() { this.index = 0; }
};
