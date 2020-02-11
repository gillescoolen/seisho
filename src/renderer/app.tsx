import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import Home from './components/Home';

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
