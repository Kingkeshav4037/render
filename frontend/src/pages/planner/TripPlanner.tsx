import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../components/layout/Container';
import { CinematicBackground } from '../../design/backgrounds/CinematicBackground';
import { generateTripPlan } from '../../services/api/plannerApi';
import { TripPlanRequest } from '../../types/planner';
import { ArrowRight, Calendar, Users, Heart, Wallet, Sparkles, MapPin, CheckCircle2, Loader2, Compass } from 'lucide-react';

const DESTINATIONS = ['Norway-wide', 'Oslo', 'Bergen', 'Tromsø', 'Lofoten', 'Stavanger', 'Trondheim', 'Svalbard'];
const PARTY_TYPES = ['solo', 'couple', 'family', 'friends', 'group'];
const TRAVEL_STYLES = ['luxury', 'adventure', 'relaxed', 'budget', 'romantic', 'photography', 'food'];
const BUDGET_LEVELS = ['budget', 'moderate', 'premium', 'luxury'];
const INTERESTS = ['Fjords', 'Mountains', 'Hiking', 'Skiing', 'Aurora', 'Wildlife', 'Food', 'Culture', 'Shopping', 'Photography', 'Road trips', 'Cruises', 'Beaches', 'Fishing'];

export const TripPlanner = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  // Form State
  const [destinations, setDestinations] = useState<string[]>([]);
  const [durationDays, setDurationDays] = useState(7);
  const [partyType, setPartyType] = useState<any>('couple');
  const [travelStyle, setTravelStyle] = useState<any>('adventure');
  const [budgetLevel, setBudgetLevel] = useState<any>('moderate');
  const [interests, setInterests] = useState<string[]>([]);

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, array: string[], item: string) => {
    if (array.includes(item)) setter(array.filter(i => i !== item));
    else setter([...array, item]);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Simulate animated generation steps
    const steps = setInterval(() => {
      setGenerationStep(prev => {
        if (prev >= 5) {
          clearInterval(steps);
          return 5;
        }
        return prev + 1;
      });
    }, 800);

    const request: TripPlanRequest = {
      destinations: destinations.length > 0 ? destinations : ['Norway-wide'],
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + durationDays * 86400000).toISOString(),
      flexibleDates: true,
      partySize: partyType === 'solo' ? 1 : partyType === 'couple' ? 2 : 4,
      partyType,
      travelStyle,
      budgetLevel,
      interests,
      durationDays
    };

    try {
      const plan = await generateTripPlan(request);
      clearInterval(steps);
      // Wait a moment for final animation step
      setTimeout(() => {
        navigate(`/planner/itinerary/${plan.id}`, { state: { plan } });
      }, 500);
    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-deep-night text-white flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-lavender-ice/20 via-deep-night to-transparent opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lavender-ice/10 blur-[100px] rounded-full animate-pulse" />
        
        <div className="relative z-10 w-full max-w-md p-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <div className="w-16 h-16 rounded-full bg-lavender-ice/20 flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-lavender-ice animate-pulse" />
            </div>
            <h2 className="text-3xl font-display font-bold">Building your Norwegian journey...</h2>
          </motion.div>

          <div className="space-y-4">
            {[
              'Understanding your interests',
              'Checking destinations',
              'Comparing travel times',
              'Finding experiences',
              'Optimizing your itinerary',
              'Checking weather'
            ].map((text, idx) => (
              <div key={idx} className={`flex items-center gap-4 transition-all duration-500 ${generationStep >= idx ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                {generationStep > idx ? (
                  <CheckCircle2 className="w-5 h-5 text-lavender-ice" />
                ) : generationStep === idx ? (
                  <Loader2 className="w-5 h-5 text-lavender-ice animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-gray-600" />
                )}
                <span className={generationStep >= idx ? 'text-white' : 'text-gray-500'}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-night text-white pb-24 pt-32 relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-lavender-ice/10 blur-[150px] rounded-full mix-blend-screen" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-polar-indigo/20 blur-[150px] rounded-full mix-blend-screen" />
      </div>

      <Container className="relative z-10 max-w-4xl">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold mb-4"
          >
            Your Norway. <span className="text-lavender-ice italic">Perfectly planned.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 font-light"
          >
            Tell us how you want to experience Norway. SmartLife will build the journey around you.
          </motion.p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              className="h-full bg-lavender-ice" 
              initial={{ width: `${((step - 1) / 5) * 100}%` }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <AnimatePresence mode="wait">
            
            {/* STEP 1: WHERE */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-lavender-ice mb-2">
                  <MapPin className="w-5 h-5" /> <span className="font-bold tracking-widest uppercase text-sm">Step 1 of 5</span>
                </div>
                <h2 className="text-3xl font-display font-bold">Where would you like to go?</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {DESTINATIONS.map(dest => (
                    <button
                      key={dest}
                      onClick={() => toggleArrayItem(setDestinations, destinations, dest)}
                      className={`p-4 rounded-2xl border text-center transition-all ${
                        destinations.includes(dest) 
                          ? 'bg-lavender-ice/20 border-lavender-ice text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="font-bold">{dest}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 2: WHEN */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-lavender-ice mb-2">
                  <Calendar className="w-5 h-5" /> <span className="font-bold tracking-widest uppercase text-sm">Step 2 of 5</span>
                </div>
                <h2 className="text-3xl font-display font-bold">How long are you staying?</h2>
                
                <div className="flex items-center gap-8 justify-center py-12">
                  <button 
                    onClick={() => setDurationDays(Math.max(1, durationDays - 1))}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-2xl"
                  >-</button>
                  <div className="text-center">
                    <div className="text-6xl font-display font-bold text-lavender-ice">{durationDays}</div>
                    <div className="text-gray-400 uppercase tracking-widest text-sm mt-2">Days</div>
                  </div>
                  <button 
                    onClick={() => setDurationDays(Math.min(30, durationDays + 1))}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 text-2xl"
                  >+</button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: WHO */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-lavender-ice mb-2">
                  <Users className="w-5 h-5" /> <span className="font-bold tracking-widest uppercase text-sm">Step 3 of 5</span>
                </div>
                <h2 className="text-3xl font-display font-bold">Who is traveling?</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {PARTY_TYPES.map(type => (
                    <button
                      key={type}
                      onClick={() => setPartyType(type)}
                      className={`p-4 rounded-2xl border text-center transition-all capitalize ${
                        partyType === type 
                          ? 'bg-lavender-ice/20 border-lavender-ice text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-bold">{type}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-8">
                  <h3 className="text-xl font-bold mb-4">Travel Style</h3>
                  <div className="flex flex-wrap gap-3">
                    {TRAVEL_STYLES.map(style => (
                      <button
                        key={style}
                        onClick={() => setTravelStyle(style)}
                        className={`px-6 py-2 rounded-full border transition-all capitalize ${
                          travelStyle === style 
                            ? 'bg-lavender-ice text-deep-night font-bold border-lavender-ice' 
                            : 'bg-transparent border-white/20 text-gray-400 hover:border-white/50'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 4: BUDGET */}
            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-lavender-ice mb-2">
                  <Wallet className="w-5 h-5" /> <span className="font-bold tracking-widest uppercase text-sm">Step 4 of 5</span>
                </div>
                <h2 className="text-3xl font-display font-bold">What is your budget level?</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {BUDGET_LEVELS.map(level => (
                    <button
                      key={level}
                      onClick={() => setBudgetLevel(level)}
                      className={`p-6 rounded-2xl border text-center transition-all capitalize ${
                        budgetLevel === level 
                          ? 'bg-lavender-ice/20 border-lavender-ice text-white shadow-[0_0_15px_rgba(167,139,250,0.2)]' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-bold text-lg block">{level}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STEP 5: INTERESTS */}
            {step === 5 && (
              <motion.div 
                key="step5"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 text-lavender-ice mb-2">
                  <Heart className="w-5 h-5" /> <span className="font-bold tracking-widest uppercase text-sm">Final Step</span>
                </div>
                <h2 className="text-3xl font-display font-bold">What are your interests?</h2>
                <p className="text-gray-400">Select all that apply to help us tailor your experience.</p>
                
                <div className="flex flex-wrap gap-3">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      onClick={() => toggleArrayItem(setInterests, interests, interest)}
                      className={`px-6 py-3 rounded-xl border transition-all ${
                        interests.includes(interest) 
                          ? 'bg-lavender-ice text-deep-night font-bold border-lavender-ice' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/30'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center">
            {step > 1 ? (
              <button 
                onClick={prevStep}
                className="text-gray-400 hover:text-white font-bold transition-colors"
              >
                Back
              </button>
            ) : <div />}

            {step < 5 ? (
              <button 
                onClick={nextStep}
                className="bg-white text-deep-night px-8 py-3 rounded-xl font-bold hover:bg-lavender-ice transition-colors flex items-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button 
                onClick={handleGenerate}
                className="bg-lavender-ice text-deep-night px-8 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(167,139,250,0.4)]"
              >
                <Sparkles className="w-4 h-4" /> Generate Trip Plan
              </button>
            )}
          </div>

        </div>
      </Container>
    </div>
  );
};
