import { aboutPageType } from './aboutPage'
import { certificateType } from './certificates'
import { clientType } from './clients'
import { contactSettingsType } from './contactSettings'
import { courseType } from './courses'
import { faqsType } from './faqs'
import { internalCertificateType } from './internalCertificates'
import { inventionType } from './inventions'
import { productsType } from './products'
import { serviceType } from './services'
import { studentProjectsType } from './studentProjects'
import { studentReviewType } from './studentReviews'
import { testimonialType } from './testimonials'

/** Complete Studio schema registry. Keep retained future-facing types listed here. */
export const schemaTypes = [
  aboutPageType,
  contactSettingsType,
  faqsType,
  courseType,
  studentReviewType,
  studentProjectsType,
  certificateType,
  internalCertificateType,
  clientType,
  inventionType,
  productsType,
  serviceType,
  testimonialType,
]
