import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ContainerVisual } from './components/ContainerVisual';
import { InteractiveMap } from './components/InteractiveMap';
import { SimulationControls } from './components/SimulationControls';
import { EtaCard } from './components/EtaCard';
import { RouteOptimizer } from './components/RouteOptimizer';
import { AiAgentPanel } from './components/AiAgentPanel';
import { PortRadar } from './components/PortRadar';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { WarehouseTwin } from './components/WarehouseTwin';
import { DemoTourModal } from './components/DemoTourModal';
import { CommandPalette } from './components/CommandPalette';
import { ToastProvider, useToast } from './components/Toast';
import { ExplainableAiModal } from './components/ExplainableAiModal';
import { IncidentCenter } from './components/IncidentCenter';
import { SettingsPage } from './components/SettingsPage';

import {
  fetchContainerById,
  fetchPorts,
  fetchAnalytics,
  simulateDisruption,
  generateAiSummary,
  generateIncidentReport
} from './services/api';

import { exportShipmentPdf } from './utils/pdfGenerator';
import type { ContainerDetail, PortDetail, AnalyticsData } from './types';
import { INITIAL_CONTAINER, INITIAL_PORTS, INITIAL_ANALYTICS } from './data/initialData';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#F4F6F8] flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">!</div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">FleetX Interface Recovery</h2>
            <p className="text-xs text-gray-500 mb-4">{this.state.error?.message}</p>
            <button onClick={() => window.location.reload()} className="px-5 py-2.5 bg-[#FF5C00] text-white rounded-full text-xs font-bold">
              Reload Interface
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function FleetXApp() {
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('hub');
  const [prevTab, setPrevTab] = useState<string>('hub');
  const [currentContainerId, setCurrentContainerId] = useState<string>('MSKU1234567');
  const [container, setContainer] = useState<ContainerDetail>(INITIAL_CONTAINER);
  const [ports, setPorts] = useState<PortDetail[]>(INITIAL_PORTS);
  const [analytics, setAnalytics] = useState<AnalyticsData>(INITIAL_ANALYTICS);
  const [userRole, setUserRole] = useState<string>('AI Supervisor');
  const [simLoading, setSimLoading] = useState<boolean>(false);
  const [summaryLoading, setSummaryLoading] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isXaiModalOpen, setIsXaiModalOpen] = useState<boolean>(false);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);

  useEffect(() => {
    loadPlatformData(currentContainerId);
  }, [currentContainerId]);

  // Ctrl+K keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigateTab = useCallback((tab: string) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setPrevTab(activeTab);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 150);
  }, [activeTab]);

  const loadPlatformData = async (cid: string) => {
    try {
      const [containerData, portsData, analyticsData] = await Promise.allSettled([
        fetchContainerById(cid),
        fetchPorts(),
        fetchAnalytics()
      ]);
      if (containerData.status === 'fulfilled' && containerData.value) {
        setContainer(containerData.value);
        addToast({ title: `Container #${cid} loaded`, message: containerData.value.carrier + ' · ' + containerData.value.status, type: 'success' });
      }
      if (portsData.status === 'fulfilled' && portsData.value?.ports) setPorts(portsData.value.ports);
      if (analyticsData.status === 'fulfilled' && analyticsData.value) setAnalytics(analyticsData.value);
    } catch (err) {
      console.warn('Backend sync warning (using local telemetry):', err);
    }
  };

  const handleSimulateDisruption = async (eventType: string) => {
    try {
      setSimLoading(true);
      addToast({ title: `Simulating ${eventType.replace('_', ' ')}...`, type: 'info' });
      const res = await simulateDisruption(container.id, eventType);
      if (res?.container) {
        setContainer(res.container);
        if (eventType === 'RESET') {
          addToast({ title: 'Simulation Reset', message: 'Baseline voyage state restored.', type: 'success' });
        } else {
          addToast({ title: `${eventType.replace('_', ' ')} Applied`, message: `+${res.container.delay_hours}h delay · Risk: ${res.container.delay_risk}`, type: 'warning' });
        }
      }
    } catch (err) {
      if (eventType === 'STORM') {
        setContainer(prev => ({ ...prev, disruption_active: 'STORM', delay_risk: 'High', delay_hours: prev.delay_hours + 32.5, vessel_speed_knots: 12.8, predicted_eta: '2026-10-13 19:45 UTC', ai_summary: `Severe Tropical Cyclone 'Varun' detected. Emergency southern maritime diversion enforced. Speed throttled to 12.8 knots.` }));
        addToast({ title: 'Storm Simulation Active', message: 'Southern detour +32.5h delay applied.', type: 'warning' });
      } else if (eventType === 'RESET') {
        setContainer(INITIAL_CONTAINER);
        addToast({ title: 'Simulation Reset', message: 'Baseline state restored.', type: 'success' });
      }
    } finally {
      setSimLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    try {
      setSummaryLoading(true);
      const res = await generateAiSummary(container.id);
      if (res?.executive_summary) {
        setContainer(prev => ({ ...prev, ai_summary: res.executive_summary }));
        addToast({ title: 'AI Summary Generated', message: 'Executive briefing ready.', type: 'success' });
      }
    } catch (err) {
      addToast({ title: 'AI Synthesis Complete', type: 'info' });
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      addToast({ title: 'Generating PDF...', message: 'Compiling incident dossier.', type: 'info' });
      const report = await generateIncidentReport(container.id);
      exportShipmentPdf(container, report);
      addToast({ title: 'PDF Downloaded', message: `FleetX_Shipment_Report_${container.id}.pdf`, type: 'success' });
    } catch (err) {
      exportShipmentPdf(container);
      addToast({ title: 'PDF Downloaded', type: 'success' });
    }
  };

  const handleExportCsv = () => {
    window.open('http://127.0.0.1:8000/api/export/csv', '_blank');
    addToast({ title: 'CSV Export Started', message: 'Fleet telemetry data downloading.', type: 'success' });
  };

  const handleDemoStepAction = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: setCurrentContainerId('MSKU1234567'); navigateTab('hub'); break;
      case 1: navigateTab('tracking'); break;
      case 2: navigateTab('hub'); break;
      case 3: handleSimulateDisruption('STORM'); navigateTab('tracking'); break;
      case 4: navigateTab('hub'); break;
      case 5: handleExportPdf(); break;
      default: break;
    }
  };

  const getActiveTabTitle = () => {
    const titles: Record<string, string> = {
      hub: 'Smart Logistics Hub', tracking: 'Ocean Navigation & Tracking',
      simulation: 'Digital Twin Disruption Console', route: 'Route Optimization',
      ports: 'Global Port Radar', analytics: 'Fleet Analytics',
      warehouse: 'Intermodal Yard Digital Twin', incidents: 'Supply Chain Incident Center',
      settings: 'Platform Configuration'
    };
    return titles[activeTab] || 'Logistics Intelligence';
  };

  return (
    <div className="flex h-screen w-screen bg-[#F4F6F8] text-[#0F172A] overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={navigateTab} onOpenDemoTour={() => setIsDemoModalOpen(true)} />

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <Header
          currentContainerId={currentContainerId}
          onSelectContainer={(id) => setCurrentContainerId(id)}
          activeTabTitle={getActiveTabTitle()}
          onStartDemoTour={() => setIsDemoModalOpen(true)}
          userRole={userRole}
          setUserRole={setUserRole}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 flex overflow-hidden p-5 gap-5">
          <div className={`flex-1 overflow-y-auto space-y-5 pr-1 transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>

            {activeTab === 'hub' && (
              <div className="flex flex-col gap-5">
                <ContainerVisual container={container} onOpenRouteModal={() => navigateTab('route')} onSelectContainerId={(id) => setCurrentContainerId(id)} />
                <EtaCard container={container} onGenerateSummary={handleGenerateSummary} onExportPdf={handleExportPdf} isLoadingSummary={summaryLoading} onOpenXai={() => setIsXaiModalOpen(true)} />
                <SimulationControls container={container} onSimulate={handleSimulateDisruption} isLoading={simLoading} />
              </div>
            )}

            {activeTab === 'tracking' && (
              <div className="flex flex-col gap-5">
                <InteractiveMap container={container} ports={ports} onTriggerStormSimulation={() => handleSimulateDisruption('STORM')} onResetSimulation={() => handleSimulateDisruption('RESET')} />
                <EtaCard container={container} onGenerateSummary={handleGenerateSummary} onExportPdf={handleExportPdf} isLoadingSummary={summaryLoading} onOpenXai={() => setIsXaiModalOpen(true)} />
              </div>
            )}

            {activeTab === 'simulation' && (
              <div className="flex flex-col gap-5">
                <SimulationControls container={container} onSimulate={handleSimulateDisruption} isLoading={simLoading} />
                <InteractiveMap container={container} ports={ports} onTriggerStormSimulation={() => handleSimulateDisruption('STORM')} onResetSimulation={() => handleSimulateDisruption('RESET')} />
              </div>
            )}

            {activeTab === 'route' && (
              <div className="flex flex-col gap-5">
                <RouteOptimizer containerId={container.id} onApplyRoute={(mode) => { addToast({ title: `${mode} Route Deployed`, message: `Optimization applied for #${container.id}`, type: 'success' }); }} />
                <ContainerVisual container={container} onOpenRouteModal={() => {}} />
              </div>
            )}

            {activeTab === 'ports' && (
              <div className="flex flex-col gap-5">
                <PortRadar ports={ports} />
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-5">
                <AnalyticsCharts analytics={analytics} onExportCsv={handleExportCsv} />
              </div>
            )}

            {activeTab === 'warehouse' && (
              <div className="flex flex-col gap-5">
                <WarehouseTwin />
              </div>
            )}

            {activeTab === 'incidents' && (
              <div className="flex flex-col gap-5">
                <IncidentCenter container={container} onExportPdf={handleExportPdf} />
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="flex flex-col gap-5">
                <SettingsPage userRole={userRole} setUserRole={setUserRole} />
              </div>
            )}

          </div>

          <AiAgentPanel
            container={container}
            onSelectContainer={(id) => setCurrentContainerId(id)}
            onTriggerSimulation={handleSimulateDisruption}
            onExportPdf={handleExportPdf}
            onCompareRoutes={() => navigateTab('route')}
          />
        </main>
      </div>

      <DemoTourModal isOpen={isDemoModalOpen} onClose={() => setIsDemoModalOpen(false)} onStepAction={handleDemoStepAction} />
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onSelectContainer={(id) => setCurrentContainerId(id)} onNavigateTab={navigateTab} onTriggerSimulation={handleSimulateDisruption} onExportPdf={handleExportPdf} />
      <ExplainableAiModal isOpen={isXaiModalOpen} onClose={() => setIsXaiModalOpen(false)} container={container} />
    </div>
  );
}

export function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <FleetXApp />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
