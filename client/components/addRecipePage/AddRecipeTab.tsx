/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux'
import UrlAddForm from '../forms/urlAddForm';
import { clearKeywordResult } from '../../slices/modalSlice';
import APIAddForm from '../forms/ApiAddForm';
import { FC, SyntheticEvent } from 'react';

interface TabPanelProps {
  value: Number;
  index: Number;
  children: React.ReactNode;
} 

// function TabPanel(props) {
const TabPanel: FC<TabPanelProps> = (props) => {

  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const dispatch = useDispatch();

  // const handleChange = (event, newValue) => {
    const handleChange = (event: SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
    dispatch(clearKeywordResult())
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Food Network or Epicurious" />
          <Tab label="Keyword Search" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <UrlAddForm />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <APIAddForm />
      </TabPanel>
    </Box>
  );
}
