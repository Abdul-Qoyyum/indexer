import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoDBRepository } from '../repositories/mongodb-repository.repository';
import { MONGODB, MYSQL, POSTGRES } from 'src/modules/libs/constants';
import { RelationalRepository } from '../repositories/relational-repository.repository';
import { RepositoryEntity } from 'src/modules/databases/entities/repository.entity';
import { EntityManager, FindOperator, FindOptionsWhere } from 'typeorm';

@Injectable()
export class RepositoryFactory {
  repository: MongoDBRepository | RelationalRepository;
  gitHubToken: string;
  githubRepoBaseUrl: string;
  dbType: string;
  constructor(
    private readonly mongoDBRepository: MongoDBRepository,
    private readonly configService: ConfigService,
    private readonly relationalRepository: RelationalRepository,
  ) {
    this.dbType = this.configService.get<string>('DB_TYPE');
    this.setRepository();
  }

  setRepository() {
    switch (this.dbType) {
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

  async update(
    id: string | FindOperator<string>,
    data: Partial<RepositoryEntity>,
    manager: EntityManager | null,
  ): Promise<Partial<RepositoryEntity>> {
    return this.repository.update(id, data, manager);
  }

  findOne(
    data: FindOptionsWhere<RepositoryEntity>,
  ): Promise<Partial<RepositoryEntity>> {
    return this.repository.findOne(data);
  }

  async save(data: Partial<RepositoryEntity>, manager: EntityManager | null) {
    const { full_name } = data;
    if (this.dbType === MONGODB) {
      return this.repository.upsertRepositoryEntity({ full_name }, data);
    }
    const entity = await this.repository.findOne({
      full_name,
    });
    if (entity) {
      data._id = entity._id;
    }
    return await this.repository.save(data, manager);
  }


  async 
}
