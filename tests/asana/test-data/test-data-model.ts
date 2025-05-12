export interface TestData {
    baseUrl: string;
    username: string;
    password: string;
    testScenarios: Scenario[];
}

export type Scenario = [
    string,   /* app type */
    string,   /* title    */
    string,   /* status   */
    string[]  /* tags     */
];
