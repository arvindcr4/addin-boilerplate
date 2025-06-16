import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  shorthands,
  Text,
  Button,
  ProgressBar,
  Card,
  CardHeader,
  CardPreview,
} from '@fluentui/react-components';
import { wordService } from '../services/wordService';
import { aiService } from '../services/aiService';

const useStyles = makeStyles({
  root: {
    ...shorthands.padding('24px'),
  },
  card: {
    marginBottom: '16px',
  },
  stats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px',
  },
  statCard: {
    ...shorthands.padding('16px'),
  },
  benchmarkResults: {
    marginTop: '24px',
  },
  resultItem: {
    ...shorthands.padding('12px'),
    ...shorthands.borderBottom('1px', 'solid', 'var(--colorNeutralStroke1)'),
  },
});

interface BenchmarkResult {
  task: string;
  time: number;
  status: 'success' | 'error';
  error?: string;
}

export function Benchmark() {
  const classes = useStyles();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<BenchmarkResult[]>([]);
  const [documentStats, setDocumentStats] = useState({
    wordCount: 0,
    characterCount: 0,
  });

  useEffect(() => {
    loadDocumentStats();
  }, []);

  const loadDocumentStats = async () => {
    try {
      const [text, wordCount] = await Promise.all([
        wordService.getDocumentText(),
        wordService.getWordCount(),
      ]);
      setDocumentStats({
        wordCount,
        characterCount: text.length,
      });
    } catch (error) {
      console.error('Failed to load document stats:', error);
    }
  };

  const runBenchmark = async () => {
    setIsRunning(true);
    setProgress(0);
    setResults([]);

    const benchmarkTasks = [
      {
        name: 'Get selected text',
        task: () => wordService.getSelectedText(),
      },
      {
        name: 'Get document text',
        task: () => wordService.getDocumentText(),
      },
      {
        name: 'General review',
        task: async () => {
          const text = await wordService.getDocumentText();
          return aiService.generalReview(text.slice(0, 1000)); // Limit for benchmark
        },
      },
      {
        name: 'Draft sample clause',
        task: () => aiService.draftClause('confidentiality', 'software development agreement'),
      },
    ];

    const newResults: BenchmarkResult[] = [];

    for (let i = 0; i < benchmarkTasks.length; i++) {
      const { name, task } = benchmarkTasks[i];
      const startTime = performance.now();

      try {
        await task();
        const endTime = performance.now();
        newResults.push({
          task: name,
          time: endTime - startTime,
          status: 'success',
        });
      } catch (error) {
        const endTime = performance.now();
        newResults.push({
          task: name,
          time: endTime - startTime,
          status: 'error',
          error: (error as Error).message,
        });
      }

      setProgress((i + 1) / benchmarkTasks.length);
      setResults([...newResults]);
    }

    setIsRunning(false);
  };

  return (
    <div className={classes.root}>
      <Text as="h1" size={800} weight="semibold">
        Performance Benchmark
      </Text>
      
      <div className={classes.stats}>
        <Card className={classes.statCard}>
          <CardHeader header={<Text weight="semibold">Word Count</Text>} />
          <CardPreview>
            <Text size={600}>{documentStats.wordCount.toLocaleString()}</Text>
          </CardPreview>
        </Card>
        
        <Card className={classes.statCard}>
          <CardHeader header={<Text weight="semibold">Character Count</Text>} />
          <CardPreview>
            <Text size={600}>{documentStats.characterCount.toLocaleString()}</Text>
          </CardPreview>
        </Card>
      </div>

      <Button
        appearance="primary"
        disabled={isRunning}
        onClick={runBenchmark}
      >
        {isRunning ? 'Running Benchmark...' : 'Run Benchmark'}
      </Button>

      {isRunning && (
        <ProgressBar
          value={progress}
          max={1}
          thickness="large"
          shape="rounded"
          color="brand"
        />
      )}

      {results.length > 0 && (
        <div className={classes.benchmarkResults}>
          <Text as="h2" size={600} weight="semibold">
            Results
          </Text>
          {results.map((result, index) => (
            <div key={index} className={classes.resultItem}>
              <Text weight="semibold">{result.task}</Text>
              <Text block size={200}>
                Time: {result.time.toFixed(2)}ms
              </Text>
              {result.status === 'error' && (
                <Text block size={200} style={{ color: 'var(--colorPaletteRedForeground1)' }}>
                  Error: {result.error}
                </Text>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}