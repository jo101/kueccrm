import { type ReactNode } from 'react';
import { IconInfoCircle } from 'twenty-ui/icon';
import { Tooltip } from 'twenty-ui/primitives/surfaces';

type InfoTooltipProps = {
  text: string;
};

// Focusable, so a keyboard user can open the tooltip too; the label repeats
// the text for screen readers.
export const InfoTooltip = ({ text }: InfoTooltipProps) => (
  <Tooltip content={text} delay={300} maxWidth={280}>
    <span className="kuec-info" tabIndex={0} role="img" aria-label={text}>
      <IconInfoCircle size={14} />
    </span>
  </Tooltip>
);

type WithInfoProps = {
  info: string;
  children: ReactNode;
};

// The icon sits beside the control, never inside it, so a click on the
// control never opens the tooltip instead.
export const WithInfo = ({ info, children }: WithInfoProps) => (
  <span className="kuec-with-info">
    {children}
    <InfoTooltip text={info} />
  </span>
);
