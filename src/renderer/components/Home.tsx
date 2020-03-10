import React from 'react';
import Toolbar from './Toolbar/Toolbar';
import { Overview, Single } from './Manga';
import { hot } from 'react-hot-loader/root';
import { HashRouter, Route } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import CacheRoute, { CacheSwitch } from 'react-router-cache-route';
import { AniList } from '../../domain/anilist/anilist';
import { MangaseeSource } from '../../domain/manga/mangasee/mangasee-source';
import { MediaListStatus } from '../../domain/anilist/types';

const anilist = new AniList();
const mangaSee = new MangaseeSource();

const anilistLogin = async () => {
  await anilist.login();
  // Maybe have a snackbar or something pop up. looks fancier.
  alert('successfully logged in!');
};

const search = async () => {
  const response = await anilist.search('gal gohan', 1);
  console.log(response);
};

const createEntry = async () => {
  console.log('Tower of God');
  const results = await mangaSee.search('Tower of God', 1);
  const manga = results[0];
  console.log(manga);
  const response = await anilist.search('Tower of God', 1);
  manga.setMediaId(response.media[0].id);
  await anilist.createEntry(manga, {
    status: MediaListStatus.CURRENT
  });
  console.log('created');
};

const testRecoverInfo = async () => {
  console.log('Tower of God');
  const results = await mangaSee.search('Tower of God', 1);
  const manga = results[0];
  console.log('fetchingDetails');
  await manga.fetchDetails();
  console.log(manga);
};

const updateEntry = async () => {
  console.log('Tower of God');
  const results = await mangaSee.search('Tower of God', 1);
  const manga = results[0];
  console.log('fetchingDetails');
  await manga.fetchDetails();
  console.log(manga);
  await anilist.updateEntry(manga, {
    progress: 100,
    scoreRaw: 90
  });
  console.log('updated');
};

const Home = () => (
  <HashRouter>
    <Container>
      <Toolbar/>
      <GlobalStyles/>
      <CacheSwitch>
        <Route path="/manga/:title" component={Single}/>
        <CacheRoute path="/overview">
          <Overview/>
        </CacheRoute>
        <CacheRoute path="/">
          <h1>Welcome struggler</h1>
          <button onClick={anilistLogin}>Login</button>
          <button onClick={search}>Search</button>
          <button onClick={createEntry}>create entry</button>
          <button onClick={testRecoverInfo}>testRecoverInfo</button>
          <button onClick={updateEntry}>updateEntry</button>
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
