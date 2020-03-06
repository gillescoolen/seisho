import React from 'react';
import Toolbar from './Toolbar/Toolbar';
import { Overview, Single } from './Manga';
import { hot } from 'react-hot-loader/root';
import styled, { createGlobalStyle } from 'styled-components';
import { HashRouter, Route } from 'react-router-dom';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'

const Home = () => (
  <HashRouter>
    <Container>
      <Toolbar />
      <GlobalStyles />
      <CacheSwitch>
        <Route path="/manga/:title" component={Single}/>
        <CacheRoute path="/overview">
          <Overview />
        </CacheRoute>
        <CacheRoute path="/">
          <h1>Welcome struggler</h1>
        </CacheRoute>
      </CacheSwitch>
    </Container>
  </HashRouter>
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