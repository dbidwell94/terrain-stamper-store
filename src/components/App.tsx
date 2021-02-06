import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { BrowserRouter as Router } from 'react-router-dom';

const HomePage = styled.div`
  display: grid;
  height: 100vh;
  width: 100%;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
  .filter-bar {
    grid-column: 2 / 6;
    grid-row: 1 / 1;
    border: thin solid black;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content-feed {
    grid-column: 2 / 6;
    grid-row: 2 / 7;
    border: thin solid green;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .sidebar {

  }
`;

export default function App() {
  return (
    <Router>
      <HomePage>
        <div className='filter-bar'>
          <h1>Filter Bar</h1>
        </div>
        <div className='content-feed'>

        </div>
        <Sidebar className=""/>
      </HomePage>
    </Router>
  );
}
