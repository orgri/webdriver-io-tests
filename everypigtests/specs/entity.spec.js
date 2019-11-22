const Page = require('../pageobjects/report.page');

page = new Page({row: '.row', input: 'div.column'});

describe('Manage entities', () => {
    const id = tdata.rand(9999);
    const group = 'Group_created_by_TA_' + id;
    const farm = 'Farm_created_by_TA_' + id;
    const company = 'Company_created_by_TA_' + id;
    const user = 'User_' + id;

    it('Create group', () => {
        page.clickSidebar('Groups')
            .clickBtn('Create Group')
            .clickBtn('Set Date').setDate('15').clickBtn('Save')
            .clickBtn('Set Ownership').setDropdown('TA').clickBtn('Save')
            .clickBtn('Set Farm').setDropdown('0000').clickBtn('Save')
            .clickOn('Use A Custom Group ID')
            .setInput(group, 'Custom Group ID', undefined, '.modal-wrapper')
            .clickToModal('Save').clickBtn('Create Group');

        expect(page.notification.getText(), 'notification').to.equal('Group was successfully created');

        page.clickSidebar('Groups').setSearch(group);

        expect(page.tableRowsWith(group), 'group is in table').to.have.lengthOf(1);
    });

    it('Delete empty(no shipments) group', () => {
        page.clickSidebar('Groups')
            .setSearch(group)
            .clickBtn('Manage').clickDots().clickOption('Delete Group');

        expect(page.notification.getText(), 'notification').to.equal('Group was successfully deleted');

        page.clickSidebar('Groups').setSearch(group);

        expect(page.tableRowsWith(group), 'empty table').to.have.lengthOf(0);
    });

    it('Create farm', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Farms')
            .clickBtn('Create Farm');

        $('.map-block').click({x: 50, y: 50});

        page.setInput(farm, 'Farm Name')
            .setDropdown('UTC+2', 'Time Zone')
            .setInput(id, 'Farm ID')
            .setDropdown('M', 'Farm Type')
            .setDropdown('TA', 'Farm Management Provider')
            .clickBtn('Create Farm');

        expect(page.notification.getText(), 'notification').to.equal('Farm has been successfully created');

        page.clickHeaderTab('Farms').setSearch(farm);

        expect(page.cell(farm, 4)
            .$('span[class^=status-badge]').getText().toLowerCase(), 'status').to.equal('active');

        page.clickSidebar('Daily Checkup').setSearch(farm);

        expect(page.isExist(farm), 'farm exists').to.equal(true);
    });

    it('Disable farm', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Farms')
            .setSearch(farm)
            .clickArrow($('button')).clickOption('Disable Farm')
            .clickToModal('Yes, Disable Farm');

        expect(page.notification.getText(), 'notification').to.equal('Farm has been disabled!');

        page.clickSidebar('Daily Checkup').setSearch(farm);

        expect(page.nothingBox.getText(), 'nothing')
            .to.equal('There are no farms that fit these search criteria.');

        page.clickSidebar('Admin')
            .clickHeaderTab('Farms')
            .clickFilterBy('Disabled').setSearch(farm);

        expect(page.tableRowsWith(farm), 'farm is in disabled tab').to.have.lengthOf(1);
    });

    it('Enable farm', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Farms')
            .setSearch(farm)
            .clickArrow($('button')).clickOption('Enable Farm')
            .clickToModal('Yes, Enable Farm');

        expect(page.notification.getText(), 'notification').to.equal('Farm has been enabled!');

        page.clickSidebar('Daily Checkup').setSearch(farm);

        expect(page.isExist(farm), 'farm exists').to.equal(true);

        page.clickSidebar('Admin')
            .clickHeaderTab('Farms')
            .clickFilterBy('Disabled').setSearch(farm);

        expect(page.tableRowsWith(farm), 'farm is not in disabled tab').to.have.lengthOf(0);
    });

    it('Delete farm', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Farms')
            .clickFilterBy('Active')
            .setSearch(farm)
            .clickBtn('Edit')
            .clickDots().clickOption('Delete Farm')
            .clickToModal('Yes, Delete Farm');

        expect(page.notification.getText(), 'notification').to.equal('Farm has been deleted!');

        page.clickHeaderTab('Farms').setSearch(farm);

        expect(page.tableRowsWith(farm), 'empty table').to.have.lengthOf(0);
    });

    it('Create company', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Companies')
            .clickBtn('Create Company')
            .setInput(company, 'Company Name')
            .clickBtn('Create Company');

        expect(page.notification.getText(), 'notification').to.equal('Company has been successfully created');

        page.clickHeaderTab('Companies').setSearch(company);

        expect(page.tableRowsWith(company), 'company is in table').to.have.lengthOf(1);
    });

    it('Delete company', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Companies')
            .setSearch(company)
            .clickBtn('Edit')
            .clickDots().clickOption('Delete Company')
            .clickToModal('Yes, Delete Company');

        expect(page.notification.getText(), 'notification').to.equal('Company has been deleted');

        page.clickHeaderTab('Companies').setSearch(company);

        expect(page.tableRowsWith(company), 'empty table').to.have.lengthOf(0);
    });

    it.skip('Create user', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Users')
            .clickBtn('Create User')
            .setInput('ta_user_' + id + '@mail.everypig', 'Email Address')
            .setInput(user, 'First Name')
            .setInput('Created_by_TA', 'Last Name')
            .setInput('0123456789', 'Phone Number')
            .clickBtn('Create User');
    });

    it('Invite user', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Users')
            .clickBtn('Create User')
            .setInput('ta@user.everypig', 'Email Address') //User_3359
            .clickBtn('Invite User');

        expect(page.notification.getText(), 'notification').to.equal('Invite successfully sent to user');

        page.clickHeaderTab('Users').setSearch('Created_by_TA');

        expect(page.tableRowsWith('Created_by_TA'), 'user is in table').to.have.lengthOf(1);
    });


    it('Disable user', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Users')
            .setSearch('Created_by_TA')
            .clickArrow($('button')).clickOption('Disable User')
            .clickToModal('Yes, Disable User');

        expect(page.notification.getText(), 'notification').to.equal('User deactivated!');

        page.clickFilterBy('Disabled').setSearch('Created_by_TA');

        expect(page.cell('Created_by_TA', 3)
            .$('span[class^=status-badge]').getText().toLowerCase(), 'status').to.equal('disabled');
    });

    it('Enable user', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Users')
            .setSearch('Created_by_TA')
            .clickArrow($('button')).clickOption('Enable User')
            .clickToModal('Yes, Enable User');

        expect(page.notification.getText(), 'notification').to.equal('User activated!');

        page.clickSidebar('Admin')
            .clickHeaderTab('Users')
            .clickFilterBy('Disabled').setSearch('Created_by_TA');

        expect(page.tableRowsWith('Created_by_TA'), 'user is not in disabled').to.have.lengthOf(0);
    });

    it('Delete user', () => {
        page.clickSidebar('Admin')
            .clickHeaderTab('Users')
            .clickFilterBy('Pending')
            .setSearch('Created_by_TA')
            .clickBtn('Edit')
            .clickDots().clickOption('Delete User');

        expect(page.notification.getText(), 'notification').to.equal('User deleted!');

        page.clickHeaderTab('Users').setSearch('Created_by_TA');

        expect(page.tableRowsWith('Created_by_TA'), 'empty table').to.have.lengthOf(0);
    });

});
