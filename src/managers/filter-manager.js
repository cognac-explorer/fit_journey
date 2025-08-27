class FilterManager {
  constructor() {
    this.options = {
      year: 'All Time',
      groupBy: 'Day',
      activity: 'RUN'
    };
    this.listeners = [];
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback();
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  setFilter(key, value) {
    this.options[key] = value;
    this.notifyListeners();
  }

  applyFilters(records) {
    return this.timeGroupBy(this.timeFilter(records));
  }

  timeFilter(records) {
    if (this.options.year === 'All Time') return records;
    let filtered = records.filter(record => {
      const recordYear = record.date.getFullYear().toString();
      return recordYear === this.options.year;
    });
    return filtered;
  }

  timeGroupBy(records) {
    const periodRecords = {};
    const groupBy = this.options.groupBy;

    if (groupBy === 'Day') return records;

    records.forEach(row => {
      let periodDate;
      switch (groupBy) {
        case 'Week':
          periodDate = new Date(row.date);
          periodDate.setDate(row.date.getDate() - row.date.getDay());
          periodDate = periodDate.toISOString().split('T')[0];
          break;
        case 'Month':
          periodDate = new Date(row.date)
          periodDate.setDate(1);
          periodDate.setHours(0, 0, 0, 0);
          break;
        default:
          return data;
      }

      if (!periodRecords[periodDate]) {
        periodRecords[periodDate] = [];
      }
      periodRecords[periodDate].push(row);
    });

    const RecordClass = records[0].constructor;
    // Convert grouped data back to array format with proper aggregation
    return Object.entries(periodRecords).map(([periodDate, records]) => {
      if (records.length === 1) return records[0];
      return RecordClass.aggregate(periodDate, records);
    }).flat();
  }
}

export { FilterManager };
