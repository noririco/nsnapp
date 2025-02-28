// export const dorotEvents = [
//   { startYear: -3760 + 0, endYear: -3760 + 930, description: 'אדם' }, // Adam
//   { startYear: -3760 + 130, endYear: -3760 + 1042, description: 'שת' }, // Seth
//   { startYear: -3760 + 235, endYear: -3760 + 1140, description: 'אנוש' }, // Enosh
//   { startYear: -3760 + 325, endYear: -3760 + 1235, description: 'קינן' }, // Cainan
//   { startYear: -3760 + 395, endYear: -3760 + 1290, description: 'מהללאל' }, // Mahalalel
//   { startYear: -3760 + 460, endYear: -3760 + 1422, description: 'ירד' }, // Jared
//   { startYear: -3760 + 622, endYear: -3760 + 987, description: 'חנוך' }, // Enoch
//   { startYear: -3760 + 687, endYear: -3760 + 1656, description: 'מתושלח' }, // Methuselah
//   { startYear: -3760 + 874, endYear: -3760 + 1651, description: 'למך' }, // Lamech
//   { startYear: -3760 + 1056, endYear: -3760 + 2006, description: 'נח' }, // Noah
//   { startYear: -3760 + 1558, endYear: -3760 + 2158, description: 'שם' }, // Shem
//   { startYear: -3760 + 1656, endYear: -3760 + 1656, description: 'המבול' }, // The Flood
//   { startYear: -3760 + 1658, endYear: -3760 + 2096, description: 'ארפכשד' }, // Arphaxad
//   { startYear: -3760 + 1693, endYear: -3760 + 2126, description: 'שלח' }, // Shelah
//   { startYear: -3760 + 1723, endYear: -3760 + 2187, description: 'עבר' }, // Eber
//   { startYear: -3760 + 1757, endYear: -3760 + 1996, description: 'פלג' }, // Peleg
//   { startYear: -3760 + 1787, endYear: -3760 + 2026, description: 'רעו' }, // Reu
//   { startYear: -3760 + 1819, endYear: -3760 + 2049, description: 'שרוג' }, // Serug
//   { startYear: -3760 + 1849, endYear: -3760 + 1997, description: 'נחור' }, // Nahor
//   { startYear: -3760 + 1878, endYear: -3760 + 2083, description: 'תרח' }, // Terah
//   { startYear: -3760 + 1948, endYear: -3760 + 2123, description: 'אברהם' }, // Abraham
// ];

// export const events = [
//   {
//     startYear: -3760,
//     endYear: -3700,
//     description: 'Foundation of Ancient Sumer',
//   },
//   { startYear: -3500, endYear: -3400, description: 'Invention of the Wheel' },
//   { startYear: -3000, endYear: -2900, description: 'Early Egyptian Dynasties' },
//   {
//     startYear: -2500,
//     endYear: -2400,
//     description: 'Building of the Pyramids of Giza',
//   },
//   { startYear: -2000, endYear: -1900, description: 'Hammurabi’s Code' },
//   {
//     startYear: -1500,
//     endYear: -1400,
//     description: 'The Exodus of the Hebrews',
//   },
//   {
//     startYear: -1000,
//     endYear: -900,
//     description: 'Founding of Ancient Israel',
//   },
//   { startYear: -500, endYear: -400, description: 'Rise of the Roman Republic' },
//   { startYear: -200, endYear: 0, description: 'The Birth of Christ' },
//   { startYear: 0, endYear: 100, description: 'The Roman Empire Expands' },
//   { startYear: 500, endYear: 600, description: 'Spread of Buddhism in Asia' },
//   { startYear: 700, endYear: 800, description: 'Viking Age Begins' },
//   { startYear: 1000, endYear: 1100, description: 'The Crusades Begin' },
//   { startYear: 1200, endYear: 1300, description: 'Mongol Empire Expansion' },
//   { startYear: 1400, endYear: 1500, description: 'Renaissance Period' },
//   { startYear: 1600, endYear: 1700, description: 'The Age of Exploration' },
//   { startYear: 1800, endYear: 1900, description: 'Industrial Revolution' },
//   { startYear: 1900, endYear: 1950, description: 'World War I and II' },
//   { startYear: 1950, endYear: 2000, description: 'Cold War and Space Race' },
//   {
//     startYear: 2000,
//     endYear: new Date().getFullYear(),
//     description: 'Digital Revolution',
//   },
// ];

// import { Component, ElementRef, inject } from '@angular/core';
// import * as d3 from 'd3';
// import { events } from './events';
// import { dorotEvents } from './dorot';

// @Component({
//   selector: 'app-d3',
//   standalone: true,
//   template: `
//     <h1>Hello</h1>
//     <div id="timeline"></div>
//   `,
// })
// export class D3PlaygroundComponent {
//   data = [...events, ...dorotEvents].sort((e1, e2) => e1.startYear - e2.startYear);
//   el = inject(ElementRef);
//   private svg: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;

//   ngAfterViewInit() {
//     this.createTimeline();
//   }

//   createTimeline() {
//     const width = 1000;
//     const height = 600; // Increase height to accommodate more rows
//     const margin = { top: 20, right: 20, bottom: 40, left: 20 };
//     const rowHeight = 50;

//     const startYear = -3760;
//     const endYear = new Date().getFullYear();
//     const tickInterval = 500;

//     // Scale for the x-axis (timeline scale)
//     const xScale = d3
//       .scaleLinear()
//       .domain([startYear, endYear])
//       .range([margin.left, width - margin.right]);

