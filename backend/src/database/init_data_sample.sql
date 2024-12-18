-- Thêm users mẫu (password là "123456" đã được hash bằng bcrypt)
INSERT INTO user (id, email, password, full_name) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'user1@example.com', '$2b$10$6jM/0qQbMN9LBWN3KvGRz.w8z0qh3jYjjuLtFzxF1fEPHe1/Yv5Eq', 'Nguyễn Văn A'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'user2@example.com', '$2b$10$6jM/0qQbMN9LBWN3KvGRz.w8z0qh3jYjjuLtFzxF1fEPHe1/Yv5Eq', 'Trần Thị B');

-- Thêm categories mẫu cho user1
INSERT INTO category (id, name, icon, color, user_id) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Ăn uống', '🍔', '#FF5733', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Di chuyển', '🚗', '#33FF57', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Mua sắm', '🛍️', '#3357FF', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Thêm categories mẫu cho user2
INSERT INTO category (id, name, icon, color, user_id) VALUES
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'Giải trí', '🎮', '#FF33E9', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'Học tập', '📚', '#33FFF6', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');

-- Thêm expenses mẫu cho user1
INSERT INTO expense (id, amount, description, date, category_id, user_id) VALUES
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 150000, 'Ăn trưa', '2024-03-10 12:00:00', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 300000, 'Đi taxi', '2024-03-10 15:30:00', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 1500000, 'Mua quần áo', '2024-03-11 10:00:00', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Thêm expenses mẫu cho user2
INSERT INTO expense (id, amount, description, date, category_id, user_id) VALUES
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 200000, 'Xem phim', '2024-03-11 20:00:00', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 500000, 'Mua sách', '2024-03-12 09:00:00', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22');

-- Thêm một số tin nhắn mẫu
INSERT INTO chat_message (content, role, user_id) VALUES
    ('Xin chào AI, làm thế nào để học lập trình?', 'user', 'c9f4e089-86d5-44ff-9a54-364ee3143045'),
    ('Để học lập trình hiệu quả, bạn nên bắt đầu với những ngôn ngữ cơ bản như Python hoặc JavaScript...', 'assistant', 'c9f4e089-86d5-44ff-9a54-364ee3143045'),
    ('Cảm ơn AI đã giải thích!', 'user', 'c9f4e089-86d5-44ff-9a54-364ee3143045'),
    ('Bạn có thể giúp tôi với bài tập về SQL không?', 'user', 'c9f4e089-86d5-44ff-9a54-364ee3143045'),
    ('Tất nhiên, tôi có thể giúp bạn. Hãy chia sẻ câu hỏi của bạn.', 'assistant', 'c9f4e089-86d5-44ff-9a54-364ee3143045');