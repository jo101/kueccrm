import '@mantine/core/styles.css';

import { Component, type ReactNode, useEffect, useState } from 'react';
import {
  Button,
  DirectionProvider,
  MantineProvider,
  Modal,
  ScrollArea,
  Select,
  Text,
  Tooltip,
  useDirection,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { defineFrontComponent, PageLayoutType } from 'twenty-sdk/define';

export const MANTINE_SPIKE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER =
  'e1a7c3d9-4b6f-4a2e-9d8c-7f5b3e1a0c94';

const GLOBAL_NAMES = [
  'window',
  'document',
  'navigator',
  'matchMedia',
  'ResizeObserver',
  'IntersectionObserver',
  'MutationObserver',
  'getComputedStyle',
  'requestAnimationFrame',
  'HTMLElement',
  'CSS',
  'localStorage',
] as const;

const describeGlobals = (): string => {
  const scope = globalThis as unknown as Record<string, unknown>;
  const lines = GLOBAL_NAMES.map((name) => {
    try {
      return `${name}=${typeof scope[name]}`;
    } catch (error) {
      return `${name}=throws(${String(error)})`;
    }
  });
  try {
    const documentLike = scope.document as { body?: unknown; documentElement?: unknown } | undefined;
    lines.push(`document.body=${typeof documentLike?.body}`);
    lines.push(`document.documentElement=${typeof documentLike?.documentElement}`);
  } catch (error) {
    lines.push(`document.body=throws(${String(error)})`);
  }
  return lines.join(' ');
};

type ProbeBoundaryProps = { id: string; title: string; children: ReactNode };
type ProbeBoundaryState = { error: string | null };

class ProbeBoundary extends Component<ProbeBoundaryProps, ProbeBoundaryState> {
  state: ProbeBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): ProbeBoundaryState {
    return { error: error instanceof Error ? `${error.name}: ${error.message}` : String(error) };
  }

  render() {
    const { id, title, children } = this.props;
    if (this.state.error !== null) {
      return (
        <section>
          <p>{`PROBE ${id} ${title}: RENDER-ERROR ${this.state.error}`}</p>
        </section>
      );
    }
    return (
      <section>
        <p>{`PROBE ${id} ${title}: RENDERED`}</p>
        {children}
      </section>
    );
  }
}

const ProviderProbe = () => {
  const theme = useMantineTheme();
  return <p>{`PROBE A detail primaryColor=${theme.primaryColor} radius=${theme.defaultRadius}`}</p>;
};

const MediaQueryProbe = () => {
  const narrow = useMediaQuery('(max-width: 768px)');
  const wide = useMediaQuery('(min-width: 769px)');
  return <p>{`PROBE E detail narrow=${String(narrow)} wide=${String(wide)}`}</p>;
};

const DirectionProbe = () => {
  const { dir } = useDirection();
  const [documentDir, setDocumentDir] = useState<string>('unread');
  useEffect(() => {
    try {
      const root = (globalThis as unknown as { document?: { documentElement?: { getAttribute?: (name: string) => string | null } } }).document?.documentElement;
      setDocumentDir(root?.getAttribute ? String(root.getAttribute('dir')) : 'no-documentElement');
    } catch (error) {
      setDocumentDir(`throws(${String(error)})`);
    }
  }, []);
  return <p>{`PROBE F detail hookDir=${dir} documentDir=${documentDir}`}</p>;
};

const ModalProbe = () => {
  const [opened, setOpened] = useState(false);
  return (
    <>
      <Button onClick={() => setOpened(true)}>Open modal</Button>
      <Modal opened={opened} onClose={() => setOpened(false)} title="Modal title">
        <Text>Modal body text</Text>
        <Button onClick={() => setOpened(false)}>Close modal</Button>
      </Modal>
    </>
  );
};

const MantineSpike = () => {
  return (
    <div style={{ padding: 16 }}>
      <p>{`PROBE 0 globals: ${describeGlobals()}`}</p>
      <ProbeBoundary id="A" title="MantineProvider">
        <MantineProvider>
          <ProviderProbe />
          <ProbeBoundary id="B" title="Select">
            <Select label="Stage (portal)" data={['Qualify', 'Scope', 'Propose']} defaultDropdownOpened comboboxProps={{ withinPortal: true }} />
            <Select label="Stage (inline)" data={['Negotiate', 'Signed', 'Parked']} defaultDropdownOpened comboboxProps={{ withinPortal: false }} />
          </ProbeBoundary>
          <ProbeBoundary id="C" title="Tooltip">
            <Tooltip label="Tooltip text visible" opened>
              <Button>Tooltip target</Button>
            </Tooltip>
          </ProbeBoundary>
          <ProbeBoundary id="D" title="Modal">
            <ModalProbe />
          </ProbeBoundary>
          <ProbeBoundary id="E" title="useMediaQuery">
            <MediaQueryProbe />
          </ProbeBoundary>
          <ProbeBoundary id="F" title="DirectionProvider">
            <DirectionProvider initialDirection="rtl">
              <DirectionProbe />
              <Text>نص عربي للتجربة</Text>
            </DirectionProvider>
          </ProbeBoundary>
          <ProbeBoundary id="G" title="ScrollArea">
            <ScrollArea h={80} type="always">
              <div style={{ height: 400 }}>
                <Text>Scroll line 1</Text>
                <Text>Scroll line 2</Text>
                <Text>Scroll line 3</Text>
              </div>
            </ScrollArea>
          </ProbeBoundary>
        </MantineProvider>
      </ProbeBoundary>
    </div>
  );
};

export default defineFrontComponent({
  universalIdentifier: MANTINE_SPIKE_FRONT_COMPONENT_UNIVERSAL_IDENTIFIER,
  name: 'Mantine spike',
  description: 'Compatibility probes for Mantine 8.3.18 inside the Twenty front component runtime',
  component: MantineSpike,
  widgetAvailability: { pageLayoutType: PageLayoutType.RECORD_PAGE },
});
