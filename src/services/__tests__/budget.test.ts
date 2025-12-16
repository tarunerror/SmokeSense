import { budgetService } from '../budget';
import { databaseService } from '../database';
import * as SecureStore from 'expo-secure-store';

jest.mock('expo-secure-store');
jest.mock('../database');

describe('BudgetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('setBudget', () => {
    it('should set a new budget', async () => {
      const mockSetItem = jest.spyOn(SecureStore, 'setItemAsync').mockResolvedValue();

      const budget = await budgetService.setBudget(10);

      expect(budget.dailyLimit).toBe(10);
      expect(budget.createdAt).toBeDefined();
      expect(budget.updatedAt).toBeDefined();
      expect(mockSetItem).toHaveBeenCalledWith(
        'user_budget',
        expect.stringContaining('"dailyLimit":10')
      );
    });
  });

  describe('getBudget', () => {
    it('should return budget when it exists', async () => {
      const mockBudget = {
        dailyLimit: 15,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(JSON.stringify(mockBudget));

      const budget = await budgetService.getBudget();

      expect(budget).toEqual(mockBudget);
    });

    it('should return null when budget does not exist', async () => {
      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(null);

      const budget = await budgetService.getBudget();

      expect(budget).toBeNull();
    });
  });

  describe('updateBudget', () => {
    it('should update existing budget', async () => {
      const existingBudget = {
        dailyLimit: 10,
        createdAt: Date.now() - 10000,
        updatedAt: Date.now() - 10000,
      };

      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(JSON.stringify(existingBudget));
      const mockSetItem = jest.spyOn(SecureStore, 'setItemAsync').mockResolvedValue();

      const updatedBudget = await budgetService.updateBudget(20);

      expect(updatedBudget.dailyLimit).toBe(20);
      expect(updatedBudget.createdAt).toBe(existingBudget.createdAt);
      expect(updatedBudget.updatedAt).toBeGreaterThan(existingBudget.updatedAt);
      expect(mockSetItem).toHaveBeenCalled();
    });
  });

  describe('getBudgetStatus', () => {
    it('should return budget status with correct calculations', async () => {
      const mockBudget = {
        dailyLimit: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(JSON.stringify(mockBudget));
      jest.spyOn(databaseService, 'getLogCount').mockResolvedValue(6);

      const status = await budgetService.getBudgetStatus();

      expect(status).not.toBeNull();
      expect(status!.budget.dailyLimit).toBe(10);
      expect(status!.todayCount).toBe(6);
      expect(status!.percentage).toBe(60);
      expect(status!.remaining).toBe(4);
    });

    it('should cap percentage at 100%', async () => {
      const mockBudget = {
        dailyLimit: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(JSON.stringify(mockBudget));
      jest.spyOn(databaseService, 'getLogCount').mockResolvedValue(15);

      const status = await budgetService.getBudgetStatus();

      expect(status!.percentage).toBe(100);
      expect(status!.remaining).toBe(0);
    });

    it('should return null when no budget is set', async () => {
      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(null);

      const status = await budgetService.getBudgetStatus();

      expect(status).toBeNull();
    });
  });

  describe('isOverBudget', () => {
    it('should return true when over budget', async () => {
      const mockBudget = {
        dailyLimit: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(JSON.stringify(mockBudget));
      jest.spyOn(databaseService, 'getLogCount').mockResolvedValue(12);

      const isOver = await budgetService.isOverBudget();

      expect(isOver).toBe(true);
    });

    it('should return false when under budget', async () => {
      const mockBudget = {
        dailyLimit: 10,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      jest.spyOn(SecureStore, 'getItemAsync').mockResolvedValue(JSON.stringify(mockBudget));
      jest.spyOn(databaseService, 'getLogCount').mockResolvedValue(5);

      const isOver = await budgetService.isOverBudget();

      expect(isOver).toBe(false);
    });
  });

  describe('deleteBudget', () => {
    it('should delete budget', async () => {
      const mockDelete = jest.spyOn(SecureStore, 'deleteItemAsync').mockResolvedValue();

      await budgetService.deleteBudget();

      expect(mockDelete).toHaveBeenCalledWith('user_budget');
    });
  });
});
