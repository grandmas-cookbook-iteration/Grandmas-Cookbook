import React from 'react';
import ReactDOM from 'react-dom'
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import App from './App';
import cardReducer, { State as CardState } from "./slices/cardSlice";
import modalReducer, { State as ModalState } from "./slices/modalSlice";
import styles from './scss/application.scss';

const rootReducer = combineReducers({
  card: cardReducer,
  modal: modalReducer,
});

const store = configureStore({
    reducer: rootReducer,
});

export type RootState = {
  card : CardState;
  modal : ModalState;
}
ReactDOM.render(
  <Provider store={store}>
    <App />    
  </Provider>,
  document.getElementById('root')
);
