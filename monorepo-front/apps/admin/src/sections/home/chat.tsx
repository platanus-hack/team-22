import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Mic, MicOff, ThumbsDown, ThumbsUp, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@common/components/ui/button';
import { sendJournalFastResponse, sendMessageOrAudio } from '@common/api/chat';
import { supabase } from '@common/supabase';
import Ripple from '@common/components/ui/ripple';
import { TextAreaDrawer } from '@common/components/text-area-drawer';
import { cn } from '@/lib/utils';
import useUserStore from '@/store/useUserStore';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@common/components/ui/card';

type MessagePayload = {
  type: 'text' | 'audio';
  content: string | Blob;
  timestamp: number;
  user_id: string | number;
};

interface FastResponse {
  title: string;
  description: string;
  mood_emoji: string;
  insights: {
    text: string;
    type: 'positive' | 'negative';
  }[];
}

export default function Chat() {
  const { userProfile } = useUserStore();
  const [, setLocation] = useLocation();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // New state for paused
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [fastResponse, setFastResponse] = useState<FastResponse | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const getSupportedMimeType = () => {
    // Prioritize formats that work well with OpenAI
    const types = [
      'audio/webm', // Most compatible
      'audio/mp4',
      'audio/ogg',
      'audio/wav',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    // Fallback to mp4 for iOS
    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      return 'audio/mp4';
    }

    return 'audio/webm'; // Default fallback
  };

  const startRecording = async () => {
    try {
      setAudioChunks([]);
      setRecordedAudio(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, event.data]);
        }
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          toast.error(
            'Por favor permite el acceso al micrófono para grabar audio'
          );
        } else if (error.name === 'NotFoundError') {
          toast.error('No se encontró ningún micrófono en el dispositivo');
        } else {
          toast.error(`Error al acceder al micrófono: ${error.message}`);
        }
      } else {
        toast.error('Error inesperado al acceder al micrófono');
      }
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'recording'
    ) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = () => {
        const mimeType = mediaRecorderRef.current?.mimeType || 'audio/wav';
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        setRecordedAudio(audioBlob);
        setAudioChunks([]);
      };

      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
    }

    setIsRecording(false);
    setIsPaused(false);
  };

  const resumeRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === 'paused'
    ) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      setIsRecording(true);
    }
  };

  const handleSubmitAudio = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!recordedAudio) return;

    setLoading(true);
    try {
      const fileName = `audio_${Date.now()}.webm`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audios')
        .upload(fileName, recordedAudio);

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from('audios')
        .getPublicUrl(fileName);

      console.log('🚀 URL pública:', publicData.publicUrl);

      const payload: MessagePayload = {
        type: 'audio',
        content: publicData.publicUrl,
        timestamp: Date.now(),
        user_id: userProfile?.id as string,
      };

      // Option 2: Race condition
      const fastResponseResult = await Promise.race([
        sendJournalFastResponse(payload),
        sendMessageOrAudio(payload),
      ]);

      console.log('fastResponseResult', fastResponseResult);
      setFastResponse(fastResponseResult);

      setFastResponse(fastResponseResult);
      toast.success('¡Gracias por subir tu journal!');
    } catch (error) {
      console.error('Error submitting audio:', error);
      toast.error('Error al enviar el audio');
    } finally {
      setLoading(false);
      setRecordedAudio(null);
    }
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      setLoading(true);
      try {
        const payload: MessagePayload = {
          type: 'text',
          content: message.trim(),
          timestamp: Date.now(),
          user_id: userProfile?.id as string,
        };

        console.log('Sending text payload:', payload);
        const [fastResponseResult] = await Promise.all([
          sendJournalFastResponse(payload),
          sendMessageOrAudio(payload),
        ]);

        setFastResponse(fastResponseResult);
        setMessage('');
        toast.success('¡Gracias por subir tu journal!');
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Error al enviar el mensaje');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else if (isPaused) {
      resumeRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className='flex flex-col items-center fixed inset-0 z-50 bg-brandgradient'>
      <Button
        onClick={() => setLocation('/journal')}
        size='icon'
        variant='ghost'
        className='absolute top-6 left-6 text-neutral-600 hover:text-neutral-800 z-[60]'
      >
        <X className='' />
      </Button>
      {fastResponse ? (
        <div className='w-full animate-fade-in'>
          <FastResponseUI response={fastResponse} />
        </div>
      ) : (
        <>
          <div className='relative h-full min-h-screen w-full max-w-96 p-12 justify-between flex items-center flex-col'>
            <h1 className='z-0 text-2xl text-center font-normal'>
              {isRecording
                ? 'Te escucho...'
                : recordedAudio
                ? 'Todo listo!'
                : 'Cuéntame algo'}
            </h1>
            <div className='flex flex-col items-center gap-4'>
              <button
                onClick={handleToggleRecording}
                disabled={loading || recordedAudio !== null}
                className={cn(
                  ' overflow-hidden ',
                  recordedAudio ? 'pointer-events-none' : ''
                )}
              >
                <Ripple
                  numCircles={isRecording ? 3 : 1}
                  mainCircleSize={164}
                  mainCircleOpacity={!isRecording ? 1 : 0.8}
                  color={
                    recordedAudio
                      ? 'bg-green-500'
                      : !isRecording
                      ? 'bg-red-500'
                      : 'bg-gradient-to-br from-[rgb(251,205,156)] from-30% via-[#ebb6ec] to-[#b0bbec]'
                  }
                  className={isRecording ? 'animate-ripple' : ''}
                />
                <div
                  className={cn(
                    'absolute z-50 [&_svg]:size-16 [&_svg]:stroke-1 rounded-full flex items-center justify-center size-full p-8 transition-all duration-200',
                    isRecording
                      ? 'animate-ripple -mt-20'
                      : 'text-white top-0 left-0 -mt-16'
                  )}
                >
                  {isRecording ? <Mic /> : recordedAudio ? <Mic /> : <MicOff />}
                </div>
              </button>
            </div>

            <div className='z-50 flex flex-col gap-3 w-full'>
              {!recordedAudio && !isRecording ? (
                <>
                  <div className='w-full fixed bottom-10 space-y-4 left-0 right-0 px-4 md:px-12 md:relative md:bottom-auto '>
                    <div className='flex gap-4 text-base font-medium items-center h-7'>
                      <div className='w-full h-px bg-neutral-200' />
                      <p className='text-neutral-400 whitespace-nowrap font-normal'>
                        o también
                      </p>
                      <div className='w-full h-px bg-neutral-200' />
                    </div>
                    {/* Envolver TextAreaDrawer en un div con pointer-events-auto */}
                    <div className='relative z-[60] isolate'>
                      <TextAreaDrawer
                        message={message}
                        setMessage={setMessage}
                        handleSendMessage={handleSendMessage}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='w-full fixed bottom-10 space-y-4 left-0 right-0 px-4 md:px-12 md:relative md:bottom-auto'>
                    <Button
                      onClick={handleSubmitAudio}
                      variant='primary'
                      className='w-full flex gap-1.5'
                      disabled={loading || !recordedAudio}
                    >
                      {loading ? 'Enviando...' : 'Continuar'}
                      <ArrowRight />
                    </Button>
                    {recordedAudio && (
                      <>
                        <div className='flex gap-4 text-base font-medium items-center h-7'>
                          <div className='w-full h-px bg-neutral-200' />
                          <p className='text-neutral-400 whitespace-nowrap font-normal'>
                            o también
                          </p>
                          <div className='w-full h-px bg-neutral-200' />
                        </div>

                        <Button
                          size='lg'
                          variant='secondary'
                          onClick={() => {
                            setRecordedAudio(null);
                            setAudioChunks([]);
                            setFastResponse(null); // Clear fast response when re-recording
                          }}
                          className='rounded-full text-base font-normal h-10 bg-neutral-200/40 !hover:bg-black w-full'
                        >
                          Grabar Denuevo
                        </Button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const getPastelColorFromEmoji = (emoji: string): string => {
  let hash = 0;
  for (let i = 0; i < emoji.length; i++) {
    hash = emoji.charCodeAt(i) + ((hash << 5) - hash);
  }

  const pastelColor = (hash: number) => {
    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    return `rgb(${(r + 200) % 256}, ${(g + 200) % 256}, ${
      (b + 200) % 256
    }, 0.35)`;
  };

  return pastelColor(hash);
};

const FastResponseUI = ({ response }: { response: FastResponse }) => {
  const [, setLocation] = useLocation();

  const pastelColor = getPastelColorFromEmoji(response?.mood_emoji || '');

  return (
    <div className='pt-24 px-8 pb-12 max-w-md mx-auto text-base text-center flex flex-col gap-8 justify-between h-full min-h-svh'>
      <div className='flex flex-col gap-10'>
        <div className='flex flex-col gap-'>
          <div
            className='mb-3 flex text-5xl aspect-square rounded-full size-20 mx-auto items-center justify-center'
            style={{ backgroundColor: pastelColor }}
          >
            {response.mood_emoji}
          </div>
          <h5 className='mt-2 text-2xl font-medium text-neutral-800'>
            {response.title}
          </h5>
          <p className='mt-2 text-base tracking-tight text-neutral-400 font-normal'>
            {response.description}
          </p>
        </div>
        <div className='flex flex-col gap-2'>
          {response.insights.map((insight, index) => (
            <div
              key={index}
              className={cn(
                'flex items-center text-sm text-left gap-3 font-medium p-2 pr-3 rounded-lg border',
                insight.type === 'positive'
                  ? 'bg-green-100 border-green-200'
                  : 'bg-red-100 border-red-200',
                'shadow-[4px_4px_24px_0px_rgba(82,82,82,0.04),_4px_4px_64px_0px_rgba(82,82,82,0.08)]'
              )}
            >
              <div
                className={cn(
                  'size-10 flex [&_svg]:size-5 items-center justify-center rounded-md shrink-0 aspect-square',
                  insight.type === 'positive'
                    ? 'bg-green-200 text-green-600'
                    : 'bg-red-200 text-red-600'
                )}
              >
                {insight.type === 'positive' ? <ThumbsUp /> : <ThumbsDown />}
              </div>
              <span className='text-neutral-800'>{insight.text}</span>
            </div>
          ))}
        </div>
      </div>
      <Button
        onClick={() => setLocation('/journal')}
        variant='primary'
        className='mt-3'
      >
        Ver resultados
      </Button>
    </div>
  );
};
