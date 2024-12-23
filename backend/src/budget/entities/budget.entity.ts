import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Budget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  amount: number;

  @Column('decimal')
  spent: number;

  @Column({ type: 'date' })
  start_date: Date;

  @Column({ type: 'date' })
  end_date: Date;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, user => user.budgets)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
