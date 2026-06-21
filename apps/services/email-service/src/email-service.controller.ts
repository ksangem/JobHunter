// ============================================================================
// email-service — transactional + campaign email (FR-R-055..060). Org-scoped.
// Honours unsubscribe/suppression (BlacklistEntry) and tracks open/click.
// Sends via SES/SendGrid; transactional sends triggered by notification.send.
// ============================================================================
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

@Controller()
export class EmailController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'email-service', port: 3006 };
  }

  // FR-R-055 — create an email campaign.
  @Post('campaigns')
  create(@Body() _body: unknown) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-057 — send: filter suppressed recipients, dispatch, track metrics.
  @Post('campaigns/:id/send')
  send(@Param('id') _id: string) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
