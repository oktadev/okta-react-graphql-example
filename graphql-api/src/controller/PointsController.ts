import { Controller, Mutation, Query } from 'vesper';
import { EntityManager } from 'typeorm';
import { Points } from '../entity/Points';

@Controller()
export class PointsController {

  constructor(private entityManager: EntityManager) {
  }

  // serves "points: [Points]" requests
  @Query()
  points() {
    return this.entityManager.find(Points);
  }

  // serves "pointsGet(id: Int): Points" requests
  @Query()
  pointsGet({id}) {
    return this.entityManager.findOne(Points, id);
  }

  // serves "pointsSave(id: Int, date: Date, exercise: Int, diet: Int, alcohol: Int, notes: String): Points" requests
  @Mutation()
  pointsSave(args) {
    const points = this.entityManager.create(Points, args);
    return this.entityManager.save(Points, points);
  }

  // serves "pointsDelete(id: Int): Boolean" requests
  @Mutation()
  async pointsDelete({id}) {
    await this.entityManager.remove(Points, {id: id});
    return true;
  }
}