import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";
import "../../styles/Autosuggest.css";
import { sumBy } from "lodash";
import round from "./../../utils/round";
import {
  cancel,
  verifyWeight,
  updateItem
} from "./../../actions/trolleyActions";
import classnames from "classnames";
import { Layout, notification, message } from "antd";
import numberFormat from "../../utils/numberFormat";
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

class WeightInvalidForm extends Component {
  state = {
    title: "Products",
    url: "/api/products/",
    search_keyword: "",
    ...form_data
  };

  onTryAgain = () => {
    this.setState({ isLoading: true }, () => {
      let all_items = [];

      if (this.props.trolley.selected_index === null) {
        all_items = [
          ...this.props.trolley.items,
          this.props.trolley.selected_product
        ];
      } else {
        all_items = [...this.props.trolley.items];

        all_items[
          this.props.trolley.selected_index
        ] = this.props.trolley.selected_product;
      }

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
            if (this.props.trolley.selected_index === null) {
              this.props.verifyWeight(
                {
                  items: this.props.trolley.items,
                  selected_product: this.props.trolley.selected_product
                },
                this.props.history
              );
            } else {
              this.props.updateItem({
                items: this.props.trolley.items,
                selected_product: this.props.trolley.selected_product,
                index: this.props.trolley.selected_index,
                history: this.props.history
              });
            }
          } else {
            /**
             * Weight invalid
             */

            const audio = new Audio(weightInvalidAudio);
            audio.play();
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
              className="notification is-danger has-text-centered has-text-weight-bold"
              style={{ fontSize: "2rem" }}
            >
              WEIGHT INVALID
            </div>
            <div>
              <a
                className="button is-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={this.onTryAgain}
                disabled={this.state.isLoading}
              >
                Try again
              </a>

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
  { cancel, verifyWeight, updateItem }
)(withRouter(WeightInvalidForm));
