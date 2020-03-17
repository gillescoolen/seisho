import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { Manga } from '../../../domain/manga/manga';
import { Chapter } from '../../../domain/manga/chapter';
import { StyledLink } from '../Manga/Cover';


const Reader = (props: any) => {
  const [manga] = useState<Manga>(props.location.state.manga);
  const [chapter, setChapter] = useState<Chapter>(props.location.state.chapter);
  const [loading, load] = useState(true);

  const buttonRef = React.createRef<typeof StyledLink>();

  useEffect(() => {
    (async () => {
      await fetchChapter(chapter);
      if (manga.getCurrentChapter().getTitle() !== chapter.getTitle()) manga.setCurrentChapter(chapter);
      load(false);
    })();

    window.addEventListener('keydown', paginate);

    return () => {
      chapter.abortRequest();
      window.removeEventListener('keydown', paginate);
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

  return (
    <Container>
      <StyledLink ref={buttonRef as any} to={{ pathname: `/${manga.getDetailsLink()}`, state: manga }}>
        Go back
      </StyledLink>
      {chapter.completed()
        ?
        <Page>
          <p>{chapter.getTitle()} Finished.</p>
          {!manga.hasNextChapter() &&
          <p>No next chapter found.</p>
          }
        </Page>
        : <Page style={{ backgroundImage: `url(${chapter.getCurrentPage()})` }}/>
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  flex-direction: column;
`;

export default hot(Reader);
