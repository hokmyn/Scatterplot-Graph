const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const draw = () => 
  graphData => {
    let margin = {top: 10, left: 100, bottom: 30},
        width = 800,
        height = 550,
        tooltipHtml,
        places = d3.scaleLinear()
                    .range([0, height])
                    .domain([1, 36]),
        time = d3.scaleLinear()
                    .range([0, width])
                    .domain([d3.max(graphData, d => d.Seconds) + 5, d3.min(graphData, d => d.Seconds) - 10]),
        svg = d3.select('#graph')
                  .append('svg')
                    .attr('width', '980')
                    .attr('height', '650')
                  .append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`),
        tooltip = d3.select('#graph')
                    .append('div')
                      .classed('tooltip', true)
                      .style('opacity', 0);
    
    svg.selectAll('circle')
        .data(graphData)
        .enter()
          .append('circle')
            .attr('cx', function(d) {
              return time(d.Seconds);
            })
            .attr('cy', d => places(d.Place))
            .attr('r', 6)
            .attr('class', 'graphCircle')
            .attr('fill', d => {
              if(d.Doping !== '') {
                return 'red';
              } else {
                return 'green';
              }
            })
            .on('mouseover', function(d) {
              tooltip.transition()
                .duration(300)
                .style('opacity', 0.8);
              tooltipHtml = `${d.Name}, ${d.Nationality} <br> Time: ${d.Time} Year: ${d.Year}`;
              if(d.Doping !== '') {
                tooltipHtml += `<br>${d.Doping}`;
              }
              tooltip.html(tooltipHtml)
                .style('left', (d3.event.pageX + 30) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');
            })
            .on('mouseout', function(d) {
              tooltip.transition()
                .duration(300)
                .style('opacity', 0);
            });
    
            let xAxis = d3.axisBottom(time);
                xAxis.tickFormat(function(d) {
                  let mins = Math.floor(d/60).toString();
                  let secs = (d%60).toString();
                  if (secs.length == 1) {
                    secs = "0" + secs;
                  }
                  return mins + ":" + secs;
                });
            let yAxis = d3.axisLeft(places);
          
            svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', function() {
              return 'translate(' + 0 + ',' + height +')' 
            })
            .call(xAxis);
    
            svg.append('g')
                .attr('class', 'y-axis')
                .call(yAxis);
            //X Axis Title
            svg.append("text")
              .attr('x',width/2)
              .attr('y',height + margin.top + margin.bottom)
              .style('text-anchor','middle')
              .text("Time");
            //Y axis title
            svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - margin.left / 1.6)
              .attr("x",0 - (height / 2))
              .attr("dy", "2em")
              .style("text-anchor", "middle")
              .text("Places");
            //red circle with legend
            svg.append("circle")
                .attr('cx', width / 1.5)
                .attr('cy', height / 1.5)
                .attr('r', 6)
                .attr('fill','red');
            svg.append('text')
                .attr('x', width / 1.5 + 10)
                .attr('y', height / 1.5 + 4.5)
                .attr("text-anchor", "right")
                .text("- Riders with doping allegations");
            //green circle with legend
            svg.append("circle")
                .attr('cx', width / 1.5)
                .attr('cy', height / 1.4)
                .attr('r', 6)
                .attr('fill','green');
            svg.append('text')
                .attr('x', width / 1.5 + 10)
                .attr('y', height / 1.4 + 4.5)
                .attr("text-anchor", "right")
                .text("- No doping allegations");
}

d3.json(url, draw());
