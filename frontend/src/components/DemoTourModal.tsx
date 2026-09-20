import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  CloudRain, 
  FileText, 
  Compass, 
  RotateCcw,
  X
} from 'lucide-react';

interface DemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStepAction: (stepIndex: number) => void;
}

export const DemoTourModal: React.FC<DemoTourModalProps> = ({
  isOpen,
  onClose,
  onStepAction
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const demoSteps = [
    {
      step: 1,
      title: 'Enterprise Operator Authentication',
      desc: 'Verify Alex Morgan (AI Supervisor) role credentials and live telemetry telemetry streams.',
      actionLabel: 'Select MSKU1234567 Container',
      highlight: 'MSKU1234567'
    },
    {
      step: 2,
      title: 'Container Search & Multi-modal Visual',
      desc: 'Inspect double-stacked container freight train and 4 live AI environmental telemetry cards (Health 92%, Temp 22°C).',
      actionLabel: 'Open Ocean Map & Journey',
      highlight: 'Smart Logistics Hub'
    },
    {
      step: 3,
      title: 'Interactive Ocean Map & Sea Lanes',
      desc: 'Track Emma Maersk traversing the great-circle Indian Ocean maritime corridor with clickable port congestion pins.',
      actionLabel: 'Analyze ML ETA & Risk',
      highlight: 'Leaflet Ocean Map'
    },
    {
      step: 4,
      title: 'XGBoost ETA & Medium Delay Risk',
      desc: 'Observe the 87% confidence radial meter and +14.0h buffer due to Singapore berth congestion.',
      actionLabel: 'Trigger Tropical Cyclone Storm',
      highlight: 'Delay Risk: Medium'
    },
    {
      step: 5,
      title: 'Digital Twin Simulation: Tropical Storm',
      desc: 'Instant southern sea lane reroute, wave avoidance speed throttled to 12.8 kts, risk gauge turns High (Red), ETA pushed +32.5h.',
      actionLabel: 'Review AI Disruption Explanation',
      highlight: 'Southern Storm Reroute'
    },
    {
      step: 6,
      title: 'AI Operational Narrative & Executive Report',
      desc: 'Synthesize executive disruption briefing and export the authorized Level-2 Disruption Dossier PDF for operations leadership.',
      actionLabel: 'Download Executive Report PDF',
      highlight: 'Export PDF Dossier'
    }
  ];

  const current = demoSteps[currentStep];

  const handleNext = () => {
    onStepAction(currentStep);
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 overflow-hidden relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center transition-colors"
        >
          <X size={16} />
        </button>

        {/* Badge & Title */}
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-[#FF5C00] text-[10px] font-black uppercase tracking-wider">
            2-Minute Executive Interview Demo
          </span>
          <span className="text-xs font-bold text-gray-400">
            Step {currentStep + 1} of {demoSteps.length}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
          {current.title}
        </h3>
        <p className="text-xs text-gray-600 leading-relaxed mb-6">
          {current.desc}
        </p>

        {/* Step Progress Pills */}
        <div className="flex items-center gap-1.5 mb-6">
          {demoSteps.map((s, idx) => (
            <div
              key={s.step}
              className={`h-2 rounded-full flex-1 transition-all ${
                idx === currentStep 
                  ? 'bg-[#FF5C00]' 
                  : idx < currentStep 
                  ? 'bg-emerald-500' 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Key Feature Highlight Pill */}
        <div className="p-3 bg-orange-50 rounded-2xl border border-orange-200 flex items-center justify-between text-xs mb-6">
          <span className="text-gray-500 font-medium">Demonstration Focus:</span>
          <span className="font-bold text-[#FF5C00]">{current.highlight}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setCurrentStep(0)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={14} />
            <span>Restart Demo</span>
          </button>

          <button
            onClick={handleNext}
            className="px-6 py-2.5 rounded-full text-xs font-bold bg-gradient-to-r from-[#FF5C00] to-orange-600 hover:from-[#E04F00] hover:to-[#FF5C00] text-white shadow-lg shadow-orange-500/25 transition-all flex items-center gap-2 transform hover:scale-105"
          >
            <span>{current.actionLabel}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
