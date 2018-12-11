import React, { Component } from "react";

import TextFieldGroup from "../../commons/TextFieldGroup";
import axios from "axios";
import isEmpty from "../../validation/is-empty";
import MessageBoxInfo from "../../commons/MessageBoxInfo";
import Searchbar from "../../commons/Searchbar";
import "../../styles/Autosuggest.css";

import { Layout, Breadcrumb } from "antd";
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

class Products extends Component {
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

    if (isEmpty(this.state._id)) {
      axios
        .put(this.state.url, this.state)
        .then(({ data }) =>
          this.setState({
            ...data,
            errors: {},
            message: "Transaction Saved"
          })
        )
        .catch(err => this.setState({ errors: err.response.data }));
    } else {
      axios
        .post(this.state.url + this.state._id, this.state)
        .then(({ data }) =>
          this.setState({
            ...data,
            errors: {},
            message: "Transaction Updated"
          })
        )
        .catch(err => this.setState({ errors: err.response.data }));
    }
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
    const { errors } = this.state;

    return (
      <Content style={{ padding: "0 50px" }}>
        <div className="columns is-marginless">
          <div className="column">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Products</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="column">
            <Searchbar
              name="search_keyword"
              onSearch={this.onSearch}
              onChange={this.onChange}
              value={this.state.search_keyword}
              onNew={this.addNew}
            />
          </div>
        </div>

        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <span className="is-size-5">{this.state.title}</span> <hr />
          <MessageBoxInfo message={this.state.message} onHide={this.onHide} />
          {isEmpty(this.state.products) ? (
            <form onSubmit={this.onSubmit}>
              <div>
                <TextFieldGroup
                  label="Product Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                  placeholder="555 Sardines"
                />

                <TextFieldGroup
                  label="Price"
                  name="price"
                  value={this.state.price}
                  onChange={this.onChange}
                  error={errors.price}
                  placeholder="e.g. 1,000.00"
                />

                <TextFieldGroup
                  label="Barcode"
                  name="barcode"
                  value={this.state.barcode}
                  onChange={this.onChange}
                  error={errors.barcode}
                  placeholder="e.g. 12345678"
                />

                <TextFieldGroup
                  label="Weight"
                  name="weight"
                  value={this.state.weight}
                  onChange={this.onChange}
                  error={errors.weight}
                  placeholder="kg"
                />

                <div className="field is-grouped">
                  <div className="control">
                    <button className="button is-primary is-small">Save</button>
                  </div>

                  {!isEmpty(this.state._id) ? (
                    <a
                      className="button is-danger is-outlined is-small"
                      onClick={this.onDelete}
                    >
                      <span>Delete</span>
                      <span className="icon is-small">
                        <i className="fas fa-times" />
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>
            </form>
          ) : (
            <table className="table is-fullwidth is-striped is-hoverable min-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Barcode</th>
                  <th className="has-text-right">Price</th>
                  <th className="has-text-right">Weight</th>
                </tr>
              </thead>
              <tbody>
                {this.state.products.map((product, index) => (
                  <tr key={product._id} onClick={() => this.edit(product)}>
                    <td>{index + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.barcode}</td>
                    <td className="has-text-right">
                      {numberFormat(product.price)}
                    </td>
                    <td className="has-text-right">
                      {numberFormat(product.weight)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Content>
    );
  }
}

export default Products;
