import Cover from './Cover';
import Search from '../Search/Search';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';
import { Manga } from '../../../domain/manga/manga';
import { motion, AnimatePresence } from 'framer-motion';
import { MangaseeSource } from '../../../domain/manga/mangasee/mangasee-source';

const Overview = () => {
  const source = new MangaseeSource();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [manga, setManga] = useState<Manga[]>([]);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    (async () => setManga([...manga, ...(await source.search(search, page))]))();

    setLoadMore(false);

    window.addEventListener('scroll', handleScroll);

    return () => {
      source.abortRequest();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMore]);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    setPage(page + 1);
    setLoadMore(true);
  }

  const submit = async (value: string) => {
    setSearch(value);
    setManga([]);
    setLoadMore(true);
  }

  const clear = async () => {
    setSearch('');
    setManga([]);
    setPage(1);
    setLoadMore(true);
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Grid>
        {manga.map((info, index) => (
          <AnimatePresence key={index}>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <Cover manga={info} />
            </motion.div>
          </AnimatePresence>
        ))}
      </Grid>
      <Search search={submit} close={clear} />
    </Container>
  );
};

const Container = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: bottom;
  justify-content: center;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-gap: 20px;
  place-content: center;
  grid-template-columns: repeat(auto-fit, 250px);
`;

export default hot(Overview);
