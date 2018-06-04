import { bootstrap } from 'vesper';
import { PointsController } from './controller/PointsController';
import { Points } from './entity/Points';
import { User } from './entity/User';
import { GraphQLDate, GraphQLDateTime, GraphQLTime } from 'graphql-iso-date';

bootstrap({
  port: 4000,
  controllers: [
    PointsController
  ],
  entities: [
    Points,
    User
  ],
  schemas: [
    __dirname + '/schema/**/*.graphql'
  ],
  // https://github.com/vesper-framework/vesper/issues/4
  customResolvers: {
    Date: GraphQLDate,
    Time: GraphQLTime,
    DateTime: GraphQLDateTime
  },
  cors: true
}).then(() => {
  console.log('Your app is up and running on http://localhost:4000. ' +
    'You can use playground in development mode on http://localhost:4000/playground');
}).catch(error => {
  console.error(error.stack ? error.stack : error);
});