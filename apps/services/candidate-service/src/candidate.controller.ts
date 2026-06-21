// ============================================================================
// candidate-service — owns the GLOBAL candidate golden record (G-025), CV
// versions, ATS scoring, profile completeness. FR-JS-010..040, FR-R-021.
// Cross-org PII reads are masked-until-consent + audited (see database/rls.sql).
// ============================================================================
import { Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';

@Controller()
export class CandidateController {
  @Get('health')
  health() {
    return { status: 'ok', service: 'candidate-service', port: 3002 };
  }

  // FR-JS-010 — return the authenticated candidate's own golden record.
  @Get('candidates/me')
  getMe() {
    // TODO: resolve req.user -> Candidate via prisma; return full (unmasked) PII
    // because the owner is reading their own record. Stubbed for reference.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-R-021 — recruiter view of a candidate; PII masked unless consent exists.
  @Get('candidates/:id')
  getById(@Param('id') _id: string) {
    // TODO: withTenant + audited read; mask email/phone if no active ConsentLog.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }

  // FR-JS-012 — upload a CV version (emits cv.uploaded for ai-worker parsing).
  @Post('candidates/me/cv')
  uploadCv() {
    // TODO: presign S3, create CvVersion(status=PARSING), publish TOPICS.CV_UPLOADED.
    throw new HttpException('Not implemented (reference stub)', HttpStatus.NOT_IMPLEMENTED);
  }
}
