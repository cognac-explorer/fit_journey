class RunRecord {
  static COLUMNS = { DATE: 0, DISTANCE: 3, SPEED: 4, ROUTE: 5, NOTES: 6 };
  static CSV_FILE = "data/run.csv";

  static ChartConfig = [
    { type: 'run', label: 'Distance (km)', metric: 'distance', color: 'blue' },
    { type: 'run', label: 'Speed (km/h)', metric: 'speed', color: 'red' }
  ];

  static metricsOptions = [];

  constructor(data) {
    this.date = data.date;
    this.type = 'run';
    this.distance = data.distance;
    this.speed = data.speed;
    this.route = data.route;
    this.routeFeatures = data.routeFeatures;
    this.notes = data.notes;
  }

  static fromCSVRow(csvRow) {
    const cols = RunRecord.COLUMNS;
    const data = {
        date: new Date(csvRow[cols.DATE]),
        distance: parseFloat(csvRow[cols.DISTANCE]),
        speed: parseFloat(csvRow[cols.SPEED]),
        route: csvRow[cols.ROUTE],
        routeFeatures: csvRow[cols.ROUTE_FEATURES],
        notes: csvRow[cols.NOTES]
    };
    return new RunRecord(data);
  }

  getTooltipText() {
    let tooltip = '';
    if (this.route) {
      tooltip += `Route: ${this.route}`;
    }
    if (this.notes) {
      tooltip += (tooltip ? '\n': '') + `Notes: ${this.notes}`;
    }
    return tooltip;
  }

  static aggregate(periodDate, records) {
    const totalDistance = records.reduce((acc, row) => acc + (row.distance || 0), 0);
    const avgSpeed = records.reduce((acc, row) => acc + (row.speed || 0), 0) / records.length;

    return new RunRecord({
      date: new Date(periodDate),
      type: 'run',
      distance: totalDistance,
      speed: avgSpeed
    });
  }
}

export { RunRecord };
