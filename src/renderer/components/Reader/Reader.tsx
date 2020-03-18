import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { Manga } from '../../../domain/manga/manga';
import { Chapter } from '../../../domain/manga/chapter';
import { Link } from 'react-router-dom';


const Reader = (props: any) => {
  const [loading, load] = useState(true);
  const [manga] = useState<Manga>(props.location.state.manga);
  const [chapter, setChapter] = useState<Chapter>(props.location.state.chapter);

  const buttonRef = React.createRef<typeof Link>();

  useEffect(() => {
    (async () => {
      await fetchChapter(chapter);
      if (manga.getCurrentChapter().getTitle() !== chapter.getTitle()) manga.setCurrentChapter(chapter);
      load(false);
    })();

    window.addEventListener('keydown', paginate);

    return () => {
      window.removeEventListener('keydown', paginate);
    };
  }, [loading]);

  useEffect(() => {
    return () => {
      manga.abortRequest();
      chapter.abortRequest();
    };
  }, [loading]);

  const fetchChapter = async (chapter: Chapter) => {
    if (!chapter.hasFetched()) await chapter.fetch();
    if (!chapter.hasPrefetched()) chapter.prefetchPages();
  };

  useEffect(() => {
    // FIXME: check is done whenever the component changes.
    if (chapter.completed() && !manga.hasNextChapter()) {
      manga.setFinished();
    }
  });

  const paginate = async (e: KeyboardEvent) => {
    e.key === 'Backspace' && goBack();
    e.key === 'Escape' && goBack();
    e.key === 'ArrowRight' && next();
    e.key === 'ArrowLeft' && await previous();
  };

  const goBack = () => {
    (buttonRef.current as any as HTMLLinkElement).click();
  };

  const next = () => {
    if (loading) return;

    if (chapter.completed()) {
      if (manga.hasNextChapter()) {
        manga.nextChapter();
        setChapter(manga.getCurrentChapter());
      }
    } else {
      chapter.nextPage();
    }
    load(true);
  };

  const previous = async () => {
    if (loading) return;

    if (chapter.getCurrentPageNumber() < 1) {
      if (manga.hasPreviousChapter()) {
        manga.previousChapter();
        const chapter = manga.getCurrentChapter();
        await fetchChapter(chapter);
        chapter.startFromLastPage();
        setChapter(chapter);
      }
    } else {
      chapter.previousPage();
    }
    load(true);
  };

  const viewProgress = () => {
    return `${chapter.getCurrentPageNumber() + 1} / ${chapter.getLastPageNumber()}`;
  };

  return (
    <Container>
      <Link ref={buttonRef as any} to={{ pathname: `/${manga.getDetailsLink()}`, state: manga }} />
      <Info>
        {chapter.getTitle()} - Page {!chapter.completed() && viewProgress()}
      </Info>
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
  width: 100%;
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  flex-direction: column;
`;

const Info = styled.div`
  z-index: 15;
  opacity: 0.3;
  font-size: 16px;
  user-select: none;
  font-weight: 700;
  margin-top: -35px;
  position: absolute;
  transition: 0.3s all;

  &:hover {
    opacity: 0.8;
    transition: 0.1s all;
  }
`;

export default hot(Reader);
