import { Alignment, Button, Navbar, NavbarDivider, NavbarGroup } from '@blueprintjs/core';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { toggleDarkMode } from './DarkMode';
import * as Shared from './SharedTypes';
import { redirectToLogin, signOut } from './Socket';

export const TopMenu = ({ user }: { user: Shared.User | null }) => (
  <Navbar>
    <NavbarGroup align={Alignment.LEFT}>
      <Link to="/" className='bp3-navbar-heading pt-button pt-minimal'>Chatroom Site</Link>
    </NavbarGroup>

    <NavbarGroup align={Alignment.RIGHT}>
      <Button icon="lightbulb" onClick={toggleDarkMode} />
      <NavbarDivider />
      {
        user
        &&
        (
          user.guest
            ?
            <Button intent='primary' onClick={redirectToLogin}>Sign up / Login</Button>
            :
            <Button minimal onClick={signOut}>Sign out</Button>
        )
      }
    </NavbarGroup>
  </Navbar>
);
