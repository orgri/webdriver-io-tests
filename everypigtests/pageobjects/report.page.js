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
    get box() { return $('.CenterBoxComponent'); }
    get submitBtn() { return isMobile ? '.StickyFooter button' : '.submit'; }
    get closeBtn() { return isMobile ? '.back-link.hide-for-large' : '.close-center-box'; }
    get isNextDisabled() { return $('.button.primary.disabled').isExisting(); }
    get isSubmitDisabled() { return  $(this.submitBtn + '.disabled').isExisting(); }
    get hasClose() { return $(this.submitBtn).isExisting(); }

    waitForOpen() {
        this.box.waitForExist(5000, false,
            `this.box still not existing after 5000 ms on ${browser.getUrl()}`);
        this.box.waitForDisplayed();
        return this;
    }

    submit() {
        this.resetIndex();
        !this.isSubmitDisabled && this.clickOn(this.submitBtn);
        return this;
    }

    back() {
        return this.clickOn('[class^=mobile-header] [class^=back-link]');
    }

    close() {
        this.box.isDisplayed() && this.box.scrollIntoView();

        return this.clickOn(this.closeBtn);
    }

    clickNext() {
        const next = $('.button=Next');
        next.isExisting() && next.isDisplayed() && this.clickOn(next);
        return this;
    }
/********************************************** Report Actions *****************************************************/
    get pigsUnderCare() { return $(`.PigsUnderCareLine.${isMobile ? 'mobile' : 'show-for-large'}`); }
    get pigs() { return this.getNumber(this.pigsUnderCare); }
    get addNoteBtn() { return '.link*=Add A Note'; }
    get addRowBtn() { return $(`.add-${this.pagename}`); }
    get trashBtn() { return $('.trash-cell'); }
    get comment() { return '.comment'; }
    get rmvCommentBtn() { return $('.remove-comment.visible'); }
    get rowPicker() { return this.getClassName('[class^=MobileRow]'); }
    get pickerRows() { return $$(this.rowPicker); }
    get rowIndex() { return '.row-index'; }
    get hasPicker() { return $('.MobileListPicker').isExisting(); }

    block(id) {
        let selector = (typeof id === 'object') ? id : this.root;
        if ($(this.row).isExisting()) {
            this.row = this.getClassName(this.row);
            const length = $$(this.row).length;
            if (id === undefined) {
                selector = $$(this.row)[this.index];
            } else if (typeof id === 'string') {
                selector = $(`${this.row}*=${id}`);
            } else if (typeof id === 'number' && id < length) {
                selector = $$(this.row)[id];
            } else if (typeof id === 'number' && id >= length) {
                selector = $$(this.row)[length - 1];
            }
        }
        return selector;
    }

    mobileRow(str) {
        return $('.MobileRow*=' + str);
    }

    input(id, name, wrap = this.inputWrapper) {
        wrap = wrap.includes('class') ? this.getClassName(wrap) : wrap;
        wrap = name ? `${wrap}*=${name}` : wrap;
        return this.block(id).$(wrap).$('input:not([type=radio])');
    }

    inputLabel(id, name, wrap = this.labelWrapper) {
        wrap = name ? `${wrap}*=${name}` : wrap;
        return this.block(id).$(wrap);
    }

    select(id, wrap = this.selectWrapper) {
        return this.block(id).$(wrap);
    }

    selectInput(...args) {
        return this.select(...args).$('input');
    }

    isSelected(text) {
        return this.mobileRow(text).$('.icon.selected').isExisting();
    }

    clickSelect(...args) {
        return this.clickOn(this.select(...args));
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
            .getAttribute('aria-activedescendant'), `There is no option corresponding to input ${value}`)
            .to.not.have.string('null');
        return this;
    }

    setPicker(value) {
        this.waitLoader();
        $(this.rowPicker).isExisting() || this.clickSelect();
        return this.clickOn(this.mobileRow(value));
    }

    addRow() {
        this.clickOn(this.addRowBtn);
        this.index++;
        return this;
    }

    addNote(id = this.root) {
        this.clickOn(this.addNoteBtn, this.block(id))
            .block(id).$(`${this.comment}.opened`).waitForExist();
        return this;
    }

    setComment(text, id = this.root) {
        this.block(id).$(`${this.comment}.closed`).isExisting() && this.addNote(id);
        const selector = this.block(id).$(`${this.comment} textarea`);
        this.type(text, selector);
        return this;
    }

    removeComment() {
        this.rmvCommentBtn.isExisting() && this.rmvCommentBtn.isDisplayed()
            && this.clickOn(this.rmvCommentBtn);
        return this;
    }

    deleteRow(id = 0) {
        if (this.trashBtn.isDisplayed()) {
            this.clickOn(this.trashBtn, this.block(id));
            this.index > 0 && this.index--;
        }
        return this;
    }

    clear() {
        this.removeComment();
        $$(this.rowIndex).forEach((el, i) => i !== 0 && this.deleteRow());
        return this.waitLoader();
    }

    clearMedia() {
        $$('.asset-wrapper').forEach(() => this.clickOn(this.rmvMediaBtn).pause(1000));
        return this.waitLoader();
    }

    resetIndex() {
        this.index = 0;
        return this;
    }
    /********************************************** Report Info *****************************************************/
    get commentWrapper() { return '[class^=Translation_] > span'; }

    info(type, section, rowWrap) {
        rowWrap = $(rowWrap).isExisting() ? this.getClassName(rowWrap): 'div';
        return (section.$(`${rowWrap}*=${type}`).isExisting())
            ? section.$$(`${rowWrap}*=${type}`).map(el => this.getFloat(el)) : [];
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
        let wrap = this.mediaUploader.isExisting() ? this.mediaUploader : this.mediaViewer;
        wrap = isMobile ? section : wrap;
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

    noteInfo(section, noteWrap = this.commentWrapper) {
        if (typeof section === 'string') { section = $(section); }
        const note = section.$(noteWrap);
        return note.isExisting() ? this.getString(note) : undefined;
    }
};
