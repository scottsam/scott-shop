import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Register from "./Pages/Register";
import Login from "./Pages/Login";
import CreateProduct from "./Pages/CreateProduct";

import Category from "./Pages/CreateCategory";
import Header from "./Components/HeaderNav";
import Footer from "./Components/Footer";
import ProductListPage from "./Pages/ProductListPage";
import ProductPage from "./Pages/ProductPage";
import HomePage from "./Pages/HomePage";
import ProductEditScreen from "./Pages/ProductEdit";
import Cart from "./Pages/Cart";
import PlaceOrder from "./Pages/PlaceOrder";
import PaymentPage from "./Pages/PaymentPage";
import OrderPage from "./Pages/OrderPage";
import ShippingPage from "./Pages/ShippingPage";
import OrderListPage from "./Pages/OrderListPage";
import Profile from "./Pages/Profile";
import UserListPage from "./Pages/UserListpage";
import UserEditPage from "./Pages/UserEditPage";
import ProfileUpdate from "./Pages/ProfileUpdate";
import CategoryPage from "./Pages/CategoryPage";
import Landing from "./Pages/Landing";

const App = () => {
  //let header = window.location.pathname !== "/" ? <Header /> : null;
  //let footer = window.location.pathname !== "/" ? <Footer /> : null;
  return (
    <div>
      <BrowserRouter>
        {header}
        <main className="py-0">
          <Switch>
            <Route path="/payment" component={PaymentPage} />
            <Route path="/category/:categoryId" component={CategoryPage} />
            <Route path="/placeorder" component={PlaceOrder} />
            <Route path="/shipping" component={ShippingPage} />

            <Route path="/placeorder" component={PlaceOrder} />

            <Route path="/cart/:productId" component={Cart} />

            <Route path="/product/:productId" component={ProductPage} />
            {/*  */}

            <Route
              path="/admin/productlist"
              component={ProductListPage}
              exact
            />
            <Route
              path="/admin/productlist/:pageNumber"
              component={ProductListPage}
              exact
            />
            <Route
              path="/admin/product/create"
              component={CreateProduct}
              exact
            />
            <Route path="/admin/category/create" component={Category} exact />
            <Route path="/admin/orderlist" component={OrderListPage} />
            <Route path="/admin/order/:orderId" component={OrderPage} />
            <Route path="/order/:orderId" component={OrderPage} exact />
            <Route
              path="/admin/product/:productId/edit"
              component={ProductEditScreen}
            />
            <Route path="/admin/userlist" component={UserListPage} exact />
            <Route
              path="/admin/user/:userId/edit"
              component={UserEditPage}
              exact
            />

            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/update-profile" component={ProfileUpdate} exact />
            <Route path="/search/:keyword" component={HomePage} exact />
            <Route
              path="/search/:keyword/page/:pageNumber"
              component={HomePage}
            />
            <Route path="/page/:pageNumber" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Route path="/" component={Landing} exact />
          </Switch>
        </main>
        {footer}
      </BrowserRouter>
    </div>
  );
};

export default App;
