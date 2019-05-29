import express from 'express';
import React from 'react';
import {renderToString} from 'react-dom/server';
import App from '../client/js/components/App';
import template from './template';

const server = express();

server.use('/assets', express.static('assets'));

//shows/{:showId}}/{:seasonId}/{:episodeId}

server.get('/', (req, res) => {
  const isMobile = false;
  const initialState = {
    isMobile
  };
  const appString = renderToString(<App {...initialState}/>);

  res.send(template({
    body: appString,
    title: 'App Title',
    initialState: JSON.stringify(initialState)
  }));
});

server.get('/api/getShows', (req, res) => {
  res.send(JSON.stringify([
    {
      id: "1",
      ytId: "_D1JGNidMr4",
      title: "Youtube video 1"
    }, {
      id: "1",
      ytId: "qh3dYM6Keuw",
      title: "Youtube video 2"
    }, {
      id: "1",
      ytId: "1iAG6h9ff5s",
      title: "Youtube video 3"
    }
  ]));
});

server.listen(8080);
console.log('listening');
