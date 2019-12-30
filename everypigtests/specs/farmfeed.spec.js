const Page = require('../pageobjects/report.page');
const dcPage = require('../pageobjects/checkup.page');
const admin = require('../pageobjects/admin.page');

let page = new Page({ row: '[class^=activity-box]' });

describe('Farmfeed', () => {
    let activity;
    const mention = ['Mention Someone', 'Mention a Farm', 'Post a Company Message'];

    mention.forEach((el) => {
        it('Create post: ' + el, () => {
            const post = $('.post-content');
            const text = tdata.randComment;

            page.clickFarmfeed();
            post.waitClick().$('textarea').waitSetValue(text);
            page.clickOn(post.$('span=' + el));
            el.includes('Company') || page.setDropdown('TA', post);
            page.clickBtn('Post', post);
            activity = page.block();

            expect(activity.$('span[class^=Translation] > span').getText(), 'farmfeed post text').to.equal(text);
        });

        it('Delete post: ' + el, () => {
            page.clickDots(activity)
                .clickOption('Delete')
                .clickToModal('Yes, Delete Post');

            expect(page.block().$('div[class^=direct-post-box]').isExisting(), 'direct post not exist')
                .to.equal(false);
        });
    });

    it('Min/max event', () => {
        activity = page.block();
        const before = activity.getCSSProperty('height').parsed.value;
        page.reload()
            .clickDots(activity)
            .clickOption('Minimize Event');
        let after = activity.getCSSProperty('height').parsed.value;

        expect(before > after, `before(${before}) > after(${after})`).to.equal(true);

        page.clickFarmfeed()
            .clickDots(activity)
            .clickOption('Maximize Event');
        after = activity.getCSSProperty('height').parsed.value;

        expect(before === after, `before(${before}) === after(${after})`).to.equal(true);
    });

    it('Post options: Manage Group', () => {
        activity = page.reload().block('Share');
        const group = activity.$('strong*=PigGroup').getText();
        page.clickDots(activity).clickOption('Manage Group');
        const rslt = $('.GroupProfileHeader .group-name').getText();

        expect(rslt === group, `${rslt} === ${group}`).to.equal(true);
    });

    it('Post options: Manage Farm', () => {
        activity = page.clickFarmfeed().block('Share');
        const farm = activity.$('strong*=Farm').getText();
        page.clickDots(activity).clickOption('Manage Farm');
        const rslt = $('.AdminPanel .farm-info-wrapper h1').getText();

        expect(rslt === farm, `${rslt} === ${farm}`).to.equal(true);
    });

    it('Post options: Manage User', () => {
        activity = page.clickFarmfeed().block('TA_PigGroup');
        const user = 'TA TenantAdmin';
        page.clickDots(activity).clickOption('Manage User');
        const rslt = $('.AdminPanel .user-name').getText();

        expect(rslt === user, `${rslt} === ${user}`).to.equal(true);
    });

    it('Flag/Unflag event', () => {
        activity = page.clickFarmfeed().block('Share');
        const flag = activity.$('[class^=activity-body]').getText();
        page.clickOn(activity.$('span=Flag'));

        expect(activity.$('[class^=flagged]').isExisting(), `status flagged`).to.equal(true);

        page.clickSidebar('Flagged Activities');
        activity = page.block('TA_PigGroup');
        page.clickOn(activity.$('span=Unflag'));
        let flagged = activity.$('[class^=activity-body]').getText();

        expect(activity.$('[class^=flagged]').isExisting(), `status flagged`).to.equal(false);
        expect(flag === flagged, `flag(${flag}) === flagged(${flagged})`).to.equal(true);

        page.clickFarmfeed();
        activity = page.block('TA_PigGroup');

        expect(activity.$('[class^=flagged]').isExisting(), `status flagged`).to.equal(false);

        page.clickSidebar('Flagged Activities');
        activity = page.block('TA_PigGroup');
        flagged = activity.$('[class^=activity-body]').getText();

        expect(flag !== flagged, `flag(${flag}) !== flagged(${flagged})`).to.equal(true);
    });

    it('Symptom trigger', () => {
        const symptomPage = require('../pageobjects/symptoms.page');
        const section = '.section-collapse_*=';

        page.clickFarmfeed();
        browser.newWindow('https://dev.everypig.com/farmfeed');
        browser.url('https://dev.everypig.com/admin/health-variables/symptoms');
        page.setElemsOnPage(100);
        const rows = page.tableRowsWith('Medium');
        const sympt = rows[tdata.rand(rows.length - 1)].$('a').getText();
        dcPage.randCheckup().noToAllReports().chooseSection('Symptom');
        symptomPage.setSymptom(sympt, 25).submit();
        dcPage.submitDC().clickToModal('OK');
        browser.switchWindow('farmfeed');
        page.clickOn($('.FarmFeedNewLabel.active')).pause(1000);
        activity = page.block();

        expect(activity.$('strong*=TA_PigGroup').getText(), 'group').to.equal(dcPage.group);

        let wrap = activity.$(section + 'Symptom');
        const rslt = page.clickOn(wrap).symptInfo(wrap, '[class^=line_]');

        expect(rslt.name[0], 'name').to.equal(sympt);
        expect(rslt.percent[0], 'percent').to.equal(25 + '%');
    });

    it('Deaths trigger', () => {
        const deathPage = require('../pageobjects/deaths.page');
        const section = '.section-collapse_*=';
        const test = tdata.randDeathsData();

        admin.openPrefs().setOn('Track Mortality Reasons');
        dcPage.randCheckup().noToAllReports().chooseSection('Mortal');
        deathPage.setMortWithReason(test.reasons[0], 5).submit();
        dcPage.submitDC().clickToModal('OK').clickFarmfeed();
        activity = page.block();

        expect(activity.$('strong*=TA_PigGroup').getText(), 'group').to.equal(dcPage.group);

        let wrap = activity.$(section + 'Dead');
        const rslt = page.clickOn(wrap).deathInfo(wrap, '[class^=item_]');

        expect(rslt.reason[0], 'reason').to.equal(test.reasons[0]);
        expect(rslt.chronic[0], 'chronic').to.equal('5');
    });

    it('Note trigger', () => {
        const test = tdata.randComment;
        dcPage.randCheckup()
            .noToAllReports().setComment(test)
            .submitDC().clickToModal('OK')
            .clickFarmfeed();
        activity = page.block();

        expect(activity.$('strong*=TA_PigGroup').getText(), 'group').to.equal(dcPage.group);

        const rslt = activity.$(page.commentWrapper).getText();

        expect(rslt, 'comment').to.equal(test);
    });

    it('Media trigger', () => {
        const test = tdata.randCheckupData;
        dcPage.randCheckup().noToAllReports().clearMedia()
            .uploadMedia([test.files.video, test.files.pic, test.files.audio])
            .submitDC().clickToModal('OK')
            .clickFarmfeed();
        activity = page.block();

        expect(activity.$('strong*=TA_PigGroup').getText(), 'group').to.equal(dcPage.group);

        let wrap = activity.$('[class^=assets-section_]');
        let rslt = page.mediaInfo(wrap);

        expect(rslt.sum, 'sum').to.equal(2);

        wrap = activity.$('.FarmFeedRowAudioAssets');
        rslt = page.audioInfo(wrap, '.AudioPreview', '.comment-body');

        expect(rslt.sum, 'sum').to.equal(1);
    });

    it('Create post with media', () => {
        const post = $('.post-content');
        const text = tdata.randComment;
        const files = [tdata.randVideo, tdata.randPhoto, tdata.randAudio];

        page.clickFarmfeed();
        post.waitClick().$('textarea').waitSetValue(text);
        page.clickOn(post.$('span*=Mention Someone'))
            .setDropdown('TA', post)
            .uploadMedia(files);

        $('.post-btn').waitForEnabled(90000);
        page.clickBtn('Post', post);
        activity = page.block();

        let rslt = page.mediaInfo(activity.$('[class^=farmfeed-assets]'));

        expect(rslt.sum, 'nOfMedia').to.equal(2);

        rslt = page.audioInfo(activity, '.AudioPreview', '.comment-body');

        expect(rslt.sum, 'nOfAudio').to.equal(1);
    });

    it('Add Diagnose', () => {
        const dBar = require('../pageobjects/diagnosis.bar');
        const test = tdata.randDiagnosData();
        let rslt;

        page.clickFarmfeed();
        activity = page.block('Diagnose');
        page.clickOn(activity.$('span=Diagnose'));

        dBar.clear().setDiagnos(test.diseases[0], test.types[0], test.comments[0]).setAlert()
            .addRow().setDiagnos(test.diseases[1], test.types[1], test.comments[1])
            .addRow().setDiagnos(test.diseases[2], test.types[2], test.comments[2])
            .clickSave();

        page.notification.waitForExist(5000, true);
        page.reload();        //page.clickOn($('.FarmFeedNewLabel.active')).pause(1000);
        activity = page.block().$('.collapses-box-item*=Diagnos');
        rslt = page.clickOn(activity.$('b')).diagnosInfo(activity, '[class^=diagnosis-info-row]');

        expect(rslt.amount, 'amount').to.equal(test.amount + '');
        test.diseases.forEach((el, idx) => {
            //expect(rslt.name[idx], 'name').to.equal(test.diseases[idx]);
            expect(rslt.type[idx], 'type').to.equal(test.types[idx] + ' Diagnosis');
            expect(rslt.comment[idx], 'comment').to.equal(test.comments[idx]);
            page.clickDots(activity).clickOption('Delete Diagnosis');
        });
    });

    it('Share post', () => {
        page.clickFarmfeed();
        activity = page.block('Share');
        const text = tdata.randComment;
        const body = activity.$('[class^=checkup-box]').getText();

        page.clickOn(activity.$('span=Share'))
            .clickOption('Share with another user');
        page.modalWrapper.$('textarea').setValue(text);
        page.setDropdown('Care', page.modalWrapper)
            .setDropdown('User', page.modalWrapper);

        const mentions = page.modalWrapper.$('[class^=activity-mentions]').getText();
        page.clickOn($('.remove-icon'))
            .setDropdown('Care', page.modalWrapper)
            .clickBtn('Post', $('.modal-footer'))
            .clickOn($('.FarmFeedNewLabel.active'))
            .pause(1000);

        activity = page.block();
        page.clickOn(activity.$('span=View Full Event'));

        const sheader = activity.$$('[class^=activity-header]')[0].getText();
        const smentions = activity.$('[class^=activity-mentions]').getText();
        const abody = activity.$('[class^=activity-box] [class^=checkup-box]').getText();

        expect(sheader, 'shared header').to.have.string('shared an event');
        expect(smentions, 'shared mentions').to.equal(mentions);
        expect(abody, 'shared activity body').to.equal(body);
    });

    it('Write comment to post', () => {
        const text = tdata.randComment;
        const comment = '.comment__text span span';

        page.clickFarmfeed();
        activity = page.block();

        activity.$('div textarea').waitSetValue(text);
        page.clickBtn('Post', activity);

        expect(activity.$(comment).getText(), 'comment text').to.equal(text);

        page.clickBtn('Edit', activity);
        activity.$('div textarea').setValue('edited');
        page.clickBtn('Save', activity);

        expect(activity.$(comment).getText(), 'edited comment text').to.equal(text + 'edited');

        page.clickBtn('Delete', activity);

        expect(activity.$(comment).isExisting(), 'comment does not exist').to.equal(false);
    });
});

