import '@playwright/test';

declare module '@playwright/test' {
    interface Locator {
        /**
         * Tries to set a value to the input field based on maximum attempts.
         * If the value is not set when the attempt count exceeds the maximum value, an error is thrown.
         * 
         * **Useage**
         * 
         * ```js
         * await locator.fillSafely('Text to enter into the field.');
         * ```
         * 
         * @param value Value to set for the `<input>`, `<textarea>` or `[contenteditable]` element.
         * @param maxAttempts Maximum number of times that the value is attempted to be set [default = 3].
         */
        fillSafely(value: string, maxAttempts?: number): Promise<void>;
    }
}