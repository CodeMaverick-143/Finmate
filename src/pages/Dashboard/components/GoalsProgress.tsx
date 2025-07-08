import React from 'react';
import { motion } from 'framer-motion';
import { Target, Calendar } from 'lucide-react';
import { Goal } from '../../../lib/supabase';
import { formatCurrency, getCurrentCurrency } from '../../../lib/supabase';

interface GoalsProgressProps {
  goals: Goal[];
  currentSavings: number;
}

export const GoalsProgress: React.FC<GoalsProgressProps> = ({ goals, currentSavings }) => {
  if (!goals || goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <Target className="w-8 h-8 mx-auto mb-2" />
        <p>No goals set yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {goals.map((goal, index) => {
        const progress = Math.min((currentSavings / Number(goal.goal_amount)) * 100, 100);
        const targetDate = new Date(goal.target_month);
        const isOverdue = targetDate < new Date();

        return (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {goal.goal_title}
              </h4>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="w-4 h-4 mr-1" />
                {targetDate.toLocaleDateString()}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {progress.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`h-2 rounded-full ${
                    isOverdue ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(currentSavings, getCurrentCurrency())}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {formatCurrency(Number(goal.goal_amount), getCurrentCurrency())}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};