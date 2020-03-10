import React, { useState, useEffect } from 'react';
import { hot } from 'react-hot-loader/root';
import { ChapterList } from '.';
import { Manga } from '../../../domain/manga/manga';
import styled from 'styled-components';

const Single = (props: any) => {
  const [manga] = useState<Manga>(props.location.state);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // window.scrollTo(0, 0);
      await manga.fetchDetails();
      setLoading(false);
    })();
  }, [loading]);
  return (
    <Container>
      <Info>
        <img src={manga.getThumbnailUrl()}/>
        <h1>{manga.getTitle()}</h1>
        <p>{manga.getDescription()}</p>
      </Info>
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
`;

const Info = styled.div`
  grid-area: info;
`;

const Chapters = styled.div`
  grid-area: chapters;
`;

export default hot(Single);
