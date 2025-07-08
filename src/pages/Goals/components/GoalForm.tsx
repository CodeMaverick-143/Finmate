import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { goals, Goal } from '../../../lib/supabase';

interface GoalFormProps {
  goal?: Goal | null;
  onSave: () => void;
  onCancel: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({
  goal,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    goal_title: goal?.goal_title || '',
    goal_amount: goal?.goal_amount.toString() || '',
    target_month: goal?.target_month || ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.goal_title.trim()) {
      newErrors.goal_title = 'Goal title is required';
    }
    if (!formData.goal_amount || Number(formData.goal_amount) <= 0) {
      newErrors.goal_amount = 'Goal amount must be greater than 0';
    }
    if (!formData.target_month) {
      newErrors.target_month = 'Target month is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const goalData = {
        ...formData,
        goal_amount: Number(formData.goal_amount),
        target_month: formData.target_month + '-01'
      };

      if (goal) {
        await goals.update(goal.id, goalData);
      } else {
        await goals.create(goalData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving goal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <Input
        label="Goal Title"
        name="goal_title"
        value={formData.goal_title}
        onChange={handleChange}
        placeholder="e.g., Emergency Fund, Vacation, New Laptop"
        required
        error={errors.goal_title}
      />

      <Input
        label="Target Amount"
        type="number"
        name="goal_amount"
        value={formData.goal_amount}
        onChange={handleChange}
        placeholder="0.00"
        step="0.01"
        min="0"
        required
        error={errors.goal_amount}
      />

      <Input
        label="Target Month"
        type="month"
        name="target_month"
        value={formData.target_month}
        onChange={handleChange}
        required
        error={errors.target_month}
      />

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {goal ? 'Update' : 'Create'} Goal
        </Button>
      </div>
    </motion.form>
  );
};