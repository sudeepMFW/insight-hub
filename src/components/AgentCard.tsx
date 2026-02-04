import { Button } from '@/components/ui/button';
import { Check, User } from 'lucide-react';

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
      onClick={onSelect}
      className={`relative group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden border ${isSelected
          ? 'border-primary/50 shadow-elevated bg-primary/5'
          : 'border-white/10 hover:border-primary/30 bg-white/5 hover:bg-white/10'
        }`}
    >
      {/* Glow Background (on hover) */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:to-transparent transition-all duration-500 opacity-0 group-hover:opacity-100" />

      <div className="relative p-5 flex flex-col items-center gap-4 text-center">
        {/* Avatar Container */}
        <div className={`relative w-24 h-24 rounded-full p-1 transition-all duration-300 ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'group-hover:scale-105'
          }`}>
          <div className="w-full h-full rounded-full overflow-hidden bg-muted relative">
            <img
              src={agent.image}
              alt={agent.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                // Fallback logic could go here, or just let it show alt text / placeholder
                (e.target as HTMLImageElement).style.display = 'none';
                ((e.target as HTMLImageElement).nextSibling as HTMLElement).style.display = 'flex';
              }}
            />
            <div className="absolute inset-0 hidden items-center justify-center bg-muted text-muted-foreground">
              <User className="w-8 h-8" />
            </div>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="absolute top-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-lg animate-scale-in border-2 border-background">
              <Check className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className={`font-semibold text-lg transition-colors ${isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
            {agent.name}
          </h3>
          <p className="text-xs text-muted-foreground">AI Voice Agent</p>
        </div>

        {/* Action Button (Visual only, whole card is clickable) */}
        <Button
          variant={isSelected ? 'default' : 'outline'}
          size="sm"
          className={`w-full rounded-xl transition-all ${isSelected
              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25'
              : 'bg-transparent border-primary/20 hover:bg-primary hover:text-white'
            }`}
        >
          {isSelected ? 'Selected' : 'Select Agent'}
        </Button>
      </div>
    </div>
  );
}
