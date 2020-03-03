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
        <Link to="/overview">Overview</Link>
      </li>
    </ul>
  </Navigation>
);

const Navigation = styledComponents.nav`
  width: 100%;
  height: 50px;

  ul {
    margin: 0;
    padding: 0;
    height: 100%;
    display: flex;
    place-items: center;
    flex-direction: row;
    list-style-type: none;

    li {
      display: flex;
      margin: 0.5rem;

      a {
        color: white;
        font-weight: 700;
        text-decoration: none;
      }
    }
  }
`;

export default hot(Toolbar);