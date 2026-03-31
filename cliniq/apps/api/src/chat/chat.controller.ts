import { Controller, Get, Post, Put, Delete, UseGuards, Request, Query, Body, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { MessagesService } from './messages.service';
import { ConversationsService } from './conversations.service';
import { CreateMessageSchema, CreateConversationSchema } from '@cliniq/shared-types';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messagesService: MessagesService,
    private readonly conversationsService: ConversationsService
  ) {}

  @Get('conversations')
  async getConversations(@Request() req) {
    const userId = req.user.sub;
    const conversations = await this.conversationsService.getUserConversations(userId);
    return { data: conversations };
  }

  @Get('conversations/:id')
  async getConversation(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    const conversation = await this.conversationsService.getConversationById(id, userId);
    return { data: conversation };
  }

  @Post('conversations')
  async createConversation(@Request() req, @Body() data: any) {
    const userId = req.user.sub;
    const validatedData = CreateConversationSchema.parse(data);
    const conversation = await this.conversationsService.createConversation(userId, validatedData);
    return { data: conversation };
  }

  @Put('conversations/:id')
  async updateConversation(@Param('id') id: string, @Request() req, @Body() data: any) {
    const userId = req.user.sub;
    const conversation = await this.conversationsService.updateConversation(id, userId, data);
    return { data: conversation };
  }

  @Delete('conversations/:id')
  async deleteConversation(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    await this.conversationsService.deleteConversation(id, userId);
    return { message: 'Conversation deleted successfully' };
  }

  @Get('conversations/:id/messages')
  async getMessages(@Param('id') id: string, @Query() query: { page?: number; limit?: number }) {
    const messages = await this.messagesService.getConversationMessages(id, query);
    return { data: messages };
  }

  @Post('conversations/:id/messages')
  async createMessage(@Param('id') id: string, @Request() req, @Body() data: any) {
    const userId = req.user.sub;
    const validatedData = CreateMessageSchema.parse({ ...data, conversationId: id });
    const message = await this.messagesService.createMessage(userId, validatedData);
    return { data: message };
  }

  @Put('messages/:id')
  async updateMessage(@Param('id') id: string, @Request() req, @Body() data: any) {
    const userId = req.user.sub;
    const message = await this.messagesService.updateMessage(id, userId, data);
    return { data: message };
  }

  @Delete('messages/:id')
  async deleteMessage(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    await this.messagesService.deleteMessage(id, userId);
    return { message: 'Message deleted successfully' };
  }

  @Post('messages/:id/read')
  async markMessageAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    await this.messagesService.markMessageAsRead(id, userId);
    return { message: 'Message marked as read' };
  }

  @Post('conversations/:id/read-all')
  async markAllMessagesAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    await this.messagesService.markAllMessagesAsRead(id, userId);
    return { message: 'All messages marked as read' };
  }

  @Get('conversations/:id/participants')
  async getParticipants(@Param('id') id: string, @Request() req) {
    const userId = req.user.sub;
    const participants = await this.conversationsService.getParticipants(id, userId);
    return { data: participants };
  }

  @Post('conversations/:id/participants')
  async addParticipant(@Param('id') id: string, @Body() body: { userId: string }, @Request() req) {
    const currentUserId = req.user.sub;
    const participant = await this.conversationsService.addParticipant(id, currentUserId, body.userId);
    return { data: participant };
  }

  @Delete('conversations/:id/participants/:userId')
  async removeParticipant(@Param('id') id: string, @Param('userId') userId: string, @Request() req) {
    const currentUserId = req.user.sub;
    await this.conversationsService.removeParticipant(id, currentUserId, userId);
    return { message: 'Participant removed successfully' };
  }

  @Get('online-users')
  async getOnlineUsers() {
    const onlineUsers = await this.chatService.getOnlineUsers();
    return { data: onlineUsers };
  }

  @Get('conversations/:id/typing')
  async getTypingIndicators(@Param('id') id: string) {
    const typingIndicators = await this.chatService.getTypingIndicators(id);
    return { data: typingIndicators };
  }

  @Post('conversations/:id/typing')
  async setTypingIndicator(@Param('id') id: string, @Body() body: { isTyping: boolean }, @Request() req) {
    const userId = req.user.sub;
    await this.chatService.setTypingIndicator(id, userId, body.isTyping);
    return { message: 'Typing indicator updated' };
  }

  @Get('search')
  async searchMessages(@Query() query: { q: string; conversationId?: string; limit?: number }) {
    const userId = req.user.sub;
    const results = await this.chatService.searchMessages(userId, query);
    return { data: results };
  }

  @Post('upload')
  async uploadFile(@Request() req) {
    const userId = req.user.sub;
    // File upload implementation would go here
    // For now, return a mock response
    return { 
      data: {
        fileUrl: `/uploads/chat/${Date.now()}_file`,
        fileName: 'uploaded_file',
        fileSize: 1024,
        mimeType: 'application/octet-stream'
      }
    };
  }
}
