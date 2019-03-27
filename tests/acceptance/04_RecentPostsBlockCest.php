<?php


class RecentPostsBlockCest
{
    public function _before(AcceptanceTester $I)
    {
    }

    public function _after(AcceptanceTester $I)
    {
    }

    public function addRecentPostsBlocks(AcceptanceTester $I)
    {
        $I->wantTo('Create a recent post blocks');

        $I->amOnPage('/wp-admin/post-new.php');

        // Click on + button
        $I->click('.edit-post-header-toolbar .editor-inserter button');

        // Search for Recent Posts block
        $I->fillField(['xpath'=>'//input[contains(@id, \'editor-inserter__search-\')]'], 'Recent Posts');

        $I->waitForText('Recent Posts');
        $I->click('Recent Posts');

        $I->waitForElement('//label[text()="Category"]/following-sibling::node()/option[text()="Recent posts"]');
        $I->selectOption('//label[text()="Category"]/following-sibling::node()', array('text' => 'Recent posts'));

        $I->fillField('.editor-post-title__input', 'Recent Posts blocks test');

        $I->click('Publish…');
        $I->waitForElementVisible('.editor-post-publish-button');

        $I->click('Publish');
        $I->waitForText('Post published.');

        $I->click('View Post');

        $I->seeNumberOfElements('.advgb-recent-post', 8);
    }

    public function changeNumberOfItems(AcceptanceTester $I)
    {
        $I->click('Edit Post');

        $I->clickAndWait('.editor-block-navigation');

        $I->clickAndWait('Recent Posts');
        $I->waitForText('Recent Posts');

        $I->waitForElementVisible('//label[text()="Number of items"]/following-sibling::input[@type="number"][@value="8"]');
        $I->wait(1);
        $I->fillField('//label[text()="Number of items"]/following-sibling::input[@type="number"]', 5);

        $I->waitForElementNotVisible('//article[@class="advgb-recent-post"][6]');

        $I->click('Update');
        $I->waitForText('Post updated.');

        $I->click('View Post');

        $I->seeNumberOfElements('.advgb-recent-post', 5);

    }
}
