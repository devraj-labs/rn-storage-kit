export type TDebugTab = 'data' | 'logs';
export type TSortOrder = 'newest' | 'oldest';

export type TDataRowProps = {
  itemKey: string;
  value: string;
};

export type TTabBarProps = {
  active: TDebugTab;
  onChange: (tab: TDebugTab) => void;
};
