import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import RegistrationForm from "../components/RegistrationForm";
import PrivateRoute from "../components/PrivateRoute";

import Products from "../components/products/Products";
import Users from "../components/utils/Users";
import UpdatePasswordForm from "../components/utils/UpdatePasswordForm";
import PublicRoute from "../components/PublicRoute";
import TrolleyRoute from "../components/TrolleyRoute";
import ScanItemForm from "../components/products/ScanItemForm";
import AddItemForm from "../components/products/AddItemForm";
import PutItemForm from "../components/products/PutItemForm";
import ItemAddedForm from "../components/products/ItemAddedForm";
import WeightInvalidForm from "../components/products/WeightInvalidForm";
import SiteMapForm from "../components/products/SiteMapForm";
import UpdateItemForm from "../components/products/UpdateItemForm";
import RemoveItemForm from "../components/products/RemoveItemForm";
import UpdateRemoveItemForm from "../components/products/UpdateRemoveItemForm";
import ScanCardForm from "../components/products/ScanCardForm";
import CashierScanCardForm from "../components/products/CashierScanCardForm";
import CashierPaymentForm from "../components/products/CashierPaymentForm";
import CashierChangeForm from "../components/products/CashierChangeForm";
import Sales from "../components/products/sales";

const AppRouter = () => (
  <BrowserRouter>
    <div>
      <Switch>
        <PublicRoute path="/" component={LoginForm} exact={true} />
        <Route path="/login" component={LoginForm} exact={true} />
        <PrivateRoute path="/products" component={Products} exact={true} />
        <PrivateRoute path="/users" component={Users} exact={true} />
        <PrivateRoute path="/sales" component={Sales} exact={true} />
        <PrivateRoute
          path="/cashier-scan"
          component={CashierScanCardForm}
          exact={true}
        />

        <PrivateRoute
          path="/cashier-payment"
          component={CashierPaymentForm}
          exact={true}
        />

        <PrivateRoute
          path="/cashier-change"
          component={CashierChangeForm}
          exact={true}
        />

        <PrivateRoute
          path="/update-password"
          component={UpdatePasswordForm}
          exact={true}
        />

        <TrolleyRoute path="/scan" component={ScanItemForm} exact={true} />
        <TrolleyRoute path="/add-item" component={AddItemForm} exact={true} />
        <TrolleyRoute
          path="/update-item"
          component={UpdateItemForm}
          exact={true}
        />
        <TrolleyRoute path="/put-item" component={PutItemForm} exact={true} />
        <TrolleyRoute
          path="/update-remove-item"
          component={UpdateRemoveItemForm}
          exact={true}
        />
        <TrolleyRoute
          path="/remove-item"
          component={RemoveItemForm}
          exact={true}
        />
        <TrolleyRoute path="/sitemap" component={SiteMapForm} exact={true} />
        <TrolleyRoute
          path="/weight-invalid"
          component={WeightInvalidForm}
          exact={true}
        />
        <TrolleyRoute
          path="/item-added"
          component={ItemAddedForm}
          exact={true}
        />
        <TrolleyRoute path="/scan-card" component={ScanCardForm} exact={true} />
      </Switch>

      <Route path="/register" component={RegistrationForm} exact={true} />
    </div>
  </BrowserRouter>
);

export default AppRouter;
