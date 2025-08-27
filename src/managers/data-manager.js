import { RunRecord } from '../records/run-record.js';
import { BarsRecord } from '../records/bars-record.js';
import { WeightsRecord } from '../records/weights-record.js';

class DataManager {
  constructor() {
    this.runRecords = [];
    this.barRecords = [];
    this.weightRecords = [];
  }

  async loadData() {
    this.runRecords = await this.loadActivity(RunRecord);
    this.barRecords = await this.loadActivity(BarsRecord);
    this.weightRecords = await this.loadActivity(WeightsRecord);
  }

  async loadActivity(RecordClass) {
    const csvData = await fetch(RecordClass.CSV_FILE).then(r => r.text());
    const rows = csvData.split("\n").slice(1);
    return rows.map(row => {
        const values = row.split(',');
        return RecordClass.fromCSVRow(values);
    });
  }

  getRecords(activity) {
    const recordMap = {
        'RUN': this.runRecords,
        'BARS': this.barRecords,
        'WEIGHTS': this.weightRecords
    };
    return recordMap[activity] || [];
  }
}

export { DataManager };
