import React from 'react';
import Toolbar from './Toolbar/Toolbar';
import { Overview, Single } from './Manga';
import { hot } from 'react-hot-loader/root';
import { HashRouter, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { AniList } from '../../domain/anilist/anilist';

const anilist = new AniList();

const anilistLogin = async () => {
  await anilist.login();
  // Maybe have a snackbar or something pop up. looks fancier.
  alert('successfully logged in!');
};

const search = async () => {
  const response = await anilist.search('gal gohan', 1);
  console.log(response);
};

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
          <button onClick={anilistLogin}>Login</button>
          <button onClick={search}>Search</button>
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
