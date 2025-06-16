import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Button,
  Card,
  CardHeader,
  CardPreview,
  Badge,
  Spinner,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import { CheckmarkCircle24Regular, DismissCircle24Regular } from '@fluentui/react-icons';
import { wordService } from '../services/wordService';
import { aiService } from '../services/aiService';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  reviewButton: {
    alignSelf: 'flex-start',
  },
  issues: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  issueCard: {
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow8)',
    },
  },
  issueActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  loading: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    ...shorthands.padding('16px'),
  },
});

interface Issue {
  issue: string;
  severity: 'high' | 'medium' | 'low';
  location: string;
  recommendation: string;
}

export function DocumentReview() {
  const classes = useStyles();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);
  const [error, setError] = useState('');

  const runReview = async () => {
    setIsReviewing(true);
    setError('');
    setIssues([]);

    try {
      const documentText = await wordService.getDocumentText();
      const reviewResults = await aiService.generalReview(documentText);
      setIssues(reviewResults);
    } catch (err) {
      setError('Failed to review document. Please try again.');
    } finally {
      setIsReviewing(false);
    }
  };

  const highlightIssue = async (issue: Issue) => {
    try {
      await wordService.highlightText(issue.location);
    } catch (err) {
      console.error('Failed to highlight text:', err);
    }
  };

  const applyRecommendation = async (issue: Issue) => {
    try {
      const selectedText = await wordService.getSelectedText();
      if (selectedText) {
        const improvedText = await aiService.improveText(selectedText, issue.recommendation);
        await wordService.insertText(improvedText);
      }
    } catch (err) {
      console.error('Failed to apply recommendation:', err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'informative';
      default: return 'brand';
    }
  };

  return (
    <div className={classes.root}>
      <Button
        appearance="primary"
        className={classes.reviewButton}
        onClick={runReview}
        disabled={isReviewing}
      >
        {isReviewing ? 'Reviewing...' : 'Run Document Review'}
      </Button>

      {error && (
        <MessageBar intent="error">
          <MessageBarBody>{error}</MessageBarBody>
        </MessageBar>
      )}

      {isReviewing && (
        <div className={classes.loading}>
          <Spinner size="small" />
          <Text>Analyzing document...</Text>
        </div>
      )}

      {issues.length > 0 && (
        <>
          <Text size={500} weight="semibold">
            Found {issues.length} issue{issues.length !== 1 ? 's' : ''}
          </Text>
          
          <div className={classes.issues}>
            {issues.map((issue, index) => (
              <Card
                key={index}
                className={classes.issueCard}
                onClick={() => highlightIssue(issue)}
              >
                <CardHeader
                  header={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Text weight="semibold">{issue.issue}</Text>
                      <Badge color={getSeverityColor(issue.severity)}>
                        {issue.severity}
                      </Badge>
                    </div>
                  }
                />
                <CardPreview>
                  <Text size={200} block>
                    Location: {issue.location}
                  </Text>
                  <Text size={300} block style={{ marginTop: '8px' }}>
                    {issue.recommendation}
                  </Text>
                  <div className={classes.issueActions}>
                    <Button
                      appearance="primary"
                      size="small"
                      icon={<CheckmarkCircle24Regular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        applyRecommendation(issue);
                      }}
                    >
                      Apply
                    </Button>
                    <Button
                      appearance="secondary"
                      size="small"
                      icon={<DismissCircle24Regular />}
                      onClick={(e) => {
                        e.stopPropagation();
                        // Dismiss logic here
                      }}
                    >
                      Dismiss
                    </Button>
                  </div>
                </CardPreview>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}