import React, { Component } from "react";
// react component for creating dynamic tables
import ReactTable from "react-table";
import { Grid, Row, Col } from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "components/CustomButton/CustomButton.jsx";

import { getCustomerList } from "crm/server/CustomerServerComm.jsx";

class crmCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = { customerList: [] };
  }
  componentWillMount() {
    let _this = this;
    getCustomerList(null,
      function success(data) {
        _this.setState({
          customerList: data.map((prop, key) => {
            return {
              id: key,
              code: prop.code,
              name: prop.firstName + ' ' + prop.middleName + ' ' + prop.lastName,
              email: prop.email,
              city: prop.city + ', ' + prop.state,
              phone: prop.phone,
              role: prop.role,
              position: prop.position,
              image: prop.image,
              actions: (
                // we've added some custom button actions
                <div className="actions-right">
                  {/* use this button to add a edit kind of action */}
                  <Button
                    onClick={() => {
                      let obj = this.state.data.find(o => o.id === key);
                      this.props.history.push('/crm/customers-edit/' + obj.code);
                    }}
                    bsStyle="info"
                    simple
                    icon
                  >
                    <i className="fa fa-edit" />
                  </Button>{" "}
                  {/* use this button to remove the data row */}
                  <Button
                    bsStyle="danger"
                    simple
                    icon
                  >
                    <i className="fa fa-times" />
                  </Button>{" "}
                </div>
              )
            };
          })
        })
      },
      function error (error) { _this.setState({ customerList: [] }); }
    );
  }
  render() {
    return (
      <div className="main-content" >
        <Grid fluid>
          <Row>
            <Col md={3}>
              <Button
                onClick={() => {
                  this.props.history.push('/crm/customers-edit/new');
                }}
                bsStyle="primary"
                simple fill wd
              >
                <i className="fa fa-plus" />{" Add New Customer"}
              </Button>
            </Col>
            <Col md={12}>
              <Card
                content={
                  !this.customerList || !this.customerList.length ? 
                  <div>
                    No customers found <a href="#/crm/customers-edit/new">click here</a> to create one.
                  </div> 
                  :
                  <ReactTable
                    data={this.state.data}
                    columns={[
                      {
                        Header: "Image",
                        Cell: (row) => {
                          return <div><img className="img-container user-img-container" alt="..." src={row.original.image} /></div>
                        },
                        id: 'image'
                      },
                      {
                        Header: "Code",
                        accessor: "code"
                      },
                      {
                        Header: "Name",
                        accessor: "name"
                      },
                      {
                        Header: "City",
                        accessor: "city"
                      },
                      {
                        Header: "Email",
                        accessor: "email"
                      },
                      {
                        Header: "Phone",
                        accessor: "phone"
                      },
                      {
                        Header: "Position",
                        accessor: "position"
                      },
                      {
                        Header: "Role",
                        accessor: "role"
                      },
                      {
                        Header: "Actions",
                        accessor: "actions",
                        sortable: false,
                        filterable: false
                      }
                    ]}
                    minRows={0}
                    defaultPageSize={5}
                    // PaginationComponent={Pagination}
                    showPaginationTop
                    showPaginationBottom={false}
                    className="-striped -highlight"
                    style={{ maxHeight: "70vh" }}
                  />
                }
              />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default crmCustomers;