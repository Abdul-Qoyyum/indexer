import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { EntityManager, FindOperator, FindOptionsWhere } from 'typeorm';

export interface RepositoryInterface {
  findOne(data: FindOptionsWhere<RepositoryEntity>): Promise<RepositoryEntity>;
  save(
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>>;
  update(
    id: string | FindOperator<string>,
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>>;
  delete(id: string | number): Promise<void>;
  upsertRepositoryEntity(
    filter: Partial<RepositoryEntity>,
    updateData: Partial<RepositoryEntity>,
  );
}
