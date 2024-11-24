import { useEffect, useState } from 'react';
import useUserStore from '@/store/useUserStore';
import { signOut } from '@common/api/auth';
import { Button } from '@common/components/ui/button';
import { LogOut, Mic } from 'lucide-react';
import { useLocation } from 'wouter';
import {
  fetchUserProfile,
  analyzeMood,
  getRecommendations,
  getGoodHabits,
  getDoBetterRecommendations,
  GoodHabits,
  GoodHabit,
} from '@common/api/users';
import { Skeleton } from '@common/components/ui/skeleton';
import Ripple from '@common/components/ui/ripple';
import { cn } from '@/lib/utils';

const conversationPrompts = [
  {
    text: '¿Qué cosas me hacen bien?',
    color: 'bg-[#FCE4CB]',
  },
  {
    text: '¿Qué cosas me hacen mal?',
    color: 'bg-[#FCDDFD]',
  },
  {
    text: '¿Qué cosas me gustaría mejorar?',
    color: 'bg-[#D9E0FF]',
  },
];

const daysOfWeek = [
  { day: 'L', emoji: '🥱', color: 'bg-[#C9C9FF]' },
  { day: 'M', emoji: '😭', color: 'bg-[#AADEFF]' },
  { day: 'W', emoji: '😡', color: 'bg-[#FFCCBB]' },
  { day: 'J', emoji: '😁', color: 'bg-[#FFFAAB]' },
  { day: 'V', emoji: '', color: 'bg-[#D4D4D4]' },
  { day: 'S', emoji: '', color: 'bg-[#D4D4D4]' },
  { day: 'D', emoji: '', color: 'bg-[#D4D4D4]' },
];

