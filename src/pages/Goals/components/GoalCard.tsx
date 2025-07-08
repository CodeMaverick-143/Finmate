import React from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Calendar, Target } from 'lucide-react';
import { Card } from '../../../components/UI/Card';
import { Button } from '../../../components/UI/Button';
import { Goal } from '../../../lib/supabase';
import { formatCurrency, getCurrentCurrency } from '../../../lib/supabase';

interface GoalCardProps {
  goal: Goal;
  currentSavings: number;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  currentSavings,
  onEdit,
  onDelete,
  delay = 0
}) => {
  const progress = Math.min((currentSavings / Number(goal.goal_amount)) * 100, 100);
  const targetDate = new Date(goal.target_month);
  const isOverdue = targetDate < new Date();
  const isCompleted = progress >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card hover className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isCompleted 
                ? 'bg-emerald-100 dark:bg-emerald-900/50' 
                : isOverdue 
                  ? 'bg-red-100 dark:bg-red-900/50' 
                  : 'bg-blue-100 dark:bg-blue-900/50'
            }`}>
              <Target className={`w-5 h-5 ${
                isCompleted 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : isOverdue 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-blue-600 dark:text-blue-400'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {goal.goal_title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                <Calendar className="w-4 h-4 mr-1" />
                {targetDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(goal)}
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(goal.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Progress
            </span>
            <span className={`text-sm font-medium ${
              isCompleted 
                ? 'text-emerald-600 dark:text-emerald-400' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {progress.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, delay }}
              className={`h-2 rounded-full ${
                isCompleted 
                  ? 'bg-emerald-500' 
                  : isOverdue 
                    ? 'bg-red-500' 
                    : 'bg-blue-500'
              }`}
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(Math.min(currentSavings, Number(goal.goal_amount)), getCurrentCurrency())}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatCurrency(Number(goal.goal_amount), getCurrentCurrency())}
            </span>
          </div>

          {isCompleted && (
            <div className="text-center py-2">
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                🎉 Goal Achieved!
              </span>
            </div>
          )}

          {isOverdue && !isCompleted && (
            <div className="text-center py-2">
              <span className="text-sm font-medium text-red-600 dark:text-red-400">
                ⏰ Overdue
              </span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};