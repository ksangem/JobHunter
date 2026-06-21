// ============================================================================
// Dropdown / picker option lists for onboarding + profile wizards.
// Ported from the clickable prototype's mockData so the new screens offer the
// same choices. Kept separate from constants.ts (pure data, no styling).
// ============================================================================

export const SKILL_OPTIONS: string[] = [
  'React', 'Angular', 'Vue.js', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js',
  'Express.js', 'Python', 'Django', 'FastAPI', 'Flask', 'Java', 'Spring Boot',
  'Go', 'Rust', 'C#', '.NET', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Kafka',
  'RabbitMQ', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD',
  'Git', 'GraphQL', 'REST APIs', 'Selenium', 'Playwright', 'Jest', 'Power BI',
  'Tableau', 'SQL', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Figma', 'Tailwind CSS',
];

export const ROLE_CATEGORIES: string[] = [
  'Software Engineer', 'Senior Software Engineer', 'Staff Software Engineer',
  'Principal Engineer', 'Frontend Developer', 'Backend Developer', 'Full-Stack Developer',
  'DevOps Engineer', 'SRE / Platform Engineer', 'Data Engineer', 'Data Analyst',
  'Data Scientist', 'Machine Learning Engineer', 'QA Engineer', 'QA Automation Lead',
  'Mobile Developer (Android)', 'Mobile Developer (iOS)', 'React Native Developer',
  'Product Manager', 'Engineering Manager', 'Technical Architect', 'Solutions Architect',
  'Cloud Engineer', 'Security Engineer', 'UI/UX Designer', 'Technical Writer',
  'Business Analyst', 'Scrum Master',
];

export const LOCATION_OPTIONS: string[] = [
  'Bangalore', 'Hyderabad', 'Pune', 'Mumbai', 'Delhi', 'Chennai', 'Ahmedabad',
  'Kolkata', 'Kochi', 'Jaipur', 'Noida', 'Gurgaon', 'Remote', 'Singapore', 'Dubai',
  'London', 'San Francisco', 'New York', 'Toronto', 'Berlin',
];

export const INDUSTRY_OPTIONS: string[] = [
  'IT Services & Consulting', 'Technology / SaaS', 'FinTech', 'Healthcare', 'Education',
  'E-Commerce', 'Consulting', 'Manufacturing', 'Staffing & Recruitment', 'Other',
];

export const ORG_SIZE_OPTIONS: string[] = ['1-10', '11-50', '51-200', '201-500', '500+'];

export const CURRENCY_OPTIONS: string[] = ['INR', 'USD', 'EUR', 'GBP', 'SGD', 'AED'];

export const EMPLOYMENT_TYPES: string[] = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
