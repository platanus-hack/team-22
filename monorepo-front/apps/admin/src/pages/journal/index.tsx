import { DateTime } from 'luxon';
import { Card, CardContent } from '@common/components/ui/card';
import { Skeleton } from '@common/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { fetchJournalEntries } from '@common/api/journals';
import { ScrollArea } from '@common/components/ui/scroll-area';
import { Button } from '@common/components/ui/button';
import useUserStore from '@/store/useUserStore';

const JournalPage = () => {
  const { userProfile } = useUserStore();
  const today = DateTime.now();
  const [selectedDate, setSelectedDate] = useState(today);
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      setLoading(true);
      const startDate = today.minus({ days: 3 });
      const endDate = today.plus({ days: 3 });
      const data = await fetchJournalEntries(
        startDate,
        endDate,
        userProfile?.id as string
      );
      setEntries(data);
      setLoading(false);
    };

    loadEntries();
  }, []);

  const getDayInitial = (date: DateTime) =>
    date
      .toLocaleString({ weekday: 'short' }, { locale: 'es' })
      .charAt(0)
      .toUpperCase();

  const getDate = (date: DateTime) => date.toFormat('d');

  const weekDays = [
    ...Array(3)
      .fill(null)
      .map((_, i) => today.minus({ days: 3 - i })),
    today,
    ...Array(3)
      .fill(null)
      .map((_, i) => today.plus({ days: i + 1 })),
  ];

  const handleDayClick = (date: DateTime) => {
    setSelectedDate(date);
  };

  const formattedDate = selectedDate.toFormat('yyyy-MM-dd');
  const entryContent =
    entries[formattedDate] || 'No hay entrada para este día.';

  if (loading) {
    return (
      <div className='mx-auto'>
        {/* Calendar Header Skeleton */}
        <div className='sticky top-0 z-10 flex flex-col gap-4 justify-between items-center bg-neutral-100 py-4'>
          <div className='w-full flex justify-between px-3'>
            {[...Array(7)].map((_, index) => (
              <div
                className='w-8 flex flex-col gap-1.5 items-center'
                key={index}
              >
                <Skeleton className='h-3 w-3' /> {/* Day initial */}
                <Skeleton className='size-7 rounded-full' /> {/* Date button */}
              </div>
            ))}
          </div>
          <Skeleton className='h-4 w-48' /> {/* Full date */}
        </div>

        {/* Content Area Skeleton */}
        <div className='px-3 pt-6 pb-40'>
          <div className='space-y-6'>
            <div className='relative'>
              <div className='max-w-96 mx-auto fixed top-1/2 -translate-y-1/2 inset-x-6 text-center flex flex-col gap-3 z-10 bg-neutral-100 rounded-3xl px-8 pt-12 pb-10'>
                <Skeleton className='h-4 w-16 mx-auto' /> {/* "Hoy" text */}
                <Skeleton className='h-6 w-64 mx-auto' /> {/* Title */}
                <Skeleton className='h-4 w-full' /> {/* Description */}
                <Skeleton className='h-10 w-full mt-3' /> {/* Button */}
              </div>

              {/* Background lines */}
              <div className='fixed inset-0 top-28 mx-4 flex flex-col'>
                {Array(15)
                  .fill(null)
                  .map((_, i) => (
                    <div
                      key={i}
                      className='border-b border-neutral-200/60'
                      style={{ height: '2rem' }}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto'>
      <div className='sticky top-0 z-10 flex flex-col gap-4 justify-between items-center bg-neutral-100 py-4'>
        <div className='w-full flex justify-between px-3'>
          {weekDays.map((day, index) => (
            <div className='w-8 flex flex-col gap-1.5 items-center' key={index}>
              <span className='text-[10px] font-bold'>
                {getDayInitial(day)}
              </span>
              <button
                onClick={() => handleDayClick(day)}
                className={`flex flex-col gap-1.5 items-center justify-center size-7 rounded-full transition-colors ${
                  day.hasSame(selectedDate, 'day')
                    ? 'bg-neutral-900 text-white'
                    : 'text-neutral-400'
                }`}
              >
                <span className='text-sm font-bold'>{getDate(day)}</span>
              </button>
            </div>
          ))}
        </div>
        <div className='text-xs font-medium text-neutral-400'>
          {selectedDate
            .toLocaleString(
              {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              },
              { locale: 'es' }
            )
            .toUpperCase()}
        </div>
      </div>

      <ScrollArea className='px-3 pt-6 pb-40'>
        <div className='space-y-6'>
          <div className='relative'>
            {entryContent === 'No hay entrada para este día.' ? (
              <>
                <div className='max-w-96 mx-auto fixed top-1/2 -translate-y-1/2 inset-x-6 text-center flex flex-col gap-3 z-10 bg-neutral-100 rounded-3xl px-8 pt-12 pb-10'>
                  <span className='text-sm text-neutral-900'>Hoy</span>
                  <h1 className='text-xl font-semibold text-neutral-900'>
                    No has escrito nada todavía.
                  </h1>
                  <p className='text-base text-neutral-600'>
                    Cuéntanos sobre algo para poder entender mejor cómo
                    ayudarte.
                  </p>
                  <Button variant='primary' className='mt-3'>
                    Cuéntame algo
                  </Button>
                </div>
                <div className='fixed inset-0 top-28 mx-4 flex flex-col'>
                  {Array(15)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className='border-b border-neutral-200/60'
                        style={{ height: '2rem' }}
                      />
                    ))}
                </div>
              </>
            ) : (
              <>
                <div
                  className='relative whitespace-pre-wrap text-neutral-700 leading-8'
                  style={{ minHeight: '30rem' }}
                >
                  {entryContent}
                </div>
              </>
            )}
            <div className='bg-gradient-to-t from-white to-transparent w-screen h-24 fixed bottom-20 inset-x-0 z-10' />
            <div className='absolute inset-0 flex flex-col -mt-0.5'>
              {Array(15)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className='border-b border-neutral-200/60'
                    style={{ height: '2rem' }}
                  />
                ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default JournalPage;
