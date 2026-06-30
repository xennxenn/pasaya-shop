export interface BudgetItem {
  id: string;
  category: string;
  subCategory: string;
  amount: number;
  note: string;
}

export interface ShowroomZone {
  id: string;
  name: string;
  floor: 1 | 2;
  description: string;
  products: string[];
  keyFeature: string;
  icon: string;
}

export interface ProjectMilestone {
  period: string;
  revenue: number;
  description: string;
}

export interface FlagshipPresentationState {
  currentSlideIndex: number;
  isEditMode: boolean;
  projectName: string;
  location: string;
  selectedZoneId: string | null;
  budgetItems: BudgetItem[];
  customProposal: string;
  isGeneratingProposal: boolean;
}
