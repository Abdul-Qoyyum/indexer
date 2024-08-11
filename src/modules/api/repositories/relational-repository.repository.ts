import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import {
  EntityManager,
  FindManyOptions,
  FindOperator,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryInterface } from '../interfaces';

@Injectable()
export class RelationalRepository implements RepositoryInterface {
  constructor(
    @InjectRepository(RepositoryEntity)
    private readonly githubRepository: Repository<RepositoryEntity>,
  ) {}

  async findOne(
    data: FindOptionsWhere<RepositoryEntity>,
  ): Promise<RepositoryEntity> {
    return await this.githubRepository.findOne({ where: data });
  }

  async save(
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>> {
    return manager
      ? await manager.save(RepositoryEntity, data)
      : await this.githubRepository.save(data);
  }

  async update(
    id: string | FindOperator<string>,
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>> {
    const repository = await this.githubRepository.findOne({
      where: { id: id },
    });

    if (!repository) {
      throw new NotFoundException('Repository not found');
    }

    Object.assign(repository, data);

    return manager
      ? await manager.save(repository)
      : await this.githubRepository.save(repository);
  }

  async delete(id: string | number): Promise<void> {
    const result = await this.githubRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Repository not found');
    }
  }

  async bulkUpsert(updateData: Partial<RepositoryEntity[]>, path: string[]) {
    return await this.githubRepository.upsert(updateData, path);
  }

  async getTotal(filter: FindManyOptions<RepositoryEntity>) {
    return await this.githubRepository.count(filter);
  }

  async find(
    data: FindManyOptions<RepositoryEntity>,
  ): Promise<RepositoryEntity[]> {
    return await this.githubRepository.find(data);
  }
}
