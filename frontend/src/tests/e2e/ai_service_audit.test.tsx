import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { plannerService } from '../../services/plannerService';
import { Assistant } from '../../pages/user/Assistant';

// ─── Polyfills ───────────────────────────────────────────────────────
beforeEach(() => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
});

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    functions: {
      invoke: vi.fn().mockResolvedValue({
        data: null,
        error: { message: 'Edge Function timeout' },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue({
        data: [
          { id: 'loc-1', name: 'Flåm', region: 'Vestland', type: 'VILLAGE' },
          { id: 'loc-2', name: 'Tromsø', region: 'Troms', type: 'CITY' },
        ],
        error: null,
      }),
    }),
  },
}));

// Mock Google Generative AI SDK
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: vi.fn().mockResolvedValue({
            response: Promise.resolve({
              text: () => 'Certainly! Here is information for your trip.',
            }),
          }),
        };
      }
    },
  };
});

describe('AI and ML Service Integration & Resilience Audit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (import.meta.env as any).VITE_GEMINI_API_KEY = 'test-key-mock';
  });

  // ─── 1. AI Database Context Extraction ────────────────────────────
  describe('AI Database Context Extraction', () => {
    it('gathers structured context (locations, activities, accommodations) for AI prompt injection', async () => {
      const context = await plannerService.getDatabaseContext();

      expect(context.locations).toBeDefined();
      expect(context.activities).toBeDefined();
      expect(context.accommodations).toBeDefined();
      expect(context.locations.length).toBeGreaterThan(0);
    });
  });

  // ─── 2. AI Prompt Generation & Fault Tolerance ────────────────────
  describe('AI Prompt Generation & Resilience', () => {
    it('handles AI network timeout or missing Gemini API key gracefully without crashing', async () => {
      // Mock global fetch returning error
      globalThis.fetch = vi.fn().mockRejectedValueOnce(new Error('Gemini API quota exceeded or network timeout'));

      const plan = await plannerService.generateAITrip('5 days in Lofoten', '2026-10-15');

      // Planner service should catch the error and return null safely
      expect(plan).toBeNull();
    });

    it('handles malformed AI JSON response without throwing unhandled exceptions', async () => {
      globalThis.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValueOnce({
          candidates: [
            {
              content: {
                parts: [{ text: 'This is not valid JSON at all!' }],
              },
            },
          ],
        }),
      } as any);

      const plan = await plannerService.generateAITrip('Fjord trip', '2026-09-01');
      expect(plan).toBeNull();
    });
  });

  // ─── 3. AI Assistant UI Resilience ────────────────────────────────
  describe('AI Assistant UI Fault Tolerance', () => {
    it('renders AI assistant chat interface and handles user messages safely', async () => {
      render(
        <MemoryRouter>
          <Assistant />
        </MemoryRouter>
      );

      expect(screen.getByRole('heading', { name: /Personal Assistant/i })).toBeInTheDocument();
      expect(screen.getByText(/Hei! I am your personal Norway assistant/i)).toBeInTheDocument();

      const input = screen.getByPlaceholderText(/Ask about your trip/i);
      fireEvent.change(input, { target: { value: 'What is the best time to see the northern lights?' } });

      const sendBtn = screen.getByRole('button');
      fireEvent.click(sendBtn);

      await waitFor(() => {
        expect(screen.getByText('What is the best time to see the northern lights?')).toBeInTheDocument();
      });
    });

    it('handles empty input gracefully without firing AI requests', () => {
      render(
        <MemoryRouter>
          <Assistant />
        </MemoryRouter>
      );

      const sendBtn = screen.getByRole('button');
      expect(sendBtn).toBeDisabled();
    });
  });
});
