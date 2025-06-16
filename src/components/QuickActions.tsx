import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Button,
  Card,
  CardHeader,
  CardPreview,
  Dropdown,
  Option,
  Textarea,
} from '@fluentui/react-components';
import {
  DocumentText24Regular,
  Edit24Regular,
  DocumentAdd24Regular,
  Wand24Regular,
} from '@fluentui/react-icons';
import { wordService } from '../services/wordService';
import { aiService } from '../services/aiService';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  actionCard: {
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow8)',
    },
  },
  actionContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  modal: {
    ...shorthands.padding('16px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
});

interface Action {
  id: string;
  title: string;
  description: string;
  icon: React.ReactElement;
  action: () => void;
}

export function QuickActions() {
  const classes = useStyles();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [clauseType, setClauseType] = useState('');
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImproveText = async () => {
    setIsProcessing(true);
    try {
      const selectedText = await wordService.getSelectedText();
      if (!selectedText) {
        alert('Please select some text first');
        return;
      }
      
      const improvedText = await aiService.improveText(selectedText, instruction || 'Make it more concise and professional');
      await wordService.insertText(improvedText);
      setActiveAction(null);
      setInstruction('');
    } catch (error) {
      console.error('Failed to improve text:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDraftClause = async () => {
    setIsProcessing(true);
    try {
      const context = await wordService.getDocumentText();
      const clause = await aiService.draftClause(clauseType, context.slice(0, 500));
      await wordService.insertText(clause, 'after');
      setActiveAction(null);
      setClauseType('');
    } catch (error) {
      console.error('Failed to draft clause:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const actions: Action[] = [
    {
      id: 'analyze',
      title: 'Analyze Selection',
      description: 'Get AI analysis of selected text',
      icon: <DocumentText24Regular />,
      action: async () => {
        const selectedText = await wordService.getSelectedText();
        if (!selectedText) {
          alert('Please select some text first');
          return;
        }
        const analysis = await aiService.analyzeText({
          text: selectedText,
          type: 'review',
        });
        // Show analysis results
        console.log(analysis);
      },
    },
    {
      id: 'improve',
      title: 'Improve Text',
      description: 'Enhance selected text with AI',
      icon: <Edit24Regular />,
      action: () => setActiveAction('improve'),
    },
    {
      id: 'draft',
      title: 'Draft Clause',
      description: 'Generate a new clause',
      icon: <DocumentAdd24Regular />,
      action: () => setActiveAction('draft'),
    },
    {
      id: 'suggest',
      title: 'Smart Suggestions',
      description: 'Get AI-powered suggestions',
      icon: <Wand24Regular />,
      action: async () => {
        const documentText = await wordService.getDocumentText();
        const analysis = await aiService.analyzeText({
          text: documentText.slice(0, 2000),
          type: 'suggest',
          options: {
            stance: 'neutral',
          },
        });
        // Show suggestions
        console.log(analysis);
      },
    },
  ];

  return (
    <div className={classes.root}>
      {activeAction === null ? (
        actions.map((action) => (
          <Card
            key={action.id}
            className={classes.actionCard}
            onClick={action.action}
          >
            <CardHeader
              header={<Text weight="semibold">{action.title}</Text>}
            />
            <CardPreview>
              <div className={classes.actionContent}>
                {action.icon}
                <Text size={300}>{action.description}</Text>
              </div>
            </CardPreview>
          </Card>
        ))
      ) : (
        <Card>
          <CardHeader
            header={
              <Text weight="semibold">
                {activeAction === 'improve' ? 'Improve Text' : 'Draft Clause'}
              </Text>
            }
          />
          <CardPreview>
            <div className={classes.modal}>
              {activeAction === 'improve' ? (
                <>
                  <Textarea
                    placeholder="Enter instructions (e.g., 'Make it more formal', 'Simplify language')"
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value)}
                    rows={3}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      appearance="primary"
                      onClick={handleImproveText}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Improve'}
                    </Button>
                    <Button
                      appearance="secondary"
                      onClick={() => {
                        setActiveAction(null);
                        setInstruction('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Dropdown
                    placeholder="Select clause type"
                    value={clauseType}
                    onOptionSelect={(_, data) => setClauseType(data.optionValue as string)}
                  >
                    <Option value="confidentiality">Confidentiality</Option>
                    <Option value="termination">Termination</Option>
                    <Option value="liability">Limitation of Liability</Option>
                    <Option value="indemnification">Indemnification</Option>
                    <Option value="warranty">Warranty</Option>
                    <Option value="force-majeure">Force Majeure</Option>
                  </Dropdown>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button
                      appearance="primary"
                      onClick={handleDraftClause}
                      disabled={!clauseType || isProcessing}
                    >
                      {isProcessing ? 'Drafting...' : 'Draft'}
                    </Button>
                    <Button
                      appearance="secondary"
                      onClick={() => {
                        setActiveAction(null);
                        setClauseType('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardPreview>
        </Card>
      )}
    </div>
  );
}