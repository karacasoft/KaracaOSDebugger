import * as React from 'react';
import { Tab, Tabs, AppBar } from '@material-ui/core';

interface RightSideBarProps {
  children: React.ReactNode[];
  tabHeaders: string[];
}

interface RightSideBarState {
  activeTab: number;
}

class RightSideBar extends React.Component<RightSideBarProps, RightSideBarState> {
  
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }
  
  handleChangeTab = (ev, value) => {
    this.setState({
      activeTab: value,
    });
  }
  
  render() {
    const { children, tabHeaders } = this.props;
    const { activeTab } = this.state;
    
    return <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={this.handleChangeTab}>
          {tabHeaders.map(header => (<Tab key={header} label={header} />))}
        </Tabs>
      </AppBar>
      {children[activeTab]}
    </div>;
  }
}

export default RightSideBar;