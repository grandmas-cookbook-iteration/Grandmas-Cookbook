const express = require('express');
const cors = require('cors');
const path = require('path');
import { Request, Response, NextFunction } from 'express';

require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// statically serve everything in the dist folder on the route '/dist'
app.use('/dist', express.static(path.join(__dirname, '../dist/')));

// Route for all recipe related features
const recipeRouter = require('./routes/recipeRoute');
const tastyRouter = require('./routes/tastyRoute');

app.use('/tasty', tastyRouter)
app.use('/recipe', recipeRouter);

// serve index.html on the route '/'.
// The '/*' is to make sure refresh in browser works with frontend routing (https://ui.dev/react-router-cannot-get-url-refresh)
if (process.env.NODE_ENV === 'production') {
  app.get('/*', (req: Request, res: Response) =>
    res.status(200).sendFile(path.join(__dirname, '../dist/index.html'))
  );
}

/*
 * To-Do: Add a 404 page backup route
 */

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
