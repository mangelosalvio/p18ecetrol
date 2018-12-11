import React, { Component } from "react";
import axios from "axios";
import isEmpty from "../../validation/is-empty";
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

class ItemAddedForm extends Component {
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

  onSearch = e => {
    e.preventDefault();

    axios
      .get(this.state.url + "?s=" + this.state.search_keyword)
      .then(response =>
        this.setState({
          products: response.data,
          message: isEmpty(response.data) ? "No rows found" : ""
        })
      )
      .catch(err => console.log(err));
  };

  addNew = () => {
    this.setState({
      ...form_data,
      errors: {},
      message: ""
    });
  };

  edit = record => {
    axios
      .get(this.state.url + record._id)
      .then(response => {
        const record = response.data;
        this.setState(prevState => {
          return {
            products: [],
            ...record,
            errors: {}
          };
        });
      })
      .catch(err => console.log(err));
  };

  onDelete = () => {
    axios
      .delete(this.state.url + this.state._id)
      .then(response => {
        this.setState({
          _id: "",
          name: "",
          price: "",
          category_name: "",
          category: {},
          message: "Transaction Deleted"
        });
      })
      .catch(err => console.log(err));
  };

  onHide = () => {
    this.setState({ message: "" });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    axios
      .get("/api/categories/?s=" + value)
      .then(response => this.setState({ categories: response.data }))
      .catch(err => console.log(err));
  };

  onSuggestionsClearRequested = () => {
    this.setState({ categories: [] });
  };

  renderSuggestion = suggestion => <div>{suggestion.name}</div>;

  onCategoryChange = (event, { newValue, method }) => {
    this.setState({ category_name: newValue });
  };

  onSuggestionSelected = (event, { suggestion }) => {
    event.preventDefault();
    this.setState({ category: suggestion });
  };

  getSuggestionValue = suggestion => suggestion.name;

  render() {
    const items = [
      {
        product: {
          name: "555 Tuna Sardines",
          price: 24
        },
        quantity: 1,
        amount: 24
      },
      {
        product: {
          name: "Tide Powder 330g",
          price: 330
        },
        quantity: 2,
        amount: 660
      },
      {
        product: {
          name: "555 Tuna Sardines",
          price: 24
        },
        quantity: 1,
        amount: 24
      },
      {
        product: {
          name: "Tide Powder 330g",
          price: 330
        },
        quantity: 2,
        amount: 660
      },
      {
        product: {
          name: "555 Tuna Sardines",
          price: 24
        },
        quantity: 1,
        amount: 24
      },
      {
        product: {
          name: "Tide Powder 330g",
          price: 330
        },
        quantity: 2,
        amount: 660
      },
      {
        product: {
          name: "555 Tuna Sardines",
          price: 24
        },
        quantity: 1,
        amount: 24
      },
      {
        product: {
          name: "Tide Powder 330g",
          price: 330
        },
        quantity: 2,
        amount: 660
      },
      {
        product: {
          name: "555 Tuna Sardines",
          price: 24
        },
        quantity: 1,
        amount: 24
      },
      {
        product: {
          name: "Tide Powder 330g",
          price: 330
        },
        quantity: 2,
        amount: 660
      },
      {
        product: {
          name: "555 Tuna Sardines",
          price: 24
        },
        quantity: 1,
        amount: 24
      },
      {
        product: {
          name: "Tide Powder 330g",
          price: 330
        },
        quantity: 2,
        amount: 660
      }
    ];

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
              className="notification is-success has-text-centered has-text-weight-bold"
              style={{ fontSize: "2rem" }}
            >
              ITEM SUCCESSFULLY ADDED
            </div>
            <div>
              <a
                className="button is-primary"
                style={{ width: "100%", marginTop: "0.5rem" }}
              >
                Next
              </a>
            </div>
          </div>
        </div>
      </Content>
    );
  }
}

export default ItemAddedForm;
