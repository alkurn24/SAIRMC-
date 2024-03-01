import React, { Component } from "react";

import ProductListComponent from "../components/ProductListComponent.jsx";

class ProductListPage extends Component {
   render() {
      return (
         <ProductListComponent {...this.props}></ProductListComponent>
      );
   }
}

export default ProductListPage;
