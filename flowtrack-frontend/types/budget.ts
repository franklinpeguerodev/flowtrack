export type AlertLevel = "Normal" | "Warning50" | "Warning80" | "Exceeded";

export interface BudgetStatusDto {
  id: string;
  categoryId: string;
  categoryName: string;
  month: number;
  year: number;
  budgetAmount: number;
  spentAmount: number;
  percentageUsed: number;
  alertLevel: AlertLevel;
}

export interface BudgetCreateDto{
    categoryId: string;
    amount:number;
    month:number;
    year:number;

}
export interface BudgetUpdateDto {
  amount: number;
}

export interface BudgetResponseDto {
  id: string;
  categoryId: string;
  amount:number;
  month:number;
  year:number;
  createdAt:string;
}