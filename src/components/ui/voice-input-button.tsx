'use client';

import { Mic, MicOff } from 'lucide-react';
import { useVoiceInput } from '@/hooks/use-voice-input';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

interface VoiceInputButtonProps {
  onTranscriptChange: (text: string) => void;
  className?: string;
}

export function VoiceInputButton({ onTranscriptChange, className }: VoiceInputButtonProps) {
  const {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceInput();

  useEffect(() => {
    if (transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  if (!isSupported) {
    return null; // Don't show button if browser doesn't support speech recognition
  }

  return (
    <Button
      type="button"
      variant={isListening ? 'destructive' : 'outline'}
      size="icon"
      onClick={isListening ? stopListening : startListening}
      className={className}
      title={isListening ? 'Stop recording' : 'Start voice input'}
    >
      {isListening ? (
        <MicOff className="h-4 w-4 animate-pulse" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </Button>
  );
}
