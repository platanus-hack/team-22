import * as React from 'react';
import { Button } from './ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer';
import { Textarea } from './ui/textarea';

interface TextAreaDrawerProps {
  message: string;
  setMessage: (message: string) => void;
  handleSendMessage: () => void;
  disabled: boolean;
}

export function TextAreaDrawer({
  message,
  setMessage,
  handleSendMessage,
  disabled,
}: TextAreaDrawerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disabled) {
      handleSendMessage();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          size='lg'
          variant='secondary'
          className='rounded-full text-base font-normal h-10 bg-neutral-200/40 !hover:bg-black w-full'
        >
          Escribe
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <form className='mx-auto w-full max-w-sm' onSubmit={handleSubmit}>
          <DrawerHeader>
            <DrawerTitle>Escribe tu mensaje</DrawerTitle>
          </DrawerHeader>
          <div className='p-4 pb-8'>
            <Textarea
              placeholder='Escribe aquí...'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={disabled}
              className='min-h-[70svh]'
            />
          </div>
          <Button disabled={disabled} className='w-full' type='submit'>
            {disabled ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
