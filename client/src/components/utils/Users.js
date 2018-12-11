import React, { Component } from "react";
import TextFieldGroup from "../../commons/TextFieldGroup";
import axios from "axios";
import isEmpty from "../../validation/is-empty";
import MessageBoxInfo from "../../commons/MessageBoxInfo";
import Searchbar from "../../commons/Searchbar";
import { connect } from "react-redux";

const form_data = {
  _id: "",
  name: "",
  username: "",
  role: "",
  password: "",
  password_confirmation: "",
  logs: []
};

const collection_field = "users";

class Users extends Component {
  state = {
    title: "Users Master File",
    url: "/api/users/",
    search_keyword: "",
    errors: {},

    [collection_field]: [],

    ...form_data
  };

  componentDidMount() {
    axios
      .get(this.state.url + "?s=" + this.state.search_keyword)
      .then(response =>
        this.setState({
          users: response.data,
          message: isEmpty(response.data) ? "No rows found" : ""
        })
      )
      .catch(err => console.log(err));
  }

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSelectChange = name => {
    return value => {
      this.setState({ [name]: value });
    };
  };

  onSubmit = e => {
    e.preventDefault();
    const data = {
      ...this.state,
      user: this.props.auth.user
    };

    if (isEmpty(this.state._id)) {
      axios
        .put(this.state.url, data)
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
        .post(this.state.url + this.state._id, data)
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
          users: response.data,
          message: isEmpty(response.data) ? "No rows found" : ""
        })
      )
      .catch(err => console.log(err));
  };

  addNew = () => {
    this.setState({
      users: [],

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
        this.setState({
          [collection_field]: [],
          ...record,
          password: "",
          password_confirmation: ""
        });
      })
      .catch(err => console.log(err));
  };

  onDelete = () => {
    axios
      .delete(this.state.url + this.state._id)
      .then(response => {
        this.setState({
          ...form_data,
          message: "Transaction Deleted"
        });
      })
      .catch(err => console.log(err));
  };

  onHide = () => {
    this.setState({ message: "" });
  };

  render() {
    const { errors } = this.state;

    return (
      <div className="container">
        <Searchbar
          name="search_keyword"
          onSearch={this.onSearch}
          onChange={this.onChange}
          value={this.state.search_keyword}
        />

        <div className="box" style={{ marginTop: "1rem", marginRight: "1rem" }}>
          <span className="is-size-5 has-text-weight-bold">
            {this.state.title}
          </span>{" "}
          <button className="button is-small" onClick={this.addNew}>
            Add New
          </button>
          <hr />
          <MessageBoxInfo message={this.state.message} onHide={this.onHide} />
          {isEmpty(this.state[collection_field]) ? (
            <form onSubmit={this.onSubmit}>
              <div>
                <TextFieldGroup
                  label="Name"
                  name="name"
                  value={this.state.name}
                  onChange={this.onChange}
                  error={errors.name}
                />

                <TextFieldGroup
                  label="Username"
                  name="username"
                  value={this.state.username}
                  onChange={this.onChange}
                  error={errors.username}
                />

                <TextFieldGroup
                  label="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />

                <TextFieldGroup
                  label="Password Confirmation"
                  type="password"
                  name="password_confirmation"
                  value={this.state.password_confirmation}
                  onChange={this.onChange}
                  error={errors.password_confirmation}
                />

                <div className="field is-grouped">
                  <div className="control">
                    <button className="button is-primary">Save</button>
                  </div>

                  {!isEmpty(this.state._id) ? (
                    <a
                      className="button is-danger is-outlined"
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
                  <th>Name</th>
                  <th>Username</th>
                </tr>
              </thead>
              <tbody>
                {this.state.users.map((user, index) => (
                  <tr key={user._id} onClick={() => this.edit(user)}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }
}

const mapToState = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapToState)(Users);
