import { DataManager } from './managers/data-manager.js';
import { ChartRenderer } from './views/chart-renderer.js';
import { FilterManager } from './managers/filter-manager.js';

class SportsDashboard {
  constructor() {
    this.dataManager = new DataManager();
    this.filterManager = new FilterManager();
    this.chartRenderer = new ChartRenderer('myChart');

    this.filterManager.addListener(() => this.updateChart());
    this.setupEventListeners();
  }

  async init() {
    await this.dataManager.loadData();
    this.updateChart();
  }

  updateChart() {
    let records = this.dataManager.getRecords(this.filterManager.options.activity);
    console.log(records);
    records = this.filterManager.applyFilters(records);
    this.chartRenderer.render(records);
  }

  setupEventListeners() {
    document.addEventListener('click', (event) => {
      const target = event.target;

      if (target.matches('[data-activity]')) {
        const activity = target.dataset.activity;
        this.updateActiveClass('.nav-link', target);
        this.filterManager.setFilter('activity', activity);
        return;
      }

      if (target.matches('[data-year]')) {
        const year = target.dataset.year;
        this.updateActiveClass('.year-btn', target);
        this.filterManager.setFilter('year', year);
        return;
      }

      if (target.matches('[data-group]')) {
        const group = target.dataset.group;
        this.updateActiveClass('.group-btn', target);
        this.filterManager.setFilter('groupBy', group);
        return;
      }
    });
  }

  updateActiveClass(selector, activeElement) {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.remove('active');
    });
    activeElement.classList.add('active');
  };
}

export { SportsDashboard };
