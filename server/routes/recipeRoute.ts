import { Request, Response, NextFunction } from 'express';
const router = require('express').Router();
const scrapingController = require('../controller/scrapingController');
const databaseController = require('../controller/databaseController');
const dalleImageController = require('../controller/dalleImageController');

// Scrape info for a specific URL provided
router.get('/scrapeurl', scrapingController, ( req: Request, res: Response, next : NextFunction)=> {
  res.status(200).json(res.locals);
});

// Get all recipes stored in the database
router.get('/all', databaseController.getAllRecipes, ( req: Request, res: Response, next : NextFunction) => {
  res.status(200).json(res.locals);
});

// Add a new recipe to the database
router.post(
  '/add',
  dalleImageController.generateImage,
  databaseController.addRecipe,
  ( req: Request, res: Response, next : NextFunction)=> {
    res.status(200).json(res.locals);
  }
);

// Update a recipe (except image) with a specific id in the database. The request shall have the recipe id in url parameter and all other information (except imagePath) in the request body.
router.put('/update/:id', databaseController.updateRecipe, ( req: Request, res: Response, next : NextFunction) => {
  res.status(200).json(res.locals);
});

// Update a recipe image with a specific id in the database. The request shall have the recipe id in url parameter and recipe title in the body.
router.put(
  '/update/image/:id',
  dalleImageController.generateImage,
  databaseController.updateImage,
  ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).json(res.locals);
  }
);

// Delete the recipe with a specific id in the database
router.delete(
  '/delete/:id',
  databaseController.deleteRecipe,
  ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).json('The recipe has been successfully deleted.');
  }
);

router.get('/userrecipe/:id', databaseController.getUserRecipe, ( req: Request, res: Response) => {
  res.status(200).json(res.locals);
})

module.exports = router;
