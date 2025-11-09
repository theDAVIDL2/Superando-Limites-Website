import React, { useEffect, useRef, useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

export const EmailBuyDialog = ({ open, onClose, onSubmit, submitting = false }) => {
  const [email, setEmail] = useState("");
  const boxRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => boxRef.current?.querySelector('input')?.focus(), 50);
  }, [open]);

  const submit = (e) => {
    e?.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    onSubmit?.(email);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div ref={boxRef} className="relative w-full max-w-md" style={{ filter: "saturate(1.05)" }}>
        {/* Simplified: no animated neon; high-contrast glass panel */}
        <div className="relative rounded-2xl">
          <div className="relative rounded-[14px] bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-white/10 shadow-2xl overflow-hidden">
            <form onSubmit={submit} className="p-5 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Quase lá!</h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300">Informe seu e-mail para registrar a compra. Em seguida você será redirecionado ao checkout.</p>
              </div>
              <input
                type="email"
                placeholder="seu@email.com"
                className="w-full h-12 rounded-xl border border-zinc-300 px-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="secondary" onClick={onClose}
                  className="bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">Cancelar</Button>
                <Button type="submit" className="liquid-btn hover-glow h-12 min-w-28" disabled={submitting}>Continuar</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <style>{``}</style>
    </div>
  );
};

export default EmailBuyDialog;


