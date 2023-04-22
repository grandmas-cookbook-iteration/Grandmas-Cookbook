import { Request, Response as ExpressResponse, NextFunction } from 'express';
import { Response as FetchResponse } from 'node-fetch';
const cheerio = require('cheerio');
import { Element } from 'cheerio';
const fetch = require('node-fetch');
import { RouteType } from './RouteType'

//typeguard for url

const hasUrl = (query: any): query is { url: string } => {
  return query && typeof query.url === 'string';
}

// Fetch from www.epicurious.com
const scrapeEpicurious: RouteType = (req, res, next) => {
  fetch(res.locals.url)
    .then((response: FetchResponse) => response.text())
    //extract response.text(), assuming html should be string type
    .then((html: String) => {
      const $ = cheerio.load(html);
      const title = $('h1[data-testid="ContentHeaderHed"]').text();
      const ingredientListNodes = $(
        'div[data-testid="IngredientList"]'
      ).children('div');
      const directionNodes = $('div[data-testid="InstructionsWrapper"] p');
      //figure out shape of data here, then define interfaces for ingredienetList and directions
      const ingredientList: String[] = [];
      const directions: String[] = [];

      //i is never referenced here, not sure if el is accessing the index and the intent is to use i as a standin for first parameter
      ingredientListNodes.children().each((i: number, el: Element) => {
        const trimmedEl: String = $(el).text().trim();
        ingredientList.push(trimmedEl);
      });

      directionNodes.each((i: number, el: Element) => {
        const trimmedEl: String = $(el).text().trim();
        directions.push(trimmedEl);
      });

      res.locals.title = title;
      res.locals.ingredientList = ingredientList;
      res.locals.directions = directions;

      next();
    })
    .catch((err: Error) =>
      next({
        log: `Error encountered in scrapingController/scrapeEpicurious function. ${err}`,
        message: 'Cannot connect to the provided URL. Please verify the URL.',
      })
    );
};

// Fetch from www.foodnetwork.com
const scrapeFoodnetwork : RouteType = (req, res, next) => {
  fetch(res.locals.url)
    .then((response: FetchResponse) => response.text())
    .then((html: String) => {
      const $ = cheerio.load(html);
      const title = $('.o-AssetTitle__a-HeadlineText').first().text();
      const ingredientListNodes = $(
        '.o-Ingredients__a-Ingredient--CheckboxLabel'
      );
      const directionsNodes = $('.o-Method__m-Step');

      const ingredientList: String[] = [];
      const directions: String[] = [];

      ingredientListNodes.each((i: Number, el: Element) => {
        if (i) {
          const trimmedEl: String = $(el).text().trim();
          ingredientList.push(trimmedEl);
        }
      });

      directionsNodes.each((i: Number, el: Element) => {
        const trimmedEl: String = $(el).text().trim();
        directions.push(trimmedEl);
      });

      res.locals.title = title;
      res.locals.ingredientList = ingredientList;
      res.locals.directions = directions;

      next();
    });
};

const scrapeHandler: RouteType = (req, res, next) =>  {
    if (hasUrl(req.query)) {
      const { url } = req.query;
      res.locals.url = url;
      const check = url.includes('epicurious');
      if (url.includes('epicurious')) {
        scrapeEpicurious(req, res, next);
      } else if (url.includes('foodnetwork')) {
        scrapeFoodnetwork(req, res, next);
      } else {
        next({
          log: 'Error encountered in scrapingController. Requested URL is not supported by this app.',
          status: 406,
          message: 'Requested URL is not supported by this app.',
        });
      }
    }
  };


module.exports = scrapeHandler;