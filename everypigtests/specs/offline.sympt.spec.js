const checkupPage = require('../pageobjects/checkup.page');
const symptomPage = require('../pageobjects/symptoms.page');

describe('Symptoms page, navigation (offline)', () => {
    it('Choose random group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();

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

            symptomPage.mSetReportParam(sympt).mSetReportParam(sympt);

            expect(symptomPage.isSelected(sympt)).to.equal(false);
        });

        tdata.specialChars.forEach((el) => {
            it('Search special chars: ' + el, () => {
                //just check whether page crashes or not, need to clarify expected behaviour
                checkupPage.inputSearch.isExisting()
                    || checkupPage.netOn(false).open().netOff()
                        .currentDC().chooseSection(3, 'Sympt');
                checkupPage.setSearch(el);

                expect(checkupPage.inputSearch.isExisting(), 'search').to .equal(true);
            });
        });

        it('Search when choosing symptoms', () => {
            let sympt = tdata.randSymptom;
            symptomPage.setSearch(sympt);

            expect(symptomPage.mobileRow(sympt).isExisting()).to.equal(true) &&
            expect(symptomPage.mRows).to.have.lengthOf(1) &&
            expect(symptomPage.mRows[0].getText()).to.have.string(sympt);
        });

        it('Not able to tap Next without choosed symptom', () => {
            expect(symptomPage.isNextDisabled, 'isNextDisabled').to.equal(true);
        });

        it('Back to checkup', () => {
            symptomPage.mBack();

            expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        });
    }

    if (!isMobile) {
        it('Cancel report', () => {
            symptomPage.setSymptom(tdata.randSymptom).cancel();
            checkupPage.section(3).scrollIntoView({ block: "center" });

            expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
        });
    }

    it('Close report', () => {
        checkupPage.chooseSection(3, 'Sympt');
        symptomPage.setSymptom(tdata.randSymptom).close();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);

        checkupPage.section(3).scrollIntoView({block: "center"});

        expect(checkupPage.isEmpty(3), 'isEmpty').to.equal(true);
    });
});

describe('Report single symptom (offline)', () => {
    beforeEach(function () {
        this.currentTest.title == 'Choose group'
            || checkupPage.currentDC().chooseSection(3, 'Sympt');
    });

    it('Choose group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Not able to report without set %', () => {
        if (isMobile) {
            symptomPage.mSetReportParam(tdata.randSymptom).mClickNext();
        } else {
            symptomPage.setReportParam(tdata.randSymptom);
        }

        expect(symptomPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Not able to report without set symptom in case of several ones', () => {
        let sympt = tdata.randArraySymptom(3);

        if (isMobile) {
            symptomPage.mSetReportParam(sympt[0])
                .mSetReportParam(sympt[1])
                .mSetReportParam(sympt[2])
                .mClickNext().setPercent().setPercent(2);    
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
            .clickSelectParam().setSymptom(sympt).submit();
        checkupPage.section(3).scrollIntoView({block: "center"});
        const rslt = checkupPage.symptInfo;

        expect(rslt.name[0], 'name of symptom').to.equal(sympt);
    });
});

describe('Report Symptoms (offline)', () => {
    let rslt;
    const test = tdata.randSymptData();

    beforeEach(function () {
        switch (this.currentTest.title) {
            case 'Choose random group':
            case 'Fill report':
                this.currentTest.retries(1);
        }

        this.currentTest._currentRetry > 0
            && this.currentTest.title == 'Fill report'
            && checkupPage.netOn(false).open().netOff()
                .chooseRandCheckup().chooseSection(3);
    });

    it('Choose random group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Choose symptoms', () => {
        checkupPage.chooseSection(3);

        expect(browser.getUrl(), 'symptoms url').to.match(/(\/report-symptoms)$/);
    });

    it('Fill report', () => {
        symptomPage.setSymptom(test.sympt[0])
            .addRow().setSymptom(test.sympt[1])
            .addRow().setSymptom(test.sympt[2])
            .addRow().setSymptom(test.sympt[3])
            .setComment(test.comment).submit();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)(fake).+$/);
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

    it('Net on(sync)', () => {
        checkupPage.netOn().setId();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
    });

    it('Amount after sync', () => {
        checkupPage.openCurrent().section(3).scrollIntoView({ block: 'center' });

        rslt = checkupPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.amount + '');
    });

    for (let i = 0; i < test.amount; i++) {
        it('Symptom(' + i + ') after sync', () => {
            expect(rslt.name[i], 'name of symptoms i').to.equal(test.sympt[i]);
        });
    }

    it('Comment after sync', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });
});