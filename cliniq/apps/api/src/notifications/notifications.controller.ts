import { Controller, Get, Patch, Query, UseGuards, Request, Param } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { NotificationsService } from "./notifications.service";
import { NotificationFilterSchema } from "@cliniq/shared-types";

@Controller("notifications")
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getNotifications(@Request() req, @Query() filters: any) {
    const validatedFilters = NotificationFilterSchema.parse(filters);
    const userId = req.user.sub;

    const result = await this.notificationsService.getUserNotifications(userId, validatedFilters);

    return { data: result.notifications, meta: { total: result.total } };
  }

  @Get("unread-count")
  async getUnreadCount(@Request() req) {
    const userId = req.user.sub;
    const count = await this.notificationsService.getUnreadCount(userId);
    return { data: { count } };
  }

  @Patch(":id/read")
  async markAsRead(@Request() req, @Param("id") id: string) {
    const userId = req.user.sub;
    const notification = await this.notificationsService.markAsRead(userId, id);
    return { data: notification };
  }

  @Patch("read-all")
  async markAllAsRead(@Request() req) {
    const userId = req.user.sub;
    const updated = await this.notificationsService.markAllAsRead(userId);
    return { data: { updated } };
  }
}
