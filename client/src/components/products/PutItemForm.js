import React, { Component } from "react";
import {
  verifyWeight,
  updateItem,
  cancel
} from "./../../actions/trolleyActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import isEmpty from "../../validation/is-empty";
import "../../styles/Autosuggest.css";
import { sumBy } from "lodash";
import { Layout, message, notification } from "antd";
import numberFormat from "../../utils/numberFormat";
import axios from "axios";
import round from "./../../utils/round";
import weightInvalidAudio from "./../../assets/weight-invalid.mp3";
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

  errors: {}
};

class PutItemForm extends Component {
  state = {
    title: "Products",
    url: "/api/products/",
    search_keyword: "",
    ...form_data
  };

  componentDidMount() {
    if (isEmpty(this.props.trolley.selected_product)) {
      this.props.history.push("/scan-card");
    }
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
  };

  onDone = () => {
    this.setState({ isLoading: true }, () => {
      const all_items = [
        ...this.props.trolley.items,
        this.props.trolley.selected_product
      ];

      const total_weight = sumBy(all_items, o =>
        round(o.product.weight * o.quantity)
      );
      const min_weight = total_weight * 0.9;
      const max_weight = total_weight * 1.1;

      const loading = message.loading("Getting weight...", 0);
      axios.get("/weight").then(response => {
        this.setState({ isLoading: false }, () => {
          loading();
          const actual_weight = response.data.weight;

          if (min_weight <= actual_weight && actual_weight <= max_weight) {
            this.props.verifyWeight(
              {
                items: this.props.trolley.items,
                selected_product: this.props.trolley.selected_product
              },
              this.props.history
            );
          } else {
            /**
             * Weight is invalid
             */

            const audio = new Audio(weightInvalidAudio);
            audio.play();
            this.props.history.push("weight-invalid");
            notification.open({
              message: "Weight Invalid",
              description: `Weight supplied is invalid. Actual weight is ${round(
                actual_weight
              )} meanwhile estimated weight is ${round(total_weight)} `
            });
          }
        });
      });
    });
  };

  onUpdate = () => {
    this.setState({ isLoading: true }, () => {
      const all_items = [...this.props.trolley.items];

      all_items[
        this.props.trolley.selected_index
      ] = this.props.trolley.selected_product;

      const total_weight = sumBy(all_items, o =>
        round(o.product.weight * o.quantity)
      );
      const min_weight = total_weight * 0.9;
      const max_weight = total_weight * 1.1;

      const loading = message.loading("Getting weight...", 0);
      axios.get("/weight").then(response => {
        this.setState({ isLoading: false }, () => {
          loading();
          const actual_weight = response.data.weight;

          if (min_weight <= actual_weight && actual_weight <= max_weight) {
            this.props.updateItem({
              items: this.props.trolley.items,
              selected_product: this.props.trolley.selected_product,
              index: this.props.trolley.selected_index,
              history: this.props.history
            });
          } else {
            this.props.history.push("weight-invalid");
            notification.open({
              message: "Weight Invalid",
              description: `Weight supplied is invalid. Actual weight is ${round(
                actual_weight
              )} meanwhile estimated weight is ${round(total_weight)} `
            });
          }
        });
      });
    });
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
            <div
              className="notification is-info has-text-centered has-text-weight-bold"
              style={{ fontSize: "2rem" }}
            >
              PLEASE PUT ITEM(S) ON TROLLEY
            </div>
            <div>
              {!isEmpty(this.props.trolley.selected_index) && (
                <a
                  className="button is-primary"
                  style={{ width: "100%", marginTop: "0.5rem" }}
                  onClick={this.onUpdate}
                >
                  Update
                </a>
              )}

              {isEmpty(this.props.trolley.selected_index) && (
                <a
                  className="button is-primary"
                  style={{ width: "100%", marginTop: "0.5rem" }}
                  onClick={this.onDone}
                  disabled={this.state.isLoading}
                >
                  Add
                </a>
              )}
            </div>
            <div>
              <a
                className="button is-danger"
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
    verifyWeight,
    updateItem,
    cancel
  }
)(withRouter(PutItemForm));
