import React from 'react';
import styled from 'styled-components';
import { hot } from 'react-hot-loader/root';
import { motion } from 'framer-motion';

const Filters = () => {

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      Content here.
    </Container>
  )
};

const Container = styled(motion.div)`

`;

export default hot(Filters);