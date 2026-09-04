import React, { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';

export const STATUS_CONFIG = {
  new: {
    label: 'New',
    bg: 'bg-sky-50 dark:bg-sky-950/70 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300',
    dot: 'bg-sky-500',
  },
  'in-progress': {
    label: 'In Progress',
    bg: 'bg-amber-50 dark:bg-amber-950/70 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
  },
  contacted: {
    label: 'Contacted',
    bg: 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
  },
  closed: {
    label: 'Closed',
    bg: 'bg-indigo-50 dark:bg-indigo-950/70 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
    dot: 'bg-indigo-500',
  },
  archived: {
    label: 'Archived',
    bg: 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400',
    dot: 'bg-slate-400',
  },
};

export const LeadStatusBadge = ({ leadId, status = 'new', editable = true }) => {
  const { updateLeadStatus } = useAdmin();
  const [isOpen, setIsOpen] = useState(false);

  const current = STATUS_CONFIG[status] || STATUS_CONFIG.new;

  const handleSelect = (newStatus, e) => {
    e.stopPropagation();
    updateLeadStatus(leadId, newStatus);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        type="button"
        disabled={!editable}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
          current.bg
        } ${editable ? 'hover:scale-105 cursor-pointer' : ''}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
        <span>{current.label}</span>
        {editable && <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />}
      </button>

      {isOpen && editable && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div
            className="absolute left-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 shadow-2xl p-1.5 z-50 animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[10px] font-bold px-2 py-1 uppercase text-slate-400 dark:text-slate-500">
              Change Status
            </div>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <button
                key={key}
                type="button"
                onClick={(e) => handleSelect(key, e)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  status === key
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                  <span>{config.label}</span>
                </div>
                {status === key && <Check className="w-3 h-3 text-sky-500" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
