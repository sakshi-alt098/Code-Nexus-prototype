// Hybrid API Client: Allows switching between Live Microservice APIs and Demo Mock Engine

import { Finding } from '../types';
import { runClientSideAudit, calculateComplianceScore } from './mockAuditEngine';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export interface AuditRequestPayload {
  content: string;
  contentType: string;
  title: string;
  brandContext?: string;
}

export interface AuditResponsePayload {
  score: number;
  findings: Finding[];
  isAiGrounded: boolean;
  latencyMs: number;
}

export class BrandGovernanceService {
  private static isLiveBackendEnabled = false;

  static setLiveMode(enabled: boolean) {
    this.isLiveBackendEnabled = enabled;
  }

  static isLiveMode(): boolean {
    return this.isLiveBackendEnabled;
  }

  static async auditContent(payload: AuditRequestPayload): Promise<AuditResponsePayload> {
    const startTime = performance.now();

    if (this.isLiveBackendEnabled) {
      try {
        const response = await fetch(`${API_BASE_URL}/audit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          return {
            score: data.score,
            findings: data.findings,
            isAiGrounded: true,
            latencyMs: Math.round(performance.now() - startTime)
          };
        }
      } catch (err) {
        console.warn('Live API connection failed, falling back to local audit engine:', err);
      }
    }

    // Default Client-Side Deterministic Rule Simulation
    const findings = runClientSideAudit(payload.content);
    const score = calculateComplianceScore(findings);

    return {
      score,
      findings,
      isAiGrounded: false,
      latencyMs: Math.round(performance.now() - startTime)
    };
  }
}
