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
} from "./types";
import axios from "axios";
import round from "../utils/round";

export const setChange = ({
  history,
  items,
  uid,
  change,
  payment_amount
}) => dispatch => {
  const form_data = {
    items,
    uid,
    change,
    payment_amount
  };

  axios
    .put("/api/sales", form_data)
    .then(response => {
      dispatch({
        type: SAVE_SALE,
        payload: {
          items,
          uid,
          change
        }
      });
      history.push("/cashier-change");
    })
    .catch(err => console.log(err));
};

export const setOrder = ({ history, items, uid }) => dispatch => {
  dispatch({
    type: SET_ORDER,
    payload: {
      items,
      uid
    }
  });
  history.push("/cashier-payment");
};

export const clearCart = history => dispatch => {
  dispatch({
    type: CLEAR_CART
  });
  history.push("/scan-card");
};
export const setUID = ({ history, uid }) => dispatch => {
  dispatch({
    type: SET_UID,
    payload: {
      uid
    }
  });

  history.push("/scan");
};

export const cancel = history => dispatch => {
  dispatch({
    type: CANCEL
  });
  history.push("/scan");
};

export const deleteItem = ({ items, index, history }) => dispatch => {
  const new_items = [...items];
  new_items.splice(index, 1);

  dispatch({
    type: UPDATE_ITEMS,
    payload: {
      items: new_items
    }
  });

  history.push("/scan");
};

export const updateItem = ({
  items,
  selected_product,
  index,
  history
}) => dispatch => {
  const new_items = [...items];
  new_items[index] = selected_product;

  dispatch({
    type: UPDATE_ITEMS,
    payload: {
      items: new_items
    }
  });

  history.push("/scan");
};

export const selectItem = ({ item, index, history }) => dispatch => {
  dispatch({
    type: SELECT_ITEM,
    payload: {
      item,
      index
    }
  });
  history.push("/update-item");
};

export const scanItem = (barcode, history) => dispatch => {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/products/barcode", { barcode })
      .then(response => {
        dispatch({
          type: SCAN_ITEM,
          payload: {
            product: response.data,
            quantity: 1
          }
        });
        history.push("/add-item");
        resolve();
      })
      .catch(err => reject());
  });
};

export const incrementQuantity = selected_product => {
  const quantity = parseFloat(selected_product.quantity) + 1;
  const product = {
    ...selected_product,
    quantity
  };

  return {
    type: UPDATE_QUANTITY,
    payload: product
  };
};

export const decrementQuantity = selected_product => {
  let quantity = parseFloat(selected_product.quantity) - 1;
  quantity = quantity <= 0 ? 1 : quantity;
  const product = {
    ...selected_product,
    quantity
  };

  return {
    type: UPDATE_QUANTITY,
    payload: product
  };
};

export const verifyWeight = (
  { items, selected_product },
  history
) => dispatch => {
  const new_selected_product = {
    ...selected_product,
    amount: round(selected_product.product.price * selected_product.quantity)
  };
  const new_items = [new_selected_product, ...items];

  dispatch({
    type: ADD_ITEM,
    payload: new_items
  });

  history.push("/scan");
};
