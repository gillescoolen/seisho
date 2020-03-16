import React from 'react';
import Reader from './Reader/Reader';
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
  manga.setTracker(anilist);
  manga.setTrackerMediaId(response.media[0].id);
  manga.setTrackingStatus(MediaListStatus.CURRENT);
  await manga.syncToTracker();
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
  manga.setTracker(anilist);
  manga.setTrackingStatus(MediaListStatus.PLANNING);
  manga.nextChapter();
  manga.setScore(82);
  await manga.syncToTracker();
  console.log('updated');
};

const syncEntry = async () => {
  console.log('Tower of God');
  const results = await mangaSee.search('Tower of God', 1);
  const manga = results[0];
  console.log('fetchingDetails');
  await manga.fetchDetails();
  manga.setTracker(anilist);
  manga.nextChapter();
  await manga.syncFromTracker();
};

const persistProgressWithoutTracker = async () => {
  console.log('Jojo');
  const results = await mangaSee.search('Jojo', 1);
  const manga = results[0];
  await manga.fetchDetails();
  manga.nextChapter();
};

const Home = () => (
  <HashRouter>
    <Container>
      <Toolbar />
      <GlobalStyles />
      <CacheSwitch>
        <Route path="/manga/reader/:title" component={Reader} />
        <Route path="/manga/:title" component={Single} />
        <CacheRoute path="/overview">
          <Overview />
        </CacheRoute>
        <CacheRoute path="/">
          <h1>Welcome struggler</h1>
          <button onClick={anilistLogin}>Login</button>
          <button onClick={search}>Search</button>
          <button onClick={createEntry}>create entry</button>
          <button onClick={testRecoverInfo}>testRecoverInfo</button>
          <button onClick={updateEntry}>updateEntry</button>
          <button onClick={syncEntry}>syncEntry</button>
          <button onClick={persistProgressWithoutTracker}>persistProgressWithoutTracker</button>
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
  background-color: #181b21;
`;

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Arial';
  }

  &::-webkit-scrollbar {
    width: 12px;
    border-radius: none;
    
    &-track {
      background: #141414;
    }

    &-thumb {
      background: #262626;
      border-radius: 0px;

      &:hover {
        background: #262626;
        border-radius: 0px;
      }
    }
  }
`;

export default hot(Home);
