import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
  ObjectId,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CommitEntity } from './commit.entity';

@Entity('repositories')
export class RepositoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'varchar', nullable: true })
  full_name?: string;

  @Column({ type: 'varchar', nullable: true })
  url?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', nullable: true })
  language?: string;

  @Column({ type: 'varchar', nullable: true })
  forks_count?: string;

  @Column({ type: 'varchar', nullable: true })
  stargazers_count?: string;

  @Column({ type: 'varchar', nullable: true })
  open_issues_count?: string;

  @Column({ type: 'varchar', nullable: true })
  watchers_count?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CommitEntity, (commit) => commit.repository)
  commits: Relation<CommitEntity[]>;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
