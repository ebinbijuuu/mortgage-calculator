import React, { useEffect, useState } from 'react';
import StepList from './StepList';
import StepPanel from './StepPanel';

export default function Wizard({ children, canContinue = [] }) {
  const steps = [
    { title: 'Your details' },
    { title: 'Mortgage options' },
    { title: 'Results' },
  ];

  const [current, setCurrent] = useState(0);

  const go = (n) => setCurrent(Math.max(0, Math.min(steps.length - 1, n)));
  const next = () => go(current + 1);
  const prev = () => go(current - 1);

  // autosave placeholder (children expected to manage state)
  useEffect(() => {
    // no-op here; App will handle localStorage autosave for values
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <StepList steps={steps} current={current} />
      </div>

      <div className="md:col-span-2 relative min-h-[320px]">
        {React.Children.map(children, (child, idx) => (
          <StepPanel active={idx === current} id={`step-${idx}`}>
            {React.cloneElement(child, { next, prev, current, go })}
            <div className="mt-6 flex items-center justify-between">
              {idx > 0 ? (
                <button
                  type="button"
                  onClick={prev}
                  className="px-4 py-2 rounded border"
                >
                  Back
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={() => idx === steps.length - 1 ? go(0) : next()}
                className={`px-4 py-2 rounded bg-lloyds text-white ${(!canContinue[idx]) ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-disabled={!canContinue[idx]}
                disabled={!canContinue[idx]}
              >
                {idx === steps.length - 1 ? 'Recalculate' : 'Continue'}
              </button>
            </div>
          </StepPanel>
        ))}
      </div>
    </div>
  );
}
