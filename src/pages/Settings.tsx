import React from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Dropdown,
  Option,
  Switch,
  Button,
  Divider,
} from '@fluentui/react-components';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles({
  root: {
    ...shorthands.padding('24px'),
    maxWidth: '600px',
    margin: '0 auto',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    marginBottom: '16px',
  },
  setting: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  userInfo: {
    ...shorthands.padding('16px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: 'var(--colorNeutralBackground2)',
    marginBottom: '16px',
  },
});

export function Settings() {
  const classes = useStyles();
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className={classes.root}>
      <Text as="h1" size={800} weight="semibold">
        Settings
      </Text>

      <div className={classes.section}>
        <Text as="h2" size={600} weight="semibold" className={classes.sectionTitle}>
          Account
        </Text>
        {user && (
          <div className={classes.userInfo}>
            <Text block>{user.name}</Text>
            <Text block size={200}>{user.email}</Text>
          </div>
        )}
        <Button appearance="secondary" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <Divider />

      <div className={classes.section}>
        <Text as="h2" size={600} weight="semibold" className={classes.sectionTitle}>
          Appearance
        </Text>
        <div className={classes.setting}>
          <Text>Theme</Text>
          <Dropdown
            value={theme}
            onOptionSelect={(_, data) => setTheme(data.optionValue as any)}
          >
            <Option value="system">System</Option>
            <Option value="light">Light</Option>
            <Option value="dark">Dark</Option>
          </Dropdown>
        </div>
      </div>

      <Divider />

      <div className={classes.section}>
        <Text as="h2" size={600} weight="semibold" className={classes.sectionTitle}>
          AI Preferences
        </Text>
        <div className={classes.setting}>
          <Text>Default negotiation stance</Text>
          <Dropdown defaultValue="neutral">
            <Option value="customer">Customer</Option>
            <Option value="provider">Service Provider</Option>
            <Option value="neutral">Neutral</Option>
          </Dropdown>
        </div>
        <div className={classes.setting}>
          <Text>Auto-apply suggestions</Text>
          <Switch defaultChecked={false} />
        </div>
        <div className={classes.setting}>
          <Text>Show confidence scores</Text>
          <Switch defaultChecked={true} />
        </div>
      </div>

      <Divider />

      <div className={classes.section}>
        <Text as="h2" size={600} weight="semibold" className={classes.sectionTitle}>
          About
        </Text>
        <Text block size={200}>
          Spellbook Word Add-in v1.0.0
        </Text>
        <Text block size={200}>
          © 2024 Spellbook Inc.
        </Text>
      </div>
    </div>
  );
}