import {
  SCAN_ITEM,
  UPDATE_QUANTITY,
  ADD_ITEM,
  SELECT_ITEM,
  UPDATE_ITEMS,
  CANCEL,
  SET_UID,
  CLEAR_CART,
  SET_ORDER,
  SAVE_SALE
} from "./../actions/types";

const defaultState = {
  items: [],
  selected_product: {},
  selected_index: null,
  uid: null,
  change: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SAVE_SALE:
      return {
        ...state,
        items: [],
        uid: null,
        change: action.payload.change
      };
    case SET_ORDER:
      return {
        ...state,
        items: action.payload.items,
        uid: action.payload.uid
      };
    case CLEAR_CART:
      return {
        ...state,
        items: [],
        selected_product: {},
        selected_index: null,
        uid: null
      };
    case SET_UID:
      return {
        ...state,
        uid: action.payload.uid
      };
    case CANCEL:
      return {
        ...state,
        selected_index: null,
        selected_product: {}
      };
    case UPDATE_ITEMS:
      return {
        ...state,
        selected_index: null,
        items: action.payload.items
      };
    case SELECT_ITEM:
      return {
        ...state,
        selected_product: action.payload.item,
        selected_index: action.payload.index
      };
    case SCAN_ITEM:
      return {
        ...state,
        selected_product: action.payload
      };

    case UPDATE_QUANTITY:
      return {
        ...state,
        selected_product: action.payload
      };

    case ADD_ITEM:
      return {
        ...state,
        selected_product: {},
        items: action.payload,
        selected_index: null
      };

    default:
      return state;
  }
};
