import RecipeCard from '../components/recipeCard'

const { createSlice } = require('@reduxjs/toolkit');
const React = require('react')

interface urlScrape {
    title: String,
    ingredientList: String[],
    directions: String[]
}

export interface State {
    urlScrape: urlScrape
    keywordResults: String[]
    clearKeywordResult: (state: State) => undefined
}

interface UrlParam {
    payload: urlScrape
}

interface KeyWord {
    payload: String[]
}

const modalSlice = createSlice({
    name: 'modal',

    initialState : {
        urlScrape: {
        },
        keywordResults: [],
    },

    reducers: {
        setUrlResult: (state:State, param:UrlParam) => {
            const { payload } = param;
            state.urlScrape = Object.assign(payload, state.urlScrape);
        },
        clearUrlResult: (state:State) => {
            state.urlScrape = {title: '', ingredientList: [], directions: []};
        },
        setKeywordResult: (state:State, param:KeyWord) => {
            const { payload } = param;
            state.keywordResults = [...state.keywordResults, ...payload]
        },
        clearKeywordResult: (state:State) => {
            state.keywordResults = [];
        },
    }
})

const { actions, reducer } = modalSlice;
export const { setKeywordResult, setUrlResult, clearKeywordResult, clearUrlResult } = actions;
export default reducer