import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { CommitEntity } from './commit.entity';

@Entity('repositories')
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  url: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar' })
  language: string;

  @Column({ type: 'varchar' })
  forks_count: string;

  @Column({ type: 'varchar' })
  stargazers_count: string;

  @Column({ type: 'varchar' })
  open_issues_count: string;

  @Column({ type: 'varchar' })
  watchers_count: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CommitEntity, (commit) => commit.repository)
  commits: Relation<CommitEntity[]>;
}
