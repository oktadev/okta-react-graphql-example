import React, { Component } from 'react';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { withAuth } from '@okta/okta-react';
import AppNavbar from './AppNavbar';
import { Alert, Button, Container, Table } from 'reactstrap';
import PointsModal from './PointsModal';

export const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql'
});

export default withAuth(class Points extends Component {
  client;

  constructor(props) {
    super(props);
    this.state = {points: [], error: null};

    this.refresh = this.refresh.bind(this);
    this.remove = this.remove.bind(this);
  }

  refresh(item) {
    let existing = this.state.points.filter(p => p.id === item.id);
    let points = [...this.state.points];
    if (existing.length === 0) {
      points.push(item);
      this.setState({points});
    } else {
      this.state.points.forEach((p, idx) => {
        if (p.id === item.id) {
          points[idx] = item;
          this.setState({points});
        }
      })
    }
  }

  remove(item, index) {
    const deletePoints = gql`mutation pointsDelete($id: Int) { pointsDelete(id: $id) }`;

    this.client.mutate({
      mutation: deletePoints,
      variables: {id: item.id}
    }).then(result => {
      if (result.data.pointsDelete) {
        let updatedPoints = [...this.state.points].filter(i => i.id !== item.id);
        this.setState({points: updatedPoints});
      }
    });
  }

  componentDidMount() {

    const authLink = setContext(async (_, {headers}) => {
      const token = await this.props.auth.getAccessToken();
      const user = await this.props.auth.getUser();

      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
          'x-forwarded-user': user ? JSON.stringify(user) : ''
        }
      }
    });

    this.client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache(),
      connectToDevTools: true
    });

    this.client.query({
      query: gql`
        {
          points {
            id,
            user {
              id,
              lastName
            }
            date,
            alcohol,
            exercise,
            diet,
            notes
          }
        }`
    }).then(result => {
      this.setState({points: result.data.points});
    }).catch(error => {
      this.setState({error: <Alert color="danger">Failure to communicate with API.</Alert>});
    });
  }

  render() {
    const {points, error} = this.state;
    const pointsList = points.map(p => {
      const total = p.exercise + p.diet + p.alcohol;
      return <tr key={p.id}>
        <td style={{whiteSpace: 'nowrap'}}><PointsModal item={p} callback={this.refresh}/></td>
        <td className={total <= 1 ? 'text-danger' : 'text-success'}>{total}</td>
        <td>{p.notes}</td>
        <td><Button size="sm" color="danger" onClick={() => this.remove(p)}>Delete</Button></td>
      </tr>
    });

    return (
      <div>
        <AppNavbar/>
        <Container fluid>
          {error}
          <h3>Your Points</h3>
          <Table>
            <thead>
            <tr>
              <th width="10%">Date</th>
              <th width="10%">Points</th>
              <th>Notes</th>
              <th width="10%">Actions</th>
            </tr>
            </thead>
            <tbody>
            {pointsList}
            </tbody>
          </Table>
          <PointsModal callback={this.refresh}/>
        </Container>
      </div>
    );
  }
})
