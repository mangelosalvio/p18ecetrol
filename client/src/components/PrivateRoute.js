import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Navbar from "./Navbar";

import { Layout } from "antd";

const { Header, Footer } = Layout;

const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Layout className="layout">
    <Header>
      <div className="logo" />
      <Navbar />
    </Header>

    <Route
      {...rest}
      render={props =>
        auth.isAuthenticated === true ? (
          <Component {...props} />
        ) : (
          <Redirect to="/login" />
        )
      }
    />

    <Footer style={{ textAlign: "center" }}>
      Smart Trolley ©2018 Created by Casugod, Genada, Calzado, Dellima ,and
      Walawad
    </Footer>
  </Layout>
);

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
