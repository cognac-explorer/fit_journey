class ChartRenderer {
  constructor(canvasId) {
      this.chart = null;
      this.ctx = document.getElementById(canvasId);
  }

  render(records) {
    if (records.length === 0) return;

    const chartData = this.prepareChartData(records);

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

  prepareChartData(records) {
    const config = records[0].constructor.getChartConfig();
    return {
      datasets: config.datasets.map(datasetConfig => ({
        label: datasetConfig.label,
        data: records
          .filter(record => record.type === datasetConfig.type)
          .map(record => ({
            x: record.date,
            y: record[datasetConfig.field],
            tooltip: record.getTooltipText()
          })),
        borderColor: datasetConfig.color,
        backgroundColor: datasetConfig.color
      }))
    };
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
