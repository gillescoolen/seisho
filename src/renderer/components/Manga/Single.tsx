import { ChapterList, Info } from '.';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { Manga } from '../../../domain/manga/manga';

const Single = (props: any) => {
  const [manga] = useState<Manga>(props.location.state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      window.scrollTo(0, 0);
      await manga.fetchDetails();
      setLoading(false);
    })();
  }, [loading]);

  return (
    <Container>
      <Info manga={manga} />
      <Chapters>
        <ChapterList manga={manga} />
      </Chapters>
    </Container>
  )
};

const Container = styled.div`
  padding: 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas: "info chapters" "widgets chapters" "widgets chapters";

  .fade {
    opacity: 0;
  }

  .fade-enter {
    opacity: 0;
  }

  .fade-enter-active {
    opacity: 1;
    transition: opacity 300ms;
  }
`;

const Chapters = styled.div`
  grid-area: chapters;
`;


export default hot(Single);
