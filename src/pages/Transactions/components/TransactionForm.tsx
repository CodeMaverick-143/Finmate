import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/UI/Button';
import { Input } from '../../../components/UI/Input';
import { Select } from '../../../components/UI/Select';
import { transactions, Transaction } from '../../../lib/supabase';

interface TransactionFormProps {
  transaction?: Transaction | null;
  onSave: () => void;
  onCancel: () => void;
}

const CATEGORIES = [
  { value: 'Food', label: 'Food & Dining' },
  { value: 'Transport', label: 'Transportation' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Bills', label: 'Bills & Utilities' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Education', label: 'Education' },
  { value: 'Salary', label: 'Salary' },
  { value: 'Freelance', label: 'Freelance' },
  { value: 'Other', label: 'Other' }
];

const TYPES = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' }
];

export const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    type: transaction?.type || 'expense',
    amount: transaction?.amount.toString() || '',
    category: transaction?.category || 'Other',
    description: transaction?.description || '',
    date: transaction?.date || new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || Number(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const transactionData = {
        ...formData,
        amount: Number(formData.amount)
      };

      if (transaction) {
        await transactions.update(transaction.id, transactionData);
      } else {
        await transactions.create(transactionData);
      }

      onSave();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          options={TYPES}
          error={errors.type}
        />
        <Input
          label="Amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          error={errors.amount}
        />
      </div>

      <Select
        label="Category"
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={CATEGORIES}
        error={errors.category}
      />

      <Input
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="What was this transaction for?"
        required
        error={errors.description}
      />

      <Input
        label="Date"
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
        error={errors.date}
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
          {transaction ? 'Update' : 'Add'} Transaction
        </Button>
      </div>
    </motion.form>
  );
};