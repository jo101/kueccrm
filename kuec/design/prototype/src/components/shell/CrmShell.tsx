'use client';

import { type ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ActionIcon, AppShell, Avatar, Box, Button, Container, Group, Indicator, Menu, Switch, Text, UnstyledButton } from '@mantine/core';
import { Spotlight, spotlight, type SpotlightActionData } from '@mantine/spotlight';
import {
  IconActivity,
  IconBell,
  IconBuilding,
  IconChartBar,
  IconChecklist,
  IconDotsCircleHorizontal,
  IconExternalLink,
  IconFiles,
  IconFileText,
  IconHelpCircle,
  IconHome,
  IconLanguage,
  IconLogout,
  IconMessageReport,
  IconMoon,
  IconPackage,
  IconPlus,
  IconSearch,
  IconSpeakerphone,
  IconSun,
  IconTargetArrow,
  IconUserPlus,
  IconUsers,
  IconFolders,
} from '@tabler/icons-react';

import { useLocale } from '@/i18n/LocaleContext';
import type { MessageKey } from '@/i18n/messages';
import { useWorkbenchStore } from '@/store/WorkbenchStore';
import { KUEC_LAYOUT } from '@/theme/kuec-tokens';

type Destination = { key: MessageKey; href: string; icon: typeof IconHome };

// Navigation of the brief (part 4): nine destinations, the rest under More.
const DESTINATIONS: Destination[] = [
  { key: 'nav.home', href: '/', icon: IconHome },
  { key: 'nav.leads', href: '/leads', icon: IconUserPlus },
  { key: 'nav.opportunities', href: '/opportunities', icon: IconTargetArrow },
  { key: 'nav.accounts', href: '/accounts', icon: IconBuilding },
  { key: 'nav.contacts', href: '/contacts', icon: IconUsers },
  { key: 'nav.activities', href: '/activities', icon: IconActivity },
  { key: 'nav.tasks', href: '/tasks', icon: IconChecklist },
  { key: 'nav.projects', href: '/projects', icon: IconFolders },
  { key: 'nav.dashboards', href: '/dashboards', icon: IconChartBar },
];

const MORE: Destination[] = [
  { key: 'nav.contracts', href: '/contracts', icon: IconFileText },
  { key: 'nav.documents', href: '/documents', icon: IconFiles },
  { key: 'nav.products', href: '/products', icon: IconPackage },
  { key: 'nav.campaigns', href: '/campaigns', icon: IconSpeakerphone },
  { key: 'nav.help', href: '/help', icon: IconHelpCircle },
];

// Mobile bar: Home, Opportunities, New, Tasks, More.
const MOBILE_BAR: Array<Destination | 'new'> = [DESTINATIONS[0], DESTINATIONS[2], 'new', DESTINATIONS[6]];

type CrmShellProps = { children: ReactNode };