//     // SVG Container
//     const svg = d3.select('#timeline').append('svg').attr('width', width).attr('height', height);

//     // const BCYears = [3760, 3500, 3000, 2500, 2000, 1500, 1000, 500];
//     const BCYears = d3.range(startYear, 0, 500);

//     // Define the AD years using d3.range to generate values from 0 up to the current year
//     const suffixADYears = d3.range(0, endYear + 1, 500); // AD years: 0, 500, 1000, ..., 2024

//     // Combine the BC years (with the prefix) and AD years
//     const tickValues = BCYears.concat(suffixADYears);

//     // Axis for timeline
//     // Axis top
//     const xAxisTop = d3
//       .axisTop(xScale)
//       .tickValues(tickValues)
//       .tickFormat((d) => `${(d as number) >= 0 ? d : `${Math.abs(d as number)} BC`}`);

//     // Axis top
//     svg.append('g').attr('transform', `translate(0, ${margin.top})`).call(xAxisTop);

//     const xAxisBottom = d3
//       .axisTop(xScale)
//       .tickFormat((d) => `${(d as number) >= 0 ? d : `${Math.abs(d as number)} BC`}`)
//       .tickValues(tickValues);

//     // Axis bottom
//     svg
//       .append('g')
//       .attr('transform', `translate(0, ${height - margin.bottom})`)
//       .call(xAxisBottom);

//     // Linear color scale for event duration
//     // Sequential color scale for distinct colors
//     const colorScale = d3.scaleSequential(d3.interpolateRainbow).domain([startYear, endYear]); // Map years to colors

//     // Calculate available height for events (excluding axis)
//     const availableHeight = height - margin.top - margin.bottom - rowHeight;
//     const eventHeight = availableHeight / this.data.length; // Dynamic height per event

//     // Tooltip element
//     const tooltip = d3
//       .select('body')
//       .append('div')
//       .attr('class', 'tooltip')
//       .style('position', 'absolute')
//       .style('visibility', 'hidden')
//       .style('background-color', 'rgba(0, 0, 0, 0.7)')
//       .style('color', 'white')
//       .style('padding', '5px')
//       .style('border-radius', '4px')
//       .style('font-size', '12px');

//     // Add rectangles and labels for events
//     svg
//       .selectAll('g.event-group')
//       .data(this.data)
//       .enter()
//       .append('g')
//       .attr('class', 'event-group')
//       .attr('transform', (d, i) => `translate(0, ${margin.top + eventHeight * i})`) // Stack events top to bottom
//       .each(function (d) {
//         const group = d3.select(this);

//         // Rectangle for event duration
//         group
//           .append('rect')
//           .attr('x', xScale(d.startYear)) // Position based on start year
//           .attr('y', 0)
//           .attr('width', xScale(d.endYear) - xScale(d.startYear)) // Width based on duration
//           .attr('height', eventHeight - 10) // Adjust height dynamically
//           .attr('fill', colorScale(d.startYear)) // Apply color scale based on start year
//           .attr('stroke', '#333')
//           .on('mouseenter', function (event) {
//             const getTooltipContent = function (d: any) {
//               console.log(d);
//               return `<b>${d.description}</b>
//               <br/>
//               ${Math.abs(d.startYear - d.endYear)}
//               `;
//             };
//             tooltip
//               .html(getTooltipContent(d))
//               .style('visibility', 'visible')
//               .style('left', `${event.pageX + 5}px`) // Position the tooltip
//               .style('top', `${event.pageY - 28}px`);
//           })
//           .on('mouseleave', function () {
//             tooltip.style('visibility', 'hidden');
//           });

//         // Event description label inside rectangle
//         const rectWidth = xScale(d.endYear) - xScale(d.startYear);
//         const isSpaceOnLeft = xScale(d.startYear) > 200; // Check if there's space on the left side (at least 50px from the start)

//         // Set text alignment and position based on available space
//         group
//           .append('text')
//           .attr('x', isSpaceOnLeft ? xScale(d.startYear) - 5 : xScale(d.endYear) + 5) // Position on the left if space allows, otherwise on the right
//           .attr('y', (eventHeight - 10) / 2)
//           .attr('alignment-baseline', 'middle')
//           .attr('font-size', '10px')
//           .attr('text-anchor', isSpaceOnLeft ? 'end' : 'start') // Align text to the left if space allows, otherwise align to the right
//           .text(d.description);
//       });

//     // Add the vertical cursor line
//     const cursorLine = svg
//       .append('line')
//       .attr('stroke', '#000') // Color of the cursor line
//       .attr('stroke-width', 0.5)
//       .attr('y1', margin.top) // Start at the top margin
//       .attr('y2', height - margin.bottom) // End at the bottom margin
//       .attr('x1', 0 + margin.left) // Initial X position, will be updated on mousemove
//       .attr('x2', 0 + margin.left); // Same as x1, ensuring it stays vertical

//     // Update cursor line position on mousemove
//     svg.on('mousemove', (event) => {
//       let mouseX = d3.pointer(event)[0]; // Get the x-coordinate of the mouse

//       // Constrain the mouseX position within the xScale range
//       mouseX = Math.max(margin.left, Math.min(mouseX, width - margin.right)); // Ensure mouseX stays within bounds

//       // Update the cursor line's position based on mouseX
//       cursorLine.attr('x1', mouseX - 1).attr('x2', mouseX - 1); // Move the line to the mouse x position
//     });
//   }
// }
