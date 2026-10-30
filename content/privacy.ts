/** Static explanation of the job-application data flow; contact details come from Sanity. */
export const privacyContent = {
  metadata: {
    title: 'Applicant Privacy',
    description: 'How Phenix Labs handles information submitted with job applications.',
    keywords: ['applicant privacy', 'careers privacy', 'job application data'],
    path: '/privacy',
    breadcrumbLabel: 'Applicant Privacy',
    schemaTitle: 'Applicant Privacy',
    schemaDescription: 'Privacy information for people applying to Phenix Labs roles.',
  },
  hero: {
    eyebrow: 'Applicant privacy',
    title: 'Your application should be handled with',
    highlightedTitle: 'care.',
    description: 'This notice explains the information we collect when you apply for a role and how we use, store, and remove it.',
  },
  sections: [
    {
      key: 'information',
      title: 'Information you choose to provide',
      body: 'We collect the contact, professional, and application information requested in the role form, plus an optional resume and cover letter. Please do not include sensitive personal information that is not relevant to the role.',
    },
    {
      key: 'purpose',
      title: 'How we use it',
      body: 'We use application information only to assess your fit for the role, contact you about your application, and operate a fair hiring process. Applications are reviewed through our recruitment inbox, not our content-management system.',
    },
    {
      key: 'retention',
      title: 'Retention and deletion',
      body: 'Applications become eligible for automatic deletion after the period shown on the role’s application form. Cleanup runs daily; large backlogs may take additional runs. One-way anti-duplicate records remain for the lifetime of the job ID so that the same email address or phone number cannot submit repeatedly for the same vacancy. They do not contain your raw email address, phone number, or resume.',
    },
    {
      key: 'service',
      title: 'Service providers',
      body: 'Application submissions are processed through Netlify Forms. A confirmation email may be sent through Resend. Resume links can remain cached briefly after a Netlify submission is deleted.',
    },
    {
      key: 'rights',
      title: 'Questions or requests',
      body: 'To ask about, correct, or request deletion of your application information before the retention period ends, contact the privacy address below and include the job ID from your application.',
    },
  ],
} as const
