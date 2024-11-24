import { useState, useEffect } from 'react';
import { Button } from '@common/components/ui/button';
import { Input } from '@common/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/ui/card';
import { updateUserProfile } from '@common/api/users';
import { toast } from 'react-toastify';
import useUserStore from '@/store/useUserStore';
import BlurFade from '@common/components/ui/blur-fade';
import { cn } from '@/lib/utils';

type Step = 'welcome' | 'name' | 'age' | 'job' | 'ready';

const ageOptions = [
  { value: '18-24', label: '👨‍🎓 Entre 18 a 24' },
  { value: '25-34', label: '🕺 Entre 25 a 34' },
  { value: '35-44', label: '👩‍💼 Entre 35 a 44' },
  { value: '45-54', label: '🏡 Entre 45 a 54' },
  { value: '55-64', label: '👴🏻 Más de 55' },
];

const jobOptions = [
  { value: 'estudio', label: '📚 Estudio' },
  { value: 'trabajo', label: '💼 Trabajo' },
  { value: 'deporte', label: '💪 Deporte' },
  { value: 'familia', label: '👨‍👩‍👧‍👦 Mi familia' },
  { value: 'jubilado', label: '👴🏻 Jubilado' },
];

export default function Onboarding() {
  const { userProfile, refreshUserProfile } = useUserStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [job, setJob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState<Step>('welcome');

  useEffect(() => {
    if (currentStep === 'welcome') {
      const timer = setTimeout(() => {
        setCurrentStep('name');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  const handleContinue = async () => {
    if (currentStep === 'name') {
      if (!name.trim()) {
        setError('Por favor ingresa tu nombre');
        return;
      }
      setError('');
      setCurrentStep('age');
      return;
    }

    if (currentStep === 'age') {
      if (!age) {
        setError('Por favor selecciona tu edad');
        return;
      }
      setError('');
      setCurrentStep('job');
      return;
    }

    if (currentStep === 'job') {
      if (!job) {
        setError('Por favor selecciona tu ocupación');
        return;
      }
      setError('');
      setCurrentStep('ready');
      return;
    }

    if (currentStep === 'ready') {
      setLoading(true);
      setError('');
      let calculatedAge =
        age === '65+'
          ? '65+'
          : String(
              Math.floor(
                (Number(age.split('-')[0]) + Number(age.split('-')[1])) / 2
              )
            );
      console.log(calculatedAge);
      console.log(userProfile?.id);
      const res = await updateUserProfile(userProfile?.id as string, {
        name,
        age: calculatedAge,
      });
      if (res) {
        refreshUserProfile();
        toast.success('¡Perfil actualizado!');
      } else {
        setError('Hubo un error al actualizar tu perfil');
        toast.error('Hubo un error al actualizar tu perfil');
      }
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'welcome':
        return <></>;
      case 'name':
        return (
          <BlurFade delay={0.5} inView>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='text-lg bg-neutral-200/40 border-0'
              placeholder='Tu nombre'
              type='name'
              autoFocus
            />
          </BlurFade>
        );
      case 'age':
        return (
          <div className='space-y-2'>
            {ageOptions.map((option, index) => (
              <BlurFade key={index} delay={index * 0.25} inView>
                <Button
                  onClick={() => setAge(option.value)}
                  variant={age === option.value ? 'primary' : 'outline'}
                  className='w-full justify-start text-center h-[50px] py-3 rounded shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]'
                >
                  {option.label}
                </Button>
              </BlurFade>
            ))}
          </div>
        );
      case 'job':
        return (
          <div className='space-y-2'>
            {jobOptions.map((option, index) => (
              <BlurFade key={index} delay={index * 0.25} inView>
                <Button
                  onClick={() => setJob(option.value)}
                  variant={job === option.value ? 'primary' : 'outline'}
                  className='w-full justify-start text-center h-[50px] py-3 rounded shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]'
                >
                  {option.label}
                </Button>
              </BlurFade>
            ))}
          </div>
        );
      case 'ready':
        return (
          <div className='-mt-12 text-base text-center flex flex-col gap-3'>
            <div className='mb-3 flex text-5xl aspect-square rounded-full size-20 mx-auto items-center justify-center bg-[#E2E8FF]'>
              📖
            </div>
            <h5 className='text-2xl font-medium text-neutral-800'>
              Todo listo?
            </h5>
            <p className='text-base tracking-tight text-neutral-400 font-normal'>
              Empezaremos creando tu primera entrada al diario.
            </p>
            <p className='text-base tracking-tight text-neutral-400 font-normal'>
              No te sobrepienses,{' '}
              <span className='underline text-neutral-800'>
                cualquier cosa sirve.
              </span>
            </p>
          </div>
        );
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={cn(
        'flex flex-col min-h-screen p-12 pb-24 pt-16',
        'bg-brandgradient fixed inset-0 z-50',
        currentStep === 'welcome'
          ? 'justify-center items-center'
          : 'items-start justify-between'
      )}
    >
      <div className='w-full max-w-md mx-auto text-xl text-neutral-500 text-center flex flex-col gap-6'>
        <BlurFade delay={0.25}>
          {currentStep === 'welcome' && 'Hola, Soy Journie'}
        </BlurFade>
        <BlurFade delay={3.25} inView>
          {currentStep === 'name' && '¿Cuál es tu nombre?'}
        </BlurFade>
        <BlurFade delay={3.5} inView>
          {currentStep === 'age' && '¿Qué edad tienes?'}
        </BlurFade>
        <BlurFade delay={3.75} inView>
          {currentStep === 'job' && '¿Qué ocupación tienes?'}
        </BlurFade>
        <BlurFade delay={0.5} className='text-2xl text-neutral-800' inView>
          {currentStep === 'ready' && <></>}
        </BlurFade>
        <div className='space-y-4'>
          <BlurFade delay={0.25} inView>
            {renderStepContent()}
          </BlurFade>

          {error && <p className='text-center text-sm text-red-500'>{error}</p>}
        </div>
      </div>
      {currentStep !== 'welcome' && (
        <BlurFade
          delay={0.5}
          className='w-full fixed bottom-4 left-0 right-0 px-4 md:px-12 md:relative md:bottom-auto'
          inView
        >
          <Button
            onClick={handleContinue}
            variant='primary'
            className='w-full'
            disabled={loading}
          >
            {loading ? 'Actualizando...' : 'Continuar'}
          </Button>
        </BlurFade>
      )}
    </form>
  );
}
