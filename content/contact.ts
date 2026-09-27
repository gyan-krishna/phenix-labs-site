/** Static Contact page and form interface copy. Contact details remain in Sanity. */
export const contactContent = {
  metadata: {
    title: 'Contact Phenix Labs for an Engineering Project',
    description:
      'Contact Phenix Labs in Thiruvananthapuram to discuss an engineering, PCB, firmware, embedded system, research, prototyping, or product development project.',
    keywords: ['contact Phenix Labs', 'engineering enquiry', 'project discussion'],
    path: '/contact',
    breadcrumbLabel: 'Contact',
    schemaTitle: 'Contact Phenix Labs',
    schemaDescription:
      'Contact details and enquiry form for engineering, research, and product development projects.',
  },
  hero: {
    sectionLabel: 'Contact overview',
    eyebrow: 'Start a conversation',
    title: 'Bring us the problem. We’ll help shape the',
    highlightedTitle: 'path forward.',
    description:
      'Whether you are developing a product, advancing research, or planning a technical learning initiative, share the context and we will help identify a practical next step.',
    action: 'Send an enquiry',
    status: 'Project desk is open',
    startingPointsLabel: 'Helpful starting points',
    startingPoints: [
      'What you are trying to build or improve',
      'Current stage, constraints, and desired outcome',
      'Any useful timeline, files, or technical context',
    ],
  },
  details: {
    sectionLabel: 'Project enquiry',
    eyebrow: 'Direct contact',
    title: 'Prefer to reach us directly?',
    description:
      'Choose the channel that works best for you. For detailed project discussions, the enquiry form helps us prepare before replying.',
    callLabel: 'Call us',
    emailLabel: 'Email us',
    addressLabel: 'Visit us',
    socialLabel: 'Follow',
    socialAriaPrefix: 'Follow Phenix Labs on',
  },
  enquiry: {
    eyebrow: 'Project enquiry',
    title: 'Tell us what you’re working on.',
    description:
      'Required fields are marked with an asterisk. Include as much context as is useful at this stage.',
    submitAction: 'Send project enquiry',
  },
  form: {
    validation: {
      nameMinimum: 'Name must be at least 2 characters',
      nameMaximum: 'Name must not exceed 100 characters',
      nameFormat: 'Name can only contain letters, spaces, hyphens, and apostrophes',
      emailFormat: 'Please enter a valid email address',
      emailMaximum: 'Email must not exceed 255 characters',
      subjectMinimum: 'Subject must be at least 5 characters',
      subjectMaximum: 'Subject must not exceed 200 characters',
      messageMinimum: 'Message must be at least 10 characters',
      messageMaximum: 'Message must not exceed 5000 characters',
      phoneMaximum: 'Phone number must not exceed 15 digits',
      phoneFormat: 'Phone number must contain digits only',
      companyMaximum: 'Company name must not exceed 100 characters',
    },
    labels: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      subject: 'Subject',
      message: 'Message',
      required: 'required',
      subscribe: 'Subscribe to our newsletter',
    },
    placeholders: {
      name: 'Your name',
      email: 'your.email@example.com',
      phone: 'Phone number',
      company: 'Your company name',
      subject: 'What is this about?',
      message: 'Tell us more about your project...',
    },
    phoneErrorTitle: 'Check the phone number',
    phoneFieldErrorTemplate: 'Enter a valid phone number for {country}',
    phoneErrorTemplate: 'The number does not appear valid for {country}.',
    rateLimitError:
      'Too many messages were sent recently. Please wait a minute and try again.',
    validationError: 'Please review the form fields and try again.',
    submissionError: 'Your message could not be sent. Please try again shortly.',
    successTitle: 'Message sent successfully',
    successMessage: 'Thanks for reaching out. We will get back to you soon.',
    failureTitle: 'Message not sent',
    failureMessage:
      'Please try again or use the direct contact details on this page.',
    defaultSubmitAction: 'Send Message',
    submittingAction: 'Sending message',
  },
} as const
