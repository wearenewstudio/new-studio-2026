import { readonly } from 'vue';

export const useMenu = () => {
  const isMenuOpen = useState<boolean>('menu-open', () => false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const closeMenu = () => {
    isMenuOpen.value = false;
  };

  const openMenu = () => {
    isMenuOpen.value = true;
  };

  return {
    isMenuOpen: readonly(isMenuOpen),
    toggleMenu,
    closeMenu,
    openMenu,
  };
};

