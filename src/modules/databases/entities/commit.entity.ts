import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { RepositoryEntity } from './repository.entity';

@Entity('commits')
export class CommitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  _id: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'varchar', nullable: true })
  author?: string;

  @Column({ type: 'varchar', nullable: true })
  node_id?: string;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'varchar', nullable: true })
  url?: string;

  @Column({ type: 'varchar', nullable: true })
  repository_id?: string;

  @ManyToOne(() => RepositoryEntity, (repository) => repository.commits)
  @JoinColumn({ name: 'repository_id' })
  repository: Relation<RepositoryEntity>;
}
