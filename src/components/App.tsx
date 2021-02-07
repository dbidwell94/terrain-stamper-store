import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import FilterBar from './FilterBar';
import ContentFeed from './ContentFeed';
import { useSelector } from 'react-redux';
import AuthModal from './AuthModal';

const HomePage = styled.div`
  display: grid;
  height: 100vh;
  width: 100%;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(6, 1fr);
`;

export default function App() {
  const { authModalOpen } = useSelector((state) => state.authReducer);

  return (
    <Router>
      <HomePage>
        {authModalOpen && <AuthModal />}
        <FilterBar />
        <ContentFeed />
        <Sidebar />
      </HomePage>
    </Router>
  );
}
