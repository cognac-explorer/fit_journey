class BarsRecord {
  static COLUMNS = { DATE: 0, TYPE: 1, FORMULA: 2, BEST_NUM: 3, TOTAL: 4, NOTES: 5 };
  static CSV_FILE = "data/bars.csv";

  static metricsOptions = [
      { value: 'total', label: 'Total Volume' },
      { value: 'best_num', label: 'Best Reps' }
    ];

  static datasets = [
    { type: 'pull_ups', label: 'Pull-ups Total', field: 'total', color: 'green' },
    { type: 'pull_ups', label: 'Pull-ups Best', field: 'best_num', color: 'green' },
    { type: 'dips', label: 'Dips Total', field: 'total', color: 'blue' },
    { type: 'dips', label: 'Dips Best', field: 'best_num', color: 'blue' },
    { type: 'push_ups', label: 'Push-ups Total', field: 'total', color: 'red' },
    { type: 'push_ups', label: 'Push-ups Best', field: 'best_num', color: 'red' }
  ];

  static getChartConfig(metric) {
    return {
      datasets: this.datasets.filter(datasetConfig => datasetConfig.field === metric)
    };
  }

  constructor(data) {
    this.date = data.date;
    this.type = data.type;
    this.formula = data.formula;
    this.best_num = data.best_num;
    this.total = data.total;
    this.notes = data.notes;
  }

  static fromCSVRow(csvRow) {
    const cols = BarsRecord.COLUMNS;
    const data = {
      date: new Date(csvRow[cols.DATE]),
      type: csvRow[cols.TYPE],
      formula: csvRow[cols.FORMULA],
      best_num: csvRow[cols.BEST_NUM],
      total: parseFloat(csvRow[cols.TOTAL]),
      notes: csvRow[cols.NOTES]
    };
    return new BarsRecord(data);
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
    return ['pull_ups', 'push_ups', 'dips'].map(type => {
      const total = records.filter(record => record.type === type).reduce((acc, row) => acc + (row.total || 0), 0);
      const best_num = records.filter(record => record.type === type).reduce((max, row) => Math.max(max, row.best_num || 0), 0);

      return new BarsRecord({
        date: new Date(periodDate),
        type: type,
        best_num: best_num,
        total: total
      });
    }).filter(record => record.total > 0);

  }
}

export { BarsRecord };
