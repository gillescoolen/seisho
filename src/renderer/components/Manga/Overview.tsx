import Cover from './Cover';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';
import { Manga } from '../../../domain/manga/manga';
import { MangaseeSource } from '../../../domain/manga/mangasee/mangasee-source';
import { motion } from 'framer-motion';

const Overview = () => {
  const source = new MangaseeSource();

  const [search] = useState('');
  const [page, setPage] = useState(1);
  const [manga, setManga] = useState<Manga[]>([]);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {

    (async () => {
      setLoadMore(false);
      setManga([...manga, ...(await source.search(search, page))]);
      setPage(page + 1);
    })();

    window.addEventListener('scroll', handleScroll);

    return () => {
      source.abortRequest();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  async function handleScroll() {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    setLoadMore(true);
  }

  return (
    <Container>
      {manga.map((info, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Cover manga={info} />
        </motion.div>
      ))}
    </Container>
  );
};

const Container = styled(motion.div)`
  display: grid;
  grid-gap: 20px;
  place-content: center;
  grid-template-columns: repeat(auto-fit, 250px);
`;

export default hot(Overview);
