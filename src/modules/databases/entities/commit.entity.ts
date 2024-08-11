import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RepositoryEntity } from './repository.entity';

@Entity('commits')
export class CommitEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'varchar', nullable: true })
  author?: string;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'varchar', nullable: true })
  url?: string;

  @Column({ type: 'varchar', nullable: true })
  repository_id?: string;

  @ManyToOne(() => RepositoryEntity, (repository) => repository.commits)
  @JoinColumn({ name: 'repository_id' })
  repository: Relation<RepositoryEntity>;

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}
