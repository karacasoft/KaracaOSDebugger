import * as React from 'react';
import { render } from 'react-dom';

import App from './App';
import { MuiThemeProvider } from '@material-ui/core/styles';

import mainTheme from './theme';

render(<MuiThemeProvider theme={mainTheme}>
  <App />
</MuiThemeProvider>, document.getElementById('app'));
