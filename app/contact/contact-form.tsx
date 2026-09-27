'use client'

import { ContactForm } from '@/components/forms/ContactForm'
import { contactContent } from '@/content/contact'

/** Client boundary for the configurable project-enquiry form on the Contact page. */
export function ContactFormClient() {
  return (
    <ContactForm
      idPrefix="project-enquiry"
      showPhone
      showCompany
      showSubscribe={false}
      submitButtonText={contactContent.enquiry.submitAction}
    />
  )
}
