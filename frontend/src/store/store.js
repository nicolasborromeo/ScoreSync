import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import catalogReducer from './tracks';
import imagesReducer from './images';
import cardsReducer from './cards';
import externalLinksReducer from './links';
import displayInfoReducer from './displayInfo'

const rootReducer = combineReducers({
  session: sessionReducer,
  catalog: catalogReducer,
  images: imagesReducer,
  cards: cardsReducer,
  links: externalLinksReducer,
  displayInfo: displayInfoReducer,
});

let enhancer;
if (import.meta.env.MODE === "production") {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = (await import("redux-logger")).default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
