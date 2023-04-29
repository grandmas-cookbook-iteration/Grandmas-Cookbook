import RecipeCard, { RecipeProps } from './recipeCard';
import { Provider } from 'react-redux';
import React, { FC } from "react";
// import { render, fireEvent, waitForElement } from "@testing-library/react";
import { render, fireEvent, waitFor, screen, getByText } from "@testing-library/react";
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import cardReducer, { State as CardState } from "../slices/cardSlice";
import modalReducer, { State as ModalState } from "../slices/modalSlice";

// export interface RecipeProps {
//   recipe: Recipe;
//   // children: any; // FIXME: Type?
//   type: String;
//   addHandler: ((recipe: Recipe) => () => void);
//   title: String; // FIXME: we're not using this prop, should we remove it from cardGrid?
//   // image: String; // FIXME: we're not using this prop, should we remove it from cardGrid?
//   cardId: String;
//   onDelete: (recipe: Recipe) => void;
// };

const renderRecipeCard = (props: Partial<RecipeProps> = {}) => {

  const defaultProps: RecipeProps = {
    recipe: {
      imagePath: 'path',
      id: 1, 
      title: 'title 20230429',
      image: new Blob(["<html>…</html>"], {type: 'text/html'}),
      ingredientList: ['ingredient 1, ingredient 2, ingredient 3'],
      directions: ['directions 1', 'directions 2', 'directsion 3'],
      imagepath: 'imagepath'
    },
    type: 'type',
    addHandler: (recipe) => () => undefined,
    title: 'title',
    cardId: 'cardId',
    onDelete: (recipe) => undefined
  }

  const mockStore = configureStore({
    reducer: combineReducers({
      card: cardReducer,
      modal: modalReducer
    })
  });

  return render(
    <Provider store={mockStore}>
      <RecipeCard { ...defaultProps } { ...props } />
    </Provider>
  )
}


describe("<RecipeCard />", () => {
  let card;

  beforeAll(() => {
    card = renderRecipeCard();
  });

  test("should display a card", () => {
    // ???
    const { getAllByText } = renderRecipeCard();
    expect(getAllByText('title 20230429', {exact: true}));
  });
});


