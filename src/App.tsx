import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
// import EchartsMap from './components/EchartsMap'
import ReactCharts from './components/ReactCharts/ReactCharts'
import ReactD3Map from './components/ReactD3Map'
import ReactAntV from './components/ReactAntV'


function App() {
  return (
    <div className="App" style={ { height: '100%' } }>
      <header className="App-header">
        <li><Link to="/react/echarts">react echarts map</Link></li>
        <li><Link to="/react/antv">react antv map </Link></li>
        <li><Link to="/react/d3">react d3 map </Link></li>
      </header>
      <main>
        <Routes>
          <Route path="/" element={ <ReactCharts type="map" /> } />
          <Route path="/react/echarts" element={ <ReactCharts type="map" /> } />
          <Route path={ 'react/d3' } element={ <ReactD3Map /> } />
          <Route path={ 'react/antv' } element={ <ReactAntV /> } />
        </Routes>
      </main>
    </div>
  )
}

export default App
