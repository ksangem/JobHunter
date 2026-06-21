// ============================================================================
// consent-service — consent ledger + GDPR/DPDP rights (FR-G-040..048).
// Candidate-scoped (global; NO org_id). Records GRANTED/DENIED/REVOKED consent
// per channel, gates voice/marketing, and drives the gdpr.erasure_requested
// workflow. The consent ledger is the source of truth for PII-unmasking reads.
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
export class ConsentController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'consent-service', port: 3012 };
  }

  // FR-G-041 — record a consent decision (type, status, channel, version).
  @Post('consents')
  record(@Body() _body: unknown) {
    // TODO: append ConsentLog (with ip/user_agent/version). REVOKED is honoured
    // immediately by voice/email gates and re-masks PII for cross-org reads.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-G-046 — GDPR/DPDP erasure request -> emits gdpr.erasure_requested.
  @Post('erasure-requests')
  requestErasure(@Body() _body: unknown) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
