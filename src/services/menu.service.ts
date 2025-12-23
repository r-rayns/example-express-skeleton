import {
  Menu,
  MenuItem,
  MenuSort,
  MenuType,
} from 'types/menu';
import { missingResource } from '@utils/errors';
import { SortOrder } from '../types/common';
import { orderBy } from 'es-toolkit';
import {
  randomUUID,
  UUID,
} from 'node:crypto';

export class MenuService {
  static readonly aleMenu: Readonly<Menu> = [
    {
      id: randomUUID(),
      name: 'Dwarven Spring',
      description: 'A smooth pale ale',
      price: 0.8,
    },
    {
      id: randomUUID(),
      name: 'Monk\'s Staff',
      description: 'A strong dark stout',
      price: 1.2,
    },
    {
      id: randomUUID(),
      name: 'Harvest Mist',
      description: 'A refreshing wheat beer',
      price: 1,
    },
  ];
  static readonly wineMenu: Readonly<Menu> = [
    {
      id: randomUUID(),
      name: 'Stargazer',
      description: 'Sauvignon Blanc, crisp and dry',
      price: 2.2,
    },
    {
      id: randomUUID(),
      name: 'Alexston Farmstead',
      description: 'Moscato, sweet dessert wine',
      price: 2.8,
    },
    {
      id: randomUUID(),
      name: 'Red Valley',
      description: 'Cabernet Sauvignon, full-bodied red',
      price: 2.5,
    },
  ];
  static readonly foodMenu: Readonly<Menu> = [
    {
      id: randomUUID(),
      name: 'Today\'s Special',
      description: 'Ask the bartender for today\'s special',
      price: 1.2,
    },
    {
      id: randomUUID(),
      name: 'Steak and Ale Pie',
      description: 'A hearty pie served with carrots and potatoes',
      price: 1.5,
    },
    {
      id: randomUUID(),
      name: 'Methi Matar Malai',
      description: 'Pea and fenugreek in a creamy curry sauce',
      price: 0.9,
    },
  ];

  private static menuMapping = new Map<MenuType, Readonly<Menu>>([
    [ MenuType.ALE, this.aleMenu ],
    [ MenuType.WINE, this.wineMenu ],
    [ MenuType.FOOD, this.foodMenu ],
  ]);

  public static getMenu(type: MenuType): Readonly<Menu> {
    const menu = this.menuMapping.get(type) ?? null;
    if (!menu) {
      throw missingResource(`Menu type ${ type } does not exist`);
    }
    return menu;
  }

  /**
   * Retrieves and sorts a menu by specified field and order
   */
  public static retrieve(menuType: MenuType, sort: MenuSort = MenuSort.NAME, order: SortOrder = SortOrder.ASC): Menu {
    const menu = this.getMenu(menuType);
    return orderBy(menu, [ sort ], [ order ]);
  }

  /**
   * Expands a menu, adding an item to it
   */
  public static add(menuType: MenuType, item: Omit<MenuItem, 'id'>): Menu {
    const menu = this.getMenu(menuType);
    const expandedMenu = [
      ...menu,
      { id: randomUUID(), ...item },
    ];
    // Update the menu mapping with the expanded menu
    this.menuMapping.set(menuType, expandedMenu);

    return expandedMenu;
  }

  /**
   * Reduces a menu, removing an existing item from it
   */
  public static remove(menuType: MenuType, id: UUID): boolean {
    const menu = this.getMenu(menuType);
    const reducedMenu = this.getMenuWithoutItem(menu, id);
    // Update the menu mapping with the reduced menu
    this.menuMapping.set(menuType, reducedMenu);

    return true;
  }

  /**
   * Filters a menu for a given menu item ID
   */
  private static getMenuWithoutItem(menu: Readonly<Menu>, id: UUID): MenuItem[] {
    const newMenu = menu.filter(item => {
      return item.id !== id;
    });
    if (newMenu.length === menu.length) {
      // Menu size did not change, item not found
      throw missingResource(`Menu item with id ${ id } not found`);
    }
    return newMenu;
  }
}
