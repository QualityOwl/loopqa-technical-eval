import { test } from '../../../common/fixture';
import { expect } from '@playwright/test';
import jsonData from '../test-data/test-data.qa.json';
import type { TestData, Scenario } from '../test-data/test-data-model';

const [{ baseUrl, username, password, testScenarios }] = jsonData as TestData[];

test.beforeEach(async ({ page, log }) => {
    log.step(`Navigate to \'${baseUrl}\'.`);
    await page.goto(`${baseUrl}`);

    log.step('Enter \'Username\' field.');
    const usernameTextbox = page.getByRole('textbox', { name: 'Username' });
    await usernameTextbox.fillSafely(`${username}`);

    log.step('Enter \'Password\' field.');
    const passwordTextbox = page.getByRole('textbox', { name: 'Password' });
    await passwordTextbox.fillSafely(`${password}`);

    log.step('Click \'Sign in\' button.');
    const signinButton = page.getByRole('button', { name: 'Sign in' });
    await signinButton.click();
});

test.afterEach(async ({ browser, testBase }) => {
    await testBase.Cleanup(browser);
});

test.describe('\'Project\' Board Test Scenarios', () => {
    for (const scenario of testScenarios) {
        const [appType, cardTitle, status, tagArray] = scenario as Scenario;

        test(`${appType}: "${cardTitle}" should be ${status}`, async ({ page, log }) => {

            log.step(`Click \'${appType}\' tile in the left-hand navigation column.`)
            const appTypeButton = page.getByRole('button', { name: appType });
            await appTypeButton.click();

            log.step(`Verify that the \'${cardTitle}\' card is displayed under the \'${status}\' column.`);
            // First, get the column element based on the 'status' value.
            const statusColumn = page.locator(`//h2[text()=\'${status}\']//parent::div`);
            await expect(statusColumn).toHaveCount(1);

            // Then, confirm that the column element contains the expected card based on the 'cardTitle' value.
            const card = statusColumn.locator(`//h3[contains(text(),\'${cardTitle}\')]//parent::div`);
            await expect(card).toHaveCount(1);

            for (const tag of tagArray) {
                log.step(`Verify that the \'${cardTitle}\' card contains the \'${tag}\' tag.`);
                await expect(card.getByText(tag, { exact: true }).first()).toHaveCount(1);
            }
        });
    }
});