describe('Farmfeed Checkup data', () => {
    let rslt, activity;
    const test = tdata.randCheckupData,
        nOfDeaths = test.deaths.chronic[0] + test.deaths.acute[0] + test.deaths.euthanas[0];

    before(function () {
        admin.openPrefs().setOff('Track Mortality Reasons')
            .openPrefs('DC').setOn('Water Usage').setOn('Temp Tracking');
    });

    it('Choose random group', () => {
        dcPage.randCheckup();
        tdata.toStringVal(test);

        expect($(dcPage.sectionWrapper).isExisting(), 'checkup section existing').to.equal(true);
    });

    it('Create checkup', () => {
        dcPage.createCheckup(test).submitDC().clickToModal('OK');

        expect($(dcPage.groupRow).isExisting(), 'groups existing').to.equal(true);
    });

    it('Reported data (Checkup)', () => {
        dcPage.openCurrent();

        rslt = dcPage.moveInfo;

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(rslt.added.concat(rslt.removed), 'heads(removed + added)').to.have.members(test.moves.heads);

        dcPage.section(1).scrollIntoView({block: 'center'});

        expect(dcPage.deathInfo.amount, 'amount of deaths').to.equal(nOfDeaths + '');

        dcPage.section(2).scrollIntoView({block: 'center'});
        rslt = dcPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);

        dcPage.section(3).scrollIntoView({block: 'center'});
        rslt = dcPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);

        dcPage.section(4).scrollIntoView({block: 'center'});
        rslt = dcPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);

        dcPage.section(5).scrollIntoView({block: 'center'});
        rslt = dcPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'comment').to.equal(test.water.comment);

        expect($(dcPage.comment).getText(), 'main comment').to.equal(test.comment);

        dcPage.mediaUploader.scrollIntoView({block: 'center'});
        rslt = dcPage.mediaInfo;

        expect(rslt.amount, 'nOfMedia').to.equal('3');
    });

    it('Reported data (Farmfeed)', () => {
        const section = '.section-collapse_*=';
        let wrap;

        page.clickFarmfeed();
        activity = page.block();

        expect(activity.$('strong*=TA_PigGroup').getText(), 'group').to.equal(dcPage.group);

        wrap = activity.$(section + 'Movement');
        rslt = page.clickOn(wrap).moveInfo(wrap, '[class^=line_]');

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(rslt.added.concat(rslt.removed), 'heads(removed + added)').to.have.members(test.moves.heads);
        expect(rslt.comment, 'comment').to.equal(test.moves.comment);

        wrap = activity.$(section + 'Symptom');
        rslt = page.clickOn(wrap).symptInfo(wrap, '[class^=line_]');

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);

        wrap = activity.$(section + 'Dead');
        rslt = page.clickOn(wrap).deathInfo(wrap, '[class^=item_]');

        expect(rslt.amount, 'amount of deaths').to.equal(nOfDeaths + '');

        wrap = activity.$(section + 'Medication');
        rslt = page.clickOn(wrap).treatInfo(wrap, '[class^=line_]');

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);

        wrap = activity.$(section + 'Temps');
        rslt = page.clickOn(wrap).tempsInfo(wrap, '[class^=line_]');

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);

        wrap = activity.$(section + 'Water');
        rslt = page.clickOn(wrap).waterInfo(wrap, '[class^=line_]');

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'comment').to.equal(test.water.comment);

        wrap = activity.$('[class^=assets-section_]');
        rslt = page.mediaInfo(wrap);

        expect(rslt.sum, 'nOfMedia').to.equal(2);

        wrap = activity.$('.FarmFeedRowAudioAssets');
        rslt = page.audioInfo(wrap, '.AudioPreview', '.comment-body');

        expect(rslt.sum, 'nOfAudio').to.equal(1);

    });

    it('Reported data (Barn Sheets)', () => {
        const sheetsPage = require('../pageobjects/barnsheets.page');
        activity = page.block();

        page.clickDots(activity).clickOption('View Barn Sheet')
            .clickCell('', 0, 1);

        rslt = sheetsPage.moveInfo;

        expect(rslt.amount, 'amount of moves').to.equal(test.moves.amount);
        expect(rslt.added.concat(rslt.removed), 'heads(removed + added)').to.have.members(test.moves.heads);
        expect(rslt.comment, 'comment').to.equal(test.moves.comment);

        rslt = sheetsPage.deathInfo;

        expect(rslt.amount, 'amount of deaths').to.equal(nOfDeaths + '');

        rslt = sheetsPage.symptInfo;

        expect(rslt.amount, 'amount of symptoms').to.equal(test.sympts.amount);
        expect(rslt.name, 'name of symptoms').to.have.members(test.sympts.name);

        rslt = sheetsPage.treatInfo;

        expect(rslt.amount, 'amount of treats').to.equal(test.treats.amount);
        expect(rslt.name, 'name of treat').to.have.members(test.treats.name);
        expect(rslt.heads, 'heads of treats').to.have.members(test.treats.heads);

        rslt = sheetsPage.tempsInfo;

        expect(rslt.high, 'high temp').to.equal(test.temps.high);
        expect(rslt.low, 'low temp').to.equal(test.temps.low);
        expect(rslt.comment, 'comment').to.equal(test.temps.comment);

        rslt = sheetsPage.waterInfo;

        expect(rslt.consumed, 'water consumed').to.equal(test.water.consumed);
        expect(rslt.comment, 'comment').to.equal(test.water.comment);

        rslt = sheetsPage.mediaInfo;

        expect(rslt.sum, 'nOfMedia').to.equal(2);

        rslt = sheetsPage.audioInfo;

        expect(rslt.sum, 'nOfAudio').to.equal(1);
    });

});

