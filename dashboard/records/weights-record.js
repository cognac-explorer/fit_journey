class WeightsRecord {
  static COLUMNS = { DATE: 0, TYPE: 3, FORMULA: 4, BEST_SET: 5, BEST_WEIGHT: 6, TOTAL: 7, NOTES: 8, ADDITIONALS: 9 };
  static CSV_FILE = "https://raw.githubusercontent.com/cognac-explorer/fit_journey/data/data/weights.csv";

  static ChartConfig = [
    { type: 'squat', label: 'Squat', color: 'blue' },
    { type: 'deadlift', label: 'Deadlift', color: 'red' },
    { type: 'bench', label: 'Bench', color: 'green' }
  ];

  static metricsOptions = [
    { value: 'total', label: 'Total Volume' },
    { value: 'bestWeight', label: 'Best Weight' }
  ];

  constructor(data) {
    this.date = data.date;
    this.type = data.type;
    this.formula = data.formula;
    this.bestSet = data.bestSet;
    this.bestWeight = data.bestWeight;
    this.total = data.total;
    this.notes = data.notes;
    this.additionals = data.additionals;
  }

  static fromCSVRow(csvRow) {
    const cols = WeightsRecord.COLUMNS;
    const data = {
      date: new Date(csvRow[cols.DATE]),
      type: csvRow[cols.TYPE],
      formula: csvRow[cols.FORMULA],
      bestSet: parseFloat(csvRow[cols.BEST_SET]),
      bestWeight: parseFloat(csvRow[cols.BEST_WEIGHT]),
      total: parseFloat(csvRow[cols.TOTAL]),
      notes: csvRow[cols.NOTES],
      additionals: csvRow[cols.ADDITIONALS]
    };
    return new WeightsRecord(data);
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
      const bestWeight = records.filter(record => record.type === config.type).reduce((max, row) => Math.max(max, row.bestWeight || 0), 0);

      return new WeightsRecord({
        date: new Date(periodDate),
        type: config.type,
        bestWeight: bestWeight,
        total: total
      });
    }).filter(record => record.total > 0);

  }
}

export { WeightsRecord };
