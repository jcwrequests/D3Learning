window.onload = function(){
   //Graph Source http://bl.ocks.org/mbostock/5977197
   // If axis label gets chopped then adjust the margins


    var margin = {top: 20, right: 20, bottom: 100, left: 100},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var fromatCurrency = d3.format("$,f");  // https://github.com/mbostock/d3/wiki/Formatting

    var xValue = function(d) { return d.letter; }, // data -> value
        xScale = d3.scale.ordinal().rangeRoundBands([0, width], .1), // value -> display
        xMap = function(d) { return xScale(xValue(d)); }, // data -> display
        xAxis = d3.svg.axis().scale(xScale)
            .orient("bottom");

    var yValue = function(d) { return d.frequency; }, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d)); }, // data -> display
        yAxis = d3.svg.axis().scale(yScale)
          .orient("left")
          .tickFormat(fromatCurrency);

    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data.tsv", type, function(error, data) {
      xScale.domain(data.map(xValue));
      yScale.domain([0, d3.max(data, yValue)]);

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")  //rotating the access text starts here ref:  http://bl.ocks.org/mbostock/4403522
          .attr("y", 0)
          .attr("x", 18)
          .attr("dy", ".35em")
          .attr("transform", "rotate(90)")
          .style("text-anchor", "start");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
          .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Revenue");

      svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", xMap)
          .attr("width", xScale.rangeBand)
          .attr("y", yMap)
          .attr("height", function(d) { return height - yMap(d); });

    });

    function type(d) {
      d.frequency = +d.frequency;
      return d;
    }
}