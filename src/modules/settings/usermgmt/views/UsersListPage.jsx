import React, { Component } from "react";
import UsersListComponent from "../components/UsersListComponent.jsx";

class UsersListPage extends Component {
	render() {
		return (
			<UsersListComponent {...this.props}></UsersListComponent>
		);
	}
}

export default UsersListPage;
