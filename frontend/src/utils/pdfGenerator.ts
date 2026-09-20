import { jsPDF } from 'jspdf';
import type { ContainerDetail } from '../types';

export function exportShipmentPdf(container: ContainerDetail, reportData?: any) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const primaryOrange = [255, 92, 0];
  const darkNavy = [15, 23, 42];
  const textMuted = [100, 116, 139];

  // Header Banner
  doc.setFillColor(darkNavy[0], darkNavy[1], darkNavy[2]);
  doc.rect(0, 0, 210, 36, 'F');

  // Accent Line
  doc.setFillColor(primaryOrange[0], primaryOrange[1], primaryOrange[2]);
  doc.rect(0, 35, 210, 3, 'F');

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('FleetX Container Intelligence Platform', 15, 18);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 210, 225);
  doc.text('GLOBAL MARITIME & INTERMODAL OPERATIONS DOSSIER', 15, 26);
  doc.text(`Generated: ${new Date().toUTCString()}`, 130, 26);

  // Document Metadata Table Box
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(15, 45, 180, 32, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, 45, 180, 32, 2, 2, 'D');

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`CONTAINER ID: #${container.id}`, 20, 53);
  doc.text(`CARRIER: ${container.carrier.toUpperCase()}`, 110, 53);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Cargo: ${container.cargo}`, 20, 61);
  doc.text(`Vessel: ${container.vessel_name}`, 110, 61);
  doc.text(`Origin: ${container.origin_port}`, 20, 69);
  doc.text(`Destination: ${container.destination_port}`, 110, 69);

  // Status & Risk Badges
  let y = 86;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Voyage Telemetry & ETA Prediction', 15, y);

  y += 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, 28, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text('Operational Status', 20, y + 8);
  doc.text('Delay Risk Rating', 70, y + 8);
  doc.text('Predicted ETA', 120, y + 8);
  doc.text('ML Confidence', 165, y + 8);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(container.status, 20, y + 18);
  
  const riskColor = container.delay_risk === 'High' ? [220, 38, 38] : container.delay_risk === 'Medium' ? [217, 119, 6] : [16, 185, 129];
  doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
  doc.text(`${container.delay_risk} (+${container.delay_hours}h)`, 70, y + 18);

  doc.setTextColor(15, 23, 42);
  doc.text(container.predicted_eta.replace(' UTC', ''), 120, y + 18);
  doc.text(`${container.eta_confidence}%`, 165, y + 18);

  // Executive AI Summary Section
  y += 38;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('AI Executive Disruption & Operational Analysis', 15, y);

  y += 6;
  doc.setFillColor(255, 247, 237); // Light orange tint
  doc.setDrawColor(254, 215, 170);
  doc.roundedRect(15, y, 180, 36, 2, 2, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(67, 20, 7);
  const splitSummary = doc.splitTextToSize(container.ai_summary, 170);
  doc.text(splitSummary, 20, y + 8);

  // Milestone Progress Table
  y += 46;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Route Waypoint Milestones', 15, y);

  y += 6;
  doc.setFillColor(241, 245, 249);
  doc.rect(15, y, 180, 8, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PORT / LOCATION', 20, y + 5);
  doc.text('STATUS', 85, y + 5);
  doc.text('ARRIVAL (UTC)', 125, y + 5);
  doc.text('CONGESTION', 165, y + 5);

  y += 8;
  doc.setFont('helvetica', 'normal');
  container.milestones.forEach((m, idx) => {
    doc.setFillColor(idx % 2 === 0 ? 255 : 248, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252);
    doc.rect(15, y, 180, 8, 'F');
    doc.setTextColor(15, 23, 42);
    doc.text(`${m.port_name} (${m.port_code})`, 20, y + 5);
    doc.text(m.status, 85, y + 5);
    doc.text(m.actual_or_estimated_arrival, 125, y + 5);
    doc.text(m.congestion_level, 165, y + 5);
    y += 8;
  });

  // Environmental & Cold Chain Telemetry
  y += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Digital Twin Telemetry & Environmental Sensors', 15, y);

  y += 6;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(15, y, 180, 20, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Container Health', 25, y + 6);
  doc.text('Core Temp', 70, y + 6);
  doc.text('Humidity', 115, y + 6);
  doc.text('CO2 Optimized', 155, y + 6);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${container.sensors.health_pct}%`, 25, y + 14);
  doc.text(`${container.sensors.temperature_c}°C`, 70, y + 14);
  doc.text(`${container.sensors.humidity_pct}%`, 115, y + 14);
  doc.text(`-${container.co2_saved_pct}%`, 155, y + 14);

  // Footer
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text('FleetX Logistics Intelligence OS - Authorized Operational Audit Copy. Confidential.', 15, 286);

  doc.save(`FleetX_Shipment_Report_${container.id}.pdf`);
}
