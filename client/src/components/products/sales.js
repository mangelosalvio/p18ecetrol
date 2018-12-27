import React, { Component } from "react";

import axios from "axios";
import isEmpty from "../../validation/is-empty";
import MessageBoxInfo from "../../commons/MessageBoxInfo";
import Searchbar from "../../commons/Searchbar";
import "../../styles/Autosuggest.css";
import moment from "moment";
import { Layout, Breadcrumb } from "antd";
import numberFormat from "../../utils/numberFormat";
import { sumBy } from "lodash";
const { Content } = Layout;

const collection_name = "sales";

const form_data = {
  _id: "",

  or_no: "",
  datetime: null,
  items: [],
  uid: "",
  payment_amount: "",
  change: "",
  [collection_name]: [],

  errors: {}
};

class Sales extends Component {
  state = {
    title: "Sales",
    url: "/api/sales/",
    search_keyword: "",
    ...form_data
  };

  componentDidMount() {
    axios
      .get(this.state.url + "?s=" + this.state.search_keyword)
      .then(response =>
        this.setState({
          [collection_name]: response.data,
          message: isEmpty(response.data) ? "No rows found" : ""
        })
      )
      .catch(err => console.log(err));
  }

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
          [collection_name]: response.data,
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
            [collection_name]: [],
            ...record,
            errors: {}
          };
        });
      })
      .catch(err => console.log(err));
  };

  onHide = () => {
    this.setState({ message: "" });
  };

  render() {
    return (
      <Content style={{ padding: "0 50px" }}>
        <div className="columns is-marginless">
          <div className="column">
            <Breadcrumb style={{ margin: "16px 0" }}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Sales</Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="column">
            <Searchbar
              name="search_keyword"
              onSearch={this.onSearch}
              onChange={this.onChange}
              value={this.state.search_keyword}
              onNew={this.addNew}
              newButtonVisibility={false}
            />
          </div>
        </div>

        <div style={{ background: "#fff", padding: 24, minHeight: 280 }}>
          <span className="is-size-5">{this.state.title}</span> <hr />
          <MessageBoxInfo message={this.state.message} onHide={this.onHide} />
          {isEmpty(this.state[collection_name]) ? (
            <div>
              {!isEmpty(this.state._id) ? (
                <div>
                  <div className="columns">
                    <div className="column is-2">OR #</div>
                    <div className="column">{this.state.or_no}</div>
                  </div>
                  <div className="columns">
                    <div className="column is-2">Date/Time</div>
                    <div className="column is-8">
                      {moment(this.state.datetime).format("LLL")}
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <table className="table min-table full-width">
                        <thead>
                          <tr>
                            <th>QTY</th>
                            <th>PRODUCT</th>
                            <th className="has-text-right">PRICE</th>
                            <th className="has-text-right">TOTAL WEIGHT</th>
                            <th className="has-text-right">AMOUNT</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.state.items.map((item, index) => (
                            <tr key={index}>
                              <td>{item.quantity}</td>
                              <td>{item.product.name}</td>
                              <td className="has-text-right">
                                {numberFormat(item.product.price)}
                              </td>
                              <td className="has-text-right">
                                {numberFormat(
                                  item.product.weight * item.quantity
                                )}
                              </td>
                              <td className="has-text-right">
                                {numberFormat(item.amount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <thead>
                          <tr className="b-t-2">
                            <th>&nbsp;</th>
                            <th>&nbsp;</th>
                            <th>&nbsp;</th>
                            <th className="has-text-right">
                              {numberFormat(
                                sumBy(
                                  this.state.items,
                                  o => o.product.weight * o.quantity
                                )
                              )}
                            </th>
                            <th className="has-text-right">
                              {numberFormat(
                                sumBy(this.state.items, o => o.amount)
                              )}
                            </th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                  <div className="columns">
                    <div className="column">
                      <a
                        className="button is-danger is-outlined is-small"
                        onClick={this.onDelete}
                      >
                        <span>Delete</span>
                        <span className="icon is-small">
                          <i className="fas fa-times" />
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <table className="table is-fullwidth is-striped is-hoverable min-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>OR #</th>
                  <th>Date/Time</th>
                  <th>UID</th>
                  <th className="has-text-right">TOTAL AMOUNT</th>
                  <th className="has-text-right">PAYMENT AMOUNT</th>
                  <th className="has-text-right">CHANGE</th>
                </tr>
              </thead>
              <tbody>
                {this.state[collection_name].map((sales, index) => (
                  <tr key={sales._id} onClick={() => this.edit(sales)}>
                    <td>{index + 1}</td>
                    <td>{sales.or_no}</td>
                    <td>{moment(sales.datetime).format("LLL")}</td>
                    <td>{sales.uid}</td>
                    <td className="has-text-right">
                      {numberFormat(sumBy(sales.items, o => o.amount))}
                    </td>
                    <td className="has-text-right">
                      {numberFormat(sales.payment_amount)}
                    </td>
                    <td className="has-text-right">
                      {numberFormat(sales.change)}
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

export default Sales;
