import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Простая проверка для демонстрации
    if (email && password) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white shadow-lg border-0">
        <CardHeader className="text-center pt-8 pb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Proja</h1>
          <h2 className="text-xl text-gray-700">Давайте начнём!</h2>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Логин"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
            
            <div>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-700 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors"
            >
              Войти
            </Button>
            
            <div className="text-center">
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Не помню пароль
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;