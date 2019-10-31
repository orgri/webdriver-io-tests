const checkupPage = require('../pageobjects/checkup.page');
const treatPage = require('../pageobjects/medications.page');

describe('Treats page, navigation (offline)', () => {
    it('Choose group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    }, 1);

    it('Choose treats', () => {
        checkupPage.chooseSection(2, 'Treats');

        expect(browser.getUrl(), 'treats url').to.match(/(\/report-treatments)$/);
    });

    if (isMobile) {
        it('Opens picker', () => {
            expect(treatPage.mobileRow('Pennox').isExisting(), 'mobileRow(Pennox).isExisting').to.equal(true);
        });

        it('Check and uncheck treat', () => {
            let treat = tdata.randTreat;
            treatPage.mSetReportParam(treat).mSetReportParam(treat);

            expect(treatPage.isSelected(treat), 'isSelected()').to.equal(false);
        });

        tdata.specialChars.forEach((el) => {
            it('Search special chars: ' + el, () => {
                //just check whether page crashes or not, need to clarify expected behaviour
                checkupPage.inputSearch.isExisting() 
                    || checkupPage.netOn(false).open().netOff()
                        .currentDC().chooseSection(2, 'Treats');
                checkupPage.setSearch(el);

                expect(checkupPage.inputSearch.isExisting(), 'search').to .equal(true);
            });
        });

        it('Search when choosing treats', () => {
            let treat = tdata.randTreat;
            treatPage.setSearch(treat);

            expect(treatPage.mobileRow(treat).isExisting(), 'mobileRow(treat).isExisting').to.equal(true) &&
            expect(treatPage.mRows, 'mRows').to.have.lengthOf(1) &&
            expect(treatPage.mRows[0].getText(), 'mRows[0]').to.have.string(treat);
        });

        it('Not able to tap Next without choosed treat', () => {
            expect(treatPage.isNextDisabled, 'isNextDisabled').to.equal(true);
        });

        it('Back to checkup', () => {
            treatPage.mBack();

            expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
        });
    }
});

describe('Report single treat (offline)', () => {
    beforeEach(function () {
        this.currentTest.title == 'Choose group' ||
            checkupPage.currentDC().chooseSection(2, 'Treats');
    });
    it('Choose group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();

        //expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    }, 1);

    if(!isMobile) {
        it('Cancel report', () => {
                treatPage.setWithGalsDosage(tdata.randUnits, tdata.randHeads, 
                    tdata.randDosage, tdata.randGals)
                    .cancel();
                checkupPage.section(2).scrollIntoView({block: "center"});
    
                expect(checkupPage.isEmpty(2), 'isEmpty(2)').to.equal(true);
        }, 1);    
    }

    it('Close report', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, tdata.randHeads,
            tdata.randDosage, tdata.randGals)
            .close();

        expect(checkupPage.isEmpty(2), 'isEmpty(2)').to.equal(true);
    });

    it('Oral treat with Gallon dosage', () => {
        let treat = tdata.randUnits + '',
            heads = tdata.randHeads + '',
            dosage = tdata.randDosage + '',
            gals = tdata.randGals + '';

        treatPage.setWithGalsDosage(treat, heads, dosage, gals).submit();
        checkupPage.section(2).scrollIntoView({block: "center"});
        const rslt = checkupPage.treatInfo;

        expect(rslt.name[0], 'name of treat').to.equal(treat);
        expect(rslt.heads[0], 'heads').to.equal(heads);
        expect(rslt.dosage[0], 'dosage of treat').to.equal(dosage);
        expect(rslt.gals[0], 'gals').to.equal(gals);
    });

    it('Oral treat with Mls dosage', () => {
        let treat = tdata.randMls + '',
            heads = tdata.randHeads + '',
            dosage = tdata.randDosage + '';

        treatPage.setWithMlsDosage(treat, heads, dosage).submit();
        checkupPage.section(2).scrollIntoView({block: "center"});
        const rslt = checkupPage.treatInfo;

        expect(rslt.name[0], 'name of treat').to.equal(treat);
        expect(rslt.heads[0], 'heads').to.equal(heads);
        expect(rslt.dosage[0], 'dosage of treat').to.equal(dosage);
    });

    it('Injectable treat with Ccs dosage', () => {
        let treat = tdata.randCcs + '',
            heads = tdata.randHeads + '',
            dosage = tdata.randDosage + '';

        treatPage.setWithCcsDosage(treat, heads, dosage).submit();
        checkupPage.section(2).scrollIntoView({block: "center"});
        const rslt = checkupPage.treatInfo;

        expect(rslt.name[0], 'name of treat').to.equal(treat);
        expect(rslt.heads[0], 'heads').to.equal(heads);
        expect(rslt.dosage[0], 'dosage of treat').to.equal(dosage);
    });

    it('Topical treat', () => {
        let treat = tdata.randNoDosage + '',
            heads = tdata.randHeads + '';

        treatPage.setWithoutDosage(treat, heads).submit();
        checkupPage.section(2).scrollIntoView({block: "center"});
        const rslt = checkupPage.treatInfo;

        expect(rslt.name[0], 'name of treat').to.equal(treat);
        expect(rslt.heads[0], 'heads').to.equal(heads);
    });

    it('Change treat', () => {
        let treat = tdata.randNoDosage + '',
            heads = tdata.randHeads + '';

        treatPage.setWithCcsDosage(tdata.randCcs, tdata.randHeads, tdata.randDosage)
            .clickSelectParam() // need for Mobile
            .setWithoutDosage(treat, heads).submit();
        checkupPage.section(2).scrollIntoView({block: "center"});
        const rslt = checkupPage.treatInfo;

        expect(rslt.amount, 'amount').to.equal('1');
        expect(rslt.name[0], 'name of treat').to.equal(treat);
        expect(rslt.heads[0], 'heads').to.equal(heads);
    });
});

