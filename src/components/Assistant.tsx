import React, { useState, useRef, useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Textarea,
  Button,
  Card,
  CardPreview,
  Spinner,
} from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { wordService } from '../services/wordService';
import { aiService } from '../services/aiService';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  messages: {
    flexGrow: 1,
    ...shorthands.overflow('auto'),
    ...shorthands.padding('16px'),
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  message: {
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'var(--colorBrandBackground)',
    color: 'white',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'var(--colorNeutralBackground2)',
  },
  inputArea: {
    ...shorthands.padding('16px'),
    ...shorthands.borderTop('1px', 'solid', 'var(--colorNeutralStroke1)'),
    display: 'flex',
    gap: '8px',
  },
  textarea: {
    flexGrow: 1,
  },
});

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function Assistant() {
  const classes = useStyles();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let response = '';
      
      // Check if the message is asking about the document
      if (input.toLowerCase().includes('document') || input.toLowerCase().includes('text')) {
        const documentText = await wordService.getDocumentText();
        response = await aiService.askQuestion(documentText, input);
      } else if (input.toLowerCase().includes('selected') || input.toLowerCase().includes('selection')) {
        const selectedText = await wordService.getSelectedText();
        if (selectedText) {
          response = await aiService.askQuestion(selectedText, input);
        } else {
          response = "Please select some text first.";
        }
      } else {
        // General question
        response = await aiService.askQuestion('', input);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.messages}>
        {messages.length === 0 && (
          <Text align="center" size={300}>
            Ask me anything about your document or get help with contract drafting.
          </Text>
        )}
        {messages.map((message) => (
          <Card
            key={message.id}
            className={`${classes.message} ${
              message.role === 'user' ? classes.userMessage : classes.assistantMessage
            }`}
          >
            <CardPreview>
              <Text>{message.content}</Text>
            </CardPreview>
          </Card>
        ))}
        {isLoading && (
          <div className={classes.assistantMessage}>
            <Spinner size="tiny" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className={classes.inputArea}>
        <Textarea
          className={classes.textarea}
          placeholder="Ask a question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          resize="vertical"
        />
        <Button
          appearance="primary"
          icon={<Send24Regular />}
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
        />
      </div>
    </div>
  );
}