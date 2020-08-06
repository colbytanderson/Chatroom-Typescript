import * as React from 'react';
import styled from 'styled-components';
import { Spinner } from '../node_modules/@blueprintjs/core';

const CenterContainer = styled.div`
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: 1fr auto 1fr;
`;

const Item = styled.div`
  grid-area: 2 / 2 / 3 / 3;
`;

const CenteredInContainer: React.ComponentType<any> = ({ children }) => (
  <CenterContainer>
    <Item>
      {children}
    </Item>
  </CenterContainer>
);

export class CenteredSpinner extends React.Component<{}, { ready: boolean }> {

  state = {
    ready: false,
  }

  timer: NodeJS.Timer | undefined;

  componentDidMount() {
    this.timer = setTimeout(() => this.setState({ ready: true }), 1000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer!);
  }

  render() {
    return (
      this.state.ready ?
        <CenteredInContainer>
          <Spinner />
        </CenteredInContainer> :
        <span />
    );
  }

};
