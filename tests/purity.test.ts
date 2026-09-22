import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Configuration Purity Test', () => {
  it('verifies that UI components do not hardcode fee calculations or tax percentages', () => {
    const componentsDir = path.join(__dirname, '../src/components');
    const files = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.tsx'));

    expect(files.length).toBeGreaterThan(0);

    for (const file of files) {
      const content = fs.readFileSync(path.join(componentsDir, file), 'utf-8');

      // Components must not perform math with hardcoded rates
      expect(content).not.toMatch(/price\s*\*\s*0\.065/);
      expect(content).not.toMatch(/purchasePrice\s*\*\s*0\.065/);
      expect(content).not.toMatch(/\b41\.60\s*\+/);
      expect(content).not.toMatch(/total\s*=\s*.*\+\s*200/);
    }
  });

  it('verifies partner slots all have href="#" in MVP build', () => {
    const partnerSlotsPath = path.join(__dirname, '../src/config/partnerSlots.json');
    const partnerSlots = JSON.parse(fs.readFileSync(partnerSlotsPath, 'utf-8'));

    expect(Array.isArray(partnerSlots)).toBe(true);
    expect(partnerSlots.length).toBeGreaterThanOrEqual(2);

    for (const slot of partnerSlots) {
      expect(slot.href).toBe('#');
    }
  });
});
