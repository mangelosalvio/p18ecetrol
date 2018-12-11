import React, { Component } from "react";
import {
  scanItem,
  selectItem,
  clearCart
} from "./../../actions/trolleyActions";
import "../../styles/Autosuggest.css";
import { sumBy } from "lodash";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Layout } from "antd";
import numberFormat from "../../utils/numberFormat";
import classnames from "classnames";
import { message } from "antd";
import scanAudio from "./../../assets/scan.mp3";
import emptyAudio from "./../../assets/empty-cart.mp3";
import paymentAudio from "./../../assets/payment.mp3";
import axios from "axios";
import isEmpty from "../../validation/is-empty";

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

class ScanItemForm extends Component {
  state = {
    title: "Products",
    url: "/api/products/",
    search_keyword: "",
    ...form_data
  };

  componentDidMount() {
    if (isEmpty(this.props.trolley.uid)) {
      this.props.history.push("/scan-card");
    }

    this.barcode_input.focus();

    let audio = new Audio(scanAudio);
    audio.play();
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
    this.props
      .scanItem(this.state.barcode, this.props.history)
      .then(response => {
        //this.props.history("/add-item");
      })
      .catch(err => {
        message.error("Barcode not found");
        this.setState({ barcode: "" });
      });
  };

  onListDirectory = () => {
    this.props.history.push("/sitemap");
  };

  onItemPressed = ({ item, index }) => {
    this.props.selectItem({
      item,
      index,
      history: this.props.history
    });
  };

  onFinish = () => {
    if (this.props.trolley.items.length <= 0) {
      let audio = new Audio(emptyAudio);
      audio.play();
      return;
    }

    const form_data = {
      items: this.props.trolley.items,
      uid: this.props.trolley.uid
    };

    const loading = message.loading("Processing...", 0);
    axios
      .put("/api/orders", form_data)
      .then(response => {
        loading();
        let audio = new Audio(paymentAudio);
        audio.play();
        this.props.clearCart(this.props.history);
      })
      .catch(err => console.log(err));
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
                      onClick={() => this.onItemPressed({ item, index })}
                      className={classnames("", {
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
            <div className="field">
              <form onSubmit={this.onSubmit}>
                <input
                  type="text"
                  className="input"
                  name="barcode"
                  value={this.state.barcode}
                  onChange={this.onChange}
                  ref={input => (this.barcode_input = input)}
                  autoComplete="off"
                />
              </form>
            </div>

            <div
              className="notification is-info has-text-centered"
              style={{ fontSize: "2rem" }}
              onClick={() =>
                this.setState({ barcode: "" }, () => {
                  this.barcode_input.focus();
                })
              }
            >
              PLEASE SCAN ITEM
            </div>
            <div>
              <a
                className="button"
                style={{ width: "100%" }}
                onClick={this.onListDirectory}
              >
                List Directory
              </a>
              <a
                className="button is-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={this.onFinish}
              >
                Finish
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
    scanItem,
    selectItem,
    clearCart
  }
)(withRouter(ScanItemForm));
