import React, { Component } from "react";
import {
  incrementQuantity,
  decrementQuantity,
  updateItem,
  cancel
} from "./../../actions/trolleyActions";
import isEmpty from "../../validation/is-empty";
import "../../styles/Autosuggest.css";
import { sumBy } from "lodash";
import classnames from "classnames";
import { Layout } from "antd";
import numberFormat from "../../utils/numberFormat";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import putItemAudio from "./../../assets/put-item.mp3";
import removeItemAudio from "./../../assets/remove-item.mp3";

const { Content } = Layout;

const collection_name = "products";

const form_data = {
  _id: "",
  name: "",
  price: "",
  barcode: "",
  weight: "",
  [collection_name]: [],

  errors: {}
};

class UpdateItemForm extends Component {
  state = {
    title: "Products",
    url: "/api/products/",
    search_keyword: "",
    ...form_data
  };

  componentDidMount = () => {
    if (isEmpty(this.props.trolley.selected_product)) {
      this.props.history.push("/scan");
    }
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
  };

  onIncrementQuantity = () => {
    this.props.incrementQuantity(this.props.trolley.selected_product);
  };

  onDecrementQuantity = () => {
    this.props.decrementQuantity(this.props.trolley.selected_product);
  };

  onUpdate = () => {
    const old_quantity = parseFloat(
      this.props.trolley.items[this.props.trolley.selected_index].quantity
    );
    const new_quantity = parseFloat(
      this.props.trolley.selected_product.quantity
    );

    if (old_quantity < new_quantity) {
      this.props.history.push("/put-item");
      new Audio(putItemAudio).play();
    } else if (old_quantity > new_quantity) {
      this.props.history.push("/update-remove-item");
      new Audio(removeItemAudio).play();
    } else {
      this.props.cancel(this.props.history);
    }
  };

  onDelete = () => {
    this.props.history.push("/remove-item");
    new Audio(removeItemAudio).play();
  };

  onCancel = () => {
    this.props.cancel(this.props.history);
  };

  render() {
    const items = this.props.trolley.items;
    return (
      <Content style={{ padding: "0 24px" }}>
        <div className="columns is-marginless is-mobile">
          <div
            style={{
              background: "#fff",
              padding: 8,
              height: "440px",
              marginTop: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              overflow: "hidden"
            }}
            className="column"
          >
            <table
              style={{ flex: 0, padding: 0, margin: 0 }}
              className="min-table table full-width"
            >
              <thead>
                <tr>
                  <th>NAME</th>
                  <th style={{ width: "60px" }}>AMOUNT</th>
                </tr>
              </thead>
            </table>
            <div style={{ flex: 7, overflow: "auto" }}>
              <table className="table min-table full-width">
                <tbody>
                  {items.map((item, index) => (
                    <tr
                      key={index}
                      className={classnames({
                        "is-selected":
                          this.props.trolley.selected_index === index
                      })}
                    >
                      <td>
                        <span className="has-text-weight-bold">
                          {item.product.name}
                        </span>{" "}
                        {item.quantity > 1 && (
                          <div>
                            {item.quantity} @ {numberFormat(item.product.price)}
                          </div>
                        )}
                      </td>
                      <td className="has-text-right">
                        {numberFormat(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="has-text-right has-text-weight-bold"
              style={{ borderTop: "3px solid #000", flex: 0 }}
            >
              {numberFormat(sumBy(items, o => o.amount))}
            </div>
          </div>

          <div className="column" style={{ marginTop: "32px", paddingTop: 0 }}>
            <div>
              <span className="is-size-5 has-text-weight-bold">
                {!isEmpty(this.props.trolley.selected_product) &&
                  this.props.trolley.selected_product.product.name}
              </span>
            </div>
            <div className="">
              Php{" "}
              {!isEmpty(this.props.trolley.selected_product) &&
                numberFormat(this.props.trolley.selected_product.product.price)}
            </div>
            <div className="" style={{ marginTop: "1rem" }}>
              <div className="field has-addons">
                <p className="control">
                  <a className="button" onClick={this.onDecrementQuantity}>
                    <span className="icon is-small">
                      <i className="fas fa-minus" />
                    </span>
                  </a>
                </p>
                <p className="control" style={{ width: "60px" }}>
                  <input
                    type="text"
                    className="input"
                    readOnly={true}
                    value={this.props.trolley.selected_product.quantity}
                  />
                </p>
                <p className="control">
                  <a className="button" onClick={this.onIncrementQuantity}>
                    <span className="icon is-small">
                      <i className="fas fa-plus" />
                    </span>
                  </a>
                </p>
              </div>
            </div>

            <div>
              <a
                className="button"
                style={{ width: "100%", marginTop: "2rem" }}
                onClick={this.onUpdate}
              >
                Update
              </a>
              <a
                className="button is-danger"
                style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={this.onDelete}
              >
                Delete
              </a>
              <a
                className="button is-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={this.onCancel}
              >
                Cancel
              </a>
            </div>
          </div>
        </div>
      </Content>
    );
  }
}

const mapStateToProps = state => {
  return {
    trolley: state.trolley
  };
};

export default connect(
  mapStateToProps,
  {
    incrementQuantity,
    decrementQuantity,
    updateItem,
    cancel
  }
)(withRouter(UpdateItemForm));
