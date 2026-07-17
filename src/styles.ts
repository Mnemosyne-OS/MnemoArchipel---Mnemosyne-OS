import { baseStyles } from './styles/baseStyles';
import { componentStyles } from './styles/componentStyles';

/**
 * Combined stylesheet objects representing base layouts, timeline lists,
 * modals, and charts. Replaces the legacy monolithic styles object.
 */
export const styles = {
  ...baseStyles,
  ...componentStyles
};

// Simple context menu btn hover style hook using class
styles.contextMenuBtn = {
  ...styles.contextMenuBtn,
  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)'
  }
} as any;
