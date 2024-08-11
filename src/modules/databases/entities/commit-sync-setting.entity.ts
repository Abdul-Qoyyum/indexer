import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { RepositoryEntity } from './repository.entity';

@Entity('commit_sync_settings')
export class CommitSyncSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryColumn('uuid')
  _id?: string;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'varchar', nullable: true })
  repository_id?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(
    () => RepositoryEntity,
    (repository) => repository.commit_sync_setting,
  )
  repository: Relation<RepositoryEntity>;
}
