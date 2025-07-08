import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../components/UI/Card';
import { StatsCard } from './components/StatsCard';
import { ExpenseChart } from './components/ExpenseChart';
import { RecentTransactions } from './components/RecentTransactions';
import { GoalsProgress } from './components/GoalsProgress';
import { transactions, goals, Transaction, Goal } from '../../lib/supabase';
import { TrendingUp, TrendingDown, Target, DollarSign } from 'lucide-react';
import { formatCurrency, getCurrentCurrency } from '../../lib/supabase';

export const Dashboard: React.FC = () => {
  const [transactionData, setTransactionData] = useState<Transaction[]>([]);
  const [goalData, setGoalData] = useState<Goal[]>([]);
  const [previousMonthData, setPreviousMonthData] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentDate = new Date();
      const currentMonth = currentDate.toISOString().slice(0, 7);
      const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
        .toISOString().slice(0, 7);

      const [transactionsResult, goalsResult] = await Promise.all([
        transactions.getAll(),
        goals.getAll(),
      ]);

      if (transactionsResult.data) {
        setTransactionData(transactionsResult.data);
        
        // Separate current and previous month data
        const currentMonthTransactions = transactionsResult.data.filter(
          t => t.date.startsWith(currentMonth)
        );
        const previousMonthTransactions = transactionsResult.data.filter(
          t => t.date.startsWith(previousMonth)
        );
        setPreviousMonthData(previousMonthTransactions);
      }
      if (goalsResult.data) {
        setGoalData(goalsResult.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthTransactions = transactionData.filter(
    t => t.date.startsWith(currentMonth)
  );

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const savings = totalIncome - totalExpenses;

  // Calculate previous month statistics for comparison
  const previousMonthIncome = previousMonthData
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const previousMonthExpenses = previousMonthData
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const previousMonthSavings = previousMonthIncome - previousMonthExpenses;

  // Calculate percentage changes
  const incomeChange = previousMonthIncome > 0 
    ? ((totalIncome - previousMonthIncome) / previousMonthIncome) * 100 
    : 0;

  const expenseChange = previousMonthExpenses > 0 
    ? ((totalExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 
    : 0;

  const savingsChange = previousMonthSavings !== 0 
    ? ((savings - previousMonthSavings) / Math.abs(previousMonthSavings)) * 100 
    : 0;

  const expensesByCategory = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Income"
          value={totalIncome}
          change={incomeChange}
          icon={<TrendingUp className="w-6 h-6" />}
          color="emerald"
          showChange={previousMonthIncome > 0}
        />
        <StatsCard
          title="Total Expenses"
          value={totalExpenses}
          change={expenseChange}
          icon={<TrendingDown className="w-6 h-6" />}
          color="red"
          showChange={previousMonthExpenses > 0}
        />
        <StatsCard
          title="Savings"
          value={savings}
          change={savingsChange}
          icon={<DollarSign className="w-6 h-6" />}
          color={savings > 0 ? "emerald" : "red"}
          showChange={previousMonthSavings !== 0}
        />
        <StatsCard
          title="Goals"
          value={goalData.length}
          icon={<Target className="w-6 h-6" />}
          color="blue"
          isNumber
          showChange={false}
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Expense Breakdown
          </h3>
          <ExpenseChart data={chartData} />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Transactions
          </h3>
          <RecentTransactions transactions={transactionData.slice(0, 5)} />
        </Card>
      </div>

      {/* Goals Progress */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Goals Progress
        </h3>
        <GoalsProgress goals={goalData} currentSavings={savings} />
      </Card>
    </div>
  );
};