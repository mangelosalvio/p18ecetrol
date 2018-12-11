import React, { Component } from "react";
import { Menu, Icon } from "antd";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../actions/authActions";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

class TrolleyNavbar extends Component {
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
)(TrolleyNavbar);
