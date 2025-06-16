import React, { useState } from 'react';
import {
  makeStyles,
  shorthands,
  Tab,
  TabList,
  SelectTabEventHandler,
} from '@fluentui/react-components';
import { Assistant } from '../components/Assistant';
import { DocumentReview } from '../components/DocumentReview';
import { QuickActions } from '../components/QuickActions';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../components/Login';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    ...shorthands.overflow('hidden'),
  },
  header: {
    ...shorthands.padding('16px'),
    ...shorthands.borderBottom('1px', 'solid', 'var(--colorNeutralStroke1)'),
  },
  tabContent: {
    flexGrow: 1,
    ...shorthands.overflow('auto'),
    ...shorthands.padding('16px'),
  },
});

export function TaskPane() {
  const classes = useStyles();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedTab, setSelectedTab] = useState<string>('assistant');

  const onTabSelect: SelectTabEventHandler = (_, data) => {
    setSelectedTab(data.value as string);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <TabList selectedValue={selectedTab} onTabSelect={onTabSelect}>
          <Tab value="assistant">Assistant</Tab>
          <Tab value="review">Review</Tab>
          <Tab value="actions">Quick Actions</Tab>
        </TabList>
      </div>
      
      <div className={classes.tabContent}>
        {selectedTab === 'assistant' && <Assistant />}
        {selectedTab === 'review' && <DocumentReview />}
        {selectedTab === 'actions' && <QuickActions />}
      </div>
    </div>
  );
}