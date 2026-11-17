import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  Activity,
  FileText,
  House,
  Image,
  Mail,
  Plug,
  Share2,
  ShieldCheck,
} from 'lucide-react'
import styles from './requests-dashboard.module.css'

const navigation = [
  { label: 'Home', href: '/', icon: House },
  { label: 'Records', href: '/?section=records', icon: FileText },
  { label: 'Share my records', href: '/?section=share', icon: Share2 },
  { label: 'Labs', href: '/?section=labs', icon: Activity },
  { label: 'Imaging', href: '/?section=imaging', icon: Image },
  { label: 'Administrator Interaction Log', href: '/requests', icon: Mail, active: true },
  { label: 'Connections', href: '/?section=connections', icon: Plug },
]

export function RequestsShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <Link className={styles.brand} href="/" aria-label="Everkeep home">
            <span className={styles.brandMark}>
              <ShieldCheck aria-hidden="true" size={21} strokeWidth={2} />
            </span>
            <span className={styles.brandName}>Everkeep</span>
          </Link>

          <nav className={styles.navigation} aria-label="Primary">
            {navigation.map(({ label, href, icon: Icon, active }) => (
              <Link
                aria-current={active ? 'page' : undefined}
                className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                href={href}
                key={label}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={1.8} />
                <span>{label}</span>
                {active && (
                  <span aria-hidden="true" className={styles.navBadge}>
                    1
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </aside>

        <main className={styles.mainPanel}>
          <div className={styles.content}>{children}</div>
        </main>
      </div>
    </div>
  )
}
