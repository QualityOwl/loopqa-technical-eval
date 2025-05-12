import { Browser } from '@playwright/test';
import { Log } from './log';

export class TestBase {    
    constructor(private readonly log: Log) {}
    
    async Cleanup(browser: Browser) {
        this.log.step("Close browser.");
        await Promise.all(browser.contexts().map(c => c.close()))
    }
}