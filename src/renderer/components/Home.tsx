import { hot } from 'react-hot-loader/root';
import React from 'react';
import Toolbar from './Toolbar/Toolbar';
import styledComponents, { createGlobalStyle } from 'styled-components';
import Overview from './Manga/Overview';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

const Home = () => (
  <Router>
    <Container>
      <Toolbar />
      <GlobalStyles />
      <Switch>
        <Route path="/overview">
          <Overview />
        </Route>
        <Route path="/">
          <h1>Welcome stranger</h1>
        </Route>
      </Switch>
    </Container>
  </Router>
);

const Container = styledComponents.div`
  color: white;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: black;
`;

const GlobalStyles = createGlobalStyle`
body {
  margin: 0;
}`;

export default hot(Home);