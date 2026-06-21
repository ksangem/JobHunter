// ============================================================================
// notification-service — real-time + push notifications (FR-G-030..036, G-035).
// Consumes notification.send from Kafka, fans out to WebSocket + FCM/APNS using
// registered DeviceTokens, and persists Notification rows. Also serves the
// realtime socket gateway (EXPO_PUBLIC_SOCKET_URL).
// ============================================================================
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

@Controller()
export class NotificationController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'notification-service', port: 3009 };
  }

  // FR-G-031 — list the authenticated user's notifications.
  @Get('notifications')
  list() {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // G-035 — register a device push token (IOS | ANDROID | WEB).
  @Post('devices')
  registerDevice(@Body() _body: unknown) {
    // TODO: upsert DeviceToken for req.user; dedupe by token.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
