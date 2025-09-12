class CalisthenicsRecord {
  static COLUMNS = { DATE: 0, TYPE: 1, FORMULA: 2, BEST_REPS: 3, TOTAL: 4, NOTES: 5 };
  static CSV_FILE = "data/calisthenics.csv";

  static ChartConfig = [
    { type: 'pull_ups', label: 'Pull-ups', color: 'green' },
    { type: 'dips', label: 'Dips', color: 'blue' },
    { type: 'push_ups', label: 'Push-ups', color: 'red' }
  ];

  static metricsOptions = [
    { value: 'total', label: 'Total Reps' },
    { value: 'bestReps', label: 'Best Reps' }
  ];

  constructor(data) {
    this.date = data.date;
    this.type = data.type;
    this.formula = data.formula;
    this.bestReps = data.bestReps;
    this.total = data.total;
    this.notes = data.notes;
  }

  static fromCSVRow(csvRow) {
    const cols = CalisthenicsRecord.COLUMNS;
    const data = {
      date: new Date(csvRow[cols.DATE]),
      type: csvRow[cols.TYPE],
      formula: csvRow[cols.FORMULA],
      bestReps: csvRow[cols.BEST_REPS],
      total: parseInt(csvRow[cols.TOTAL]),
      notes: csvRow[cols.NOTES]
    };
    return new CalisthenicsRecord(data);
  }

  getTooltipText() {
    let tooltip = '';
    if (this.formula) {
      tooltip += `Formula: ${this.formula}`;
    }
    if (this.notes) {
      tooltip += (tooltip ? '\n' : '') + `Notes: ${this.notes}`;
    }
    return tooltip;
  }

  static aggregate(periodDate, records) {
    return this.ChartConfig.map(config => {
      const total = records.filter(record => record.type === config.type).reduce((acc, row) => acc + (row.total || 0), 0);
      const bestReps = records.filter(record => record.type === config.type).reduce((max, row) => Math.max(max, row.bestReps || 0), 0);

      return new CalisthenicsRecord({
        date: new Date(periodDate),
        type: config.type,
        bestReps: bestReps,
        total: total
      });
    }).filter(record => record.total > 0);

  }
}

export { CalisthenicsRecord };
