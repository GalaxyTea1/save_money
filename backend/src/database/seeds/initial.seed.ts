import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
import { Expense } from '../../expenses/entities/expense.entity';

export const initialSeed = async (dataSource: DataSource) => {
    try {
        // Tạo users
        const userRepository = dataSource.getRepository(User);
        console.log('Creating users...');
        const users = await userRepository.save([
            {
                email: 'user1@example.com',
                password: await bcrypt.hash('password123', 10),
                fullName: 'A',
            },
            {
                email: 'user2@example.com',
                password: await bcrypt.hash('password123', 10),
                fullName: 'B',
            },
        ]);
        console.log(`Created ${users.length} users`);

        // Tạo categories
        const categoryRepository = dataSource.getRepository(Category);
        const categories = [];
        console.log('Creating categories...');
        for (const user of users) {
            const userCategories = await categoryRepository.save([
                {
                    name: 'Ăn uống',
                    icon: '🍔',
                    color: '#FF5733',
                    userId: user.id,
                },
                {
                    name: 'Di chuyển',
                    icon: '🚗',
                    color: '#33FF57',
                    userId: user.id,
                },
                {
                    name: 'Mua sắm',
                    icon: '🛍️',
                    color: '#3357FF',
                    userId: user.id,
                },
                {
                    name: 'Giải trí',
                    icon: '🎮',
                    color: '#FF33F6',
                    userId: user.id,
                },
            ]);
            categories.push(...userCategories);
        }
        console.log(`Created ${categories.length} categories`);

        // Tạo expenses
        const expenseRepository = dataSource.getRepository(Expense);
        const expenses = [];
        console.log('Creating expenses...');
        for (const category of categories) {
            const randomExpenses = Array(5).fill(null).map(() => ({
                amount: parseFloat((Math.random() * 1000000).toFixed(2)),
                description: `Chi tiêu cho ${category.name}`,
                date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
                categoryId: category.id,
                userId: category.userId,
            }));
            const savedExpenses = await expenseRepository.save(randomExpenses);
            expenses.push(...savedExpenses);
        }
        console.log(`Created ${expenses.length} expenses`);

        return {
            users,
            categories,
            expenses,
        };
    } catch (error) {
        console.error('Error in initialSeed:', error);
        throw error;
    }
}; 