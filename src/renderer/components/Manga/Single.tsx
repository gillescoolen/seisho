import { ChapterList } from '.';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useState, useEffect } from 'react';
import { Manga } from '../../../domain/manga/manga';
import { Link } from 'react-router-dom';

const Single = (props: any) => {
  const [manga] = useState<Manga>(props.location.state);
  const [loading, load] = useState(true);

  useEffect(() => {
    (async () => {
      await manga.fetchDetails();
      load(false);
    })();

    window.addEventListener('keydown', goBackHandler);
    return () => {
      manga.abortRequest();
      window.removeEventListener('keydown', goBackHandler);
    };
  }, [loading]);

  const buttonRef = React.createRef<typeof Link>();

  const goBackHandler = async (e: KeyboardEvent) => {
    e.key === 'Backspace' && goBack();
    e.key === 'Escape' && goBack();
  };

  const goBack = () => {
    (buttonRef.current as any as HTMLLinkElement).click();
  };

  return (
    <Container>
      <InfoArea
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img src={manga.getThumbnailUrl()} />
        <h1>{manga.getTitle()}</h1>
        {!loading &&
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Tags>
              {manga.getGenres().map((genre: string, key: number) => (
                <div key={key}>{genre}</div>
              ))}
            </Tags>
            <p>
              {manga.getDescription()}
            </p>
          </motion.div>
        }
      </InfoArea>
      {!loading &&
        <ChaptersArea
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Back ref={buttonRef as any} to={{ pathname: `/overview` }} />
          <ChapterList manga={manga} />
        </ChaptersArea>
      }
    </Container>
  );
};

const Container = styled.div`
  padding: 1rem;
  display: grid;
  grid-gap: 8rem;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr 8fr;
  grid-template-areas: 'info chapters' 'widgets chapters' 'widgets chapters';
`;

const Back = styled(Link)`
  color: white;
  text-decoration: none;
`;

const InfoArea = styled(motion.div)`
  grid-area: info;

  position: fixed;
  padding: 1rem;
  max-width: 50%;

  img {
    border-radius: 5px;
  }

  h1 {
    margin: 1.5rem 0 0.5rem 0;
  }
`;

const ChaptersArea = styled(motion.div)`
  grid-area: chapters;
`;

const Tags = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;

  div {
    color: white;
    margin: 0.1rem;
    font-size: 12px;
    padding: 0.3rem;
    user-select: none;
    border-radius: 5px; 
    background-color: #232636;
  }
`;

export default hot(Single);
