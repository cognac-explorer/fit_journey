import { RunRecord } from '../records/run-record.js';

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
    records = this.timeFilter(records);
    console.log(records);
    records = this.timeGroupBy(records);
    console.log(records);
    return records;
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
    const grouped = {};
    const groupBy = this.options.groupBy;

    if (groupBy === 'Day') return records;

    records.forEach(row => {
      let groupedTimeFactor;
      switch (groupBy) {
        case 'Week':
          groupedTimeFactor = new Date(row.date);
          groupedTimeFactor.setDate(row.date.getDate() - row.date.getDay());
          groupedTimeFactor = groupedTimeFactor.toISOString().split('T')[0];
          break;
        case 'Month':
          groupedTimeFactor = new Date(row.date)
          groupedTimeFactor.setDate(1);
          groupedTimeFactor.setHours(0, 0, 0, 0);
          break;
        default:
          return data;
      }

      if (!grouped[groupedTimeFactor]) {
        grouped[groupedTimeFactor] = {
          rows: []
        };
      }
      grouped[groupedTimeFactor].rows.push(row);
    });

    // console.log(grouped);
    const RecordClass = records[0].constructor;
    // Convert grouped data back to array format with proper aggregation
    return Object.entries(grouped).map(([groupedTimeFactor, groupData]) => {
      const rows = groupData.rows;
      if (rows.length === 1) return rows[0];
      return RecordClass.aggregate(groupedTimeFactor, groupData.rows);

      // if (this.options.activity === 'RUN') {
      // } else if (this.options.groupBy.activity === 'BARS') {
      //   return ['pull_ups', 'dips', 'push_ups'].map(type => {
      //     const totalReps = rows
      //       .filter(row => row.type === type)
      //       .reduce((acc, row) => acc + (parseFloat(row.reps) || 0), 0);
      //     return {
      //       date: new Date(groupedTimeFactor),
      //       type: type,
      //       reps: totalReps
      //     };
      //   }
      // ).filter(entry => entry.reps > 0);

    }).flat();
  }
}

export { FilterManager };
