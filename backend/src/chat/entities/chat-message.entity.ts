import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  role: 'user' | 'assistant';

  @ManyToOne(() => User)
  user: User;

  @Column()
  user_id: number;

  @CreateDateColumn()
  createdAt: Date;
}
