import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export interface Agent {
  id: string;
  name: string;
  voiceId: string;
  image: string;
}

interface AgentCardProps {
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
}

export function AgentCard({ agent, isSelected, onSelect }: AgentCardProps) {
  return (
    <div
      className={`glass-card rounded-2xl p-4 transition-all duration-300 cursor-pointer group ${
        isSelected
          ? 'ring-2 ring-primary shadow-elevated'
          : 'hover:shadow-elevated'
      }`}
      onClick={onSelect}
    >
      <div className="relative mb-4">
        <img
          src={agent.image}
          alt={agent.name}
          className="w-full aspect-square object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        {isSelected && (
          <div className="absolute top-2 right-2 w-8 h-8 rounded-full gradient-bg flex items-center justify-center shadow-lg animate-scale-in">
            <Check className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      <h3 className="font-semibold text-center text-foreground mb-3">
        {agent.name}
      </h3>

      <Button
        variant={isSelected ? 'default' : 'outline'}
        size="sm"
        className="w-full"
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
      >
        {isSelected ? 'Selected' : 'Select'}
      </Button>
    </div>
  );
}
