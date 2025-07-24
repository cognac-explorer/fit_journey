export async function fetchCSVData(filePath) {
    try {
        const response = await fetch(filePath);
        const csvText = await response.text();
        const rows = csvText.split("\n").map(row => row.split(","));
        const headers = rows[0];
        const data = rows.slice(1).filter(row => row.length === headers.length);
        return data;
    } catch (error) {
        console.error('Error fetching CSV from ${filePath}:', error);
        return null;
    }
}

export async function loadAllData(files) {
    const dataPromises = Object.entries(files).map(async ([key, filePath]) => {
        const data = await fetchCSVData(filePath);
        if (!data) {
            console.error(`Failed to load data for ${key}.`);
            return null;
        }
        return [key, data];
    });

    const dataEntries = await Promise.all(dataPromises);
    if (dataEntries.includes(null)) {
        console.error("Failed to load some data.");
        return;
    }

    return Object.fromEntries(dataEntries);
}

export function runDataStats(runData) {
    // Calculate counters
    const currentYear = new Date().getFullYear();
    const totalRuns = runData.length;
    const runsThisYear = runData.filter(row => new Date(row[0]).getFullYear() === currentYear).length;
    // Calculate average runs per week
    const startDate = new Date(runData[0][0]);
    const endDate = new Date(runData[runData.length - 1][0]);
    const totalWeeks = Math.ceil((endDate - startDate) / (7 * 24 * 60 * 60 * 1000));
    const averageRunsPerWeek = totalWeeks > 0 ? (totalRuns / totalWeeks).toFixed(2) : 0;

    document.getElementById("totalRuns").textContent = totalRuns;
    document.getElementById("runsThisYear").textContent = runsThisYear;
    document.getElementById("averageRunsPerWeek").textContent = averageRunsPerWeek;
}


            // const cal = new CalHeatmap();
        //     cal.paint(
        //         {
        //             range: 24,
        //             date: {start: new Date('2023-01-01')},
        //             data: {
        //                 source: 'data/run.csv',  // TODO: already parsed above, use it
        //                 type: 'csv',
        //                 x: 'start_dt',
        //                 y: d => +d['distance_km'],
        //                 defaultValue: 0
        //             },
        //             domain: {
        //                 type: 'month',
        //                 gutter: 4,
        //                 label: { text: 'MMM', textAlign: 'start', position: 'top' },
        //             },
        //             scale: {
        //                 color: {
        //                     type: 'linear',
        //                     scheme: 'Plasma',
        //                     domain: [0, 10]
        //                 },
        //             },
        //             legend: {
        //                 show: true,
        //                 label: 'Daily Volume',
        //                 width: 150,
        //                 marginLeft: 10,
        //                 marginRight: 10
        //             },
        //             subDomain: {
        //                 type: 'ghDay',
        //                 radius: 2,
        //                 width: 11,
        //                 height: 11,
        //                 gutter: 4
        //             },
        //             itemSelector: "#heatmap"
        //         },
        //         [
        //             [
        //                 Tooltip,
        //                 {
        //                     text: function (date, value, dayjsDate) {
        //                     return (
        //                         (value != 0 ? value + 'km' : 'No data') + ' on ' + dayjsDate.format('LL')
        //                     );
        //                     },
        //                 },
        //             ],
        //             [
        //                 Legend,
        //                 {
        //                     tickSize: 0,
        //                     width: 150,
        //                     itemSelector: '#heatmap-legend',
        //                     label: 'Distance, km',
        //                 },
        //             ],
        //             [
        //                 CalendarLabel,
        //                 {
        //                     width: 30,
        //                     textAlign: 'start',
        //                     text: () => dayjs.weekdaysShort().map((d, i) => (i % 2 == 0 ? '' : d)),
        //                     padding: [25, 0, 0, 0],
        //                 },
        //             ],
        //         ]    
        //    );