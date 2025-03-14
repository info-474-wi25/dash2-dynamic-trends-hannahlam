const margin = { top: 50, right: 30, bottom: 60, left: 70 };
const width = 900 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select("#lineChart1")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("weather.csv").then(data => {
    data.forEach(d => {
        d.date = new Date(d.date);
        d.month = d.date.getMonth() + 1;
        d.year = d.date.getFullYear();
        d.maxtemp = +d.actual_max_temp;
        d.city = d.city.trim();
    });

    const cities = [...new Set(data.map(d => d.city))];

    const dropdown = d3.select("#city-select");
    dropdown.selectAll("option")
        .data(cities)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);

    const xScale = d3.scaleTime().range([0, width]);
    const yScale = d3.scaleLinear().range([height, 0]);

    const line = d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.maxtemp))
        .curve(d3.curveMonotoneX);

    const xAxisGroup = svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`);

    const yAxisGroup = svg.append("g")
        .attr("class", "y-axis");

    function updateChart(selectedCity) {
        const filteredData = data.filter(d => d.city === selectedCity && d.month === 12 && d.year === 2014);
        filteredData.sort((a, b) => a.date - b.date);

        xScale.domain(d3.extent(filteredData, d => d.date));
        yScale.domain([d3.min(filteredData, d => d.maxtemp) - 2, d3.max(filteredData, d => d.maxtemp) + 2]);

        svg.selectAll(".line").remove();
        svg.selectAll(".dot").remove();

        svg.append("path")
            .datum(filteredData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line)
            .attr("class", "line");

        svg.selectAll(".dot")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xScale(d.date))
            .attr("cy", d => yScale(d.maxtemp))
            .attr("r", 4)
            .attr("fill", "blue");

        xAxisGroup.call(d3.axisBottom(xScale).ticks(6))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        yAxisGroup.call(d3.axisLeft(yScale));

        // Ensure labels are removed before adding new ones
        svg.selectAll(".axis-label").remove();

        // Debugging: Log to check if labels are being created
        console.log("Appending labels...");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 20)  // Adjusted position
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "black")  // Ensure visibility
            .style("font-weight", "bold")
            .text("Date");

        svg.append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", -height / 2)
            .attr("y", -margin.left + 15) // Adjusted position
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("fill", "black")  // Ensure visibility
            .style("font-weight", "bold")
            .text("Max Temperature (°F)");

        // Check in console if labels exist
        console.log("Label elements:", svg.selectAll(".axis-label").nodes());
    }

    dropdown.on("change", function () {
        const selectedCity = this.value;
        updateChart(selectedCity);
    });

    updateChart(cities[0]);
});
