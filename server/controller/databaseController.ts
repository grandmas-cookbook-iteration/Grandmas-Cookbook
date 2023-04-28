/* eslint-disable prefer-destructuring */
/* eslint-disable radix */
import { Request, Response, NextFunction } from 'express';
import { QueryResult } from 'pg';
import { db } from '../models/databaseModels';
const { deleteFileFromS3 } = require('../utils/awsS3Connection');
import { RouteType } from './RouteType';

interface databaseController {
  getAllRecipes: RouteType
  addRecipe: RouteType
  updateRecipe: RouteType
  updateImage: RouteType
  getUserRecipe: RouteType
  deleteRecipe: RouteType
}


//generate interface for ingredientList and directions
interface Recipe {
  id: number
  url: String
  title: String
  description: String
  ingredientList: String
  directions: String
  tastyId: number
  imagePath: String
  userId: number
}

//find out structure of databaseRowsArray and define interface
// const camelCaseTheKey = (databaseRowsArray: Recipe[]) => {
//   const camelCaseArray = databaseRowsArray.map((dbObj) => {
//     const ccObj = {};
//     Object.assign(
//       ccObj,
//       dbObj,
//       { ingredientList: dbObj.ingredientlist },
//       { tastyId: dbObj.tastyid },
//       { imagePath: dbObj.imagepath },
//       { userId: dbObj.userid }
//     );
//     delete ccObj.ingredientlist;
//     delete ccObj.tastyid;
//     delete ccObj.imagepath;
//     delete ccObj.userid;
//     return ccObj;
//   });

//   return camelCaseArray;
// };


const databaseController: databaseController = {

  getAllRecipes: async (req, res, next) => {
    // console.log('In get all recipes');
    // console.log('request: ' + req);
    const allRecipeQuery = `SELECT * FROM recipes`;
    // console.log(allRecipeQuery);
    const result = await db.query(allRecipeQuery)
    for (let i = 0; i < result.rows.length; i++) {
      result.rows[i].ingredientList = result.rows[i].ingredientlist;
    }
    res.locals = result.rows;
    // console.log('This is res.locals', res.locals)
    return next()
      // //find intended structure of data from db
      // .then((data: QueryResult) => {
      //   console.log("These are the rows", data.rows);
      //   res.locals = data.rows;
      //   //res.locals = camelCaseTheKey(data.rows);
      //   return next();
      // })
      // .catch((error: Error) =>
      //   next({
      //     log: `Error encountered in databaseController.getAllRecipe, ${error}`,
      //     message: 'Error encountered when querying the database.',
      //   })
      // );
  },

  addRecipe: (req, res, next) => {
    const {
      url,
      title,
      description,
      ingredientList,
      directions,
      tastyId,
      imagePath,
    } = req.body;
    console.log('reach addRecipe');
    const addRecipeQuery = `INSERT INTO recipes (url, title, description, ingredientList, directions, tastyId, imagePath) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    // To also cover Tasty API entries where description can be long.
    const values = [
      url,
      title,
      !description || description.slice(0, 250),
      JSON.stringify(ingredientList),
      JSON.stringify(directions),
      tastyId,
      res.locals.awsimagePath || imagePath,
    ];

    db.query(addRecipeQuery, values)
      //find intended structure of data from db
      .then((data: QueryResult) => {
        res.locals = data.rows[0];
        //res.locals = camelCaseTheKey(data.rows)[0];
        return next();
      })
      .catch((error: Error) =>
        next({
          log: `Error encountered in databaseController.addRecipe, ${error}`,
          message: 'Error encountered when querying the database.',
        })
      );
  },

  updateRecipe: (req, res, next) => {
    const { url, title, description, ingredientList, directions, tastyId } =
      req.body;
    const { id } = req.params;

    const updateRecipeQuery = `
        UPDATE recipes
        SET url = $1, title = $2, description = $3, ingredientList = $4, 
        directions = $5, tastyId = $6
        WHERE id = $7
        RETURNING *;
      `;
    const values = [
      url,
      title,
      description,
      JSON.stringify(ingredientList),
      JSON.stringify(directions),
      tastyId,
      parseInt(id),
    ];

    db.query(updateRecipeQuery, values)
      .then((data:QueryResult) => {
        res.locals = data.rows[0]
        // res.locals = camelCaseTheKey(data.rows)[0];
        return next();
      })
      .catch((error: Error) =>
        next({
          log: `Error encountered in databaseController.updateRecipe, ${error}`,
          message: 'Error encountered when querying the database.',
        })
      );
  },

  updateImage: (req, res, next) => {
    const { id } = req.params;

    const updateImageQuery = `
      UPDATE recipes
      SET imagePath = $2
      WHERE id = $1
      RETURNING id, imagePath, (
        SELECT imagePath FROM recipes WHERE id = $1
      ) as oldImagePath;
      `;
    const values = [parseInt(id), res.locals.awsimagePath];

    db.query(updateImageQuery, values)
      .then((data: QueryResult) => {
        //res.locals = camelCaseTheKey(data.rows)[0];
        res.locals = data.rows[0];
        const oldImagePath = res.locals.oldimagepath;
        if (
          oldImagePath &&
          oldImagePath.includes(
            'https://grandmas-cookbook-scratch-project.s3.amazonaws.com/images'
          ) &&
          res.locals.imagePath !== oldImagePath
        ) {
          return deleteFileFromS3(oldImagePath);

          // Delete the image file on local disk. Not used.
          /*
          return fs.unlink(
            path.join(__dirname, '../../public/images/', res.locals.oldimagepath)
          );
          */
        }
        return null;
      })
      .then(() => next())
      .catch((error: Error) =>
        next({
          log: `Error encountered in databaseController.updateRecipe, ${error}`,
          message: 'Error encountered when querying the database.',
        })
      );
  },

  deleteRecipe: (req, res, next) => {
    const { id } = req.params;

    const deleteRecipeQuery = `
        DELETE FROM recipes
        WHERE id = $1
        RETURNING (
          SELECT imagePath FROM recipes WHERE id = $1
        ) as imagePath;
      `;
    const values = [parseInt(id)];

    db.query(deleteRecipeQuery, values)
      .then((data: QueryResult) => {
        const imagePath = data.rows[0].imagepath;
        if (
          imagePath &&
          imagePath.includes(
            'https://grandmas-cookbook-scratch-project.s3.amazonaws.com/images'
          )
        ) {
          return deleteFileFromS3(imagePath);

          // Delete the image file on local disk. Not used.
          /*
          return fs.unlink(
            path.join(__dirname, '../../public/images/', imagePath)
          );
          */
        }
        return null;
      })
      .then(() => next())
      .catch((error: Error) =>
        next({
          log: `Error encountered in databaseController.deleteRecipe, ${error}`,
          message: 'Error encountered when querying the database.',
        })
      );
  },

  getUserRecipe: (req, res, next) => {
    const { id } = req.params;

    const queryString = `
      SELECT recipes.url, recipes.title, recipes.ingredientlist, recipes.directions, recipes.tastyid, recipes.imagepath
      FROM recipes
      JOIN users
      ON recipes.userid = users.id
      WHERE users.id = $1;
      `;
    const values = [parseInt(id)];
    db.query(queryString, values)
      .then((data: QueryResult) => {
        res.locals = data.rows;
        // res.locals = camelCaseTheKey(data.rows);
        return next();

      })
      .then(() => next())
      .catch((error: Error) =>
        next({
          log: `Error encountered in databaseController.getUserRecipe, ${error}`,
          message: 'Error encountered when querying the database.',
        })
      );
  },
};

module.exports = databaseController;
