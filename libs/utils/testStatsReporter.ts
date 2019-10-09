import WDIOReporter from '@wdio/reporter';
import fs from 'fs';

export const clearCurrentResults = () => {
  const data = JSON.stringify(
    {
      passes: 0,
      failures: 0,
      pending: 0,
    },
    null,
    2,
  );

  fs.writeFileSync('current-result.json', data);
};

export default class TestStatsReporter extends WDIOReporter {
  passes = 0;
  failures = 0;
  pending = 0;
  path = 'current-result.json';

  onRunnerStart() {
    const rawResults = fs.readFileSync(this.path, 'utf8');
    const results = JSON.parse(rawResults);
    this.passes = results.passes;
    this.failures = results.failures;
    this.pending = results.pending;
  }

  onTestPass() {
    this.passes += 1;
  }
  onTestFail() {
    this.failures += 1;
  }
  onTestSkip() {
    this.pending += 1;
  }

  onRunnerEnd() {
    this.writeToFile(this.getData());
  }

  getData() {
    return {
      passes: this.passes,
      failures: this.failures,
      pending: this.pending,
    };
  }

  writeToFile(results) {
    const data = JSON.stringify(results, null, 2);

    fs.writeFileSync(this.path, data);
  }
}
