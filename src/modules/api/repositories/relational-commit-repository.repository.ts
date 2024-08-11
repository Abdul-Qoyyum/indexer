import { Injectable, NotFoundException } from '@nestjs/common';
import {
  EntityManager,
  FindOperator,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryInterface } from '../interfaces';
import { CommitEntity } from 'src/modules/databases/entities/commit.entity';

@Injectable()
export class CommitRepository implements RepositoryInterface {
  constructor(
    @InjectRepository(CommitEntity)
    private readonly commitEntity: Repository<CommitEntity>,
  ) {}

  get commitEntityResource() {
    return this.commitEntity;
  }

  async findOne(data: FindOptionsWhere<CommitEntity>): Promise<CommitEntity> {
    return await this.commitEntity.findOne({ where: data });
  }

  async save(
    data: Partial<CommitEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitEntity>> {
    return manager
      ? await manager.save(CommitEntity, data)
      : await this.commitEntity.save(data);
  }

  async update(
    id: number | FindOperator<number>,
    data: Partial<CommitEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<CommitEntity>> {
    const repository = await this.commitEntity.findOne({
      where: { id },
    });

    if (!repository) {
      throw new NotFoundException('Commit not found');
    }

    Object.assign(repository, data);

    return manager
      ? await manager.save(repository)
      : await this.commitEntity.save(repository);
  }

  async delete(id: string | number): Promise<void> {
    const result = await this.commitEntity.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Commit not found');
    }
  }

  async upsertRepositoryEntity(
    filter: Partial<CommitEntity>,
    updateData: Partial<CommitEntity>,
  ) {
    return await this.commitEntity.upsert([updateData], ['id']);
  }

  async bulkUpsert(
    updateData: Partial<CommitEntity[]>,
    path: string[],
    manager: EntityManager | null,
  ) {
    return manager
      ? await manager.upsert(CommitEntity, updateData, path)
      : await this.commitEntity.upsert(updateData, path);
  }
}
