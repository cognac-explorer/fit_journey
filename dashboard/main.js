import { DataManager } from './managers/data-manager.js';
import { ChartRenderer } from './views/chart-renderer.js';
import { StateManager } from './managers/state-manager.js';

class SportsDashboard {
  constructor() {
    this.dataManager = new DataManager();
    this.stateManager = new StateManager();
    this.chartRenderer = new ChartRenderer('mainChart');

    this.stateManager.addListener(() => this.updateChart());
    this.setupEventListeners();
  }

  async init() {
    await this.dataManager.loadData();
    this.updateChart();
  }

  updateChart() {
    let records = this.dataManager.getRecords(this.stateManager.currentSettings.activity);
    records = this.stateManager.applySettings(records);
    this.chartRenderer.render(records, this.stateManager.currentSettings);
  }

  setupEventListeners() {
    document.addEventListener('click', (event) => {
      const target = event.target;

      if (target.matches('[data-activity]')) {
        const activity = target.dataset.activity;
        this.updateActiveClass('.nav-link', target);
        this.stateManager.setCurrentSetting('activity', activity);
        return;
      }

      if (target.matches('[data-year]')) {
        const year = target.dataset.year;
        this.updateActiveClass('.year-btn', target);
        this.stateManager.setCurrentSetting('year', year);
        return;
      }

      if (target.matches('[data-group]')) {
        const group = target.dataset.group;
        this.updateActiveClass('.group-btn', target);
        this.stateManager.setCurrentSetting('groupBy', group);
        return;
      }

      if (target.matches('[data-metric]')) {
        const metric = target.dataset.metric;
        this.updateActiveClass('.metric-btn', target);
        this.stateManager.setCurrentSetting('metric', metric);
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
