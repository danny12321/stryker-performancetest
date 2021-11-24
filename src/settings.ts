export default {
    project: "../stryker-new",
    paths: [
        "/packages/jest-runner",
        "/packages/cucumber-runner",
    ],
    command: "npm.cmd run stryker",
    outputFile: "output",
    summaryFile: "summary",
    iterations: 2,
    timeBetweenInS: 1,
    runName: "Wednesday afternoon run",
}