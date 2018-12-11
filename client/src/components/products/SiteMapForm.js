import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import sitemap from "./../../images/sitemap.jpg";

import "../../styles/Autosuggest.css";
import { sumBy } from "lodash";

import { Layout } from "antd";
import numberFormat from "../../utils/numberFormat";
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

class SiteMapForm extends Component {
  state = {
    title: "Products",
    url: "/api/products/",
    search_keyword: "",
    ...form_data
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();
  };

  onBack = () => {
    this.props.history.push("/scan");
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
                    <tr key={index}>
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
              className="content has-text-centered has-text-weight-bold"
              style={{ fontSize: "2rem" }}
            >
              <img src={sitemap} alt="Sitemap" />
            </div>
            <div>
              <a
                className="button is-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
                onClick={this.onBack}
              >
                Back
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

export default connect(mapStateToProps)(withRouter(SiteMapForm));
