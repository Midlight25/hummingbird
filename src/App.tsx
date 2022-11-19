
import React,{useState, useRef, useEffect} from 'react';
import * as d3 from 'd3';
import './App.css';

import Sidebar from './Components/Sidebar';
import MainRoutes from './Routes';
import Footer from './Components/Footer';
import Chart from './Components/Footer';



function App() {

  return (
    <div className="App">
    {/** Sidebar */}
    <Sidebar/>

     {/** Inner container */}
    <MainRoutes/>

    {/**Chart */}
    <Chart/>
    
    {/**Footer */}
    <Footer/>
    
    </div>
  );
}

export default App;