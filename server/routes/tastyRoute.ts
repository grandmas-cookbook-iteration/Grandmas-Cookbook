import { Request, Response, NextFunction } from 'express';
const router =  require('express').Router();
const tastyController =  require('../controller/tastyAPI/tastyApiController');

router.get('/search/:searchTerm', tastyController.tastyAutoCompletequery, ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).send(res.locals.queryData);
  });

//   http://localhost:3000/tasty/tagQuery/?from=0&size=50&tags=[]&q=${keywords}'

router.get('/tagQuery/:start/:size/:tags/:q', tastyController.tastyList, ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).send(res.locals.tastyList);
});

router.get('/findSimilarRecipe/:id', tastyController.tastyFindSimilarRecipeByID, ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).send(res.locals.similarRecipe);
});

router.get('/getMoreInfo', tastyController.tastyGetMoreInfo, ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).send(res.locals.recipeData);
});

router.get('/getTipsForID', tastyController.tastyGetTipsForID, ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).send(res.locals.tips);
});

router.get('/tags', tastyController.tastyGetTags, ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).send(res.locals.tags);
});

router.get('/feed', tastyController.tastyGetFeed, ( req: Request, res: Response, next : NextFunction) => {
    res.status(200).send(res.locals.feed);
});

module.exports = router;