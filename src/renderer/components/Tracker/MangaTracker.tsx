import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';
import { AniList } from '../../../domain/anilist/anilist';
import { MediaListStatus } from '../../../domain/anilist/types';
import Spinner from '../UI/Spinner';

const MangaTracker = (props: { manga: Manga, tracker: AniList }) => {
  const [manga] = useState<Manga>(props.manga);
  const [tracked, setTracked] = useState(false);
  const [syncing, setSyncing] = useState(false);


  useEffect(() => {
    (async () => {
      setSyncing(true);
      manga.setTracker(props.tracker);
      await manga.syncFromTracker();
      setSyncing(false);
    })();
    setTracked(manga.tracking());
  }, [tracked]);

  const add = async () => {
    setSyncing(true);
    const result = await props.tracker.search(manga.getTitle(), 1);
    const counterpart = result.media[0];

    manga.setTrackerMediaId(counterpart.id);
    manga.setTrackingStatus(MediaListStatus.CURRENT);

    await manga.syncToTracker();

    setTracked(true);
    setSyncing(false);
  };

  const sync = async () => {
    setSyncing(true);
    await manga.syncToTracker();
    setSyncing(false);
  };
  return (
    <Container>
      {syncing ? <Spinner/>
        : (tracked
          ? <Button onClick={sync}>Sync to AniList</Button>
          : <Button onClick={add}>Add to AniList</Button>)
      }

    </Container>
  );
};


const Container = styled.div`
  
`;

const Button = styled.button`
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  background-color: green;
`;

export default hot(MangaTracker);