import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { RepositoryEntity } from './repository.entity';

@Entity('commit_sync_settings')
export class CommitSyncSettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @Column({ type: 'int', nullable: true })
  repository_id?: number;

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
