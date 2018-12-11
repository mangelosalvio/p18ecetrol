import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import userReducer from "./../reducers/users";
import thunk from "redux-thunk";
import trolleyReducer from "../reducers/trolleyReducer";

const initialState = {};
const middleware = [thunk];

const composeEnhancers =
  typeof window === "object" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
      })
    : compose;

const store = createStore(
  combineReducers({
    auth: userReducer,
    trolley: trolleyReducer
  }),
  initialState,
  composeEnhancers(applyMiddleware(...middleware))
);

export default store;
