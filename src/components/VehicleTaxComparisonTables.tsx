'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { StateComparisonRow, TaxRateRow, TitleFeeRow, generateComparisonCsv } from '@/lib/stateComparison';
import { formatFee } from '@/lib/formatters';

interface VehicleTaxComparisonTablesProps {
  initialHeroRows: StateComparisonRow[];
  initialTaxRateRows: TaxRateRow[];
  initialTitleFeeRows: TitleFeeRow[];
}

type HeroSortField = 'rank' | 'state' | 'rate' | 'title' | 'reg' | 'total';
type TaxRateSortField = 'rank' | 'state' | 'rate' | 'tax';
type TitleFeeSortField = 'rank' | 'state' | 'title' | 'lien';
type SortDirection = 'asc' | 'desc';

export function VehicleTaxComparisonTables({
  initialHeroRows,
  initialTaxRateRows,
  initialTitleFeeRows
}: VehicleTaxComparisonTablesProps) {
  // Hero Table Sort State
  const [heroSortField, setHeroSortField] = useState<HeroSortField>('rank');
  const [heroSortDir, setHeroSortDir] = useState<SortDirection>('asc');

  // Tax Rate Table Sort State
  const [rateSortField, setRateSortField] = useState<TaxRateSortField>('rank');
  const [rateSortDir, setRateSortDir] = useState<SortDirection>('asc');

  // Title Fee Table Sort State
  const [titleSortField, setTitleSortField] = useState<TitleFeeSortField>('rank');
  const [titleSortDir, setTitleSortDir] = useState<SortDirection>('asc');

  // Hero table sorting logic
  const sortedHeroRows = useMemo(() => {
    return [...initialHeroRows].sort((a, b) => {
      let comparison = 0;
      switch (heroSortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'state':
          comparison = a.label.localeCompare(b.label);
          break;
        case 'rate':
          if (a.isFlatTable && !b.isFlatTable) comparison = 1;
          else if (!a.isFlatTable && b.isFlatTable) comparison = -1;
          else comparison = a.exciseTaxRate - b.exciseTaxRate;
          break;
        case 'title':
          comparison = a.titleFee - b.titleFee;
          break;
        case 'reg':
          comparison = a.registrationFee - b.registrationFee;
          break;
        case 'total':
          comparison = a.totalCost - b.totalCost;
          break;
      }
      return heroSortDir === 'asc' ? comparison : -comparison;
    });
  }, [initialHeroRows, heroSortField, heroSortDir]);

  // Tax rate table sorting logic
  const sortedRateRows = useMemo(() => {
    return [...initialTaxRateRows].sort((a, b) => {
      let comparison = 0;
      switch (rateSortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'state':
          comparison = a.label.localeCompare(b.label);
          break;
        case 'rate':
          if (a.isFlatTable && !b.isFlatTable) comparison = 1;
          else if (!a.isFlatTable && b.isFlatTable) comparison = -1;
          else comparison = a.exciseTaxRate - b.exciseTaxRate;
          break;
        case 'tax':
          comparison = a.estimatedTax - b.estimatedTax;
          break;
      }
      return rateSortDir === 'asc' ? comparison : -comparison;
    });
  }, [initialTaxRateRows, rateSortField, rateSortDir]);

  // Title fee table sorting logic
  const sortedTitleRows = useMemo(() => {
    return [...initialTitleFeeRows].sort((a, b) => {
      let comparison = 0;
      switch (titleSortField) {
        case 'rank':
          comparison = a.rank - b.rank;
          break;
        case 'state':
          comparison = a.label.localeCompare(b.label);
          break;
        case 'title':
          comparison = a.titleFee - b.titleFee;
          break;
        case 'lien':
          comparison = a.lienFilingFee - b.lienFilingFee;
          break;
      }
      return titleSortDir === 'asc' ? comparison : -comparison;
    });
  }, [initialTitleFeeRows, titleSortField, titleSortDir]);

  // Sorting handlers
  const handleHeroSort = (field: HeroSortField) => {
    if (heroSortField === field) {
      setHeroSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setHeroSortField(field);
      setHeroSortDir(field === 'state' ? 'asc' : 'asc');
    }
  };

  const handleRateSort = (field: TaxRateSortField) => {
    if (rateSortField === field) {
      setRateSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setRateSortField(field);
      setRateSortDir('asc');
    }
  };

  const handleTitleSort = (field: TitleFeeSortField) => {
    if (titleSortField === field) {
      setTitleSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setTitleSortField(field);
      setTitleSortDir('asc');
    }
  };

  // CSV download trigger
  const handleDownloadCsv = () => {
    const csvContent = generateComparisonCsv(initialHeroRows);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'cartaxhub-vehicle-tax-by-state-2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderSortArrow = (active: boolean, dir: SortDirection) => {
    if (!active) {
      return (
        <span className="ml-1 text-slate-300 opacity-60 group-hover:opacity-100 dark:text-slate-600">
          ↕
        </span>
      );
    }
    return <span className="ml-1 text-indigo-600 dark:text-indigo-400">{dir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className="space-y-16">
      {/* 1. Hero Table: Total First-Year Cost Ranking */}
      <section id="total-cost-ranking" className="scroll-mt-12">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              <span>Section 3: Comprehensive Rankings</span>
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
              Total First-Year Vehicle Cost by State
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
              Ranked from cheapest to most expensive for a standard $25,000 passenger purchase (sales tax + title fee + 1-year registration). Click column headers to sort.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadCsv}
            id="download-csv-btn"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            <span>Download Dataset (CSV)</span>
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleHeroSort('rank')}
                      className="group inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Rank</span>
                      {renderSortArrow(heroSortField === 'rank', heroSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleHeroSort('state')}
                      className="group inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>State</span>
                      {renderSortArrow(heroSortField === 'state', heroSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleHeroSort('rate')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Tax Rate</span>
                      {renderSortArrow(heroSortField === 'rate', heroSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleHeroSort('title')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Title Fee</span>
                      {renderSortArrow(heroSortField === 'title', heroSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleHeroSort('reg')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>1-Yr Reg</span>
                      {renderSortArrow(heroSortField === 'reg', heroSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleHeroSort('total')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Total Cost</span>
                      {renderSortArrow(heroSortField === 'total', heroSortDir)}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                {sortedHeroRows.map((row) => (
                  <tr
                    key={row.key}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                      #{row.rank}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      <Link
                        href={`/calculator/${row.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {row.label}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                        {row.rateDisplay}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-slate-700 dark:text-slate-300">
                      {formatFee(row.titleFee)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-slate-700 dark:text-slate-300">
                      {formatFee(row.registrationFee)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {formatFee(row.totalCost)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 2. Tax Rate Ranking Table */}
      <section id="tax-rate-ranking" className="scroll-mt-12">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <span>Section 4: Tax Rates</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            State Vehicle Sales &amp; Use Tax Rates (Ranked)
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Ranked by statutory state-level sales, excise, or use tax rate descending. Illinois utilizes statutory Form RUT-50 flat brackets and is categorized with its official flat schedule.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleRateSort('rank')}
                      className="group inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Rank</span>
                      {renderSortArrow(rateSortField === 'rank', rateSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleRateSort('state')}
                      className="group inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>State</span>
                      {renderSortArrow(rateSortField === 'state', rateSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleRateSort('rate')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Statutory Rate</span>
                      {renderSortArrow(rateSortField === 'rate', rateSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleRateSort('tax')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Tax on $25,000 Purchase</span>
                      {renderSortArrow(rateSortField === 'tax', rateSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-center">
                    <span>Tax Basis</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                {sortedRateRows.map((row) => (
                  <tr
                    key={row.key}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                      #{row.rank}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      <Link
                        href={`/calculator/${row.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {row.label}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {row.isFlatTable ? (
                        <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                          {row.rateDisplay}
                        </span>
                      ) : (
                        <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                          {row.rateDisplay}
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm font-semibold text-slate-900 dark:text-white">
                      {row.isFlatTable ? (
                        <span>{formatFee(row.estimatedTax)} (Table B)</span>
                      ) : (
                        formatFee(row.estimatedTax)
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 uppercase dark:bg-slate-800 dark:text-slate-400">
                        {row.isFlatTable ? 'Flat Bracket' : row.taxBase}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 3. Title Fee Ranking Table */}
      <section id="title-fee-ranking" className="scroll-mt-12">
        <div className="border-b border-slate-200 pb-5 dark:border-slate-800">
          <div className="inline-flex items-center gap-2 rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
            <span>Section 5: Title &amp; Admin Fees</span>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-white">
            Certificate of Title Fees by State (Ranked)
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Mandatory title issuance fees charged by state DMVs and county tax collectors upon ownership transfer, ranked from highest to lowest.
          </p>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleTitleSort('rank')}
                      className="group inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Rank</span>
                      {renderSortArrow(titleSortField === 'rank', titleSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => handleTitleSort('state')}
                      className="group inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>State</span>
                      {renderSortArrow(titleSortField === 'state', titleSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleTitleSort('title')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Certificate of Title Fee</span>
                      {renderSortArrow(titleSortField === 'title', titleSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleTitleSort('lien')}
                      className="group ml-auto inline-flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
                    >
                      <span>Lien Filing Fee (If Financed)</span>
                      {renderSortArrow(titleSortField === 'lien', titleSortDir)}
                    </button>
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right">
                    <span>1-Year Tag Registration</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/80">
                {sortedTitleRows.map((row) => (
                  <tr
                    key={row.key}
                    className="transition-colors hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-bold text-slate-400 dark:text-slate-500">
                      #{row.rank}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      <Link
                        href={`/calculator/${row.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 hover:underline dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        {row.label}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-sm font-bold text-slate-900 dark:text-white">
                      {formatFee(row.titleFee)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                      {row.lienFilingFee > 0 ? formatFee(row.lienFilingFee) : '$0.00 (No extra fee)'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-mono text-xs text-slate-600 dark:text-slate-400">
                      {formatFee(row.registrationFee)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
