const fetch = require('node-fetch')
const tastyTypes = require('./tastyQueryTypes')
import { RouteType } from '../RouteType';
import { Response as FetchResponse } from 'node-fetch';

const url = 'https://tasty.p.rapidapi.com/';

interface tastyApiController {
    tastyAutoCompleteQuery: RouteType
    tastyList: RouteType
    tastyGetTags: RouteType 
    tastyFindSimilarRecipeByID: RouteType
    tastyGetTipsForID: RouteType
    tastyGetFeed: RouteType
    tastyGetMoreInfo: RouteType
};

interface Dish {
    tasty_id: number,
    title: string,
    description: string,
    directions: string[],
    ingredientList: string[],
    tags: string[],
    imagePath: string
}

interface AutoCompleteQuery {
    display: string,
    search_value: string,
    type: string,
}

interface AutoCompleteQueryJson {
    results: AutoCompleteQuery[]
}

interface GetTagsJson {
    count: number,
    results: TagQuery[]
}

interface TagQuery {
    id: number,
    type: string,
    name: string,
    display_name: string,
}


//similarQuery object is a nightmare, idk how to properly type all of it, may look into later
//probably most practical to leave it like this for now

interface SimilarIDQuery {
    count : number,
    results: any[]
}

// interface SimilarQueryObj {
//     video_ad_content: any,
//     promotion: string,
//     nutrition_visibility: string,
//     instructions: SimilarRecipeObj[]
// }

// interface SimilarRecipeObj {
//     appliance: null | string,
//     end_time: 
// }

const options = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': 'e09d14a1famsh1357f106bfa3db5p13665djsn53706769ec4b',
        'X-RapidAPI-Host': 'tasty.p.rapidapi.com'
    }
}

