// ============================================================================
// jd-service — job description lifecycle (FR-R-013..020). Org-scoped (RLS).
// expected_close_date is MANDATORY; uploaded JDs are AI-parsed (jd.parsing) and
// a PriorityMatrix is generated. Publishing emits jd.published.
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
export class JdController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'jd-service', port: 3003 };
  }

  // FR-R-013 — list org JDs (tenant context set by middleware; RLS enforces).
  @Get('jds')
  list() {
    // TODO: withTenant(orgId) -> prisma.jobDescription.findMany({ where: { orgId } })
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-013 — create a JD (validate mandatory expected_close_date).
  @Post('jds')
  create(@Body() _body: unknown) {
    // TODO: persist DRAFT JD; if ai_extracted, generate PriorityMatrix via ai-worker.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-018 — publish a JD -> emits TOPICS.JD_PUBLISHED (partition by org_id).
  @Post('jds/:id/publish')
  publish(@Param('id') _id: string) {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
