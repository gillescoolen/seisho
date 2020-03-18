import React from 'react';
import Reader from './Reader/Reader';
import User from './Settings/User';
import { Overview, Single } from './Manga';
import { hot } from 'react-hot-loader/root';
import { HashRouter, Route, Switch } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const Index = () => (
  <HashRouter>
    <User />
    <Container>
      <GlobalStyles />
      <Switch>
        <Route path="/manga/reader/:title" component={Reader} />
        <Route path="/manga/:title" component={Single} />
        <Route path="/">
          <Overview />
        </Route>
      </Switch>
    </Container>
  </HashRouter>
);

const Container = styled.div`
  width: 100%;
  color: white;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  background-color: #181b21;
`;

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    overflow-y: scroll;
    overflow-x: hidden;
    font-family: 'Arial';
  }

  &::-webkit-scrollbar {
    width: 12px;
    border-radius: none;
    
    &-track {
      background: #181b21;
    }

    &-thumb {
      background: #1c2029;
      border-radius: 0px;

      &:hover {
        background: #1e232e;
        border-radius: 0px;
      }
    }
  }
`;

export default hot(Index);
