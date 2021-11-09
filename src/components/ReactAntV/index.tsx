import React, { FunctionComponent, useEffect } from 'react'
import { PointLayer, Scene, LineLayer } from '@antv/l7'
import { CountryLayer } from '@antv/l7-district'
import { Mapbox } from '@antv/l7-maps'

interface OwnProps {
}

type Props = OwnProps;

const colors = ['#769398']
const ProvinceData = [
  {
    name: '云南省',
    code: 530000,
    value: 17881.12
  },
  {
    name: '黑龙江省',
    code: 230000,
    value: 16361.62
  },
  {
    name: '贵州省',
    code: 520000,
    value: 14806.45
  },
  {
    name: '北京市',
    code: 110000,
    value: 30319.98
  },
  {
    name: '河北省',
    code: 130000,
    value: 36010.27
  },
  {
    name: '山西省',
    code: 140000,
    value: 16818.11
  },
  {
    name: '吉林省',
    code: 220000,
    value: 15074
  },
  {
    name: '宁夏回族自治区',
    code: 640000,
    value: 3705.18
  },
  {
    name: '辽宁省',
    code: 210000,
    value: 25315.35
  },
  {
    name: '海南省',
    code: 460000,
    value: 4832.05
  },
  {
    name: '内蒙古自治区',
    code: 150000,
    value: 17289.22
  },
  {
    name: '天津市',
    code: 120000,
    value: 18809.64
  },
  {
    name: '新疆维吾尔自治区',
    code: 650000,
    value: 12199.08
  },
  {
    name: '上海市',
    code: 310000,
    value: 32679.87
  },
  {
    name: '陕西省',
    code: 610000,
    value: 24438.32
  },
  {
    name: '甘肃省',
    code: 620000,
    value: 8246.07
  },
  {
    name: '安徽省',
    code: 340000,
    value: 30006.82
  },
  {
    name: '香港特别行政区',
    code: 810000,
    value: 0
  },
  {
    name: '广东省',
    code: 440000,
    value: 97277.77
  },
  {
    name: '河南省',
    code: 410000,
    value: 48055.86
  },
  {
    name: '湖南省',
    code: 430000,
    value: 36425.78
  },
  {
    name: '江西省',
    code: 360000,
    value: 21984.78
  },
  {
    name: '四川省',
    code: 510000,
    value: 40678.13
  },
  {
    name: '广西壮族自治区',
    code: 450000,
    value: 20353.51
  },
  {
    name: '江苏省',
    code: 320000,
    value: 92595.4
  },
  {
    name: '澳门特别行政区',
    code: 820000,
    value: null
  },
  {
    name: '浙江省',
    code: 330000,
    value: 56197.15
  },
  {
    name: '山东省',
    code: 370000,
    value: 76469.67
  },
  {
    name: '青海省',
    code: 630000,
    value: 2865.23
  },
  {
    name: '重庆市',
    code: 500000,
    value: 20363.19
  },
  {
    name: '福建省',
    code: 350000,
    value: 35804.04
  },
  {
    name: '湖北省',
    code: 420000,
    value: 39366.55
  },
  {
    name: '西藏自治区',
    code: 540000,
    value: 1477.63
  },
  {
    name: '台湾省',
    code: 710000,
    value: null
  }
]

const ReactAntV: FunctionComponent<Props> = (props) => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      logoVisible: false,
      map: new Mapbox({
        center: [104.21, 35],
        pitch: 0,
        style: {
          version: 8,
          sprite: 'https://lzxue.github.io/font-glyphs/sprite/sprite',
          glyphs:
            'https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf',
          sources: {},
          layers: [
            {
              id: 'background',
              type: 'background',
              paint: {
                'background-color': '#2b2b3a'
              }
            }
          ]
        },
        zoom: 3,
        minZoom: 0,
        maxZoom: 10
      })
    })
    scene.on('loaded', () => {
      // scene.addImage(
      //   'plane',
      //   'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg'
      // );
      new CountryLayer(scene, {
        data: ProvinceData,
        joinBy: ['NAME_CHN', 'name'],
        depth: 1,
        provinceStroke: '#f00',
        cityStroke: '#EBCCB4',
        cityStrokeWidth: 1,
        fill: {
          color: {
            field: 'NAME_CHN',
            values: colors
          }
        },
        bubble: {
          enable: false,
          size: {
            field: 'value',
            values: [3, 20]
          }
        },
        popup: {
          enable: true,
          Html: props => {
            return `<span>${ props.NAME_CHN }</span><span>${ props.value }</span>`
          }
        }
      })
      Promise.all([
        fetch('/data/bubble.json').then(res => res.json()),
        fetch('/data/from-to.json').then(res => res.json())
      ]).then(function ([bubble, fly]){
        const imgData = JSON.parse(JSON.stringify(bubble))
        // 气泡点
        const pointLayer = new PointLayer({})
          .source(bubble.slice(0).map((item:any) => {
            item.latitude += Math.random()
            item.longitude += Math.random()
            return item
          }), {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude'
            }
          })
          .shape('circle')
          .active(true)
          .animate(true)
          // count：数据值键名   气泡大小范围
          .size('count', [ 20, 60 ])
          .color('#4cfd47')
          .style({
            opacity: 1
          })
        scene.addImage(
          'plane',
          'https://gw.alipayobjects.com/zos/bmw-prod/0ca1668e-38c2-4010-8568-b57cb33839b9.svg'
        );
        scene.addImage(
          'marker',
          'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ'
        )
        const imageLayer = new PointLayer()
          .source(imgData.slice(0).map((item:any) => {
            item.latitude -= Math.random()
            item.longitude -= Math.random() * 1.5
            return item
          }), {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude'
            }
          })
          .shape('marker')
          .size(12)
        // 飞线图片
        const flyData = fly.map((item:any) => {
          // @ts-ignore
          const latlng1 = item.from.split(',').map(e => {
            return e * 1;
          });
          // @ts-ignore
          const latlng2 = item.to.split(',').map(e => {
            return e * 1;
          });
          return { coord: [ latlng1, latlng2 ] };
        });
        const flyLine = new LineLayer({ blend: 'normal' })
          .source(flyData, {
            parser: {
              type: 'json',
              coordinates: 'coord'
            }
          })
          .color('#ff6b34')
          .texture('plane')
          .shape('arc')
          // .shape('arc')
          .size(20)
          .active(true)
          .animate({
            duration: 3,
            interval: 0.2,
            trailLength: 0.2
          })
          .style({
            textureBlend: 'replace',
            lineTexture: true, // 开启线的贴图功能
            iconStep: 10, // 设置贴图纹理的间距
            opacity: 1
          })
        scene.addLayer(pointLayer)
        scene.addLayer(flyLine)
        scene.addLayer(imageLayer)
      })
    })
    return () => {

    }
  }, [])

  return (
    <div style={ { width: '90vw', height: '90vh', position: 'relative' } }>
      <div
        id="map"
        style={ {
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        } }
      >
      </div>
    </div>
  )
}

export default ReactAntV
