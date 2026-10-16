import { Button } from 'twenty-ui/primitives/input';

type FallbackLinkProps = {
  label: string;
  onOpen: () => void;
};

// Always visible: if the component misbehaves, the native page is one click away.
export const FallbackLink = ({ label, onOpen }: FallbackLinkProps) => (
  <Button variant="link" size="sm" onClick={onOpen}>
    {label}
  </Button>
);
