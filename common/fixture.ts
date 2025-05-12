import { test as base, type Locator, type Page } from '@playwright/test';
import { Log } from './log';
import { TestBase } from './test-base';

function patch<T extends object, K extends keyof T>(obj: T, name: K, impl: T[K]) {
    if (!(obj as any)[name]) {
        Object.defineProperty(obj, name, { value: impl, configurable: true });
    }
}

const sleep = (ms: number = 1000) => new Promise<void>(res => setTimeout(res, ms));

interface EnhancedLocator extends Locator {
    fillSafely(value: string, maxAttempts?: number): Promise<void>;
}

export const test = base.extend<{
    log: Log;
    testBase: TestBase;
}>({
    log: async ({ }, use, testInfo) => {
        const logger = new Log(testInfo.title);
        await use(logger);
        logger.postOutput(testInfo.status ?? 'unknown');
    },

    testBase: async ({ log }, use) => {
        const base = new TestBase(log);
        await use(base);
    },

    page: async ({ page }, use) => {
        const sample = page.locator('body');
        const prototype = Object.getPrototypeOf(sample) as any;

        patch(prototype, 'fillSafely', async function (value: string, maxAttempts = 3) {
            const sel = (this as any)._selector;
            for (let i = 1; i <= maxAttempts; i++) {
                await this.fill(value);
                if ((await this.inputValue()) === value) {
                    return;
                }
                await sleep(500);
            }
            throw new Error(`fillSafely: failed on "${sel}"`);
        });

        await use(page);
    }
});