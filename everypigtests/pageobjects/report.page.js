// report.page.js
const Page = require('./page');

module.exports = class ReportPage extends Page {
    constructor({row = 'row', input = 'div', label = 'div', select = '.ReactSelect'} = {}) {
        super();
        this.index = 0;
        this.pagename = 'root';
        this.row = row;
        this.inputWrapper = input;
        this.labelWrapper = label;
        this.selectWrapper = select;
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

    block(id) {
        let selector = (typeof id === 'object') ? id : this.root;
        if ($(this.row).isExisting()) {
            this.row = this.getClassName(this.row);
            const length = $$(this.row).length;
            if (id === undefined) {
                selector = $$(this.row)[this.index];
            } else if (typeof id === 'string') {
                selector = $(this.row + '*=' + id);
            } else if (typeof id === 'number' && id < length) {
                selector = $$(this.row)[id];
            } else if (typeof id === 'number' && id >= length) {
                selector = $$(this.row)[length - 1];
            }
        }
        return selector;
    }

    mobileRow(text) { return $(this.mRowPicker + '*=' + text); }

    input(id, name, wrap = this.inputWrapper) {
        wrap = wrap.includes('class') ? this.getClassName(wrap) : wrap;
        wrap = name ? (wrap + '*=' + name) : wrap;
        return this.block(id).$(wrap).$('input:not([type=radio])');
    }

    inputLabel(id, name, wrap = this.labelWrapper) {
        wrap = name ? (wrap + '*=' + name) : wrap;
        return this.block(id).$(wrap);
    }

    select(id, wrap = this.selectWrapper) {
        return this.block(id).$(wrap);
    }

    selectInput(...args) {
        return this.select(...args).$('input');
    }

    isSelected(text) { return this.mobileRow(text).$(this.selectIcon).isExisting(); }

    clickSelect(...args) {
        return this.select(...args).waitClick() && this.waitLoader();
    }

    setInput(value, ...args) {
        return this.input(...args).waitSetValue(value) && this;
    }

    setDropdown(value, ...args) {
        this.clickSelect(...args);
        expect(this.selectInput(...args).getAttribute('aria-expanded'), 'isExpanded').to.equal('true');

        this.selectInput(...args).waitSetValue(value) && this.waitLoader();
        expect(this.selectInput(...args).getAttribute('value'), 'inputValue of select').to.equal(value);

        browser.keys('Tab');
        expect(this.selectInput(...args)
            .getAttribute('aria-activedescendant'), 'There is no option corresponding to input ' + value)
            .to.not.have.string('null');
        return this;
    }

    setPicker(value) {
        this.waitLoader();
        $(this.mRowPicker).isExisting() || this.clickSelect();
        this.mobileRow(value).waitClick();
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

    deleteRow(id) {
        if ($(this.trashBtn).isDisplayed()) {
            this.block(id).$(this.trashBtn).waitClick();
            this.index > 0 && this.index--;
        }
        return this;
    }

    clear() {
        this.removeComment();
        const rows = $$(this.rowIndex).length;
        for (let i = 0; i < rows; i++) {
            this.deleteRow(0);
        }
        this.submit();
        return this;
    }

    resetIndex() { this.index = 0; }

    /********************************************** Report Info *****************************************************/

    get commentWrapper() { return '[class^=Translation_] > span'; }

    info(type, section, rowWrap) {
        rowWrap = $(rowWrap).isExisting() ? this.getClassName(rowWrap): 'div';
        return (section.$(rowWrap + '*=' + type).isExisting())
            ? section.$$(rowWrap + '*=' + type).map(el => this.getFloat(el)) : [];
    }

    moveInfo(section, rowWrap, commentWrap = this.commentWrapper) {
        const selector = section.$$(rowWrap);
        const comment = section.$(commentWrap);
        const reCondition = /(?<=arrival|arrival\n)([a-zA-Z]+)/u;

        return {
            amount : this.getNumber(section),
            added : this.info('Added', section, rowWrap),
            removed : this.info('Removed', section, rowWrap),
            weight : this.info('Weight', section, rowWrap),
            condition : this.getArray(selector, reCondition),
            comment : comment.isExisting() ? this.getString(comment) : undefined
        }
    }

    deathInfo(section, rowWrap, commentWrap = this.commentWrapper) {
        const comment = section.$(commentWrap);
        const collapse = section.$$(this.collapseWrapper);
        const reReason = /(.+?)(?=\s\u2022)/u;

        collapse.length && collapse.forEach((el) => this.clickOn(el));

        return {
            amount : this.getNumber(section),
            reason : collapse.length ? this.getArray(collapse, reReason) : [],
            chronic : this.info('Chronic', section, rowWrap),
            acute : this.info('Acute', section, rowWrap),
            euthanas : this.info('Euthanasia', section, rowWrap),
            comment : comment.isExisting() ? this.getString(comment) : undefined
        }
    }

    symptInfo(section, rowWrap, commentWrap = this.commentWrapper) {
        const selector = section.$$(rowWrap);
        const comment = section.$(commentWrap);
        const reName = /([^\n\d%]+)(?=\n\d|\d)/u;
        const rePercent = /(\d+)%/u;

        return {
            amount : this.getNumber(section),
            name : this.getArray(selector, reName),
            percent : this.getArray(selector, rePercent),
            comment : comment.isExisting() ? this.getString(comment) : undefined
        }
    }

    treatInfo(section, rowWrap, commentWrap = this.commentWrapper) {
        const selector = section.$$(rowWrap);
        const comment = section.$(commentWrap);
        const reName = /(.+?)(?=(\s\u2022)|(\d+|\n\d+)$)/u;
        const reDosage = /(?<=\u2022\s)(\d+\.\d+)/u;
        const reHeads = /(\d+)$/u;
        const reGals = /(\d+)(?=\sgal)/u;

        return {
            amount : this.getNumber(section),
            name : this.getArray(selector, reName),
            dosage : this.getArray(selector, reDosage),
            heads : this.getArray(selector, reHeads),
            gals : this.getArray(selector, reGals),
            comment : comment.isExisting() ? this.getString(comment) : undefined
        }
    }

    tempsInfo(section, rowWrap, commentWrap = this.commentWrapper) {
        const selector = section.$$(rowWrap);
        const comment = section.$(commentWrap);

        return {
            high : this.getFloat(selector[0]),
            low : this.getFloat(selector[1]),
            comment : comment.isExisting() ? this.getString(comment) : undefined
        }
    }

    waterInfo(section, rowWrap, commentWrap = this.commentWrapper) {
        const selector = section.$(rowWrap);
        const comment = section.$(commentWrap);

        return {
            consumed : this.getFloat(selector),
            comment : comment.isExisting() ? this.getString(comment) : undefined
        }
    }

    mediaInfo(section, rowWrap = '[class^=image]') {
        const amount = section.getText().includes('Media') ? this.getNumber(section) : undefined;
        const wrap = this.mediaUploader.isExisting() ? this.mediaUploader : this.mediaViewer;
        let sum, titles;

        if (section.$(rowWrap).isExisting()) {
            this.clickOn(section.$(rowWrap));
            browser.pause(1500);
            sum = wrap.$$(rowWrap).length;
            titles = wrap.$$(rowWrap).map(el => el.getAttribute('title'));
            $('.MediaViewerHeader').isExisting() && this.clickCloseView();
        }

        return {
            amount: amount,
            sum: sum,
            titles: titles
        }
    }

    audioInfo(section, rowWrap = '.AudioPreview', commentWrap = '.description') {
        const audio = section.$$(rowWrap);
        const comments = section.$$(commentWrap);

        return {
            amount: section.getText().includes('Audio') ? this.getNumber(section) : undefined,
            sum: audio.length,
            comment: comments.length ? this.getArray(comments) : [],
        }
    }

    diagnosInfo(section, rowWrap, commentWrap = this.commentWrapper) {
        const collapse = section.$('b*=Diagnos');
        const comments = section.$$(commentWrap);
        const reComment = /(.+)(?=\n|See)|(.+)/u;

        return {
            amount: collapse.isExisting() ? this.getNumber(collapse) : undefined,
            name: this.getArray(section.$$(rowWrap + ' > :first-child')),
            type: this.getArray(section.$$(rowWrap + ' > :last-child')),
            comment: comments.length ? this.getArray(comments, reComment) : []
        }
    }

};
