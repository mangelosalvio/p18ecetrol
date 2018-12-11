import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { loginUser } from "./../actions/authActions";
import { connect } from "react-redux";
import TextFieldGroup from "./../commons/TextFieldGroup";

class LoginForm extends Component {
  state = {
    errors: {},
    username: "",
    password: ""
  };

  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = e => {
    e.preventDefault();

    const form_data = {
      username: this.state.username,
      password: this.state.password
    };

    this.props.loginUser(form_data, this.props.history);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentDidMount() {
    console.log(this.props.auth);
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/customers");
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="container">
        <form className="columns" onSubmit={this.onSubmit}>
          <div
            className="column box is-half is-offset-one-quarter"
            style={{ padding: "2rem" }}
          >
            <div
              className="has-text-centered has-text-weight-bold is-size-3"
              style={{ paddingBottom: "1rem" }}
            >
              SMART TROLLEY
            </div>
            <TextFieldGroup
              label="Username"
              name="username"
              value={this.state.username}
              onChange={this.onChange}
              error={errors.username}
            />

            <TextFieldGroup
              type="password"
              label="Password"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
              error={errors.password}
            />

            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary">Login</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.errors,
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { loginUser }
)(withRouter(LoginForm));
