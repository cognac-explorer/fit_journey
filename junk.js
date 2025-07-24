
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