const ProfilePage = () => {
  const { userProfile } = useUserStore();
  const [mood, setMood] = useState('');
  const [, setLocation] = useLocation();
  const [recommendations, setRecommendations] = useState<{ mensaje: string }[]>(
    []
  );
  const [goodHabits, setGoodHabits] = useState<GoodHabit[]>([]);
  const [dobetterHabits, setDobetterHabits] = useState<{ mensaje: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!userProfile?.id) return;

      try {
        setLoading(true);
        const [recommendationsResult, goodHabitsResult, dobetterResult] =
          await Promise.all([
            getRecommendations(userProfile.id),
            getGoodHabits(userProfile.id),
            getDoBetterRecommendations(userProfile.id),
          ]);

        setRecommendations(recommendationsResult);
        setGoodHabits(goodHabitsResult.goodhabits);
        setDobetterHabits(dobetterResult);
        console.log('reccomendatios', recommendations);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [userProfile?.id]);

  if (loading) {
    return (
      <div className='min-h-svh bg-[linear-gradient(90deg,_#FFFBFB_0%,_#FCE4CB_25%,_#FCDDFD_50%,_#D9E0FF_75%,_#F2F4FF_100%)]'>
        {/* Header Skeleton */}
        <div className='flex gap-2 items-center p-3 justify-between'>
          <Skeleton className='size-7 rounded-full' />
          <Skeleton className='h-4 w-32' />
          <Skeleton className='size-8 rounded-lg shrink-0' />
        </div>

        {/* Mood Calendar Skeleton */}
        <div className='flex px-2 py-3'>
          <div className='flex gap-2 justify-between rounded-2xl w-full bg-white px-4 py-3'>
            {Array.from({ length: 7 }).map((_, index) => (
              <div
                key={index}
                className='w-32 flex flex-col items-center gap-1.5'
              >
                <Skeleton className='h-2 w-3' />
                <Skeleton className='size-8 rounded-full' />
              </div>
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className='bg-white w-full h-full flex flex-col gap-6 rounded-t-[24px] p-6'>
          <Skeleton className='h-6 w-24' />

          {/* Recommendations Section Skeleton */}
          <div className='space-y-4'>
            <Skeleton className='h-6 w-32' />
            <div className='space-y-2'>
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className='h-14 w-full rounded-lg' />
              ))}
            </div>
          </div>

          {/* Good Habits Section Skeleton */}
          <div className='space-y-4'>
            <Skeleton className='h-6 w-32' />
            <div className='space-y-2'>
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className='h-14 w-full rounded-lg' />
              ))}
            </div>
          </div>

          {/* Improvement Areas Section Skeleton */}
          <div className='space-y-4'>
            <Skeleton className='h-6 w-32' />
            <div className='space-y-2'>
              {Array.from({ length: 2 }).map((_, index) => (
                <Skeleton key={index} className='h-14 w-full rounded-lg' />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-svh bg-[linear-gradient(180deg,#Fce6cf_0%,_#fbcffc_10%,_#CCd5ff_20%)]'>
      {/* Heaer */}
      <div className='flex gap-2 items-center p-3 justify-between'>
        <img
          src='https://avatars.dicebear.com/api/avataaars/mati.svg'
          alt='avatar'
          className='size-7 rounded-full'
        />
        <h1 className='font-bold text-sm w-full'>{userProfile?.name}</h1>
        <Button
          size='icon'
          variant='ghost'
          className='shrink-0 hover:bg-black/40'
          onClick={signOut}
        >
          <LogOut />
        </Button>
      </div>

      {/* Mood Calendar */}
      {/*   <div className='flex px-2 py-3'>
        <div className='flex gap-2 justify-between rounded-2xl w-full bg-white px-4 py-3'>
          {daysOfWeek.map(({ day, emoji, color }, index) => (
            <div
              key={index}
              className='w-32 [&:nth-last-child(-n+3)]:text-neutral-300 flex flex-col items-center gap-1.5'
            >
              <span className='font-bold text-[10px] leading-none'>{day}</span>
              <div
                className={`flex flex-col items-center justify-center size-8 rounded-full ${color}`}
              >
                <span className='leading-none'>{emoji}</span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
      {/* Conversation Prompts */}
      <div className='flex flex-col items-center gap-4 relative mt-20 h-60'>
        <Ripple
          numCircles={3}
          mainCircleSize={164}
          mainCircleOpacity={0.9}
          color={'bg-white'}
          className={'animate-ripple'}
        />
        <div
          className={cn(
            'absolute z-50 [&_svg]:size-16 [&_svg]:stroke-1 rounded-full flex items-center justify-center size-full p-8 transition-all duration-200',
            'text-neutral-800 top-0 left-0 -mt-16'
          )}
        >
          <Mic />
        </div>
      </div>
      <div className='px-6 py-3'>
        <p className='text-neutral-100 text-3xl text-center pb-4'>
          De qué quieres hablar?
        </p>
        <div className='flex flex-col gap-2 w-full pt-3 pb-4'>
          {conversationPrompts.map(({ text, color }, index) => (
            <Button
              key={index}
              onClick={() => setLocation(`/chat?prompt=${text}`)}
              className={`w-full h-10 bg-white/25 backdrop-blur-md shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]`}
            >
              <span className='text-sm font-medium text-neutral-800'>
                {text}
              </span>
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className='bg-white w-full h-full flex flex-col gap-6 rounded-t-[24px] p-6'>
        <h2 className='text-lg font-semibold'>El resumen de este mes</h2>
        {/* Recommendations Sctio */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-neutral-500'>
            Recomendaciones
          </h3>
          <div className='space-y-2'>
            {recommendations?.length > 0 ? (
              recommendations?.map((recommendation, index) => (
                <div
                  key={index}
                  className='p-3 bg-neutral-50 rounded-lg border border-neutral-100'
                >
                  <p className='text-neutral-800'>
                    {recommendation.mensaje.charAt(0).toUpperCase() +
                      recommendation.mensaje.slice(1).toLowerCase()}
                  </p>
                </div>
              ))
            ) : (
              <p className='text-neutral-500'>No tienes recomendaciones</p>
            )}
          </div>
        </div>

        {/* Good Habits Section */}
        <div className='space-y-4'>
          <h3 className='text-lg font-medium text-neutral-500'>
            Buenos hábitos
          </h3>
          <div className='space-y-2'>
            {goodHabits?.length > 0 ? (
              goodHabits?.map((habit, index) => (
                <div
                  key={index}
                  className='p-3 bg-green-50 rounded-lg border border-green-100'
                >
                  <p className='text-green-800'>{habit.mensaje}</p>
                </div>
              ))
            ) : (
              <p className='text-neutral-500'>No tienes buenos hábitos</p>
            )}
          </div>
        </div>

        {/* Improvement Areas Section */}
        <div className='space-y-4 pb-20'>
          <h3 className='text-lg font-medium text-neutral-500'>
            Áreas de mejora
          </h3>
          <div className='space-y-2'>
            {dobetterHabits?.length > 0 ? (
              dobetterHabits?.map((habit, index) => (
                <div
                  key={index}
                  className='p-3 bg-red-50 rounded-lg border border-red-100'
                >
                  <p className='text-red-800'>{habit.mensaje}</p>
                </div>
              ))
            ) : (
              <p className='text-neutral-500'>No tienes áreas de mejora</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
