import { hot } from 'react-hot-loader/root';
import React from 'react';
import styledComponents from "styled-components";
import { Link } from 'react-router-dom';

const Toolbar = () => (
  <Navigation>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/Overview">Overview</Link>
      </li>
    </ul>
  </Navigation>
);

const Navigation = styledComponents.nav`
  width: 100%;
  height: 50px;
  background-color: red;
`;

export default hot(Toolbar);