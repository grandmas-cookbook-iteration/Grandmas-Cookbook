import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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


const cardSlice = createSlice({
  name: 'card',

  initialState: {
    recipes: [],
  },

    reducers: {
        init: (state: State, param: PayloadAction<Recipe[]>) => {
            const { payload } = param;
            state.recipes = [...state.recipes, ...payload];
        },
        addCard: (state: State, param: PayloadAction<Recipe>) => {
            const { payload } = param;
            // const tempState = state;
            // fetch('/recipe/add', 
            //     {method: 'POST', 
            //     body: JSON.stringify(payload),
            //     headers: {
            //         'Content-type': 'application/json',
            //     }})
            //     .then(res => res.json())
            //     .then(data => console.log(data));
            state.recipes = [...state.recipes, payload]
        },
        updateCard: (state: State, param: PayloadAction<Recipe>) => {
            const { payload } = param;
            // const tempState: Recipe[] = state.recipes;
            // const tempStateMap: Recipe[] = tempState.map((recipe) => {
            //     if (recipe.id === payload.id) return payload;
            //     return recipe;
            // })
            state.recipes = state.recipes.map((recipe) => {
                if(recipe.id === payload.id) return payload;
                return recipe;
            })
        },
        deleteCard: (state: State, param: PayloadAction<Recipe>) => {
            const { payload } = param;
            // const tempState = state;
            state.recipes = state.recipes.filter((recipe) => recipe.id !== payload.id)
        }
    }
})

const { actions, reducer } = cardSlice;
export const { init, addCard, updateCard, deleteCard } = actions;
export default reducer