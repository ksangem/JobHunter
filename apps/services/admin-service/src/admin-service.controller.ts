// ============================================================================
// admin-service — platform + org administration (FR-A-001..010). SUPER_ADMIN /
// ORG_ADMIN only. Org onboarding (DPA), user/seat management, AI monitoring
// dashboard (FR-A-005), and audit-log access. Reads immutable audit_logs.
// ============================================================================
import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';

@Controller()
export class AdminController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'admin-service', port: 3010 };
  }

  // FR-A-005 — AI monitoring: per-function accuracy, hallucination, override,
  // p95 latency, token cost (aggregated from ai_audit_logs).
  @Get('admin/ai-monitor')
  aiMonitor() {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-A-008 — audit-log query (append-only; UPDATE/DELETE blocked at DB level).
  @Get('admin/audit-logs')
  auditLogs() {
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
