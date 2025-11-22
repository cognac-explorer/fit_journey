class ChartRenderer {
  constructor(canvasId) {
      this.chart = null;
      this.ctx = document.getElementById(canvasId);
  }

  render(records, activeSettings) {
    if (records.length === 0) return;

    const config = records[0].constructor.ChartConfig;
    const metricOptions = records[0].constructor.metricsOptions;

    let selectedMetric = activeSettings.metric;
    // Check if the metric is not found in the array
    if (metricOptions.length && !metricOptions.some(option => option.value === selectedMetric)) {
      // If not found, use the first option
      selectedMetric = metricOptions[0].value;
    }

    this.updateMetricSelector(metricOptions, selectedMetric);
    const chartData = this.prepareChartData(records, config, selectedMetric);

    if (this.chart) {
      this.chart.data = chartData;
      this.chart.update();
    } else {
      this.chart = new Chart(this.ctx, {
        type: 'line',
        data: chartData,
        options: this.getChartOptions()
      });
    }
  }

  prepareChartData(records, config, metric) {
    return {
      datasets: config.map(datasetConfig => ({
        label: datasetConfig.label,
        data: records
          .filter(record => record.type === datasetConfig.type)
          .map(record => ({
            x: record.date,
            y: record[datasetConfig.metric || metric],
            tooltip: record.getTooltipText()
          })),
        borderColor: datasetConfig.color,
        backgroundColor: datasetConfig.color,
        // dashed line for gaps longer than 32 days
        spanGaps: false,
        segment: {
          borderDash: ctx => {
            const prev = ctx.p0.parsed.x;
            const curr = ctx.p1.parsed.x;  
            const daysDiff = (curr - prev) / (1000 * 60 * 60 * 24);
            return daysDiff > 32 ? [10, 15] : undefined;  // [10, 15] defines dashed line
          }
        }
      }))
    };
  }

  updateMetricSelector(metricOptions, metric) {
    const metricSection = document.querySelector('.metric-section');
    const metricButtons = document.querySelector('.metric-buttons');

    if (metricOptions.length === 0) {
      metricSection.style.display = 'none';
      metricButtons.style.display = 'none';
      return;
    }

    metricSection.style.display = 'inline';
    metricButtons.style.display = 'flex';

    metricButtons.innerHTML = metricOptions.map((option) =>
      `<button class="metric-btn ${option.value === metric ? 'active' : ''}" data-metric="${option.value}">
        ${option.label}
      </button>`
    ).join('');
  }

  getChartOptions() {
    return {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM d'
            }
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 5
          },
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        },
        y: {
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            afterBody: function (context) {
              const dataPoint = context[0].raw;
              return dataPoint.tooltip;
            }
          }
        }
      }
    };
  }

}

export { ChartRenderer };
