import { TDebugTab } from '../storage-debug-screen-types';

export type TDebugHeaderProps = {
  activeTab: TDebugTab;
  onClearLogs: () => void;
  onClearData: () => void;
  onClose: () => void;
};
