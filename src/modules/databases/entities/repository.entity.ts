import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CommitEntity } from './commit.entity';
import { CommitSyncSettingsEntity } from './commit-sync-setting.entity';

@Entity('repositories')
export class RepositoryEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

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

  @Column({ type: 'varchar', nullable: true })
  commit_sync_setting_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => CommitEntity, (commit) => commit.repository)
  commits: Relation<CommitEntity[]>;

  @OneToOne(
    () => CommitSyncSettingsEntity,
    (commit_sync_settings) => commit_sync_settings.repository,
  )
  @JoinColumn({ name: 'commit_sync_setting_id' })
  commit_sync_setting: Relation<CommitSyncSettingsEntity>;

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}
