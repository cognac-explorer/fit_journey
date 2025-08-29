class WeightsRecord {
  static COLUMNS = { DATE: 0, TYPE: 3, FORMULA: 4, BEST_SET: 5, BEST_WEIGHT: 6, TOTAL: 7, NOTES: 8, ADDITIONALS: 9 };
  static CSV_FILE = "data/weights.csv";

  static metricsOptions = [
    { value: 'total', label: 'Total Volume' },
    { value: 'best_weight', label: 'Best Weight' }
  ];
  static datasets = [
    { type: 'squat', label: 'Squat Total', field: 'total', color: 'blue' },
    { type: 'squat', label: 'Squat Best', field: 'best_weight', color: 'blue' },
    { type: 'deadlift', label: 'Deadlift Total', field: 'total', color: 'red' },
    { type: 'deadlift', label: 'Deadlift Best', field: 'best_weight', color: 'red' },
    { type: 'bench', label: 'Bench Total', field: 'total', color: 'green' },
    { type: 'bench', label: 'Bench Best', field: 'best_weight', color: 'green' }
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
    this.best_set = data.best_set;
    this.best_weight = data.best_weight;
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
      best_set: parseFloat(csvRow[cols.BEST_SET]),
      best_weight: parseFloat(csvRow[cols.BEST_WEIGHT]),
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
    return ['squat', 'deadlift', 'bench'].map(type => {
      const total = records.filter(record => record.type === type).reduce((acc, row) => acc + (row.total || 0), 0);
      const best_weight = records.filter(record => record.type === type).reduce((max, row) => Math.max(max, row.best_weight || 0), 0);

      return new WeightsRecord({
        date: new Date(periodDate),
        type: type,
        best_weight: best_weight,
        total: total
      });
    }).filter(record => record.total > 0);

  }
}

export { WeightsRecord };
