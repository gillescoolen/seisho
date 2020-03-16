import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { Manga } from '../../../domain/manga/manga';
import { Chapter } from '../../../domain/manga/chapter';

const Reader = (props: any) => {
  const [manga] = useState<Manga>(props.location.state.manga);
  const [chapter, setChapter] = useState<Chapter>(props.location.state.chapter);
  const [loading, load] = useState(true);

  useEffect(() => {
    (async () => {
      if (!chapter.hasFetched()) await chapter.fetch();
      if (!chapter.hasPrefetched()) chapter.prefetchPages();
      manga.setCurrentChapter(chapter);
      load(false);
    })();


    window.addEventListener('keydown', paginate);

    return () => {
      chapter.abortRequest();
      window.removeEventListener('keydown', paginate);
    };
  }, [loading]);

  const paginate = (e: KeyboardEvent) => {
    e.key === 'ArrowRight' && next();
    e.key === 'ArrowLeft' && previous();
  };

  const next = () => {
    if (loading) return;

    if (chapter.completed()) {
      if (manga.hasNextChapter()) {
        console.log('Manga has next chapter.');
        console.log(manga.hasNextChapter());

        manga.nextChapter();
        setChapter(manga.getCurrentChapter());
      };
    } else {
      chapter.nextPage();
    }
    load(true);
  };

  const previous = () => {
    if (loading) return;

    if (chapter.getCurrentPageNumber() < 1) {
      manga.previousChapter();
      setChapter(manga.getCurrentChapter());
    } else {
      chapter.previousPage();
    }
    load(true);
  };

  return (
    <Container>
      {chapter.completed()
        ?
        <Page>
          <p>{chapter.getTitle()} Finished.</p>
          {!manga.hasNextChapter() &&
            <p>No next chapter found.</p>
          }
        </Page>
        : <Page style={{ backgroundImage: `url(${chapter.getCurrentPage()})` }} />
      }
    </Container>
  );
};

const Page = styled.div`
  width: 90vw;
  height: 100%;
  display: flex;
  flex: 1 1 auto;
  place-items: center;
  flex-direction: column;
  justify-content: center;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const Controls = styled.div`
  display: flex;
  position: absolute;
  flex-direction: row;
  justify-content: space-between;

  button {
    color: white;
    border: none;
    padding: 1rem;
    font-weight: 700;
    border-radius: 5px;
    background-color: #1c2029;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  flex-direction: column;
`;

export default hot(Reader);
