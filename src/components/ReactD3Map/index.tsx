import React, { FunctionComponent, useCallback, useEffect } from 'react'
import * as d3 from 'd3'

interface OwnProps {
}

type Props = OwnProps;

const chinajson = require('../../assets/china.geo.json')

function renderMainLand(center: [number, number], sc: number, width: number, height: number) {
  const projection = d3.geoMercator().center(center).scale(sc).translate([width / 2, height / 2])
  const path = d3.geoPath().projection(projection)
  const svg: any = d3
    .select('#d3_map')
    .append('svg')
    .attr('id', 'mapSvg')
    .attr('width', width)
    .attr('height', height)
  svg.append('rect')
    .attr('class', 'background')
    .attr('width', width)
    .attr('height', height)
  // .on("click", clicked);
  const g = svg.append('g').attr('id', 'mapG')
  let scale = 1
  let texts, centered: any
  const color = {
    lineColor: '#4AFFFE',
    pointColor: '#fbcd2c',
    lightColor: '#4affff',
    areaColor: ['#09373a', '#11545c', '#0b6c79', '#769398'],
    locationBgColor: '#0e403f',
    pointTextColor: '#fff',
    haveSelectColor: '#1c2b2b'
  }
  g.selectAll('path')
    .data(chinajson.features)
    .enter()
    .append('path')
    .attr('stroke', color.lineColor)
    .attr('stroke-width', 1)
    .attr('fill', '#000')
    .attr('id', function (d: any) {
      return 'path' + d.properties.id
    })
    .attr('style', 'display:block')
    .attr('class', function (d: any) {
      if (d.properties.id.length > 2) {
        return 'location'
      } else {
        return 'distribution'
      }
    })
    .attr('style', 'cursor:pointer;')
    .attr('d', path)
    .on('mouseover', function (d: any) {
      console.log('<---- dd2 -----> :', d)
      d3.select('#d3_map').attr('stroke-width', 5 / scale + 'px')
      d3.select('#d3_map').attr('stroke', color.pointColor)
    })
    .on('mouseout', function (d: any) {
      console.log('<---- dd -----> :', d)
      if (d3.select('#d3_map').attr('active') === 'false' || d.properties.id.length <= 2 || !d3.select('#d3_map').attr('active')) {
        d3.select('#d3_map')
          .attr('stroke', color.lineColor)
          .attr('stroke-width', 1 / scale + 'px')
      }
    })
    .on('click', function (d: any) {
      if (d.properties.id.length <= 2) {
        clicked(d)
      }

      if (d.properties.id.length > 2) {
        d3.select('.point-info').attr('style', 'display:block;')
        g.selectAll('path')
          .attr('stroke', color.lineColor)
          .attr('stroke-width', 1 / scale + 'px')
          .attr('active', 'false')

        d3.select('#d3_map')
          .attr('stroke', color.pointColor)
          .attr('stroke-width', 5 / scale + 'px')
          .attr('active', 'true')
      }
    })
  // eslint-disable-next-line
  texts = g.append('g')
    .attr('class', 'texts')
    .selectAll('text')
    .data(chinajson.features)
    .enter().append('text')
    .attr('class', function (d: any) {
      if (d.properties.id.length > 2) {
        return 'location'
      } else {
        return 'distribution'
      }
    })
    .text(function (d: any) {
      return d.properties.name
    })
    .attr('id', function (d: any) {
      return 'text' + d.properties.id
    })
    .attr('transform', function (d: any) {
      var centroid = path.centroid(d),
        x = centroid[0],
        y = centroid[1]
      return 'translate(' + x + ', ' + y + ')'
    })
    .attr('fill', '#1E9AAD')
    .attr('font-size', '14px')
    .attr('style', 'cursor:pointer;')
  d3.selectAll('.location').attr('style', 'display:none')

  function clicked(d: any) {
    var x, y, k
    if (d && centered !== d) {
      var centroid = path.centroid(d)
      x = centroid[0]
      y = centroid[1]
      if (d.properties.id === '46') {
        y = y + 10
      }
      if (d.properties.scale) {
        k = d.properties.scale
      } else {
        k = scale
      }
      scale = k
      centered = d
      d3.select('.re-show').attr('display', 'block')
      mapChange('open', d)
    } else {
      x = width / 2
      y = height / 2
      k = 1
      scale = 1
      centered = null
      d3.select('.re-show').attr('display', 'none')
      mapChange('close')
    }

    g.selectAll('path')
      .classed('active', centered && function (d: any) {
        return d === centered
      })

    g.transition()
      .duration(750)
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')scale(' + k + ')translate(' + -x + ',' + -y + ')')
      .style('stroke-width', 1.5 / k + 'px')
  }

  function mapChange(flag: string, d?: any) {
    if (flag === 'open') {
      var disId = d.properties.id

      if (disId.length < 3) {
        chinajson.features.forEach(function (n: any) {
          if (n.properties.id.length > 2 && n.properties.id.substr(0, 2) === disId) {
            d3.select('#path' + n.properties.id)
              .attr('style', 'display:block')
              .attr('stroke-width', 1 / scale + 'px')
              .attr('fill', '#1b5c5b')
            d3.select('#text' + n.properties.id)
              .attr('style', 'display:block')
              .attr('font-size', 0.8 + 'px')
          } else {
            if (n.properties.id.length <= 2 && n.properties.id !== disId) {
              d3.select('.point-info').attr('style', 'display:none;')
              d3.select('#path' + n.properties.id)
                .attr('style', 'opacity:0.2')
                .attr('stroke-width', '0.3px')
              d3.select('#text' + n.properties.id)
                .attr('style', 'display:none')
                .attr('font-size', '3px')
            } else {
              d3.select('#path' + n.properties.id)
                .attr('style', 'display:none')
                .attr('stroke-width', '0.2px')
              d3.select('#text' + n.properties.id)
                .attr('style', 'display:none')
                .attr('font-size', '1px')
            }
          }
        })

      }
    } else {

      d3.selectAll('.location').attr('style', 'display:none')
      d3.selectAll('text').attr('font-size', '14px')
      d3.selectAll('path').attr('stroke-width', '1px')
      d3.selectAll('.distribution').attr('style', 'display:block')
    }
  }
}

const ReactD3Map: FunctionComponent<Props> = (props) => {
  const drawMap = useCallback(() => {
    const width = 1600
    const height = 800

    renderMainLand([104.21, 35], 800, width, height)
  }, [])
  useEffect(() => {
    drawMap()
  }, [drawMap])
  return (
    <>
      <div id="d3_map" style={ { marginTop: 20 } }></div>
    </>
  )
}

export default ReactD3Map
