import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('Documents')
export class Document {
  @PrimaryGeneratedColumn()
  documentID: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text' })
  fileType: string;

  @Column({ type: 'integer' })
  ownerID: number;

  @CreateDateColumn({ type: 'datetime' })
  uploadTimestamp: Date;

  @Column({ type: 'integer', default: 1 })
  currentVersion: number;
}