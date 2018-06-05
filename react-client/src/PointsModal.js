import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { withAuth } from '@okta/okta-react';
import { httpLink } from './Points';
import { ApolloClient } from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

export default withAuth(class PointsModal extends Component {
  client;
  emptyItem = {
    date: (new Date()).toISOString().split('T')[0],
    exercise: 1,
    diet: 1,
    alcohol: 1,
    notes: ''
  };


  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      item: this.emptyItem
    };

    this.toggle = this.toggle.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.item) {
      this.setState({item: this.props.item})
    }

    const authLink = setContext(async (_, {headers}) => {
      const token = await this.props.auth.getAccessToken();
      const user = await this.props.auth.getUser();

      // return the headers to the context so httpLink can read them
      return {
        headers: {
          ...headers,
          authorization: token ? `Bearer ${token}` : '',
          'x-forwarded-user': JSON.stringify(user)
        }
      }
    });

    this.client = new ApolloClient({
      link: authLink.concat(httpLink),
      cache: new InMemoryCache()
    });
  }

  toggle() {
    if (this.state.modal && !this.state.item.id) {
      this.setState({item: this.emptyItem});
    }
    this.setState({modal: !this.state.modal});
  }

  render() {
    const {item} = this.state;
    const opener = item.id ? <Link onClick={this.toggle} to="#">{this.props.item.date}</Link> :
      <Button color="primary" onClick={this.toggle}>Add Points</Button>;

    return (
      <div>
        {opener}
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>{(item.id ? 'Edit' : 'Add')} Points</ModalHeader>
          <ModalBody>
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="date">Date</Label>
                <Input type="date" name="date" id="date" value={item.date}
                       onChange={this.handleChange}/>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="exercise" id="exercise" checked={item.exercise}
                         onChange={this.handleChange}/>{' '}
                  Did you exercise?
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="diet" id="diet" checked={item.diet}
                         onChange={this.handleChange}/>{' '}
                  Did you eat well?
                </Label>
              </FormGroup>
              <FormGroup check>
                <Label check>
                  <Input type="checkbox" name="alcohol" id="alcohol" checked={item.alcohol}
                         onChange={this.handleChange}/>{' '}
                  Did you drink responsibly?
                </Label>
              </FormGroup>
              <FormGroup>
                <Label for="notes">Notes</Label>
                <Input type="textarea" name="notes" id="notes" value={item.notes}
                       onChange={this.handleChange}/>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  };

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? (target.checked ? 1 : 0) : target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;

    const updatePoints = gql`
      mutation pointsSave($id: Int, $date: Date, $exercise: Int, $diet: Int, $alcohol: Int, $notes: String) {
        pointsSave(id: $id, date: $date, exercise: $exercise, diet: $diet, alcohol: $alcohol, notes: $notes) {
          id date
        }
      }`;

    this.client.mutate({
      mutation: updatePoints,
      variables: {
        id: item.id,
        date: item.date,
        exercise: item.exercise,
        diet: item.diet,
        alcohol: item.alcohol,
        notes: item.notes
      }
    }).then(result => {
      let newItem = {...item};
      newItem.id = result.data.pointsSave.id;
      this.props.callback(newItem);
      this.toggle();
    });
  }
});
