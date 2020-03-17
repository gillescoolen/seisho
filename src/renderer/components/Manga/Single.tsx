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
      window.scrollTo(0, 0);
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
      <Link ref={buttonRef as any} to={{ pathname: `/overview` }}/>
      <InfoArea
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <img src={manga.getThumbnailUrl()}/>
        <h1>{manga.getTitle()}</h1>
        {!loading &&
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {manga.getDescription()}
        </motion.p>
        }
      </InfoArea>
      {!loading &&
      <ChaptersArea
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ChapterList manga={manga}/>
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

const InfoArea = styled(motion.div)`
  grid-area: info;

  img {
    border-radius: 5px;
  }
`;

const ChaptersArea = styled(motion.div)`
  grid-area: chapters;
`;

export default hot(Single);
