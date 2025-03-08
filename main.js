const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// Create SVG container
const svg = d3.select("#lineChart1")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load data
d3.csv("weather.csv").then(data => {
    data.forEach(d => {
        d.date = new Date(d.date);
        d.month = d.date.getMonth() + 1;
        d.year = d.date.getFullYear();
        d.maxtemp = +d.actual_max_temp;
        d.city = d.city.trim(); // Ensure there are no leading/trailing spaces in city names
    });

    // List of cities for the dropdown (from the data)
    const cities = [...new Set(data.map(d => d.city))];

    // Populate dropdown with cities
    const dropdown = d3.select("#city-select");
    dropdown.selectAll("option")
        .data(cities)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    // Define scales for axes
    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    // Line generator for the chart
    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.maxtemp))
        .curve(d3.curveMonotoneX);

    // Append axes groups to the SVG
    const xAxisGroup = svg.append("g").attr("transform", `translate(0, ${height})`);
    const yAxisGroup = svg.append("g");

    // Function to update chart based on selected city
    function updateChart(selectedCity) {
        const filteredData = data.filter(d => d.city === selectedCity && d.month === 12 && d.year === 2014);
        filteredData.sort((a, b) => a.date - b.date);

        // Update the scales based on filtered data
        xScale.domain(d3.extent(filteredData, d => d.date));
        yScale.domain([d3.min(filteredData, d => d.maxtemp) - 2, d3.max(filteredData, d => d.maxtemp) + 2]);

        // Remove previous chart content
        svg.selectAll(".line").remove();
        svg.selectAll(".dot").remove();
        svg.selectAll("g").remove();

        // Append line
        svg.append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line)
            .attr("class", "line");

        // Append dots for each data point
        svg.selectAll(".dot")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.maxtemp))
            .attr("r", 4)
            .attr("fill", "blue");

        // Append axes
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(xScale).ticks(6))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        svg.append("g")
            .call(d3.axisLeft(yScale));
    }

    // Event listener for dropdown change (city selection)
    dropdown.on("change", function() {
        const selectedCity = this.value;
        updateChart(selectedCity); // Update chart with the selected city data
    });

    // Initialize with the first city
    updateChart(cities[0]); 
});


    // 5.a: ADD AXES FOR CHART 1


    // 6.a: ADD LABELS FOR CHART 1


    // 7.a: ADD INTERACTIVITY FOR CHART 1
    



