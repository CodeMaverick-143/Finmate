import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../../../components/UI/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, getCurrentCurrency } from '../../../lib/supabase';

interface StatsCardProps {
  title: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  color: 'emerald' | 'red' | 'blue';
  isNumber?: boolean;
  showChange?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change = 0,
  icon,
  color,
  isNumber = false,
  showChange = true
}) => {
  const colorClasses = {
    emerald: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400',
    red: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400',
    blue: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
  };

  const formatValue = (val: number) => {
    if (isNumber) return val.toString();
    return formatCurrency(val, getCurrentCurrency());
  };

  return (
    <Card hover className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatValue(value)}
          </p>
          {!isNumber && showChange && change !== undefined && (
            <div className="flex items-center mt-2">
              {change > 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${
                change > 0 ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {Math.abs(change).toFixed(1)}%
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
};