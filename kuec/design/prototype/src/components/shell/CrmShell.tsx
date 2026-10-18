'use client';

import { type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { ActionIcon, AppShell, Avatar, Box, Button, Container, Group, Indicator, Menu, Switch, Text, UnstyledButton } from '@mantine/core';
import {
  IconBell,
  IconBuildingSkyscraper,
  IconChartBar,
  IconChecklist,
  IconDotsCircleHorizontal,
  IconExternalLink,
  IconHelpCircle,
  IconLanguage,
  IconMessageReport,
  IconPlus,
  IconSearch,
  IconSun,
  IconTargetArrow,
  IconUsersGroup,
} from '@tabler/icons-react';

import { useLocale } from '@/i18n/LocaleContext';
import type { MessageKey } from '@/i18n/messages';
import { usePrototypeStore } from '@/store/PrototypeStore';

type Destination = { key: MessageKey; href: string; icon: typeof IconSun };

const DESTINATIONS: Destination[] = [
  { key: 'nav.today', href: '/', icon: IconSun },
  { key: 'nav.pipeline', href: '/pipeline', icon: IconTargetArrow },
  { key: 'nav.accounts', href: '/accounts', icon: IconBuildingSkyscraper },
  { key: 'nav.delivery', href: '/delivery', icon: IconChecklist },
  { key: 'nav.insights', href: '/insights', icon: IconChartBar },
];

const MOBILE_BAR: Array<Destination | 'log'> = [DESTINATIONS[0], DESTINATIONS[1], 'log', DESTINATIONS[3]];

const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 64;

type CrmShellProps = { children: ReactNode };

// uVENTURE's AppShell owns the real chrome; the prototype reproduces only what
// the /crm route group adds: destination tabs, Log, the bell, and the bottom bar.
export const CrmShell = ({ children }: CrmShellProps) => {
  const { t, locale, setLocale } = useLocale();
  const { viewer, personas, simulateFailure, setSimulateFailure } = usePrototypeStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const withParams = (href: string, overrides: Record<string, string> = {}): string => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(overrides)) {
      params.set(key, value);
    }
    const query = params.toString();

    return `${href}${query ? `?${query}` : ''}`;
  };

  const isActive = (href: string): boolean => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <AppShell header={{ height: HEADER_HEIGHT }} footer={{ height: FOOTER_HEIGHT, collapsed: false }} padding={0}>
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" wrap="nowrap">
          <Group gap="lg" wrap="nowrap">
            <UnstyledButton component="a" href={withParams('/')} aria-label="KUEC" h={44} style={{ display: 'flex', alignItems: 'center' }}>
              <Group gap={8} wrap="nowrap">
                <Box w={28} h={28} style={{ borderRadius: 6, background: 'linear-gradient(135deg, #1B2A4A, #4071F4)' }} aria-hidden />
                <Text fw={700} size="sm">
                  KUEC
                </Text>
              </Group>
            </UnstyledButton>
            <Group gap={2} visibleFrom="sm" wrap="nowrap">
              {DESTINATIONS.map((destination) => (
                <Button
                  key={destination.href}
                  component="a"
                  href={withParams(destination.href)}
                  variant={isActive(destination.href) ? 'light' : 'subtle'}
                  color={isActive(destination.href) ? 'brand' : 'gray'}
                  size="sm"
                  aria-current={isActive(destination.href) ? 'page' : undefined}
                >
                  {t(destination.key)}
                </Button>
              ))}
            </Group>
          </Group>
          <Group gap="xs" wrap="nowrap">
            <ActionIcon variant="subtle" color="gray" size={44} radius="xl" aria-label={t('nav.search')} title="Ctrl+K">
              <IconSearch size={20} />
            </ActionIcon>
            <Button component="a" href={withParams('/log')} variant="light" size="sm" leftSection={<IconPlus size={16} />} visibleFrom="sm">
              {t('nav.log')}
            </Button>
            <Indicator color="error" size={8} offset={8} disabled={false}>
              <ActionIcon component="a" href={withParams('/inbox')} variant="subtle" color="gray" size={44} radius="xl" aria-label={t('nav.inbox')}>
                <IconBell size={20} />
              </ActionIcon>
            </Indicator>
            <Menu position="bottom-end" withArrow shadow="md" width={280}>
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
                <Menu.Divider />
                <Menu.Label>{t('nav.viewAs')}</Menu.Label>
                {personas.map((persona) => (
                  <Menu.Item key={persona.id} component="a" href={withParams(pathname, { as: persona.id })} fw={persona.id === viewer.id ? 600 : undefined}>
                    <bdi>{persona.name[locale]}</bdi> · {persona.roleLabel[locale]}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Box px="sm" py={6}>
                  <Switch size="xs" label={t('proto.simulateFailure')} checked={simulateFailure} onChange={(event) => setSimulateFailure(event.currentTarget.checked)} />
                </Box>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main style={{ backgroundColor: 'var(--mantine-color-body)' }}>
        <Container size="lg" px="md" py="lg" pb={FOOTER_HEIGHT + 24}>
          {children}
        </Container>
      </AppShell.Main>

      <AppShell.Footer hiddenFrom="sm" withBorder>
        <Group h="100%" justify="space-around" align="stretch" gap={0} px={4}>
          {MOBILE_BAR.map((item) =>
            item === 'log' ? (
              <UnstyledButton key="log" component="a" href={withParams('/log')} aria-label={t('nav.log')} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box w={48} h={48} style={{ borderRadius: '50%', backgroundColor: 'var(--mantine-primary-color-filled)', color: 'var(--mantine-primary-color-contrast, white)', display: 'grid', placeItems: 'center', boxShadow: 'var(--mantine-shadow-md)' }}>
                  <IconPlus size={24} />
                </Box>
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
                <Text size="xs" fw={isActive(item.href) ? 600 : 500}>
                  {t(item.key)}
                </Text>
              </UnstyledButton>
            ),
          )}
          <Menu position="top-end" withArrow shadow="md" width={240}>
            <Menu.Target>
              <UnstyledButton aria-label={t('nav.more')} style={{ flex: 1, minHeight: 44, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, color: 'var(--mantine-color-dimmed)' }}>
                <IconDotsCircleHorizontal size={22} />
                <Text size="xs" fw={500}>
                  {t('nav.more')}
                </Text>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item component="a" href={withParams('/accounts')} leftSection={<IconBuildingSkyscraper size={16} />}>
                {t('nav.accounts')}
              </Menu.Item>
              <Menu.Item component="a" href={withParams('/insights')} leftSection={<IconChartBar size={16} />}>
                {t('nav.insights')}
              </Menu.Item>
              <Menu.Item leftSection={<IconLanguage size={16} />} onClick={() => setLocale(locale === 'ar' ? 'en' : 'ar')}>
                {t('nav.language')}
              </Menu.Item>
              <Menu.Item component="a" href={withParams('/help')} leftSection={<IconHelpCircle size={16} />}>
                {t('nav.help')}
              </Menu.Item>
              <Menu.Item leftSection={<IconUsersGroup size={16} />} disabled>
                {t('nav.viewAs')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </AppShell.Footer>
    </AppShell>
  );
};
