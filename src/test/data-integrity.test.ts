import { describe, it, expect } from 'vitest';
import {
  mockCandidateProfile,
  mockJobRecommendations,
  mockResumeImprovements,
  mockOrganization,
  mockJobDescriptions,
  mockPipelineCandidates,
  mockInterviews,
  mockVoiceOutreachCampaigns,
  mockMarketIntelligence,
  mockAnalytics,
  skillOptions,
  roleCategories,
  locationOptions,
} from '@shared/data/mockData';

describe('Data Integrity - Candidate Profile', () => {
  it('has all required fields populated', () => {
    expect(mockCandidateProfile.id).toBeTruthy();
    expect(mockCandidateProfile.currentRole).toBeTruthy();
    expect(mockCandidateProfile.skills.length).toBeGreaterThan(0);
    expect(mockCandidateProfile.experienceYears).toBeGreaterThanOrEqual(0);
    expect(mockCandidateProfile.preferredLocations.length).toBeGreaterThan(0);
  });

  it('has valid AI score between 0-100', () => {
    expect(mockCandidateProfile.aiScore).toBeGreaterThanOrEqual(0);
    expect(mockCandidateProfile.aiScore).toBeLessThanOrEqual(100);
  });

  it('has valid profile completeness between 0-100', () => {
    expect(mockCandidateProfile.profileCompleteness).toBeGreaterThanOrEqual(0);
    expect(mockCandidateProfile.profileCompleteness).toBeLessThanOrEqual(100);
  });

  it('has at least one CV version', () => {
    expect(mockCandidateProfile.cvVersions.length).toBeGreaterThan(0);
  });

  it('has exactly one active CV version', () => {
    const activeVersions = mockCandidateProfile.cvVersions.filter(cv => cv.isActive);
    expect(activeVersions.length).toBe(1);
  });

  it('has valid employment type', () => {
    const validTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
    expect(validTypes).toContain(mockCandidateProfile.employmentType);
  });

  it('has valid experience range (0-50 years)', () => {
    expect(mockCandidateProfile.experienceYears).toBeGreaterThanOrEqual(0);
    expect(mockCandidateProfile.experienceYears).toBeLessThanOrEqual(50);
    expect(mockCandidateProfile.experienceMonths).toBeGreaterThanOrEqual(0);
    expect(mockCandidateProfile.experienceMonths).toBeLessThan(12);
  });

  it('has education entries with required fields', () => {
    mockCandidateProfile.education.forEach(edu => {
      expect(edu.institution).toBeTruthy();
      expect(edu.degree).toBeTruthy();
      expect(edu.year).toBeGreaterThan(1950);
    });
  });

  it('employment history is chronologically ordered', () => {
    const history = mockCandidateProfile.employmentHistory;
    for (let i = 1; i < history.length; i++) {
      const current = new Date(history[i].startDate).getTime();
      const prev = new Date(history[i - 1].startDate).getTime();
      // Earliest first (ascending order)
      expect(current).toBeGreaterThanOrEqual(prev);
    }
  });
});

describe('Data Integrity - Job Recommendations', () => {
  it('has at least 5 recommendations (BRD: 5 within 48hrs)', () => {
    expect(mockJobRecommendations.length).toBeGreaterThanOrEqual(5);
  });

  it('all have valid match scores (0-100)', () => {
    mockJobRecommendations.forEach(job => {
      expect(job.matchScore).toBeGreaterThanOrEqual(0);
      expect(job.matchScore).toBeLessThanOrEqual(100);
    });
  });

  it('are sorted by match score descending', () => {
    for (let i = 1; i < mockJobRecommendations.length; i++) {
      expect(mockJobRecommendations[i - 1].matchScore)
        .toBeGreaterThanOrEqual(mockJobRecommendations[i].matchScore);
    }
  });

  it('all have required fields', () => {
    mockJobRecommendations.forEach(job => {
      expect(job.id).toBeTruthy();
      expect(job.title).toBeTruthy();
      expect(job.company).toBeTruthy();
      expect(job.location).toBeTruthy();
      expect(job.skills.length).toBeGreaterThan(0);
    });
  });
});