page = new Page({ row: '[class^=activity-box]', input: '[class^=value-input-line]' });

const reachEnd = () => {
    do {
        const activities = $$(page.row + ' [class^=activity-actions-bar]');
        activities.length && activities.slice(-1)[0].scrollIntoView();
        page.waitLoader();
    } while (!$('.ReachEndPlaceholder').isDisplayed());
};

describe('Farmfeed Filters', () => {
    let activities;

    it('Scroll events', () => {
        page.open();
        for(let i = 0; i < 10; i++) {
            activities = $$(page.row + ' [class^=activity-actions-bar]');
            let number = activities.length;

            expect(number, `number of events`).to.equal((i+1)*12);

            activities.slice(-1)[0].scrollIntoView();
            page.waitLoader();

            activities = $$(page.row + ' [class^=activity-actions-bar]' );
            number = activities.length;

            expect(number, `after scroll: number  of events`).to.equal((i+2)*12);
        }
    });

    it('Search events', () => {
        const list = '[class^=search-list]';
        activities = page.row + ' [class^=activity-actions-bar]';

        page.reload().clickFarmfeed()
            .setInput('ta', $('.FarmfeedSearch'), undefined, 'div');
        browser.keys('Enter');
        page.waitLoader()
            .clickOn('.DatesFilter')
            .setDate('1').setDate('10');
        reachEnd();

        const topDate = +page.getNumber($$('.TimeLineSeparator')[0]);
        const bottomDate = +page.getNumber($$('.TimeLineSeparator').slice(-1)[0]);

        expect(topDate <= 10, `top Date <= 10`).to.equal(true);
        expect(bottomDate >= 1, `bottom Date >= 1`).to.equal(true);

        page.clickOn('.filter-item=Company')
            .setSearch('TA_Tenant', list)
            .clickOn(list + ' [class^=line_]');
        reachEnd();

        let filtered = $$(page.getClassName(page.row) + '*=TA_Tenant' ).length;
        let all = $$(activities).length;

        expect(filtered, 'filtered activities by Company ').to.equal(all);

        const farm = $(page.row).$('strong*=TA_Farm').getText();
        page.clickOn('.filter-item=Farm')
            .setSearch(farm, list)
            .clickOn(list + ' [class^=line_]');
        reachEnd();

        filtered = $$(page.getClassName(page.row) + '*=' + farm).length;
        all = $$(activities).length;

        expect(filtered, 'filtered activities by Farm ').to.equal(all);

        const group = $(page.row).$('strong*=TA_PigGroup').getText();
        page.clickOn('.filter-item=Group')
            .setSearch(group, list)
            .clickOn(list + ' [class^=line_]');
        reachEnd();

        filtered = $$(page.getClassName(page.row) + '*=' + group).length;
        all = $$(activities).length;

        expect(filtered, 'filtered activities by Group ').to.equal(all);

        page.clickBtn('Clear All');
        filtered = $$('.farmfeed-page .fa.fa-angle-down').length;
        all = $$(activities).length;

        expect(filtered, 'cleared filters').to.equal(4);
        expect(all, 'all events').to.equal(12);
    });

    it('Create Filter for events', () => {
        const dropdown = '[class^=menu][class*=opened]';

        page.reload().clickFarmfeed()
            .clickOn('.open-filter-icon')
            .clickOn('span=Add Filter')
            .clickOn('li=Event Date')
            .clickOn('label=before')
            .setDate('1')
            .clickBtn('Done')

            .clickOn('span=Add Filter')
            .clickOn('li=Group ID')
            .clickOn('label=contains')
            .setInput('PigGroup', $(dropdown))
            .clickBtn('Done', dropdown)

            .clickOn('span=Add Filter')
            .clickOn('li=User')
            .clickOn('label=is', dropdown)
            .setDropdown('TA Caretaker', $(dropdown))
            .clickBtn('Done', dropdown)

            .clickOn('span=Save Filter')
            .setInput('First filter', $('.modal-wrapper'), 'Filter Name', 'section')
            .clickBtn('Save')
            .clickBtn('View Filter');

        activities = $(page.row);
        const user = page.getString(activities.$('[class^=activity-author-line] b'));

        expect(user, `user`).to.equal('TA Caretaker');
    });

    it('Change and Create filter from existing one', () => {
        const dropdown ='[class^=menu][class*=opened]';

        page.reload().clickFarmfeed()
            .clickSidebar('First filter')
            .clickBtn('View Filter')
            .clickOn('span*=Group ID')
            .clickOn('[class*=remove-icon][class*=visible]')

            .clickOn('span=Add Filter')
            .clickOn('li=Farm Name')
            .clickOn('label=contains')
            .setInput('TA_Farm', $(dropdown))
            .clickBtn('Done', dropdown)

            .clickOn('span=Add Filter')
            .clickOn('li=Est. Avg. Weight')
            .clickOn('label=has range', dropdown)
            .setInput('9', $(dropdown), 'from')
            .setInput('11', $(dropdown), 'to')
            .clickBtn('Done', dropdown)

            .clickOn('span=Add Filter')
            .clickOn('li=Mortality Rate')
            .clickOn('label=less than', dropdown)
            .setInput('1.01', $(dropdown))
            .clickBtn('Done', dropdown)

            .clickOn('span=Save Filter')
            .clickOn('b=Create New Filter')
            .setInput('Second filter', $('.modal-wrapper'), undefined, 'div')
            .clickBtn('Save');

        activities = $(page.row);
        page.clickOn('strong*=TA_PigGroup');
        const weight = +page.getNumber(activities.$('strong*=lbs'));
        const rate = +page.getFloat(activities.$('strong*=%'));

        expect(weight > 9 && weight < 11, `weight(${weight}) has range [9, 11]`).to.equal(true);
        expect(rate < 1.01, `rate(${rate}) < 1.01`).to.equal(true);
    });

    it('Update filter', () => {
        page.reload().clickFarmfeed()
            .clickSidebar('First filter')
            .clickBtn('View Filter')
            .clickOn('span=Events that match all filters')
            .clickOn('span=Events that match any filters')
            .clickOn('span*=Show me events before')
            .clickOn('[class*=remove-icon][class*=visible]')

            .clickOn('span=Add Filter')
            .clickOn('li=Media')
            .clickOn('li=Does not have Media')

            .clickOn('span=Save Filter')
            .clickBtn('Save');

        let number = $$(page.row + ' [class^=activity-actions-bar]').length;

        expect(number, `number of events`).to.equal(25);

        page.clickOn('span=Events that match any filters')
            .clickOn('span=Events that match all filters')
            .clickOn('span=Save Filter')
            .clickBtn('Save');

        const user = page.getString($(page.row).$('[class^=activity-author-line] b'));
        number = $$('[class^=image]').length + $$('.audio-item').length;

        expect(user, `user`).to.equal('TA Caretaker');
        expect(number, `${number} of media`).to.equal(0);
    });

    it('Delete filter', () => {
        page.reload().clickFarmfeed()
            .clickSidebar('First filter')
            .clickBtn('Delete Filter')
            .clickBtn('Yes, Delete Filter')
            .clickSidebar('Second filter')
            .clickBtn('Delete Filter')
            .clickBtn('Yes, Delete Filter');

        expect(page.sidebar.$('span=First filter').isExisting(), 'no First filter in left sidebar').to.equal(false);
        expect(page.sidebar.$('span=Second filter').isExisting(), 'no Second filter in left sidebar').to.equal(false);
    });
});
