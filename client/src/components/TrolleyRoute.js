import React from "react";
import { connect } from "react-redux";

import { Layout } from "antd";

const TrolleyRoute = ({ component: Component, auth, ...rest }) => (
  <Layout className="layout">
    {/* <Header>
      <div className="logo" />
      <TrolleyNavbar />
    </Header> */}

    <Component {...rest} />

    {/* <Footer style={{ textAlign: "center" }}>
      Smart Trolley ©2018 Created by Casugod, Genada, Calzado, Dellima ,and
      Walawad
    </Footer> */}
  </Layout>
);

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(TrolleyRoute);
