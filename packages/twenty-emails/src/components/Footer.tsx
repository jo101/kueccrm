import { type I18n } from '@lingui/core';
import { Column, Container, Row } from 'react-email';
import { Link } from 'src/components/Link';
import { ShadowText } from 'src/components/ShadowText';

const footerContainerStyle = {
  marginTop: '12px',
};

type FooterProps = {
  i18n: I18n;
};

export const Footer = ({ i18n }: FooterProps) => {
  return (
    <Container style={footerContainerStyle}>
      <Row>
        <Column>
          <ShadowText>
            <Link
              href="https://crm.uventure.net/"
              value={i18n._('Open the CRM')}
              aria-label={i18n._('Open UVenture CRM')}
            />
          </ShadowText>
        </Column>
        <Column>
          <ShadowText>
            <Link
              href="https://uventure.net/"
              value={i18n._('UVenture')}
              aria-label={i18n._("Visit UVenture's website")}
            />
          </ShadowText>
        </Column>
      </Row>
      <ShadowText>
        <>
          {i18n._('UVenture by KUEC')}
          <br />
          {i18n._('Abu Dhabi')}
        </>
      </ShadowText>
    </Container>
  );
};
