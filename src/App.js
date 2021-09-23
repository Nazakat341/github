import React, { Component, Fragment } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Users from "./components/users/Users";
import User from "./components/users/User";
import Search from "./components/users/Search";
import Alert from "./components/layout/Alert";
import About from "./components/pages/About";
import axios from "axios";
import "./App.css";

class App extends Component {
  state = {
    users: [],
    user: {},
    repos:[],
    loading: false,
    alert: null,
  };

  // async componentDidMount() {
  //   this.setState({ loading: true });

  //   const res = await axios.get(`https://api.github.com/users?clint_id=
  // ${process.env.REACT_APP_GITHUB_CLIENT_ID}
  // &Clint_secret ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

  //   this.setState({ users: res.data, loading: false });
  // }
  //Search Users
  searchUsers = async (text) => {
    this.setState({ loading: true });
    const res =
      await axios.get(`https://api.github.com/search/users?q=${text}&clint_id=
    ${process.env.REACT_APP_GITHUB_CLIENT_ID}
    &Clint_secret ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ users: res.data.items, loading: false });
  };
  ////////Get a single User
  getUser = async (username) => {
    this.setState({ loading: true });
    const res =
      await axios.get(`https://api.github.com/users/${username}?clint_id=
    ${process.env.REACT_APP_GITHUB_CLIENT_ID}
    &Clint_secret ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ user: res.data, loading: false });
  };

  //get Users repos
  getUserRepos = async (username) => {
    this.setState({ loading: true });
    const res =
      await axios.get(`https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&clint_id=
    ${process.env.REACT_APP_GITHUB_CLIENT_ID}
    &Clint_secret ${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`);

    this.setState({ repos: res.data, loading: false });
  };

  ///Clear user
  clearUsers = () => this.setState({ users: [], loading: false });

  //Alert message if user empty
  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });
    setTimeout(() => {
      this.setState({ alert: null });
    }, 5000);
  };

  render() {
    const { users, user,repos, loading } = this.state;
    return (
      <Router>
        <Fragment>
          <div className="app">
            <Navbar />
            <div className="container">
              <Alert alert={this.state.alert} />
              <Switch>
                <Route
                  exact
                  path="/"
                  render={(props) => (
                    <Fragment>
                      <Search
                        searchUsers={this.searchUsers}
                        clearUsers={this.clearUsers}
                        showClear={users.length > 0 ? true : false}
                        setAlert={this.setAlert}
                      />
                      <Users loading={loading} users={users} />
                    </Fragment>
                  )}
                />
                <Route exact path="/about" component={About} />
                <Route
                  exact
                  path="/user/:login"
                  render={(props) => (
                    <User
                      {...props}
                      getUser={this.getUser}
                      getUserRepos={this.getUserRepos}
                      repos={repos}
                      user={user}
                      loading={loading}
                    />
                  )}
                />
              </Switch>
            </div>
          </div>
        </Fragment>
      </Router>
    );
  }
}

export default App;
