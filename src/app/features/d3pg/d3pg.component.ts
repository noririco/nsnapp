import { Component, ElementRef, inject } from '@angular/core';
import * as d3 from 'd3';
import { dorotEvents, emipreEvents, empires, events } from './data';

@Component({
  selector: 'app-d3pg',
  standalone: true,
  imports: [],
  template: `
    <h1>Hello</h1>
    <div id="timeline"></div>
  `,
  styles: [
    `
      :host {
        display: flex;
      }
    `,
  ],
})
export class D3pgComponent {
  data = [...emipreEvents, ...dorotEvents].sort((e1, e2) => e1.startYear - e2.startYear);
  el = inject(ElementRef);
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | undefined;

  ngAfterViewInit() {
    this.createTimeline();
  }

  createTimeline() {
    const width = 1000;
    const height = 600; // Increase height to accommodate more rows
    const margin = { top: 20, right: 20, bottom: 40, left: 20 };
    const rowHeight = 10;
    // Calculate the total number of events
    const numEvents = this.data.length;

    // Set the minimum padding between each event (in pixels)
    const padding = 5; // Adjust this value as needed
    // Calculate available height for events (excluding axis)
    // const availableHeight = height - margin.top - margin.bottom - rowHeight;
    // const eventHeight = availableHeight / this.data.length + padding; // Dynamic height per event
    // const totalHeight = margin.top + margin.bottom + numEvents * eventHeight + 40;
    // Calculate available height for events (excluding axis and other static space)
    const availableHeight = height - margin.top - margin.bottom - rowHeight;

    // Calculate the height of each event, excluding the padding
    const eventHeight = (availableHeight - padding * (numEvents - 1)) / numEvents; // Total padding is distributed between events

    // Total height to ensure padding between rows
    // const totalHeight = margin.top + margin.bottom + numEvents * eventHeight + (numEvents - 1);
    // Total height is determined by the number of events, each with a rowHeight and padding
    const totalHeight = margin.top + margin.bottom + numEvents * rowHeight + (numEvents - 1) * padding;

    const startYear = -3760;
    const endYear = new Date().getFullYear();
    const tickInterval = 500;

    // SVG Container
    this.svg = d3.select('#timeline').append('svg').attr('width', width).attr('height', totalHeight).style('cursor', 'pointer');
    // Scale for the x-axis (timeline scale)

    const xScale = d3
      .scaleLinear()
      .domain([startYear, endYear])
      .range([margin.left, width - margin.right]);

    // const BCYears = [3760, 3500, 3000, 2500, 2000, 1500, 1000, 500];
    const BCYears = d3.range(startYear, 0, tickInterval);
    // Define the AD years using d3.range to generate values from 0 up to the current year
    const suffixADYears = d3.range(0, endYear + 1, tickInterval); // AD years: 0, 500, 1000, ..., 2024
    // Combine the BC years (with the prefix) and AD years
    const tickValues = BCYears.concat(suffixADYears);

    // Axis for timeline
    // Axis top
    const xAxisTop = d3
      .axisTop(xScale)
      .tickValues(tickValues)
      .tickFormat((d) => `${(d as number) >= 0 ? d : `${Math.abs(d as number)} BC`}`);

    // Axis top
    this.svg.append('g').attr('transform', `translate(0, ${margin.top})`).call(xAxisTop);

    const xAxisBottom = d3
      .axisTop(xScale)
      .tickFormat((d) => `${(d as number) >= 0 ? d : `${Math.abs(d as number)} BC`}`)
      .tickValues(tickValues);

    // Axis bottom
    this.svg
      .append('g')
      .attr('transform', `translate(0, ${totalHeight - margin.bottom})`)
      // .attr('transform', `translate(0, ${totalHeight})`)
      .call(xAxisBottom);

    // Linear color scale for event duration
    // Sequential color scale for distinct colors
    const colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([startYear, endYear]); // Map years to colors

    // Tooltip element
    const tooltip = d3
      .select('body')
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '5px')
      .style('border-radius', '4px')
      .style('font-size', '12px');

