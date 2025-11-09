import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import Gift from 'lucide-react/dist/esm/icons/gift';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

export function GiveawayNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [giveawayData, setGiveawayData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      if (!API) return;
      
      // Check if user already participated
      const participated = localStorage.getItem('giveaway-participated');
      if (participated) return;
      
      // Check if user has seen modal
      const seen = localStorage.getItem('giveaway-modal-seen');
      if (seen) return;

      try {
        const response = await fetch(`${API}/giveaway/status`);
        const data = await response.json();
        if (data.active) {
          setGiveawayData(data);
          
          // Show modal after 3 seconds
          setTimeout(() => {
            setIsOpen(true);
            localStorage.setItem('giveaway-modal-seen', 'true');
          }, 3000);
        }
      } catch (error) {
        console.error('Error fetching giveaway status:', error);
      }
    };

    fetchStatus();
  }, []);

  const handleParticipate = () => {
    setIsOpen(false);
    navigate('/sorteio');
  };

  if (!giveawayData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <motion.div
                animate={{
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <Gift className="h-16 w-16 text-amber-500" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-1 -right-1"
                >
                  <Sparkles className="h-6 w-6 text-yellow-400" />
                </motion.div>
              </motion.div>
            </div>
            
            <DialogTitle className="text-center text-2xl font-bold">
              🎉 Sorteio Especial!
            </DialogTitle>
            
            <DialogDescription className="text-center text-base mt-2">
              Concorra a uma <span className="font-bold text-amber-600">{giveawayData.prize}</span>!
              <br />
              Participe gratuitamente preenchendo um formulário rápido.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-3">
            <Button
              onClick={handleParticipate}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
              size="lg"
            >
              Quero Participar! 🎁
            </Button>
            
            <Button
              onClick={() => setIsOpen(false)}
              variant="ghost"
              className="w-full"
            >
              Talvez depois
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

