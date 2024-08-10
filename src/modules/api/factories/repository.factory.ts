import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBRepository } from '../repositories/mongodb-repository.repository';
import { MONGODB, MYSQL, POSTGRES } from 'src/modules/libs/constants';
import { RelationalRepository } from '../repositories/relational-repository.repository';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { EntityManager, FindOptionsWhere } from 'typeorm';

@Injectable()
export class RepositoryFactory {
  repository: MongoDBRepository | RelationalRepository;
  gitHubToken: string;
  githubRepoBaseUrl: string;
  constructor(
    private readonly mongoDBRepository: MongoDBRepository,
    private readonly configService: ConfigService,
    private readonly relationalRepository: RelationalRepository,
  ) {
    this.setRepository();
  }

  setRepository() {
    const dbType = this.configService.get<string>('DB_TYPE');
    switch (dbType) {
      case MONGODB:
        this.repository = this.mongoDBRepository;
        break;
      case POSTGRES:
      case MYSQL:
        this.repository = this.relationalRepository;
        break;
      default:
        this.repository = this.relationalRepository;
    }
  }

  getRepository() {
    return this.repository;
  }

  findOne(
    data: FindOptionsWhere<RepositoryEntity>,
  ): Promise<Partial<RepositoryEntity>> {
    return this.repository.findOne(data);
  }

  save(
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>> {
    return this.repository.save(data, manager);
  }
}