    // Add rectangles and labels for events
    this.svg
      .selectAll('g.event-group')
      .data(this.data)
      .enter()
      .append('g')
      .attr('class', 'event-group')
      .attr('transform', (d, i) => `translate(0, ${margin.top + (rowHeight + padding) * i})`) // Stack events top to bottom
      .each(function (d) {
        const group = d3.select(this);

        // Rectangle for event duration
        const rect = group
          .append('rect')
          .attr('x', xScale(d.startYear)) // Position based on start year
          .attr('y', 0)
          .attr('height', rowHeight - 2) // Adjust height dynamically with padding
          .attr('fill', colorScale(d.startYear)) // Apply color scale based on start year
          .attr('stroke', '#333')
          .attr('width', 0) // Start with 0 width for animation
          .on('mouseenter', function (event) {
            showTooltip(d, event.pageX, event.pageY);
          })
          .on('mousemove', function (event) {
            updateTooltipPosition(event.pageX, event.pageY);
          })
          .on('mouseleave', function () {
            hideTooltip();
          });

        const formatYear = (year: number) => (year >= 0 ? year : `${Math.abs(year)} BC`);
        const yearDiff = Math.abs(d.startYear - d.endYear);

        const showTooltip = (data: any, x: number, y: number) => {
          d3
            .select('#tooltip')
            .style('visibility', 'visible')
            .style('left', `${x - 20}px`)
            .style('top', `${y + 20}px`).html(`
              <strong>${data.description}</strong>
              <br>From ${formatYear(data.startYear)} to ${formatYear(data.endYear)}
              <br>${yearDiff} Years
            `);
        };

        const updateTooltipPosition = (x: number, y: number) => {
          d3.select('#tooltip')
            .style('left', `${x}px`)
            .style('top', `${y + 20}px`); // Adjust tooltip's position as the mouse moves
        };

        const hideTooltip = () => {
          d3.select('#tooltip').style('visibility', 'hidden');
        };

        rect
          .transition() // Add the transition
          .duration(1000) // Duration in milliseconds
          .ease(d3.easeCubicOut) // Use an easing function
          .attr('width', xScale(d.endYear) - xScale(d.startYear) || 5); // Width based on duration

        // Event description label inside rectangle
        const rectWidth = xScale(d.endYear) - xScale(d.startYear);
        const isSpaceOnLeft = xScale(d.startYear) > 200; // Check if there's space on the left side (at least 50px from the start)

        // Set text alignment and position based on available space
        group
          .append('text')
          .attr('x', isSpaceOnLeft ? xScale(d.startYear) - 5 : xScale(d.endYear) + 5) // Position on the left if space allows, otherwise on the right
          .attr('y', rowHeight / 2)
          .attr('alignment-baseline', 'middle')
          .attr('font-size', '10px')
          .attr('text-anchor', isSpaceOnLeft ? 'end' : 'start') // Align text to the left if space allows, otherwise align to the right
          .text(d.description);
      });

    // Add the vertical cursor line
    const cursorLine = this.svg
      .append('line')
      .attr('stroke', '#000') // Color of the cursor line
      .attr('stroke-width', 0.5)
      .attr('y1', margin.top) // Start at the top margin
      // .attr('y2', totalHeight - margin.bottom) // End at the bottom margin
      .attr('y2', totalHeight - margin.bottom) // End at the bottom margin
      .attr('x1', 0 + margin.left) // Initial X position, will be updated on mousemove
      .attr('x2', 0 + margin.left); // Same as x1, ensuring it stays vertical

    // Update cursor line position on mousemove
    this.svg.on('mousemove', (event) => {
      let mouseX = d3.pointer(event)[0]; // Get the x-coordinate of the mouse

      // Constrain the mouseX position within the xScale range
      mouseX = Math.max(margin.left, Math.min(mouseX, width - margin.right)); // Ensure mouseX stays within bounds

      // Update the cursor line's position based on mouseX with offset to prevent cursor tooltip overlap
      const mouseXWithOffset = mouseX - 2;
      cursorLine.attr('x1', mouseXWithOffset).attr('x2', mouseXWithOffset); // Move the line to the mouse x position
    });
  }
}