const tastyApiController: tastyApiController = {
    tastyAutoCompleteQuery: (req, res, next) => {
        console.log("Inside tastyAutoCompleteQuery")
        const query = req.params.searchTerm;
        const type = tastyTypes.recipes.AUTO_COMPLETE;

        fetch(`${url}recipes/${type}?prefix=${query}`, options)
            .then((result: FetchResponse) => result.json())
            //find structure of dataJson
            .then((dataJson : AutoCompleteQueryJson) => {
                const resultArray: AutoCompleteQuery[] = dataJson.results;
                const searchVals: string[] = [];
                //find structure of dataJson.results in order to define interface
                resultArray.forEach((el: AutoCompleteQuery) => {
                    searchVals.push(el.search_value);
                })
                res.locals.queryData = searchVals;
                 next();
            })
            .catch((err: Error) => {
                next({
                    log: `Error encountered in tastyApiController/tastyAutoCompleteQuery function. ${err}`,
                    message: 'Could not query the data',
                })
            });
    }, 
  

    tastyList: (req, res, next) => { 
        // console.log('inside tastyList');
        const { start } = req.params;
        const { size } = req.params;
        let { tags } = req.params;
        let { q } = req.params;
        const type = tastyTypes.recipes.LIST;
        if (tags !== 'null') {
            const tagsSplit = tags.split(' ');
            for (let i = 0; i < tags.length; i++) {
                if (i === 0) continue;
                else {
                    tagsSplit[i] = `%20${tags[i]}`
                }
            }
            tags = tagsSplit.join('');
        } else {
            tags = '';
        }

        if (q !== 'null') {
            const qSplit = q.split(' ');
            //q = q.split(' ');
            console.log(`qSplit: ${qSplit}`);
            for (let i = 0; i < qSplit.length; i++) {
                if (i === 0) continue;
                else {
                    qSplit[i] = `%20${qSplit[i]}`
                }
            }
            q = qSplit.join('');
            // q = 'pizza';
            // console.log(`q: ${q}`);
        } else {
            q = '';
        }


        fetch(`${url}recipes/${type}?from=${start}&size=${size}${tags.length > 0 ? `&tags=${tags}` : ''}${q.length > 0 ? `&q=${q}` : ''}`, options)
            .then((result : FetchResponse) => result.json())
            //find structure of result.json()
            .then((json: any) => { 
                const resultArray = json.results;
                console.log('ResultArray:', resultArray);
                let dishes: Dish[] = [];
                for (let i = 0; i < resultArray.length; i++) {
                    if (resultArray[i] === undefined || resultArray[i] === null) continue;
                    let el = resultArray[i];
                    const preparations: string[] = [];
                    const recipeTags: string[]= [];
                    const ingredients: string[] = [];
                    //find structure of instruction, define interface
                    if (el.instructions !== undefined && el.instructions !== null) {
                        for (let j = 0; j < el.instructions.length; j++) {
                            const instruction = el.instructions[j];
                            if (instruction === undefined || instruction === null) continue;
                            preparations.push(instruction.display_text);
                        }
                    }

                    if (el.tags !== undefined && el.tags !== null) {
                        //find structure of tags
                        for (let a = 0; a < el.tags.length; a++) {
                            const tag = el.tags[a];
                            if (tag === undefined || tag === 0 || tag === null) continue;
                            recipeTags.push(tag.name);
                        }
                    }

                    if (el.sections !== undefined && el.sections !== null) {
                        if (el.sections[0] !== undefined && el.sections[0] !== null) {
                            for (let b = 0; b < el.sections[0].components.length; b++) {
                                const ingredient = el.sections[0].components[b];
                                if (ingredient === undefined || ingredient === null) continue;
                                ingredients.push(ingredient.raw_text);
                            }
                        }
                    }

                    dishes.push({
                        tasty_id: el.id,
                        title: el.name,
                        description: `${(el.total_time_tier !== undefined) ? el.total_time_tier : ''} - ${el.description}`,
                        directions: preparations,
                        ingredientList: ingredients,
                        tags: recipeTags,
                        imagePath: el.thumbnail_url
                    })
                }
                dishes = dishes.filter(el =>
                    el.directions.length !== 0 && el.ingredientList.length !== 0
                );
                res.locals.tastyList = dishes;
                next();
            })
            .catch((err: Error) => {
                next({
                    log: `Error encountered in tastyApiController/tastyList function. ${err}`,
                    message: 'Could not query the data',
                })
            });
    },

    //tastyList({body:{start: 0, size: 20, tags: ['under_30_minutes'], q:['pasta']}});

    tastyGetTags: (req, res, next) => {
        console.log('Inside tasty get tags');
        const type = tastyTypes.tags.LIST;

        fetch(`${url}tags/${type}`, options)
            .then((result : FetchResponse) => result.json())
            //find structure of json
            .then((json: GetTagsJson) => {
                console.log('Json retrieved');
                const tastyTags = json.results;
                const tagsArr : string[] = [];

                tastyTags.forEach((tag) => (
                    tagsArr.push(tag.name)
                ))

                res.locals.tags = tagsArr;
                next();
            })
            .catch((err : Error) => {
                next({
                    log: `Error encountered in tastyApiController/tastyGetTags function. ${err}`,
                    message: 'Could not query the data',
                })
            });
    },

    // tastyGetTags();

    // TODO: implement finding similar recipe as an extension

    tastyFindSimilarRecipeByID: (req, res, next) => {
        const { id } = req.params;
        const type = tastyTypes.recipes.LIST_SIMILARITIES;

        fetch(`${url}recipes/${type}?recipe_id=${id}`, options)
            .then((result : FetchResponse) => result.json())
            //find structure of json
            .then((json : SimilarIDQuery) => {
                res.locals.similarRecipe = json;
                next();
            })
            .catch((err: Error) => {
                next({
                    log: `Error encountered in tastyApiController/tastyFindSimilarRecipeByID function. ${err}`,
                    message: 'Could not query the data',
                })
            });
    },

    // tastyFindSimilarRecipeByID({body:{id: 8138}});

    // TODO: POSSIBLY REMOVE AS THIS ENDPOINT IS REDUNDANT

    tastyGetMoreInfo: (req, res, next) => {
        const { id } = req.body;
        const type = tastyTypes.recipes.GET_MORE_INFO;

        fetch(`${url}recipes/${type}?id=${id}`, options)
            .then((result : FetchResponse) => result.json())
            //find structure of json
            .then((json : any) => {
                res.locals.recipeData = json;
                next();
            })
            .catch((err: Error) => {
                next({
                    log: `Error encountered in tastyApiController/tastyGetMoreInfo function. ${err}`,
                    message: 'Could not query the data',
                })
            });
    },

    // tastyGetMoreInfo({body:{id: 8138}});

    // TODO: implement parsing of tips/reviews as an extension

    tastyGetTipsForID: (req, res, next) => {
        const { start } = req.body;
        const { size } = req.body;
        const { id } = req.body;
        const type = tastyTypes.tips.TIPS;

        fetch(`${url}${type}/list?id=${id}&from=${start}&size=${size}`, options)
            .then((result : FetchResponse) => result.json())
            .then((json : any) => {
                res.locals.tips = json;
                next();
            })
            .catch((err: Error) => {
                next({
                    log: `Error encountered in tastyApiController/tastyGetTipsForID function. ${err}`,
                    message: 'Could not query the data',
                })
            });
    },

    // tastyGetTipsForID({body:{id: 8138}});

    // TODO: implement parsing of feed as an extension

    tastyGetFeed: (req, res, next) => {
        const type = tastyTypes.feeds.LIST;
        const { start } = req.body;
        const { size } = req.body;
        const timezone = '%2B0700';
        const { isVegetarian } = req.body;


        fetch(`${url}feeds/${type}?size=${size}&timezone=${timezone}&vegetarian${isVegetarian}&from=${start}`, options)
            .then((result : FetchResponse) => result.json())
            .then((json : any) => {
                res.locals.feed = json;
                next();
            })
            .catch((err: Error) => {
                next({
                    log: `Error encountered in tastyApiController/tastyGetFeed function. ${err}`,
                    message: 'Could not query the data',
                })
            });
    }
}
// tastyGetFeed({body:{start: 0, size: 20, isVegetarian: false}});

module.exports = tastyApiController;
