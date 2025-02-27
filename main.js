const margin = { top: 50, right: 30, bottom: 60, left: 70 };
        const width = 900 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Create SVG container
        const svg = d3.select("#lineChart1")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Tooltip element
        // const tooltip = ...

        // 2.a: LOAD DATA
        d3.csv("weather.csv").then(data => {
            
            // 2.b: TRANSFORM DATA
            data.forEach(d => {
                d.date = new Date(d.date);
                d.month = d.date.getMonth() + 1; // Months are 0-based
                d.year = d.date.getFullYear();
                d.maxtemp = +d.actual_max_temp; // Convert to number
            });

            // 2.c: FILTER DATA FOR CHICAGO, DECEMBER 2014
            const filteredData = data.filter(d =>
                d.city === "Chicago" && d.month === 12 && d.year === 2014
            );

            // Sort by date to ensure proper line connection
            filteredData.sort((a, b) => a.date - b.date);

            // 3.a: SET SCALES
            const xScale = d3.scaleTime()
                .domain(d3.extent(filteredData, d => d.date))
                .range([0, width]);

            const yScale = d3.scaleLinear()
                .domain([d3.min(filteredData, d => d.maxtemp) - 2, d3.max(filteredData, d => d.maxtemp) + 2])
                .range([height, 0]);

            // 4.a: DRAW LINE
            const line = d3.line()
                .x(d => xScale(d.date))
                .y(d => yScale(d.maxtemp))
                .curve(d3.curveMonotoneX); // Smooth curve

            svg.append("path")
                .datum(filteredData)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr("d", line);


                svg.selectAll(".dot")
                .data(filteredData)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => xScale(d.date))
                .attr("cy", d => yScale(d.maxtemp))
                .attr("r", 4)
                .attr("fill", "blue")

    // 4.a: PLOT DATA FOR CHART 1
    svg.selectAll(".dot")
    .data(filteredData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.date))
    .attr("cy", d => yScale(d.maxtemp))
    .attr("r", 4)
    .attr("fill", "blue")
    .on("mouseover", (event, d) => {
        tooltip.style("display", "block")
            .html(`Date: ${d.date.toDateString()}<br>Max Temp: ${d.maxtemp}°F`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", () => tooltip.style("display", "none"));

// 5.a: ADD AXES
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).ticks(6))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end");

svg.append("g").call(d3.axisLeft(yScale));

// 5.b: ADD AXIS LABELS
svg.append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", height + 50)
    .attr("text-anchor", "middle")
    .text("Date");

svg.append("text")
    .attr("class", "axis-label")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -50)
    .attr("text-anchor", "middle")
    .text("Max Temperature (°F)");

    // 5.a: ADD AXES FOR CHART 1


    // 6.a: ADD LABELS FOR CHART 1


    // 7.a: ADD INTERACTIVITY FOR CHART 1
    

    // ==========================================
    //         CHART 2 (if applicable)
    // ==========================================

    // 3.b: SET SCALES FOR CHART 2


    // 4.b: PLOT DATA FOR CHART 2


    // 5.b: ADD AXES FOR CHART 


    // 6.b: ADD LABELS FOR CHART 2


    // 7.b: ADD INTERACTIVITY FOR CHART 2


});