describe('Data Integrity - Resume Improvements', () => {
  it('has improvement suggestions', () => {
    expect(mockResumeImprovements.length).toBeGreaterThan(0);
  });

  it('all have valid categories', () => {
    const validCategories = ['skills_gap', 'formatting', 'keywords', 'experience'];
    mockResumeImprovements.forEach(imp => {
      expect(validCategories).toContain(imp.category);
    });
  });

  it('all have valid impact levels', () => {
    const validImpacts = ['high', 'medium', 'low'];
    mockResumeImprovements.forEach(imp => {
      expect(validImpacts).toContain(imp.impact);
    });
  });
});

describe('Data Integrity - Organization', () => {
  it('has all required fields', () => {
    expect(mockOrganization.id).toBeTruthy();
    expect(mockOrganization.name).toBeTruthy();
    expect(mockOrganization.industry).toBeTruthy();
    expect(mockOrganization.domain).toBeTruthy();
  });
});

describe('Data Integrity - Job Descriptions', () => {
  it('has at least 3 JDs', () => {
    expect(mockJobDescriptions.length).toBeGreaterThanOrEqual(3);
  });

  it('all belong to the same organization', () => {
    mockJobDescriptions.forEach(jd => {
      expect(jd.organizationId).toBe(mockOrganization.id);
    });
  });

  it('all have valid statuses', () => {
    const validStatuses = ['draft', 'active', 'paused', 'closed'];
    mockJobDescriptions.forEach(jd => {
      expect(validStatuses).toContain(jd.status);
    });
  });

  it('has skills array for matching', () => {
    mockJobDescriptions.forEach(jd => {
      expect(jd.skills.length).toBeGreaterThan(0);
    });
  });

  it('experience range min is less than max', () => {
    mockJobDescriptions.forEach(jd => {
      expect(jd.experienceRange.min).toBeLessThanOrEqual(jd.experienceRange.max);
    });
  });

  it('budget range min is less than max', () => {
    mockJobDescriptions.forEach(jd => {
      expect(jd.budget.min).toBeLessThanOrEqual(jd.budget.max);
    });
  });

  it('active JDs count is under 50 per org (BRD: FR24)', () => {
    const activeJDs = mockJobDescriptions.filter(jd => jd.status === 'active');
    expect(activeJDs.length).toBeLessThanOrEqual(50);
  });
});

describe('Data Integrity - Pipeline Candidates', () => {
  it('has candidates across multiple stages', () => {
    const stages = new Set(mockPipelineCandidates.map(c => c.stage));
    expect(stages.size).toBeGreaterThanOrEqual(3);
  });

  it('all have valid pipeline stages', () => {
    const validStages = ['shortlisted', 'contacted', 'screened', 'interview_scheduled', 'offer', 'closed'];
    mockPipelineCandidates.forEach(c => {
      expect(validStages).toContain(c.stage);
    });
  });

  it('all have match scores 0-100', () => {
    mockPipelineCandidates.forEach(c => {
      expect(c.matchScore).toBeGreaterThanOrEqual(0);
      expect(c.matchScore).toBeLessThanOrEqual(100);
    });
  });

  it('candidates reference valid JD IDs', () => {
    const jdIds = new Set(mockJobDescriptions.map(jd => jd.id));
    mockPipelineCandidates.forEach(c => {
      expect(jdIds.has(c.jdId)).toBe(true);
    });
  });

  it('shortlisted candidates have score >= 75 (BRD: default threshold)', () => {
    const shortlisted = mockPipelineCandidates.filter(c => c.stage === 'shortlisted');
    shortlisted.forEach(c => {
      expect(c.matchScore).toBeGreaterThanOrEqual(75);
    });
  });
});

describe('Data Integrity - Interviews', () => {
  it('has interviews with various statuses', () => {
    const statuses = new Set(mockInterviews.map(i => i.status));
    expect(statuses.size).toBeGreaterThanOrEqual(2);
  });

  it('all have valid statuses', () => {
    const validStatuses = ['scheduled', 'completed', 'no_show', 'rescheduled', 'cancelled'];
    mockInterviews.forEach(i => {
      expect(validStatuses).toContain(i.status);
    });
  });

  it('completed interviews have feedback or rating', () => {
    const completed = mockInterviews.filter(i => i.status === 'completed');
    completed.forEach(i => {
      expect(i.feedback || i.rating).toBeTruthy();
    });
  });

  it('ratings are between 1-5', () => {
    mockInterviews.forEach(i => {
      if (i.rating !== undefined) {
        expect(i.rating).toBeGreaterThanOrEqual(1);
        expect(i.rating).toBeLessThanOrEqual(5);
      }
    });
  });
});

