import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Send, Zap } from 'lucide-react';

export interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  onSendMessage,
  isLoading = false,
}) => {
  const [content, setContent] = useState<string>('');

  const handleSend = () => {
    if (!content.trim()) return;
    onSendMessage(content.trim());
    setContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const applyTemplate = (text: string) => {
    setContent(text);
  };

  return (
    <div className="chat-composer">
      <Button
        variant="ghost"
        size="sm"
        title="Quick Template Replies"
        onClick={() =>
          applyTemplate('Hello! I would be happy to share our official brochure and pricing table with you. When is a good time to talk?')
        }
      >
        <Zap size={16} />
      </Button>

      <textarea
        className="input chat-composer-input"
        placeholder="Type a message or press Enter to send..."
        rows={1}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <Button
        variant="primary"
        size="sm"
        onClick={handleSend}
        isLoading={isLoading}
        disabled={!content.trim()}
      >
        <Send size={16} />
      </Button>
    </div>
  );
};
