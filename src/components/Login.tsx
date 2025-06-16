import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Input,
  Button,
  Card,
  CardHeader,
  CardPreview,
} from '@fluentui/react-components';
import { useAuth } from '../contexts/AuthContext';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    ...shorthands.padding('24px'),
  },
  card: {
    width: '100%',
    maxWidth: '400px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    ...shorthands.padding('24px'),
  },
  error: {
    color: 'var(--colorPaletteRedForeground1)',
  },
});

export function Login() {
  const classes = useStyles();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardHeader header={<Text size={700} weight="semibold">Sign in to AI Assistant</Text>} />
        <CardPreview>
          <form onSubmit={handleSubmit} className={classes.form}>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
            {error && <Text className={classes.error}>{error}</Text>}
            <Button
              appearance="primary"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardPreview>
      </Card>
    </div>
  );
}