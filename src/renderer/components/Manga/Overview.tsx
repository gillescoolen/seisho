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

  const [page, setPage] = useState(1);
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [manga, setManga] = useState<Manga[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [activeGenres, setActiveGenres] = useState<string[]>([]);
  const [inactiveGenres, setInactiveGenres] = useState<string[]>([]);

  useEffect(() => {
    (async () => setManga([...manga, ...(await source.search(search, page, activeGenres, inactiveGenres))]))();

    setLoading(false);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, activeGenres, inactiveGenres]);

  useEffect(() => {
    (async () => setGenres(await source.fetchGenres()))();

    return () => source.abortRequest()
  }, []);

  const handleScroll = async () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }

    setPage(page + 1);
    setLoading(true);
  }

  const submit = async (value: string) => {
    setSearch(value);
    setManga([]);
    setMessage('No manga found.');
    setLoading(true);
  }

  const clear = async () => {
    setMessage('');
    setSearch('');
    setManga([]);
    setPage(1);
    setActiveGenres([]);
    setInactiveGenres([]);
    setLoading(true);
  }

  const toggle = (name: string) => {
    if (activeGenres.includes(name)) {
      activeGenres.splice(activeGenres.indexOf(name), 1);
      setInactiveGenres([...inactiveGenres, name]);
    } else if (inactiveGenres.includes(name)) {
      inactiveGenres.splice(inactiveGenres.indexOf(name), 1);
    } else {
      setActiveGenres([...activeGenres, name]);
    }
  }

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {manga.length > 0 ?
        <Grid>
          {manga.map((info, index) => (
            <AnimatePresence key={index}>
              <motion.div
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
        :
        <Message
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 0.2, delay: 2 }}
        >
          {message}
        </Message>
      }
      <Search
        search={submit}
        close={clear}
        genres={genres}
        toggle={toggle}
      />
    </Container>
  );
};

const Message = styled(motion.div)`
  height: 100%;
  opacity: 0.2;
  display: flex;
  font-size: 32px;
  font-weight: 700;
  align-items: center;
  justify-content: center;
`;

const Container = styled(motion.div)`
  height: 100%;
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
