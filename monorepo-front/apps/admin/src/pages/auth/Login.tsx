import { SetStateAction, useState } from 'react';
import { Input } from '@common/components/ui/input';
import { Label } from '@common/components/ui/label';
import { loginWithEmailAndPassword } from 'common/src/api/auth';
import { Button } from '@common/components/ui/button';

type Props = {
  setView: (view: 'login' | 'register') => void;
};

export default function Login({ setView }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithEmailAndPassword(email, password);
    } catch (error) {
      setError('Contraseña incorrecta');
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLogin}
      className='flex flex-col text-neutral-800 h-screen w-full *:w-full p-12 pt-24 items-start justify-between'
    >
      <div className='flex flex-col items-center *:w-full gap-12'>
        <div className='flex flex-col items-center gap-5'>
          <div className='flex items-center justify-center size-20'>
            <img src='/isotipo.svg' alt='Yournal' className='h-12 w-auto' />
          </div>
          <h2 className='text-2xl font-medium'>Bienvenido a Yournal</h2>
        </div>

        <div className='space-y-8 max-w-96'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              value={email}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setEmail(e.target.value)
              }
              className='border-transparent bg-neutral-200/30 shadow-none'
              placeholder='m@yournal.com'
              type='email'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Contraseña</Label>
            <Input
              id='password'
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPassword(e.target.value)
              }
              className='border-transparent bg-neutral-200/30 shadow-none'
              placeholder='********'
              type='password'
            />
          </div>
          {error && (
            <p className='text-red-500/80 text-sm font-medium'>⚠️ {error}</p>
          )}
        </div>
      </div>

      <div className='flex flex-col gap-4 max-w-96 mx-auto'>
        <Button onClick={handleLogin} disabled={loading} variant='primary'>
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </Button>
        <p className='text-center text-sm text-gray-400 h-10 flex gap-1.5 justify-center items-center'>
          Primera vez?{' '}
          <button
            onClick={() => setView('register')}
            className='font-medium text-neutral-800 underline hover:text-neutral-800/80'
          >
            Regístrate
          </button>
        </p>
      </div>
    </form>
  );
}
