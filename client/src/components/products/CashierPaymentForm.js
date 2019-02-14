import React, { Component } from "react";
import {
  verifyWeight,
  updateItem,
  cancel,
  setUID,
  setOrder,
  setChange,
  selectCashierItem,
  incrementQuantity,
  decrementQuantity,
  updateCashierItem,
  deleteCashierItem,
  clearCashierCart
} from "./../../actions/trolleyActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import isEmpty from "../../validation/is-empty";
import "../../styles/Autosuggest.css";
import { sumBy } from "lodash";
import { Layout, message, Modal, Button } from "antd";
import numberFormat from "../../utils/numberFormat";
import round from "../../utils/round";

const { Content } = Layout;

const collection_name = "products";

const form_data = {
  _id: "",
  name: "",
  price: "",
  barcode: "",
  weight: "",
  [collection_name]: [],
  isLoading: false,
  payment_amount: "",

  update_modal_visible: false,

  errors: {}
};

class CashierScanCardForm extends Component {
  state = {
    title: "Products",
    url: "/api/products/",
    search_keyword: "",
    ...form_data
  };

  componentDidMount() {
    if (this.props.trolley.items.length <= 0) {
      this.props.history.push("/cashier-scan");
    }
  }
  onBack = () => {
    this.props.clearCashierCart();
    this.props.history.push("/cashier-scan");
  };

  onProcess = () => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        const total_amount = round(
          sumBy(this.props.trolley.items, item => {
            return item.amount;
          })
        );

        if (isEmpty(this.state.payment_amount)) {
          message.error("Input is invalid");
          this.setState({ isLoading: false });
          return;
        }

        if (parseFloat(this.state.payment_amount) < total_amount) {
          message.error("Invalid payment amount");
          this.setState({ isLoading: false });
          return;
        }

        const change = round(this.state.payment_amount - total_amount);

        this.setState({ isLoading: false });

        this.props.setChange({
          history: this.props.history,
          items: this.props.trolley.items,
          uid: this.props.trolley.uid,
          change,
          payment_amount: this.state.payment_amount
        });
      }
    );
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleUpdate = () => {
    console.log("update");
  };
  handleDelete = () => {
    console.log("delete");
  };
  handleCancel = () => {
    this.setState({ update_modal_visible: false });
  };

  openUpdateItemForm = (item, index) => {
    console.log(item, index);
    this.props.selectCashierItem({ item, index });
    this.setState({ update_modal_visible: true });
  };

  onIncrementQuantity = () => {
    this.props.incrementQuantity(this.props.trolley.selected_product);
  };

  onDecrementQuantity = () => {
    this.props.decrementQuantity(this.props.trolley.selected_product);
  };

  onUpdate = () => {
    this.props.updateCashierItem({
      items: this.props.trolley.items,
      selected_product: this.props.trolley.selected_product,
      index: this.props.trolley.selected_index
    });
    this.setState({ update_modal_visible: false });
  };

  onDelete = () => {
    this.props.deleteCashierItem({
      items: this.props.trolley.items,
      index: this.props.trolley.selected_index
    });
    this.setState({ update_modal_visible: false });
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
                      onClick={() => this.openUpdateItemForm(item, index)}
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
              <input
                type="number"
                className="input"
                onChange={this.onChange}
                name="payment_amount"
                value={this.state.payment_amount}
              />
            </div>

            <div>
              <a
                className="button is-primary"
                disabled={this.state.isLoading}
                style={{ width: "100%", marginTop: "0.5rem", padding: "2rem" }}
                onClick={this.onProcess}
              >
                Process
              </a>

              <a
                className="button is-info"
                style={{ width: "100%", marginTop: "0.5rem", padding: "2rem" }}
                onClick={this.onBack}
              >
                Back
              </a>
            </div>
          </div>
          <Modal
            title={
              this.props.trolley.selected_product &&
              this.props.trolley.selected_product.product &&
              this.props.trolley.selected_product.product.name
            }
            visible={this.state.update_modal_visible}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.onDelete}>
                Delete
              </Button>,
              <Button key="submit" type="primary" onClick={this.onUpdate}>
                Update
              </Button>
            ]}
          >
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
          </Modal>
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
    verifyWeight,
    updateItem,
    cancel,
    setUID,
    setOrder,
    setChange,
    selectCashierItem,
    incrementQuantity,
    decrementQuantity,
    updateCashierItem,
    deleteCashierItem,
    clearCashierCart
  }
)(withRouter(CashierScanCardForm));
