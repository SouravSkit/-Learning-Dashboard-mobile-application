import { createContext, useContext, type ReactNode } from 'react';
import {
  useDashboardViewModel,
  type DashboardViewModel,
} from '../viewModels/DashboardViewModel';

/// Shares one dashboard view model between the dashboard and details
/// screens (the Swift app kept the view model on the dashboard and
/// passed an `onUpdate` closure down to the details screen).
const CoursesContext = createContext<DashboardViewModel | null>(null);

export function CoursesProvider({ children }: { children: ReactNode }) {
  const viewModel = useDashboardViewModel();
  return <CoursesContext.Provider value={viewModel}>{children}</CoursesContext.Provider>;
}

export function useCourses(): DashboardViewModel {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCourses must be used within a CoursesProvider');
  }
  return context;
}
