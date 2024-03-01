import React, { Component } from "react";
import { Pagination } from "react-bootstrap";

class PaginationBorder extends Component {
  render() {
    return (
      <div className="content">
        <Pagination>
          <Pagination.First />
          <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Item>{2}</Pagination.Item>
          <Pagination.Item active>{3}</Pagination.Item>
          <Pagination.Item>{4}</Pagination.Item>
          <Pagination.Item>{5}</Pagination.Item>
          <Pagination.Last />
        </Pagination>
      </div>
    )
  }
}

export default PaginationBorder;