// uVENTURE's AppShell owns the real chrome; the workbench reproduces only what
// the /crm route group adds: the destination tabs, search, New, the bell, the
// person menu and the phone bottom bar.
export const CrmShell = ({ children }: CrmShellProps) => {
  const { t, locale, setLocale } = useLocale();
  const { viewer, personas, simulateFailure, setSimulateFailure, opportunities, accounts, contacts, tasks, getAccount } = useWorkbenchStore();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const scheme = searchParams.get('scheme') === 'dark' ? 'dark' : 'light';

  const withParams = (href: string, overrides: Record<string, string> = {}): string => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      params.set(key, value);
    }
    const query = params.toString();

    return `${href}${query ? `?${query}` : ''}`;
  };

  const isActive = (href: string): boolean => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const searchActions: SpotlightActionData[] = [
    ...accounts.map((account) => ({ id: account.id, label: account.name[locale], description: t('nav.accounts'), leftSection: <IconBuilding size={18} />, onClick: () => router.push(withParams(`/accounts/${account.id}`)) })),
    ...contacts.map((contact) => ({ id: contact.id, label: contact.name[locale], description: getAccount(contact.accountId)?.name[locale] ?? '', leftSection: <IconUsers size={18} />, onClick: () => router.push(withParams(`/contacts/${contact.id}`)) })),
    ...opportunities.map((opportunity) => ({ id: opportunity.id, label: opportunity.name[locale], description: getAccount(opportunity.accountId)?.name[locale] ?? '', leftSection: <IconTargetArrow size={18} />, onClick: () => router.push(withParams(`/opportunities/${opportunity.id}`)) })),
    ...tasks.map((task) => ({ id: task.id, label: task.title[locale], description: t('nav.tasks'), leftSection: <IconChecklist size={18} />, onClick: () => router.push(withParams(`/tasks/${task.id}`)) })),
  ];

  const toggleScheme = () => router.replace(withParams(pathname, { scheme: scheme === 'dark' ? 'light' : 'dark' }));

  return (
    <AppShell header={{ height: KUEC_LAYOUT.headerHeightPx }} footer={{ height: KUEC_LAYOUT.bottomBarHeightPx, collapsed: false }} padding={0}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap" gap="md">
          <Group gap="md" wrap="nowrap" style={{ minWidth: 0 }}>
            <UnstyledButton component="a" href={withParams('/')} aria-label="KUEC" h={44} style={{ display: 'flex', alignItems: 'center' }}>
              <Group gap={8} wrap="nowrap">
                <Box w={28} h={28} aria-hidden style={{ borderRadius: 6, background: 'var(--mantine-color-brand-9)' }} />
                <Text fw={600} size="sm">
                  KUEC
                </Text>
              </Group>
            </UnstyledButton>
            <Group gap={2} visibleFrom="md" wrap="nowrap" component="nav" aria-label={t('nav.more')}>
              {DESTINATIONS.map((destination) => (
                <Button
                  key={destination.href}
                  component="a"
                  href={withParams(destination.href)}
                  variant={isActive(destination.href) ? 'light' : 'subtle'}
                  color={isActive(destination.href) ? 'brand' : 'gray'}
                  size="sm"
                  px="sm"
                  aria-current={isActive(destination.href) ? 'page' : undefined}
                >
                  {t(destination.key)}
                </Button>
              ))}
              <Menu position="bottom-start" withArrow>
                <Menu.Target>
                  <Button variant="subtle" color="gray" size="sm" px="sm" rightSection={<IconDotsCircleHorizontal size={16} />}>
                    {t('nav.more')}
                  </Button>
                </Menu.Target>
                <Menu.Dropdown>
                  {MORE.map((item) => (
                    <Menu.Item key={item.href} component="a" href={withParams(item.href)} leftSection={<item.icon size={16} />}>
                      {t(item.key)}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <ActionIcon variant="subtle" color="gray" size={44} radius="xl" aria-label={t('nav.search')} title="Ctrl+K" onClick={spotlight.open}>
              <IconSearch size={20} />
            </ActionIcon>
            <Button component="a" href={withParams('/leads/new')} variant="default" size="sm" leftSection={<IconPlus size={16} />} visibleFrom="sm">
              {t('nav.new')}
            </Button>
            <Indicator color="error" size={8} offset={8} disabled={false}>
              <ActionIcon component="a" href={withParams('/inbox')} variant="subtle" color="gray" size={44} radius="xl" aria-label={t('nav.inbox')}>
                <IconBell size={20} />
              </ActionIcon>
            </Indicator>
            <Menu position="bottom-end" withArrow width={280}>
              <Menu.Target>
                <UnstyledButton aria-label={t('nav.more')} w={44} h={44} style={{ display: 'grid', placeItems: 'center' }}>
                  <Avatar radius="xl" size={32} color="brand">
                    {viewer.firstName.en.slice(0, 1)}
                  </Avatar>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>
                  <bdi>{viewer.name[locale]}</bdi> · {viewer.roleLabel[locale]}
                </Menu.Label>
                <Menu.Item leftSection={<IconLanguage size={16} />} onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}>
                  {t('nav.language')}
                </Menu.Item>
                <Menu.Item leftSection={scheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />} onClick={toggleScheme}>
                  {scheme === 'dark' ? t('nav.scheme.light') : t('nav.scheme.dark')}
                </Menu.Item>
                <Menu.Item component="a" href={withParams('/help')} leftSection={<IconHelpCircle size={16} />}>
                  {t('nav.help')}
                </Menu.Item>
                <Menu.Item component="a" href={withParams('/feedback')} leftSection={<IconMessageReport size={16} />}>
                  {t('nav.feedback')}
                </Menu.Item>
                {viewer.role === 'ED' || viewer.role === 'OPS_COORDINATOR' ? (
                  <Menu.Item leftSection={<IconExternalLink size={16} />} disabled>
                    {t('nav.expert')}
                  </Menu.Item>
                ) : null}
                <Menu.Item leftSection={<IconLogout size={16} />} disabled>
                  {t('nav.signOut')}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Label>{t('nav.viewAs')}</Menu.Label>
                {personas.map((persona) => (
                  <Menu.Item key={persona.id} component="a" href={withParams(pathname, { as: persona.id })} fw={persona.id === viewer.id ? 600 : undefined}>
                    <bdi>{persona.name[locale]}</bdi> · {persona.roleLabel[locale]}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Box px="sm" py={6}>
                  <Switch size="xs" label={t('workbench.simulateFailure')} checked={simulateFailure} onChange={(event) => setSimulateFailure(event.currentTarget.checked)} />
                </Box>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main style={{ backgroundColor: 'var(--mantine-color-body)' }}>
        <Container size={KUEC_LAYOUT.recordMaxWidthPx} px="md" py="lg" pb={KUEC_LAYOUT.bottomBarHeightPx + 24}>
          {children}
        </Container>
      </AppShell.Main>

      <AppShell.Footer hiddenFrom="sm" withBorder>
        <Group h="100%" justify="space-around" align="stretch" gap={0} px={4} component="nav" aria-label={t('nav.more')}>
          {MOBILE_BAR.map((item) =>
            item === 'new' ? (
              <UnstyledButton key="new" component="a" href={withParams('/leads/new')} aria-label={t('nav.new')} style={{ flex: 1, minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: 'var(--mantine-color-dimmed)' }}>
                <IconPlus size={22} />
                <Text size="xs" fw={600}>
                  {t('nav.new')}
                </Text>
              </UnstyledButton>
            ) : (
              <UnstyledButton
                key={item.href}
                component="a"
                href={withParams(item.href)}
                aria-current={isActive(item.href) ? 'page' : undefined}
                style={{ flex: 1, minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: isActive(item.href) ? 'var(--mantine-primary-color-filled)' : 'var(--mantine-color-dimmed)' }}
              >
                <item.icon size={22} />
                <Text size="xs" fw={600}>
                  {t(item.key)}
                </Text>
              </UnstyledButton>
            ),
          )}
          <Menu position="top-end" withArrow width={240}>
            <Menu.Target>
              <UnstyledButton aria-label={t('nav.more')} style={{ flex: 1, minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: 'var(--mantine-color-dimmed)' }}>
                <IconDotsCircleHorizontal size={22} />
                <Text size="xs" fw={600}>
                  {t('nav.more')}
                </Text>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              {[...DESTINATIONS.filter((destination) => !MOBILE_BAR.includes(destination)), ...MORE].map((item) => (
                <Menu.Item key={item.href} component="a" href={withParams(item.href)} leftSection={<item.icon size={16} />}>
                  {t(item.key)}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Item leftSection={<IconLanguage size={16} />} onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}>
                {t('nav.language')}
              </Menu.Item>
              <Menu.Item leftSection={scheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />} onClick={toggleScheme}>
                {scheme === 'dark' ? t('nav.scheme.light') : t('nav.scheme.dark')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Footer>

      <Spotlight actions={searchActions} nothingFound={t('nav.searchNothing')} highlightQuery shortcut={['mod + K']} searchProps={{ leftSection: <IconSearch size={18} />, placeholder: t('nav.searchPlaceholder') }} limit={8} />
    </AppShell>
  );
};
