import Link from 'next/link'
import { ArrowUpRight, House, RouteOff } from 'lucide-react'
import { MainLayout } from '@/components/layout/MainLayout'
import { StatusPage } from '@/components/feedback/StatusPage'
import { sharedContent } from '@/content/shared'
import { getFooterData, getNavbarData } from '@/lib/config/site'

/** Global fallback rendered when no application route matches the request. */
export default async function NotFound() {
  const [navbar, footer] = await Promise.all([
    getNavbarData(),
    getFooterData(),
  ])

  return (
    <MainLayout navbarData={navbar} footerData={footer}>
      <StatusPage
        code={sharedContent.statusPages.notFound.code}
        eyebrow={sharedContent.statusPages.notFound.eyebrow}
        title={sharedContent.statusPages.notFound.title}
        description={sharedContent.statusPages.notFound.description}
        icon={<RouteOff aria-hidden="true" size={15} />}
        actions={
          <>
            <Link
              href="/"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#0064d7] px-7 font-semibold text-white shadow-[0_14px_34px_rgba(0,100,215,.23)] transition-all hover:-translate-y-0.5 hover:bg-[#0055b8] sm:w-auto"
            >
              <House aria-hidden="true" size={18} />
              {sharedContent.statusPages.notFound.primaryAction}
            </Link>
            <Link
              href="/products"
              className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-[#9fb3c2] bg-white/55 px-7 font-semibold text-[#203348] backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-[#0064d7]/55 hover:text-[#0064d7] sm:w-auto"
            >
              {sharedContent.statusPages.notFound.secondaryAction}
              <ArrowUpRight aria-hidden="true" size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </>
        }
      />
    </MainLayout>
  )
}
