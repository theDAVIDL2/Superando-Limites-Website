import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import Gift from 'lucide-react/dist/esm/icons/gift';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2';
import Loader2 from 'lucide-react/dist/esm/icons/loader-2';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = BACKEND_URL ? `${BACKEND_URL}/api` : null;

export default function Sorteio() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [success, setSuccess] = useState(false);
  const [giveawayData, setGiveawayData] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    whatsapp: '',
    has_book: false,
    instagram: '',
    address_street: '',
    address_number: '',
    address_complement: '',
    address_neighborhood: '',
    address_city: '',
    address_state: '',
    address_zipcode: ''
  });

  useEffect(() => {
    const fetchStatus = async () => {
      if (!API) return;
      try {
        const response = await fetch(`${API}/giveaway/status`);
        const data = await response.json();
        if (!data.active) {
          toast.error('Este sorteio não está mais ativo');
          navigate('/');
          return;
        }
        setGiveawayData(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Erro ao carregar sorteio');
        navigate('/');
      }
    };

    fetchStatus();
  }, [navigate]);

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
  };

  const formatWhatsApp = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let formattedValue = value;
    if (name === 'address_zipcode') {
      formattedValue = formatCEP(value);
    } else if (name === 'whatsapp') {
      formattedValue = formatWhatsApp(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : formattedValue
    }));
  };

  const handleCepBlur = async () => {
    const cep = formData.address_zipcode.replace(/\D/g, '');
    
    if (cep.length !== 8) return;
    
    setLoadingCep(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }
      
      // Auto-fill address fields
      setFormData(prev => ({
        ...prev,
        address_street: data.logradouro || prev.address_street,
        address_neighborhood: data.bairro || prev.address_neighborhood,
        address_city: data.localidade || prev.address_city,
        address_state: data.uf || prev.address_state
      }));
      
      toast.success('Endereço encontrado!');
    } catch (error) {
      console.error('Error fetching CEP:', error);
      toast.error('Erro ao buscar CEP');
    } finally {
      setLoadingCep(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!API) {
      toast.error('Backend não configurado');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API}/giveaway`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao enviar formulário');
      }

      // Mark user as participated in localStorage
      localStorage.setItem('giveaway-participated', 'true');
      
      setSuccess(true);
      
      // Smooth scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!giveawayData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #ffffff 50%, #fed7aa 100%)'
    }}>
      <div className="max-w-3xl mx-auto">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2 hover:bg-white/50 backdrop-blur-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {!success ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-2xl border-0 overflow-hidden" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <CardHeader className="text-center pb-8" style={{
                  background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(249, 115, 22, 0.1) 100%)',
                  borderBottom: '1px solid rgba(249, 115, 22, 0.1)'
                }}>
                  <motion.div
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex justify-center mb-4"
                  >
                    <div className="p-4 rounded-2xl" style={{
                      background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: 'inset 0 2px 4px rgba(255, 255, 255, 0.5), 0 4px 12px rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.2)'
                    }}>
                      <Gift className="h-14 w-14 text-orange-600" strokeWidth={2} />
                    </div>
                  </motion.div>
                  
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    Sorteio: {giveawayData.prize}
                  </CardTitle>
                  
                  <CardDescription className="text-base mt-2 text-gray-700">
                    Preencha todos os campos para participar
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-800 pb-2 border-b-2 border-orange-200">Informações Pessoais</h3>
                      
                      <div>
                        <Label htmlFor="full_name">Nome Completo *</Label>
                        <Input
                          id="full_name"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleChange}
                          required
                          placeholder="João Silva"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          placeholder="joao@exemplo.com"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="whatsapp">WhatsApp *</Label>
                        <Input
                          id="whatsapp"
                          name="whatsapp"
                          type="tel"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          required
                          placeholder="(11) 98765-4321"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input
                          id="instagram"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          placeholder="@seuinstagram"
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="has_book"
                          name="has_book"
                          checked={formData.has_book}
                          onCheckedChange={(checked) => 
                            setFormData(prev => ({ ...prev, has_book: checked }))
                          }
                        />
                        <Label htmlFor="has_book" className="cursor-pointer">
                          Já possuo o livro "Superando Limites"
                        </Label>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg text-gray-800 pb-2 border-b-2 border-orange-200">Endereço para Entrega</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="address_zipcode">
                            CEP * {loadingCep && <span className="text-amber-600 text-xs ml-2">Buscando...</span>}
                          </Label>
                          <Input
                            id="address_zipcode"
                            name="address_zipcode"
                            value={formData.address_zipcode}
                            onChange={handleChange}
                            onBlur={handleCepBlur}
                            required
                            placeholder="12345-678"
                            maxLength={9}
                            className="mt-1"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Digite o CEP e saia do campo para preencher automaticamente
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="address_street">Rua *</Label>
                          <Input
                            id="address_street"
                            name="address_street"
                            value={formData.address_street}
                            onChange={handleChange}
                            required
                            placeholder="Rua das Flores"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address_number">Número *</Label>
                          <Input
                            id="address_number"
                            name="address_number"
                            value={formData.address_number}
                            onChange={handleChange}
                            required
                            placeholder="123"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address_complement">Complemento</Label>
                          <Input
                            id="address_complement"
                            name="address_complement"
                            value={formData.address_complement}
                            onChange={handleChange}
                            placeholder="Apto 45"
                            className="mt-1"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <Label htmlFor="address_neighborhood">Bairro *</Label>
                          <Input
                            id="address_neighborhood"
                            name="address_neighborhood"
                            value={formData.address_neighborhood}
                            onChange={handleChange}
                            required
                            placeholder="Centro"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address_city">Cidade *</Label>
                          <Input
                            id="address_city"
                            name="address_city"
                            value={formData.address_city}
                            onChange={handleChange}
                            required
                            placeholder="São Paulo"
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="address_state">Estado *</Label>
                          <Input
                            id="address_state"
                            name="address_state"
                            value={formData.address_state}
                            onChange={handleChange}
                            required
                            placeholder="SP"
                            maxLength={2}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full text-white font-bold py-6 text-lg shadow-lg hover:shadow-xl transition-all border-0"
                      style={{
                        background: loading ? '#9ca3af' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        boxShadow: loading ? 'none' : '0 4px 15px 0 rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Gift className="mr-2 h-5 w-5" />
                          Participar do Sorteio
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
            >
              <Card className="shadow-2xl border-0 overflow-hidden" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}>
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-transparent to-green-50/50 pointer-events-none" />
                <CardContent className="pt-12 pb-12 text-center relative">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
                    className="flex justify-center mb-6"
                  >
                    <div className="p-4 rounded-full" style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 10px 40px rgba(16, 185, 129, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3)'
                    }}>
                      <CheckCircle2 className="h-16 w-16 text-white" strokeWidth={2.5} />
                    </div>
                  </motion.div>

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4"
                  >
                    Inscrição Confirmada!
                  </motion.h2>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-gray-700 mb-2 font-medium"
                  >
                    Você está participando do sorteio de {giveawayData.prize}!
                  </motion.p>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 }}
                    className="text-base text-gray-600 mb-8"
                  >
                    Boa sorte! 🍀
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={() => navigate('/')}
                      size="lg"
                      className="font-bold text-white border-0"
                      style={{
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        boxShadow: '0 4px 15px 0 rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      Voltar para o Site
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

