import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import './Menu.scss';
import {
  PanelBar,
  PanelBarItem,
  PanelBarSelectEventArguments
} from '@progress/kendo-react-layout';
import { Normalized } from '../../utils/normalization.utils';

export interface MenuItem {
  title: string;
  route?: string;
  children: MenuItem[];
  key: string;
}

interface MenuProps {
  menu: MenuItem[];
  menuNormalized: Normalized<MenuItem>[];
}

export const Menu: React.FC<MenuProps> = ({ menu, menuNormalized }) => {
  const router = useRouter();
  console.log(menu);

  const [selected, setSelected] = useState<MenuItem>(
    menuNormalized[router.asPath]
  );

  useEffect(() => {
    setSelected(menuNormalized[router.asPath]);
  }, [router.asPath]);

  const onSelectPanelBarItem = ({ target }: PanelBarSelectEventArguments) => {
    const route = target.props.route;
    if (route) {
      router.push(route);
    }
  };

  const createPanelBarItems = (menu: MenuItem[]) =>
    menu.map(({ title, route, children, key }) => (
      <PanelBarItem
        title={title}
        route={route}
        key={route || '' + title}
        expanded={selected.key.startsWith(key)}
      >
        {children.length > 0 && createPanelBarItems(children)}
      </PanelBarItem>
    ));

  return (
    <PanelBar onSelect={onSelectPanelBarItem} selected={selected.key}>
      {createPanelBarItems(menu)}
    </PanelBar>
  );
};

export default Menu;
