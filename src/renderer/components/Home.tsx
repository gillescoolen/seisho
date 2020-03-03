import React from 'react';
import Toolbar from './Toolbar/Toolbar';
import Overview from './Manga/Overview';
import { hot } from 'react-hot-loader/root';
import styled, { createGlobalStyle } from 'styled-components';
import { HashRouter as Router } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { Anilist } from '../../domain/anilist/anilist';

const Home = () => (
  <Router>
    <Container>
      <Toolbar />
      <GlobalStyles />
      <CacheSwitch>
        <CacheRoute path="/overview">
          <Overview />
        </CacheRoute>
        <CacheRoute path="/">
          <h1>Welcome stranger</h1>
          <button onClick={() => new Anilist().login()}>Login</button>
        </CacheRoute>
      </CacheSwitch>
    </Container>
  </Router>
);

const Container = styled.div`
  color: white;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: black;
`;

const GlobalStyles = createGlobalStyle`
body {
  margin: 0;
  font-family: 'Arial';
}`;

export default hot(Home);
