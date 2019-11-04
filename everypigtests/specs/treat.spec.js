const checkupPage = require('../pageobjects/checkup.page');
const treatPage = require('../pageobjects/medications.page');

describe('Treats page, navigation', () => {
    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(2, 'Treats');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
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

        it('Search special chars', () => {
            //just check whether page crashes or not, need to clarify expected behaviour
            checkupPage.setSearch('&').setSearch('%').setSearch('#').setSearch('\\')
                .setSearch('/').setSearch('\"').setSearch('$').setSearch('?')
                .setSearch('^').setSearch('|').setSearch(':').setSearch('*');
    
            expect(checkupPage.inputSearch.isExisting(), 'search').to .equal(true);
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

describe('Treats page, input)', () => {
    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(2, 'Treats');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Heads equal to total pigs for Oral medications', () => {
        treatPage.setWithGalsDosage(tdata.randUnits);
        let total = treatPage.pigs;

        expect(treatPage.input('Head Treated').getValue(), 'heads').to.equal(total);
    });

    it('Not able to set Heads bigger than total pigs', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '99999');
        let total = treatPage.pigs;

        expect(treatPage.input('Head Treated').getValue(), 'heads').to.equal(total);
    });

    it('Not able to set float value in Heads', () => {
        treatPage.setWithCcsDosage(tdata.randCcs, '1.01');

        expect(treatPage.input('Head Treated').getValue(), 'heads').to.equal('101');
    });

    it('Not able to set float value in Gals', () => {
        treatPage.setWithGalsDosage(tdata.randUnits).setGals('1.01');
        
        expect(treatPage.input('Gals').getValue(), 'gals').to.equal('1');
    });

    it('Not able to set negative value in Heads', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '-123');
        
        expect(treatPage.input('Head Treated').getValue(), 'heads').to.equal('123');
    });

    it('Not able to set negative value in Units', () => {
        treatPage.setWithGalsDosage(tdata.randUnits).setUnits('-123');

        isChrome && expect(treatPage.input('Units').getProperty('value'), 'units').to.equal('0123');
        isSafari && expect(treatPage.input('Units').getProperty('value'), 'units').to.equal('023');
    });

    it('Not able to set negative value in Gals', () => {
        treatPage.setWithGalsDosage(tdata.randUnits).setGals('-123');

        isChrome && expect(treatPage.input('Gals').getProperty('value'), 'gals').to.equal('0123');
        isSafari && expect(treatPage.input('Gals').getProperty('value'), 'gals').to.equal('023');
    });

    it('Not able to set negative value in Ccs', () => {
        treatPage.setWithCcsDosage(tdata.randCcs).setCcs('-123');

        isChrome && expect(treatPage.input('ccs').getProperty('value'), 'ccs').to.equal('0123');
        isSafari && expect(treatPage.input('ccs').getProperty('value'), 'ccs').to.equal('023');
    });

    it('Not able to set negative value in Mls', () => {
        treatPage.setWithMlsDosage(tdata.randMls).setMls('-123');
        
        isChrome && expect(treatPage.input('Milliliters').getProperty('value'), 'mls').to.equal('0123');
        isSafari && expect(treatPage.input('Milliliters').getProperty('value'), 'mls').to.equal('023');
    });

    it('Not able to set negative value in Total', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '20')
            .addRow().setWithCcsDosage(tdata.randCcs, '20')
            .setTotal('-30').resetIndex();

        expect(treatPage.total.getValue(), 'total').to.equal('30');
    });

    it('Not able to set values bigger than 99999 in Units', () => {
        treatPage.setWithGalsDosage(tdata.randUnits).setUnits('1234567890');
        
        expect(treatPage.input('Units').getValue(), 'units').to.equal('12345');
    });

    it('Not able to set values bigger than 99999  in Gals', () => {
        treatPage.setWithGalsDosage(tdata.randUnits).setGals('1234567890');
        
        expect(treatPage.input('Gals').getValue(), 'gals').to.equal('12345');
    });


    it('Not able to set values bigger than 99999  in Ccs', () => {
        treatPage.setWithCcsDosage(tdata.randCcs).setCcs('1234567890');
        
        expect(treatPage.input('ccs').getValue(), 'ccs').to.equal('12345');
    });

    it('Not able to set values bigger than 99999 in Mls', () => {
        treatPage.setWithMlsDosage(tdata.randMls).setMls('1234567890');
        
        expect(treatPage.input('Milliliters').getValue(), 'mls').to.equal('12345');
    });

    it('Not able to set letters in Heads', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, 'qwerty ~!@#$%^&*()');
        
        expect(treatPage.input('Head Treated').getValue(), 'heads').to.equal('0');
    });

    it('Not able to set letters in Units', () => {
        treatPage.setWithGalsDosage(tdata.randUnits).setUnits('qwerty ~!@#$%^&*()');
        
        expect(treatPage.input('Units').getValue(), 'units').to.equal('0');
    });

    it('Not able to set letters in Gals', () => {
        treatPage.setWithGalsDosage(tdata.randUnits).setGals('qwerty ~!@#$%^&*()');
        
        expect(treatPage.input('Gals').getValue(), 'gals').to.equal('0');
    });

    it('Not able to set letters  in Ccs', () => {
        treatPage.setWithCcsDosage(tdata.randCcs).setCcs('qwerty ~!@#$%^&*()');
        
        expect(treatPage.input('ccs').getValue(), 'ccs').to.equal('0');
    });

    it('Not able to set letters in Mls', () => {
        treatPage.setWithMlsDosage(tdata.randMls).setMls('qwerty ~!@#$%^&*()');
        
        expect(treatPage.input('Milliliters').getValue(), 'mls').to.equal('0');
    });

    it('Not able to set letters in Total', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '20')
            .addRow().setWithCcsDosage(tdata.randCcs, '20')
            .setTotal('qwerty ~!@#$%^&*()').resetIndex();

        expect(treatPage.total.getValue(), 'total').to.equal('20');
    });

    it('Not able to set Total differ than Heads', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '100').setTotal('10');
        
        expect(treatPage.total.getValue(), 'total').to.equal('100');
    });

    it.skip('Not able to set Total less than maxValue from filled Heads', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '10')
            .addRow().setWithCcsDosage(tdata.randCcs, '20')
            .addRow().setWithoutDosage(tdata.randNoDosage, '30')
            .setTotal('1').resetIndex();

        expect(treatPage.total.getValue(), 'total').to.equal('30');
    });

    it.skip('Not able to set Total bigger than summ of filled Heads', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '10')
            .addRow().setWithCcsDosage(tdata.randCcs, '20')
            .addRow().setWithoutDosage(tdata.randNoDosage, '30')
            .setTotal('100').resetIndex();

        expect(treatPage.total.getValue(), 'total').to.equal('60');
    });

    it('Not able to report without Heads', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '0', '2.2', '30');

        expect(treatPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Not able to report without Units', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '10', '0', '30');

        expect(treatPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Not able to report without Gals', () => {
        treatPage.setWithGalsDosage(tdata.randUnits, '10', '2.2', '0');

        expect(treatPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Not able to report without Ccs', () => {
        treatPage.setWithCcsDosage(tdata.randCcs, '10', '0');

        expect(treatPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });

    it('Not able to report without Mls', () => {
        treatPage.setWithMlsDosage(tdata.randMls, '10', '0');

        expect(treatPage.isSubmitDisabled, 'isSubmitDisabled').to.equal(true);
    });
});

describe('Report single treat', () => {
    beforeEach(function () {
        this.currentTest.title === 'Choose group'
            || checkupPage.openCurrent().chooseSection(2, 'Treats');
    });

    it('Choose group', () => {
        checkupPage.randCheckup();

        expect($(checkupPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Cancel report', function() {
        if (treatPage.isMobile) {
            this.skip();
        } else {
            treatPage.setWithGalsDosage(tdata.randUnits, tdata.randHeads, 
                tdata.randDosage, tdata.randGals)
                .cancel();
            checkupPage.section(2).scrollIntoView({block: "center"});

            expect(checkupPage.isEmpty(2), 'isEmpty(2)').to.equal(true);
        }
    });

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

        expect(rslt.amount, 'amount').to.equal('1');
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

        expect(rslt.amount, 'amount').to.equal('1');
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

        expect(rslt.amount, 'amount').to.equal('1');
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

        expect(rslt.amount, 'amount').to.equal('1');
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

describe('Report few treats', () => {
    let rslt;
    const test = tdata.randTreatsData();

    it('Choose random group', () => {
        checkupPage.randCheckup();
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

        expect(browser.getUrl(), 'checkup url').to.match(/(\/daily-checkup\/)([0-9]+)$/);
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
});
