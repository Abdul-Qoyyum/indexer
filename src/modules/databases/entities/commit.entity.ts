import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { RepositoryEntity } from './repository.entity';

@Entity('commits')
export class CommitEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'bigint', nullable: true })
  repository_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => RepositoryEntity, (repository) => repository.commits)
  @JoinColumn({ name: 'repository_id' })
  repository: Relation<RepositoryEntity>;
}
