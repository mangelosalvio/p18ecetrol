import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../actions/authActions";

class Navbar extends Component {
  onLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;

    return (
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={["1"]}
        style={{ lineHeight: "64px" }}
      >
        <Menu.Item>
          <span>SMART TROLLEY</span>
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/products">
            <Icon type="shopping-cart" />
            Products
          </Link>
        </Menu.Item>
        <Menu.Item key="2">
          <Link to="/users">
            <Icon type="team" />
            Users
          </Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/cashier-scan">
            <Icon type="shopping-cart" />
            Cashier
          </Link>
        </Menu.Item>

        <Menu.Item style={{ float: "right" }} onClick={this.onLogout}>
          Logout
        </Menu.Item>
        <Menu.Item style={{ float: "right" }}>
          <Icon type="user" /> {user.name}
        </Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(
  mapStateToProps,
  { logoutUser }
)(Navbar);
