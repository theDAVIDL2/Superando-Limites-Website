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
      <DialogContent className="sm:max-w-md overflow-hidden border-0 p-0" style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.3)'
      }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="p-6"
        >
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 via-transparent to-orange-50/50 pointer-events-none" />
          
          <div className="relative">
            <DialogHeader>
              <div className="flex justify-center mb-6">
                <motion.div
                  animate={{
                    rotate: [0, -5, 5, -5, 0],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="relative p-4 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.2)'
                  }}
                >
                  <Gift className="h-14 w-14 text-orange-600" strokeWidth={2} />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="h-7 w-7 text-amber-500" strokeWidth={2.5} />
                  </motion.div>
                </motion.div>
              </div>
              
              <DialogTitle className="text-center text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                Sorteio Especial!
              </DialogTitle>
              
              <DialogDescription className="text-center text-base mt-3 text-gray-700 leading-relaxed">
                Concorra a {giveawayData.prize}
                <br />
                <span className="text-sm text-gray-600">Participe gratuitamente preenchendo um formulário rápido</span>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-8 space-y-3">
              <Button
                onClick={handleParticipate}
                className="w-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 text-white border-0"
                size="lg"
                style={{
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  boxShadow: '0 4px 15px 0 rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                }}
              >
                <Gift className="h-5 w-5 mr-2" />
                Quero Participar!
              </Button>
              
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 hover:bg-gray-100/50"
              >
                Talvez depois
              </Button>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

