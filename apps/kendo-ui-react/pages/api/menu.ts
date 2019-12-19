/**
 * Server
 */
interface MenuItem {
  title: string;
  route?: string;
  children: MenuItem[];
}

/**
 * Server menu config.
 */
const MENU: MenuItem[] = [
  {
    title: 'Home',
    route: '/',
    children: []
  },
  {
    title: 'Test pages',
    children: [
      {
        title: 'Test 1',
        route: '/test',
        children: []
      },
      {
        title: 'Test 2 & 3',
        children: [
          {
            title: 'Test 2',
            route: '/test2',
            children: []
          },
          {
            title: 'Test 3',
            route: '/test3',
            children: []
          }
        ]
      }
    ]
  }
];

/**
 * Add keys required by the Kendo menu dynamically.
 */
interface MenuItemWithKey extends Omit<MenuItem, 'children'> {
  children: MenuItemWithKey[];
  key: string;
}

const addKeysToMenu = (menu: MenuItem[], key = ''): MenuItemWithKey[] =>
  (menu as MenuItemWithKey[]).map((menuItem, index) => {
    menuItem.key = `${key}.${index}`;
    menuItem.children = addKeysToMenu(menuItem.children, menuItem.key);
    return menuItem;
  });

/**
 * Create endpoint for menu.
 */
export default (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.end(JSON.stringify({ menu: addKeysToMenu(MENU) }));
};
