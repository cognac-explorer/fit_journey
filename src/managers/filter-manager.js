class FilterManager {
  constructor() {
    this.options = {
      year: 'All Time',
      groupBy: 'Day',
      activity: 'RUN'
    };
    this.listeners = [];
  }

  setFilter(key, value) {
    this.options[key] = value;
    this.notifyListeners();
  }

  applyFilters(records) {
    if (this.options.year === 'All Time') return records;
    let filtered = records.filter(record => {
      const recordYear = record.date.getFullYear().toString();
      return recordYear === this.options.year;
    });
    return filtered;
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback();
    });
  }

  addListener(callback) {
    this.listeners.push(callback);
  }
}

export { FilterManager };
