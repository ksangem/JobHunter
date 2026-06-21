// ============================================================================
// voice-ai-service — outbound AI voice screening (BRD §10.3, FR-R-040..050).
// EVERY call passes a 5-point pre-call gate (voice_consent, not_on_dnc,
// time_window, platform_throttle, org_throttle) before dialing; failures are
// logged as SKIPPED with a skip_reason. Org-scoped (RLS). Consent is mandatory.
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
export class VoiceController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'voice-ai-service', port: 3005 };
  }

  // FR-R-040 — create/launch a voice campaign (rate: 10–50 calls/hour).
  @Post('campaigns')
  createCampaign(@Body() _body: unknown) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-044 — launch: enqueue gated calls; emits TOPICS.CALL_INITIATED per call.
  @Post('campaigns/:id/launch')
  launch(@Param('id') _id: string) {
    // TODO: for each candidate -> evaluate PreCallGate; dial if all true else
    // CallLog(status=SKIPPED, skip_reason). Respect org/platform throttles.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-047 — telephony webhook (Twilio/Retell). Records transcript, risk_level.
  @Post('webhooks/call-status')
  callWebhook(@Body() _body: unknown) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
