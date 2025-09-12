import React from 'react';

export default function StepList({ steps, current }) {
  return (
    <aside className="bg-white rounded-lg p-6 shadow mb-6">
      <h3 className="text-xl font-semibold mb-4">Steps</h3>
      <ul className="space-y-4">
        {steps.map((s, i) => {
          const active = i === current;
          return (
            <li
              key={s.title}
              className={`flex items-center justify-between p-3 rounded-lg ${
                active ? 'bg-gray-100' : ''
              }`}
              aria-current={active ? 'step' : undefined}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${active ? 'bg-lloyds' : 'bg-gray-200 text-gray-700'}`}>
                  {i + 1}
                </div>
                <div className="text-sm">{s.title}</div>
              </div>
              <div className="text-gray-400">›</div>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-gray-500 mt-4">Tip: Your progress is auto-saved locally so you won’t lose inputs if the page refreshes.</p>
    </aside>
  );
}
