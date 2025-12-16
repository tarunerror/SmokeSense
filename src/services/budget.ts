import * as SecureStore from 'expo-secure-store';
import { Budget, BudgetStatus } from '../types/models';
import { databaseService } from './database';

const BUDGET_KEY = 'user_budget';

class BudgetService {
  async getBudget(): Promise<Budget | null> {
    try {
      const budgetJson = await SecureStore.getItemAsync(BUDGET_KEY);
      if (!budgetJson) return null;
      return JSON.parse(budgetJson) as Budget;
    } catch (error) {
      console.error('Failed to get budget:', error);
      return null;
    }
  }

  async setBudget(dailyLimit: number): Promise<Budget> {
    try {
      const now = Date.now();
      const budget: Budget = {
        dailyLimit,
        createdAt: now,
        updatedAt: now,
      };

      await SecureStore.setItemAsync(BUDGET_KEY, JSON.stringify(budget));
      return budget;
    } catch (error) {
      console.error('Failed to set budget:', error);
      throw error;
    }
  }

  async updateBudget(dailyLimit: number): Promise<Budget> {
    try {
      const existingBudget = await this.getBudget();
      const now = Date.now();

      const budget: Budget = {
        dailyLimit,
        createdAt: existingBudget?.createdAt || now,
        updatedAt: now,
      };

      await SecureStore.setItemAsync(BUDGET_KEY, JSON.stringify(budget));
      return budget;
    } catch (error) {
      console.error('Failed to update budget:', error);
      throw error;
    }
  }

  async deleteBudget(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(BUDGET_KEY);
    } catch (error) {
      console.error('Failed to delete budget:', error);
      throw error;
    }
  }

  async getBudgetStatus(): Promise<BudgetStatus | null> {
    try {
      const budget = await this.getBudget();
      if (!budget) return null;

      const todayCount = await this.getTodayCount();
      const percentage = Math.min((todayCount / budget.dailyLimit) * 100, 100);
      const remaining = Math.max(budget.dailyLimit - todayCount, 0);

      return {
        budget,
        todayCount,
        percentage,
        remaining,
      };
    } catch (error) {
      console.error('Failed to get budget status:', error);
      return null;
    }
  }

  async getTodayCount(): Promise<number> {
    try {
      const startOfDay = this.getStartOfDay();
      const endOfDay = this.getEndOfDay();

      return await databaseService.getLogCount(startOfDay, endOfDay);
    } catch (error) {
      console.error('Failed to get today count:', error);
      return 0;
    }
  }

  private getStartOfDay(): number {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.getTime();
  }

  private getEndOfDay(): number {
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return now.getTime();
  }

  async isOverBudget(): Promise<boolean> {
    const status = await this.getBudgetStatus();
    if (!status) return false;
    return status.todayCount >= status.budget.dailyLimit;
  }
}

export const budgetService = new BudgetService();
