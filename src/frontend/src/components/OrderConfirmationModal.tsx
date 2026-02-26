import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OrderConfirmationModalProps {
  open: boolean;
  orderId: string;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

type AnimationPhase = 'spinning' | 'checkmark' | 'celebration';

export function OrderConfirmationModal({ 
  open, 
  orderId, 
  onViewOrders, 
  onContinueShopping 
}: OrderConfirmationModalProps) {
  const [phase, setPhase] = useState<AnimationPhase>('spinning');

  useEffect(() => {
    if (!open) {
      setPhase('spinning');
      return;
    }

    // Phase 1: Spinning (0-1.5s)
    const spinTimer = setTimeout(() => {
      setPhase('checkmark');
    }, 1500);

    // Phase 2: Checkmark (1.5-2.5s)
    const checkTimer = setTimeout(() => {
      setPhase('celebration');
    }, 2500);

    return () => {
      clearTimeout(spinTimer);
      clearTimeout(checkTimer);
    };
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md border-0 shadow-2xl overflow-hidden"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {/* Animation Container */}
          <div className="relative w-32 h-32 mb-6">
            {/* Phase 1: Spinning Circle */}
            {phase === 'spinning' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border-8 border-primary/30 border-t-primary animate-spin" />
              </div>
            )}

            {/* Phase 2 & 3: Checkmark with bounce */}
            {(phase === 'checkmark' || phase === 'celebration') && (
              <div 
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  phase === 'checkmark' && "animate-scale-bounce"
                )}
              >
                <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-20 h-20 text-white" strokeWidth={3} />
                </div>
              </div>
            )}

            {/* Confetti dots animation */}
            {phase === 'celebration' && (
              <>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-confetti"
                    style={{
                      backgroundColor: ['#f59e0b', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6'][i % 5],
                      top: '50%',
                      left: '50%',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </>
            )}
          </div>

          {/* Phase 3: Text and Buttons */}
          {phase === 'celebration' && (
            <div className="text-center space-y-4 animate-fade-in">
              <h2 className="text-3xl font-bold text-foreground font-serif">
                CONGRATULATIONS!
              </h2>
              <p className="text-lg text-muted-foreground">
                Your order is confirmed
              </p>
              <p className="text-sm font-mono text-muted-foreground bg-muted px-4 py-2 rounded-lg">
                Order ID: {orderId}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  variant="default" 
                  size="lg" 
                  onClick={onViewOrders}
                  className="flex-1"
                >
                  View My Orders
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={onContinueShopping}
                  className="flex-1"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scale-bounce {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        @keyframes confetti {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(calc(cos(var(--angle, 0deg)) * 100px), calc(sin(var(--angle, 0deg)) * 100px)) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-scale-bounce {
          animation: scale-bounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-confetti {
          animation: confetti 1s ease-out forwards;
        }

        .animate-confetti:nth-child(1) { --angle: 0deg; }
        .animate-confetti:nth-child(2) { --angle: 45deg; }
        .animate-confetti:nth-child(3) { --angle: 90deg; }
        .animate-confetti:nth-child(4) { --angle: 135deg; }
        .animate-confetti:nth-child(5) { --angle: 180deg; }
        .animate-confetti:nth-child(6) { --angle: 225deg; }
        .animate-confetti:nth-child(7) { --angle: 270deg; }
        .animate-confetti:nth-child(8) { --angle: 315deg; }
      ` }} />
    </Dialog>
  );
}
