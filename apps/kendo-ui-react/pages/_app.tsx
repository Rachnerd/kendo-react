import React from 'react';
import App from 'next/app';
import { Splitter, SplitterPaneProps } from '@progress/kendo-react-layout';
import './_app.scss';
import '@progress/kendo-theme-default/dist/all.css';
import Menu, { MenuItem } from '../components/menu/Menu';
import fetch from 'isomorphic-fetch';
import { Normalized } from '../utils/normalization.utils';

const normalizeMenuByRoute = (menu: MenuItem[]): Normalized<MenuItem> =>
  menu.reduce(
    (normalizedMenu, menuItem) => ({
      ...normalizedMenu,
      ...(menuItem.route !== undefined ? { [menuItem.route]: menuItem } : {}),
      ...normalizeMenuByRoute(menuItem.children)
    }),
    {}
  );

const MENU_PANE_CONFIG: SplitterPaneProps = {
  size: '20%',
  min: '20px',
  resizable: false
};

const CONTENT_PANE_CONFIG: SplitterPaneProps = {};

class MyApp extends App<{}, {}> {
  static async getInitialProps() {
    const res = await fetch('http://localhost:4200/api/menu');
    const { menu } = await res.json();
    const menuNormalized = normalizeMenuByRoute(menu);
    return {
      pageProps: {
        menu,
        menuNormalized
      }
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    const { menu, menuNormalized } = pageProps;
    return (
      <Splitter panes={[MENU_PANE_CONFIG, CONTENT_PANE_CONFIG]}>
        <Menu menu={menu} menuNormalized={menuNormalized} />
        <Component {...pageProps} />
      </Splitter>
    );
  }
}

export default MyApp;
