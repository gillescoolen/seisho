import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { Chapter } from '../../../domain/manga/chapter';

const Reader = (props: any) => {
  const [chapter] = useState<Chapter>(props.location.state.chapter);
  const [loading, load] = useState(true);

  useEffect(() => {
    (async () => {
      await chapter.fetch();
      load(false);
    })();

    window.addEventListener('keydown', paginate);

    return () => {
      chapter.abortRequest();
      window.removeEventListener('keydown', paginate);
    };
  }, [loading]);

  const paginate = (e: KeyboardEvent) => {
    e.key === 'ArrowRight' ? next() : null;
    e.key === 'ArrowLeft' ? previous() : null;
  };

  const next = () => {
    chapter.nextPage();
    load(true);
  };
  const previous = () => {
    chapter.previousPage();
    load(true);
  };

  return (
    <Container>
      <Controls>
        <button onClick={previous}>Previous Page</button>
        <button onClick={next}>Next Page</button>
      </Controls>
      <Page style={{ backgroundImage: `url(${chapter.getCurrentPage()})` }} />
    </Container>
  );
};

const Page = styled.div`
  width: 90vw;
  height: 90vh;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

const Controls = styled.div`
  display: flex;
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
  place-items: center;
  flex-direction: column;
`;

export default hot(Reader);
