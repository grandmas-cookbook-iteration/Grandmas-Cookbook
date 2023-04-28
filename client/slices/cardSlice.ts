const { createSlice } = require('@reduxjs/toolkit');

export interface Recipe {
    imagePath: any;
    id: number, 
    title: String,
    image: Blob,
    ingredientList: String[],
    directions: String[],
    imagepath: String
}

export interface State {
    recipes: Recipe[]
}

interface Param {
    payload: Recipe
}

const cardSlice = createSlice({
  name: 'card',

  initialState: {
    recipes: [],
  },

    reducers: {
        init: (state: State, param: Param) => {
            const { payload } = param;
            const tempState = state;
            tempState.recipes = [...state.recipes, payload];
        },
        addCard: (state: State, param: Param) => {
            const { payload } = param;
            const tempState = state;
            // fetch('/recipe/add', 
            //     {method: 'POST', 
            //     body: JSON.stringify(payload),
            //     headers: {
            //         'Content-type': 'application/json',
            //     }})
            //     .then(res => res.json())
            //     .then(data => console.log(data));
            tempState.recipes = [...state.recipes, payload]
        },
        updateCard: (state: State, param: Param) => {
            const { payload } = param;
            const tempState: Recipe[] = state.recipes;
            const tempStateMap: Recipe[] = tempState.map((recipe) => {
                if (recipe.id === payload.id) return payload;
                return recipe;
            })
        },
        deleteCard: (state: State, param: Param) => {
            const { payload } = param;
            const tempState = state;
            tempState.recipes = tempState.recipes.filter((recipe) => recipe.id !== payload.id)
        }
    }
})

const { actions, reducer } = cardSlice;
export const { init, addCard, updateCard, deleteCard } = actions;
export default reducer