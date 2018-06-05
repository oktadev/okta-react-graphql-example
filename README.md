# Health Tracking App with React, GraphQL, and TypeORM

This example app shows how to use React, GraphQL, and TypeORM to build a health tracking app and add authentication with Okta.

<!--Please read [Build a Health Tracking App with React and GraphQL, and TypeORM]() to see how this app was created.-->

**Prerequisites:** [Node.js](https://nodejs.org/).

> [Okta](https://developer.okta.com/) has Authentication and User Management APIs that reduce development time with instant-on, scalable user infrastructure. Okta's intuitive API and expert support make it easy for developers to authenticate, manage, and secure users and roles in any application.

* [Getting Started](#getting-started)
* [Links](#links)
* [Help](#help)
* [License](#license)

## Getting Started

To install this example application, run the following commands:

```bash
git clone https://github.com/oktadeveloper/okta-react-graphql-example.git
cd okta-react-graphql-example
```

This will get a copy of the project installed locally. To install all of its dependencies and start each app, follow the instructions below.

To run the GraphQL API, cd into the `graphql-api` folder and install its dependencies:
 
```bash
npm i
```

This project is configured to use a MySQL database. You can change its settings by modifying [`graphql-api/ormconfig.json`](graphql-api/ormconfig.json). To create a MySQL database with the default settings, run the following commands:

```bash
mysql -u root -p
create database healthpoints;
use healthpoints;
grant all privileges on *.* to 'health'@'localhost' identified by 'points';
```

After this database exists, start the API with `npm start`.

To run the client, cd into the `react-client` folder and run:
 
```bash
npm i
npm start
```

### Setup Okta

Log in to your Okta Developer account (or [sign up](https://developer.okta.com/signup/) if you don’t have an account) and navigate to **Applications** > **Add Application**. Click **Single-Page App**, click **Next**, and give the app a name you’ll remember. Click **Done**.

#### Server Configuration

Open `graphql-api/index.ts` and replace `{yourOktadomain}` and `{yourClientId}` in the following code block. 

```ts
const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: '{yourClientId}',
  issuer: 'https://{yourOktaDomain}.com/oauth2/default'
});
```

**NOTE:** The value of `{yourOktaDomain}` should be something like `dev-123456.oktapreview`. Make sure you don't include `-admin` or two `.com` in the value!

#### Client Configuration

For the client, set the `issuer` and `client_id` in `react-client/src/App.js`.

```js
class App extends Component {
  render() {
    return (
      <Router>
        <Security issuer='https://{yourOktaDomain}.com/oauth2/default'
                  client_id='{yourClientId}'
                  redirect_uri={window.location.origin + '/implicit/callback'}
                  onAuthRequired={onAuthRequired}>
          <Route path='/' exact={true} component={Home}/>
          <SecureRoute path='/points' component={Points}/>
          <Route path='/login' render={() => <Login baseUrl='https://dev-669532.oktapreview.com'/>}/>
          <Route path='/implicit/callback' component={ImplicitCallback}/>
        </Security>
      </Router>
    );
  }
}
```

## Links

This example uses the following libraries provided by Okta:

* [Okta JWT Verifier](https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier)
* [Okta Sign-In Widget](https://github.com/okta/okta-signin-widget)

## Help

Please post any questions as comments on the [blog post](), or visit our [Okta Developer Forums](https://devforum.okta.com/). You can also email developers@okta.com if would like to create a support ticket.

## License

Apache 2.0, see [LICENSE](LICENSE).
