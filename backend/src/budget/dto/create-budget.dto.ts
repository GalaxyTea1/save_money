import { IsString, IsDecimal, IsDate } from 'class-validator';

export class CreateBudgetDto {
  @IsString()
  name: string;

  @IsDecimal()
  amount: number;

  @IsDecimal()
  spent: number;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;
}