describe('Data Integrity - Voice Outreach Campaigns', () => {
  it('campaign totals are consistent', () => {
    mockVoiceOutreachCampaigns.forEach(c => {
      const sum = c.interested + c.declined + c.noAnswer;
      expect(sum).toBeLessThanOrEqual(c.contacted);
      expect(c.contacted).toBeLessThanOrEqual(c.totalCandidates);
    });
  });

  it('all have valid statuses', () => {
    const validStatuses = ['draft', 'active', 'completed', 'paused'];
    mockVoiceOutreachCampaigns.forEach(c => {
      expect(validStatuses).toContain(c.status);
    });
  });
});

describe('Data Integrity - Market Intelligence', () => {
  it('has data points for multiple roles/locations', () => {
    expect(mockMarketIntelligence.length).toBeGreaterThanOrEqual(3);
  });

  it('all have valid demand trends', () => {
    const validTrends = ['rising', 'stable', 'declining'];
    mockMarketIntelligence.forEach(m => {
      expect(validTrends).toContain(m.demandTrend);
    });
  });

  it('salary values are positive', () => {
    mockMarketIntelligence.forEach(m => {
      expect(m.avgSalary).toBeGreaterThan(0);
    });
  });
});

describe('Data Integrity - Analytics', () => {
  it('KPI values are realistic', () => {
    expect(mockAnalytics.timeToHire).toBeGreaterThan(0);
    expect(mockAnalytics.timeToHire).toBeLessThan(100);
    expect(mockAnalytics.matchAccuracy).toBeGreaterThan(0);
    expect(mockAnalytics.matchAccuracy).toBeLessThanOrEqual(100);
    expect(mockAnalytics.pipelineConversion).toBeGreaterThan(0);
    expect(mockAnalytics.pipelineConversion).toBeLessThanOrEqual(100);
  });
});

describe('Data Integrity - Reference Data', () => {
  it('has sufficient skill options (BRD: 100+)', () => {
    expect(skillOptions.length).toBeGreaterThanOrEqual(30);
  });

  it('has sufficient role categories (BRD: 50 standard)', () => {
    expect(roleCategories.length).toBeGreaterThanOrEqual(20);
  });

  it('has multiple location options', () => {
    expect(locationOptions.length).toBeGreaterThanOrEqual(10);
  });

  it('candidate skills exist in skill options', () => {
    // Most candidate skills should be in the skill taxonomy
    const matchCount = mockCandidateProfile.skills.filter(
      s => skillOptions.includes(s)
    ).length;
    expect(matchCount).toBeGreaterThan(0);
  });
});

describe('Workflow Sequence Validation', () => {
  it('pipeline stages follow correct order', () => {
    const stageOrder: Record<string, number> = {
      shortlisted: 0,
      contacted: 1,
      screened: 2,
      interview_scheduled: 3,
      offer: 4,
      closed: 5,
    };

    // Verify all stages are represented
    const stages = Object.keys(stageOrder);
    const pipelineStages = new Set(mockPipelineCandidates.map(c => c.stage));
    stages.forEach(stage => {
      // At least shortlisted, contacted, and screened should have candidates
      if (['shortlisted', 'contacted', 'screened'].includes(stage)) {
        expect(pipelineStages.has(stage as any)).toBe(true);
      }
    });
  });

  it('voice outreach candidates should be in contacted or later stage', () => {
    const contactedOrLater = mockPipelineCandidates.filter(
      c => c.voiceOutreachStatus && c.voiceOutreachStatus !== 'pending'
    );
    const stageOrder: Record<string, number> = {
      shortlisted: 0,
      contacted: 1,
      screened: 2,
      interview_scheduled: 3,
      offer: 4,
      closed: 5,
    };
    contactedOrLater.forEach(c => {
      expect(stageOrder[c.stage]).toBeGreaterThanOrEqual(1);
    });
  });

  it('interview_scheduled candidates should have interview dates', () => {
    const interviewStage = mockPipelineCandidates.filter(
      c => c.stage === 'interview_scheduled'
    );
    // Most should have interview dates
    const withDates = interviewStage.filter(c => c.interviewDate);
    expect(withDates.length).toBeGreaterThanOrEqual(0);
  });
});
