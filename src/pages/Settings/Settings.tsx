import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';

const CURRENCIES = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  { value: 'CAD', label: 'Canadian Dollar (C$)' },
  { value: 'AUD', label: 'Australian Dollar (A$)' },
  { value: 'INR', label: 'Indian Rupee (₹)' },
  { value: 'JPY', label: 'Japanese Yen (¥)' },
  { value: 'CNY', label: 'Chinese Yuan (¥)' },
  { value: 'KRW', label: 'South Korean Won (₩)' },
  { value: 'SGD', label: 'Singapore Dollar (S$)' },
  { value: 'HKD', label: 'Hong Kong Dollar (HK$)' },
  { value: 'THB', label: 'Thai Baht (฿)' },
  { value: 'MYR', label: 'Malaysian Ringgit (RM)' },
  { value: 'PHP', label: 'Philippine Peso (₱)' },
  { value: 'IDR', label: 'Indonesian Rupiah (Rp)' },
  { value: 'VND', label: 'Vietnamese Dong (₫)' },
  { value: 'TWD', label: 'Taiwan Dollar (NT$)' },
  { value: 'LKR', label: 'Sri Lankan Rupee (Rs)' }
];

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' }
];

export const Settings: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    currency: 'INR',
    theme: isDark ? 'dark' : 'light',
    notifications: {
      budgetAlerts: true,
      goalReminders: true,
      weeklyReports: false
    },
    monthlyBudget: '1000'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('financeSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem('financeSettings', JSON.stringify(settings));
      
      // Show success message
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Profile
            </h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50 dark:bg-gray-700"
            />
            <Input
              label="Monthly Budget Limit"
              type="number"
              value={settings.monthlyBudget}
              onChange={(e) => handleSettingChange('monthlyBudget', e.target.value)}
              placeholder="1000"
            />
          </div>
        </Card>

        {/* Appearance Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Palette className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Appearance
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex items-center space-x-4">
                <Button
                  variant={!isDark ? 'primary' : 'outline'}
                  size="sm"
                  onClick={!isDark ? undefined : toggleTheme}
                >
                  Light
                </Button>
                <Button
                  variant={isDark ? 'primary' : 'outline'}
                  size="sm"
                  onClick={isDark ? undefined : toggleTheme}
                >
                  Dark
                </Button>
              </div>
            </div>
            <Select
              label="Currency"
              value={settings.currency}
              onChange={(e) => handleSettingChange('currency', e.target.value)}
              options={CURRENCIES}
            />
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
              <Bell className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Budget Alerts
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get notified when you're close to your budget limit
                </p>
              </div>
              <Button
                variant={settings.notifications.budgetAlerts ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleNotificationChange('budgetAlerts', !settings.notifications.budgetAlerts)}
              >
                {settings.notifications.budgetAlerts ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Goal Reminders
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get reminded about your savings goals
                </p>
              </div>
              <Button
                variant={settings.notifications.goalReminders ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleNotificationChange('goalReminders', !settings.notifications.goalReminders)}
              >
                {settings.notifications.goalReminders ? 'On' : 'Off'}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Weekly Reports
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Get weekly spending summaries
                </p>
              </div>
              <Button
                variant={settings.notifications.weeklyReports ? 'primary' : 'outline'}
                size="sm"
                onClick={() => handleNotificationChange('weeklyReports', !settings.notifications.weeklyReports)}
              >
                {settings.notifications.weeklyReports ? 'On' : 'Off'}
              </Button>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Security
            </h3>
          </div>

          <div className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Export Data
            </Button>
            <Button variant="danger" className="w-full">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} size="lg" loading={saving}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};