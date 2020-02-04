import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Home from './components/Home';

// TODO: remove this
import {Mangasee} from "../domain/manga/mangasee";
new Mangasee().search('berserk', 1).then(e => console.log(e));

// Create main element
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);
// Render components
const render = (Component: () => JSX.Element) => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    mainElement
  );
};

render(Home);
