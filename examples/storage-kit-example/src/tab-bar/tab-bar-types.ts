export type TTab = 'todos' | 'storage';

export type TTabBarProps = {
  active: TTab;
  onChange: (tab: TTab) => void;
};
