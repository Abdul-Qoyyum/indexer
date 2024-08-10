import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { EntityManager, FindOperator, FindOptionsWhere } from 'typeorm';

export interface RepositoryInterface {
  findOne(data: FindOptionsWhere<RepositoryEntity>): Promise<RepositoryEntity>;
  save(
    data: RepositoryEntity,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>>;
  update(
    id: number | FindOperator<number>,
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>>;
  delete(id: string | number): Promise<void>;
}
