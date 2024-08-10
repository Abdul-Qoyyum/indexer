import { Injectable, NotFoundException } from '@nestjs/common';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import {
  EntityManager,
  FindOperator,
  FindOptionsWhere,
  MongoRepository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RepositoryInterface } from '../interfaces';

@Injectable()
export class MongoDBRepository implements RepositoryInterface {
  constructor(
    @InjectRepository(RepositoryEntity)
    private readonly githubRepository: MongoRepository<RepositoryEntity>,
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
    if (manager) {
      const user = await manager.create(RepositoryEntity, data);
      return await manager.save(user);
    }
    return await this.githubRepository.save(data);
  }

  async update(
    id: string | FindOperator<string>,
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>> {
    const repository = await this.githubRepository.findOne({ where: { id } });

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
}
