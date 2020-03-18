import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { Manga } from '../../../domain/manga/manga';
import { AniList } from '../../../domain/anilist/anilist';
import { MediaListStatus } from '../../../domain/anilist/types';

const MangaTracker = (props: { manga: Manga, tracker: AniList }) => {
  const [manga] = useState<Manga>(props.manga);
  const [tracked, setTracked] = useState(false);

  useEffect(() => {
    (async () => {
      manga.setTracker(props.tracker);
      await manga.syncFromTracker();
    })();
    setTracked(manga.tracking());
  }, [tracked]);

  const add = async () => {
    const result = await props.tracker.search(manga.getTitle(), 1);
    const counterpart = result.media[0];

    manga.setTrackerMediaId(counterpart.id);
    manga.setTrackingStatus(MediaListStatus.CURRENT);

    await manga.syncToTracker();

    setTracked(true);
  };

  const sync = async () => {
    await manga.syncToTracker();
  };
  return (
    <Container>
      {tracked
        ? <Button onClick={sync}>Sync to AniList</Button>
        : <Button onClick={add}>Add to AniList</Button>
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