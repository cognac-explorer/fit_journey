class RunRecord {
  static COLUMNS = { DATE: 0, DISTANCE: 3, SPEED: 4, ROUTE: 5, NOTES: 6 };
  static CSV_FILE = "data/run.csv";

  static getChartConfig() {
    return {
      datasets: [
        { label: 'Distance (km)', field: 'distance', color: 'blue' },
        { label: 'Speed (km/h)', field: 'speed', color: 'red' }
      ]
    };
  }

  constructor(data, context) {
    this.date = data.date;
    this.distance = data.distance;
    this.speed = data.speed;
    this.route = data.route;
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

  static aggregate(anchorDate, groupedRows) {
    const totalDistance = groupedRows.reduce((acc, row) => acc + (row.distance || 0), 0);
    const avgSpeed = groupedRows.reduce((acc, row) => acc + (row.speed || 0), 0) / groupedRows.length;

    return new RunRecord({
      date: new Date(anchorDate),
      distance: totalDistance,
      speed: avgSpeed
    });
  }
}

export { RunRecord };
