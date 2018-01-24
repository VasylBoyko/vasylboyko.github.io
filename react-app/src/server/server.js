import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../client/js/components/App';
import template from './template';

const server = express();

server.use('/assets', express.static('assets'));


//shows/{:showId}}/{:seasonId}/{:episodeId}

server.get('/', (req, res) => {
  const isMobile = false;
  const initialState = { isMobile };
  const appString = renderToString(<App {...initialState} />);

  res.send(template({
    body: appString,
    title: 'Hello World from the server',
    initialState: JSON.stringify(initialState)
  }));
});

server.get('/news', (req, res) => {
  const isMobile = false;
  const initialState = { isMobile };
  const appString = renderToString(<App {...initialState} />);

  res.send(template({
    body: appString,
    title: 'news',
    initialState: JSON.stringify(initialState)
  }));
});


server.listen(8080);
console.log('listening');
