import React, { Component } from "react";
import {
  verifyWeight,
  updateItem,
  cancel,
  setUID
} from "./../../actions/trolleyActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import classnames from "classnames";
import "../../styles/Autosuggest.css";
import { sumBy } from "lodash";
import { Layout, message } from "antd";
import numberFormat from "../../utils/numberFormat";
import scanCardAudio from "./../../assets/scan-card.mp3";
import axios from "axios";
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

class ScanCardForm extends Component {
  state = {
    title: "Products",
    url: "/api/products/",
    search_keyword: "",
    ...form_data
  };

  onScan = () => {
    this.setState(
      {
        isLoading: true
      },
      () => {
        new Audio(scanCardAudio).play();
        const loading = message.loading("Waiting...", 0);
        axios.get("/scan-trolley-card").then(response => {
          loading();
          const uid = response.data.uid
            .toString()
            .replace(/(\r\n\t|\n|\r\t)/gm, "")
            .trim();
          console.log(uid);
          this.props.setUID({
            history: this.props.history,
            uid
          });
        });
      }
    );
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
              style={{ fontSize: "2rem", padding: "5rem" }}
            >
              PLEASE SCAN CARD
            </div>
            <div>
              <a
                className="button is-primary"
                disabled={this.state.isLoading}
                style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={this.onScan}
              >
                Scan
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
    cancel,
    setUID
  }
)(withRouter(ScanCardForm));
