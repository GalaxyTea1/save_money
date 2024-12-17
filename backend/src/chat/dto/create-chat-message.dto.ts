export class CreateChatMessageDto {
  content: string;
  role: 'user' | 'assistant';
  userId: number;
}
