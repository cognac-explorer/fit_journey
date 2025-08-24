
async function processData(dataMap) {

    const { run: runData, bars: barsData, gaps: gapsData } = dataMap;

    const bdates = barsData.map(row => new Date(row[0]));
    const types = barsData.map(row => row[3]);
    const total_reps = barsData.map(row => parseFloat(row[6]));

    runDataStats(runData);

    // Convert gap dates to Date objects
    const gapShapes = gapsData.map(gap => ({
        type: 'rect',
        xref: 'x',
        yref: 'paper',
        x0: gap[0],
        x1: gap[1],
        y0: 0,
        y1: 1,
        fillcolor: 'rgba(255, 0, 0, 0.07)', // Transparent red
        line: { width: 0 }
    }));

    const gapAnnotations = [];
    const usedYPositions = [];
    // TODO: now annotation text looks ugly, improve it
    gapsData.forEach((gap, index) => {
        const midPoint = new Date((new Date(gap[0]).getTime() + new Date(gap[1]).getTime()) / 2);
        let yPosition = index % 2 == 0 ? 1.05 : 1.12;

        gapAnnotations.push({
            x: midPoint,
            y: yPosition,
            xref: 'x',
            yref: 'paper',
            text: gap[2],
            showarrow: false,
            font: { color: 'red', size: 12 }
        });
    });



    // Layout customization
    const layout = {
        title: { text: 'Runs', font: { color: '#ffffff' } },
        paper_bgcolor: '#121212',
        plot_bgcolor: '#1e1e1e',
        xaxis: {
            title: { text: 'Time', font: { color: '#ffffff' } },
            color: '#ffffff'
        },
        yaxis: {
            title: { text: 'Values', font: { color: '#ffffff' } },
            color: '#ffffff'
        },
        shapes: gapShapes,
        annotations: gapAnnotations,
        legend: {
            font: { color: '#ffffff' },
            bgcolor: '#1e1e1e',
            bordercolor: '#333333',
            borderwidth: 1
        }
    };

    Plotly.newPlot('chart', [trace1, trace2, trace3], layout);
}



        async function prepareBarsData(data) {
            const types = ['pull_ups', 'dips', 'push_ups'];
            const labels = ['Pull-ups', 'Dips', 'Push-ups'];
            const colors = ['blue', 'red', 'brown'];

            const datasets = types.map((type, index) => {
                const typeData = data
                .filter(row => row.type === type)
                .map(row => ({ x: row.date, y: row.reps }));

                return {
                    label: labels[index],
                    data: typeData,
                    borderColor: colors[index]
                };
            }).filter(dataset => dataset.data.length > 0);
            return { datasets };
        }

        function filterDataByYear(data, year) {
            // console.log(currentFilters);
            if (year === 'All Time') return data;
            return data.filter(row => {
                const rowYear = row.date.getFullYear().toString();
                return rowYear === year;
            });
        }

        function groupDataByPeriod(data, groupBy) {

            const grouped = {};

            if (groupBy === 'Day') return data;

            data.forEach(row => {
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
            console.log(grouped);
            // Convert grouped data back to array format with proper aggregation
            return Object.entries(grouped).map(([groupedTimeFactor, groupData]) => {
                const rows = groupData.rows;
                if (rows.length === 1) return rows[0];

                if (currentFilters.activity === 'RUN') {
                    // Distance (sum)
                    const totalDistance = rows.reduce((acc, row) => acc + (parseFloat(row.distance) || 0), 0);
                    // Speed (average)
                    const avgSpeed = rows.reduce((acc, row) => acc + (parseFloat(row.speed) || 0), 0) / rows.length;
                    return {
                        date: new Date(groupedTimeFactor),
                        distance: totalDistance,
                        speed: avgSpeed
                    };
                } else if (currentFilters.activity === 'BARS') {
                    return ['pull_ups', 'dips', 'push_ups'].map(type => {
                        const totalReps = rows
                            .filter(row => row.type === type)
                            .reduce((acc, row) => acc + (parseFloat(row.reps) || 0), 0);
                        return {
                            date: new Date(groupedTimeFactor),
                            type: type,
                            reps: totalReps
                        };
                    }).filter(entry => entry.reps > 0);
                }
            }).flat();
        }
