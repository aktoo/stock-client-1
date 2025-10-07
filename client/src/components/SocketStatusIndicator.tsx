import * as React from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Wifi, WifiOff } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function SocketStatusIndicator() {
  const { isConnected } = useSocket();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center w-8 h-8">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isConnected ? 'Real-time connection active' : 'Disconnected, attempting to reconnect...'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
