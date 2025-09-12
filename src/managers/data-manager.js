import { RunRecord } from '../records/run-record.js';
import { CalisthenicsRecord } from '../records/calisthenics-record.js';
import { WeightsRecord } from '../records/weights-record.js';

class DataManager {
  constructor() {
    this.runRecords = [];
    this.CalisthenicsRecords = [];
    this.weightRecords = [];
  }

  async loadData() {
    this.runRecords = await this.loadActivity(RunRecord);
    this.calisthenicsRecords = await this.loadActivity(CalisthenicsRecord);
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
        'CALISTHENICS': this.calisthenicsRecords,
        'WEIGHTS': this.weightRecords
    };
    return recordMap[activity] || [];
  }
}

export { DataManager };
