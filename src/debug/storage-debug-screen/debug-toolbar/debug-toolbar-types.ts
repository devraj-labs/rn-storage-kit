import { TDebugTab, TSortOrder } from '../storage-debug-screen-types';

export type TDebugToolbarProps = {
  activeTab: TDebugTab;
  search: string;
  sort: TSortOrder;
  onSearch: (text: string) => void;
  onToggleSort: () => void;
  onRefresh: () => void;
};
