import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Target, Calendar, TrendingUp } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Modal } from '../../components/UI/Modal';
import { GoalForm } from './components/GoalForm';
import { GoalCard } from './components/GoalCard';
import { goals, transactions, Goal } from '../../lib/supabase';
import { formatCurrency, getCurrentCurrency } from '../../lib/supabase';

export const Goals: React.FC = () => {
  const [goalData, setGoalData] = useState<Goal[]>([]);
  const [currentSavings, setCurrentSavings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [goalsResult, transactionsResult] = await Promise.all([
        goals.getAll(),
        transactions.getAll()
      ]);

      if (goalsResult.data) {
        setGoalData(goalsResult.data);
      }

      if (transactionsResult.data) {
        // Calculate current savings
        const totalIncome = transactionsResult.data
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        const totalExpenses = transactionsResult.data
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        setCurrentSavings(totalIncome - totalExpenses);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    setEditingGoal(null);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsModalOpen(true);
  };

  const handleGoalSaved = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
    loadData();
  };

  const handleDeleteGoal = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const { error } = await goals.delete(id);
        if (error) throw error;
        loadData();
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

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
          Savings Goals
        </h1>
        <Button
          onClick={handleAddGoal}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Goal</span>
        </Button>
      </div>

      {/* Current Savings Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Current Savings
            </h3>
            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatCurrency(currentSavings, getCurrentCurrency())}
            </p>
          </div>
          <div className="text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-12 h-12" />
          </div>
        </div>
      </Card>

      {/* Goals Grid */}
      {goalData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goalData.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currentSavings={currentSavings}
              onEdit={handleEditGoal}
              onDelete={handleDeleteGoal}
              delay={index * 0.1}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <Target className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Goals Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Set your first savings goal to start tracking your progress
            </p>
            <Button onClick={handleAddGoal}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Goal
            </Button>
          </div>
        </Card>
      )}

      {/* Add/Edit Goal Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGoal ? 'Edit Goal' : 'Add New Goal'}
      >
        <GoalForm
          goal={editingGoal}
          onSave={handleGoalSaved}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};