import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { RepositoryEntity } from './repository.entity';

@Entity('commit_sync_settings')
export class CommitSyncSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column({ type: 'date', nullable: true })
  date?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToOne(
    () => RepositoryEntity,
    (repository) => repository.commit_sync_setting,
  )
  repository: Relation<RepositoryEntity>;

  @BeforeInsert()
  generateId() {
    if (!this._id) {
      this._id = uuidv4();
    }
  }
}
