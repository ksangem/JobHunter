// ============================================================================
// interview-service — scheduling, calendar/meet integration, feedback
// scorecards, offers (FR-R-065..080). Org-scoped (RLS). Emits interview events.
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
export class InterviewController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'interview-service', port: 3007 };
  }

  // FR-R-065 — schedule an interview -> emits TOPICS.INTERVIEW_SCHEDULED.
  @Post('interviews')
  schedule(@Body() _body: unknown) {
    // TODO: create calendar event + Meet/Zoom link; persist Interview; notify.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-072 — submit a feedback scorecard (technical/comm/problem/culture, rec).
  @Post('interviews/:id/feedback')
  feedback(@Param('id') _id: string, @Body() _body: unknown) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-078 — create an offer for an application.
  @Post('offers')
  createOffer(@Body() _body: unknown) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
