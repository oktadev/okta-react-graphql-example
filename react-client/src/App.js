import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { ApolloProvider, Query } from 'react-apollo';
const client = new ApolloClient({
  uri: "http://localhost:4000/graphql"
});

class App extends Component {

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
          <Query query={gql`
            {
              points {id date exercise diet alcohol notes}
            }
          `}>
            {({loading, error, data}) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error: {error}</p>;
              return data.points.map(p => {
                return <div key={p.id}>
                  <p>Date: {p.date}</p>
                  <p>Points: {p.exercise + p.diet + p.alcohol}</p>
                  <p>Notes: {p.notes}</p>
                </div>
              })
            }}
          </Query>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