describe('Report treats (offline)', () => {
    let rslt;
    const test = tdata.randTreatsData();

    beforeEach(function () {
        switch (this.currentTest.title) {
            case 'Choose random group':
            case 'Fill report':
                this.currentTest.retries(1);
        }

        this.currentTest._currentRetry > 0
            && this.currentTest.title == 'Fill report'
            && checkupPage.netOn(false).open().netOff()
                .chooseRandCheckup().chooseSection(2);
    });

    it('Choose random group', () => {
        checkupPage.netOn(false).open().netOff().chooseRandCheckup();
        tdata.toStringVal(test);

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Choose mediacations', () => {
        checkupPage.chooseSection(2, 'Treats');

        expect(browser.getUrl(), 'treats url').to.match(/(\/report-treatments)$/);
    });

    it('Fill report', () => {
        treatPage.setWithCcsDosage(test.treats[0], test.heads[0], test.dosage[0])
            .addRow().setWithGalsDosage(test.treats[1], test.heads[1], test.dosage[1], test.gals)
            .addRow().setWithMlsDosage(test.treats[2], test.heads[2], test.dosage[2])
            .addRow().setWithoutDosage(test.treats[3], test.heads[3]).setTotal(test.total)
            .setComment(test.comment).submit();

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)(fake).+$/);
    });

    it('Amount', () => {
        checkupPage.section(2).scrollIntoView({ block: 'center' });
        rslt = checkupPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('Treat(' + i + ')', () => {
            expect(rslt.name[i], 'name of treat').to.equal(test.treats[i]);
        });

        it('Heads(' + i + ')', () => {
            expect(rslt.heads[i], 'heads').to.equal(test.heads[i]);
        });

        if (i < 3) {
            it('Dosage(' + i + ')', () => {
                expect(rslt.dosage[i], 'dosage of treat').to.equal(test.dosage[i]);
            });
        }
    }

    it('Gals', () => {
        expect(rslt.gals[0], 'gals').to.equal(test.gals);
    });

    it('Comment', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });

    it('Net on(sync)', () => {
        checkupPage.netOn();
    });

    it('Amount after sync', () => {
        checkupPage.currentDC().section(2).scrollIntoView({ block: 'center' });
        rslt = checkupPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.amount);
    });

    for (let i = 0; i < +test.amount; i++) {
        it('Treat(' + i + ') after sync', () => {
            expect(rslt.name[i], 'name of treat').to.equal(test.treats[i]);
        });

        it('Heads(' + i + ') after sync', () => {
            expect(rslt.heads[i], 'heads').to.equal(test.heads[i]);
        });

        if (i < 3) {
            it('Dosage(' + i + ') after sync', () => {
                expect(rslt.dosage[i], 'dosage of treat').to.equal(test.dosage[i]);
            });
        }
    }

    it('Gals after sync', () => {
        expect(rslt.gals[0], 'gals').to.equal(test.gals);
    });

    it('Comment after sync', () => {
        expect(rslt.comment, 'comment').to.equal(test.comment);
    });
});
