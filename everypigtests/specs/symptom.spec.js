const checkupPage = require('../pageobjects/checkup.page');
const symptomPage = require('../pageobjects/symptoms.page');

describe('Symptoms page, navigation', () => {
    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(3, 'Symptoms');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    if (isMobile) {
        it('Opens picker', () => {
            expect(symptomPage.mobileRow(tdata.randSymptom).isExisting(), 'mobileRow().isExisting').to.equal(true);
        });

        it('Check and uncheck symptom', () => {
            let sympt = tdata.randSymptom;

            symptomPage.setPicker(sympt).setPicker(sympt);

            expect(symptomPage.isSelected(sympt)).to.equal(false);
        });

        it('Search special chars', () => {
            //just check whether page crashes or not, need to clarify expected behaviour
            checkupPage.setSearch('&').setSearch('%').setSearch('#').setSearch('\\')
                .setSearch('/').setSearch('\"').setSearch('$').setSearch('?')
                .setSearch('^').setSearch('|').setSearch(':').setSearch('*');
    
            expect($('.MobileListPicker').isExisting(), 'picker isExisting').to.equal(true);
        });

        it('Search when choosing symptoms', () => {
            let sympt = tdata.randSymptom;
            symptomPage.setSearch(sympt);

            expect(symptomPage.mobileRow(sympt).isExisting()).to.equal(true) &&
            expect(symptomPage.pickerRows, 'pickerRows').to.have.lengthOf(1) &&
            expect(symptomPage.pickerRows[0].getText()).to.have.string(sympt);
        });

        it('Not able to tap Next without choosed symptom', () => {
            expect(symptomPage.isNextDisabled, 'isNextDisabled').to.equal(true);
        });

        it('Back to checkup', () => {
            symptomPage.back();

            expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        });
    } else {
        it('Cancel report', function () {
            symptomPage.setSymptom(tdata.randSymptom).clickBtn('Cancel');
            checkupPage.section(3).scrollIntoView({ block: "center" });

            expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
        });
    }

    it('Close report', () => {
        symptomPage.setSymptom(tdata.randSymptom).close();
        checkupPage.section(3).scrollIntoView({block: "center"});

        expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
    });
});

describe('Report single symptom', () => {
    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(3, 'Symptoms');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Not able to report without set %', () => {
        if (isMobile) {
            symptomPage.setPicker(tdata.randSymptom).clickNext();
        } else {
            symptomPage.setDropdown(tdata.randSymptom);
        }

        expect(symptomPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Not able to report without set symptom in case of several ones', () => {
        let sympt = tdata.randArraySymptom(3);

        if (isMobile) {
            symptomPage.setPicker(sympt[0])
                .setPicker(sympt[1])
                .setPicker(sympt[2])
                .clickNext().setPercent().setPercent(2);
        } else {
            symptomPage.setSymptom(sympt[0])
                .addRow().addRow()
                .setSymptom(sympt[1]).resetIndex();  //set 0 to internal row index
        }
        
        expect(symptomPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('With comment', () => {
        let sympt = tdata.randSymptom,
            comment = tdata.randComment;

        symptomPage.setSymptom(sympt).setComment(comment).submit();
        checkupPage.section(3).scrollIntoView({block: "center"});
        const rslt = checkupPage.symptInfo;

        expect(rslt.name[0], 'name of symptom').to.equal(sympt);
        expect(rslt.comment, 'comment').to.equal(comment);
    });

    it('Change symptom', () => {
        let sympt = tdata.randSymptom;

        symptomPage.setSymptom(tdata.randSymptom)
            .clickSelect().setSymptom(sympt).submit();
        checkupPage.section(3).scrollIntoView({block: "center"});
        const rslt = checkupPage.symptInfo;

        expect(rslt.name[0], 'name of symptom').to.equal(sympt);
    });
});

describe('Report symptoms', () => {
    let rslt;
    const test = tdata.randSymptData();

    it('Choose random group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Choose symptoms', () => {
        checkupPage.chooseSection(3);

        expect(browser.getUrl(), 'symptoms url').to.match(/(\/report-symptoms)$/);
    });

    if (isMobile) {
        it('Opens picker', () => {
            expect(symptomPage.mobileRow(tdata.randSymptom).isExisting(), 'mobileRow().isExisting').to.equal(true);
        });

        it('Check and uncheck symptom', () => {
            let sympt = tdata.randSymptom;

            symptomPage.setPicker(sympt).setPicker(sympt);

            expect(symptomPage.isSelected(sympt)).to.equal(false);
        });

        it('Search when choosing symptoms', () => {
            let sympt = tdata.randSymptom;
            symptomPage.setSearch(sympt);

            expect(symptomPage.mobileRow(sympt).isExisting()).to.equal(true) &&
            expect(symptomPage.pickerRows, 'pickerRows').to.have.lengthOf(1) &&
            expect(symptomPage.pickerRows[0].getText()).to.have.string(sympt);
        });

        it('Not able to tap Next without choosed symptom', () => {
            expect(symptomPage.isNextDisabled, 'isNextDisabled').to.equal(true);
        });

        it('Back to checkup', () => {
            symptomPage.back();

            expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        });
    }

    it('Cancel report', function() { 
        if (isMobile) {
            this.skip();
        } else {
            symptomPage.setSymptom(tdata.randSymptom).clickBtn('Cancel');
            checkupPage.section(3).scrollIntoView({block: "center"});

            expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
        }
    });

    it('Close report', () => {
        checkupPage.chooseSection(3);
        symptomPage.setSymptom(tdata.randSymptom).close();
        checkupPage.section(3).scrollIntoView({block: "center"});

        expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
    });

    it('Fill report', () => {
        checkupPage.chooseSection(3);
        symptomPage.setSymptom(test.sympt[0])
            .addRow().setSymptom(test.sympt[1])
            .addRow().setSymptom(test.sympt[2])
            .addRow().setSymptom(test.sympt[3])
            .setComment(test.comment).submit();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('Amount', () => {
        checkupPage.section(3).scrollIntoView({ block: 'center' });

        rslt = checkupPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.amount + '');
    });

    for (let i = 0; i < test.amount; i++) {
        it('Symptom(' + i + ')', () => {
            expect(rslt.name[i], 'name of symptoms i').to.equal(test.sympt[i]);
        });
    }

    it('Comment', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });
});
