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
