export class CreateChatMessageDto {
  content: string;
  role: 'user' | 'assistant';
  user_id: string;
}
