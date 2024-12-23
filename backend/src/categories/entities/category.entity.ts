import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { ApiProperty, ApiHideProperty } from '@nestjs/swagger';

@Entity('category')
export class Category {
  @ApiProperty({
    description: 'ID',
    example: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Category name',
    example: 'Food'
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Icon of category',
    example: '🍔',
    nullable: true
  })
  @Column({ nullable: true })
  icon: string;

  @ApiProperty({
    description: 'Color of category', 
    example: '#FF5733',
    nullable: true
  })
  @Column({ nullable: true })
  color: string;

  @ApiProperty({
    description: 'ID user',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
  })
  @Column({ name: 'user_id' })
  user_id: string;

  @ApiHideProperty()
  @ManyToOne(() => User, user => user.categories)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiHideProperty()
  @OneToMany(() => Expense, expense => expense.category)
  expenses: Expense[];
} 