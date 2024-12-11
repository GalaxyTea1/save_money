import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { initialSeed } from './seeds/initial.seed';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Expense } from '../expenses/entities/expense.entity';

config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User, Category, Expense],
    synchronize: false,
});

async function runSeed() {
    try {
        await dataSource.initialize();
        console.log('Database connected');

        const result = await initialSeed(dataSource);
        console.log('Users created:', result.users.length);
        console.log('Categories created:', result.categories.length);
        console.log('Expenses created:', result.expenses.length);
        
        // Log chi tiết hơn
        console.log('Sample user:', result.users[0]);
        console.log('Sample category:', result.categories[0]);
        console.log('Sample expense:', result.expenses[0]);

        await dataSource.destroy();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
}

runSeed()
    .then(() => {
        console.log('Seeding completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Seeding failed:', error);
        process.exit(1);
    }); 