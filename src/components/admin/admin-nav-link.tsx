import type { SidebarLink } from '@/config/admin-sidebar-links'
import { useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import Link from '../link'

type AdminNavLinkProps = SidebarLink

const AdminNavLink = (props: AdminNavLinkProps) => {
  const { titleKey, url, icon: Icon } = props
  const t = useTranslations()
  const pathname = usePathname()
  const isActive = pathname === url

  return (
    <SidebarMenuItem>
      <SidebarMenuButton isActive={isActive} asChild>
        <Link href={url}>
          <Icon />
          <span>{t(`admin.nav.${titleKey}`)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export default AdminNavLink