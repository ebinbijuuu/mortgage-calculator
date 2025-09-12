import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import Wizard from "./components/Wizard";

function App() {
  // store inputs as simple values; we'll format for display
  const [amount, setAmount] = useState(() => {
    const v = localStorage.getItem('mortgage.amount');
    return v !== null ? Number(v) : 200000;
  });
  const [term, setTerm] = useState(() => {
    const v = localStorage.getItem('mortgage.term');
    return v !== null ? Number(v) : 25;
  });
  const [rate, setRate] = useState(() => {
    const v = localStorage.getItem('mortgage.rate');
    return v !== null ? Number(v) : 3;
  });

  // sanitize and normalize inputs
  const principal = Number(amount) || 0;
  const monthlyRate = Number(rate) / 100 / 12 || 0;
  const numberOfPayments = Math.max(Math.floor(Number(term) * 12), 0);

  // safe monthly payment calculation
  let monthlyPayment = 0;
  if (numberOfPayments > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments;
    } else {
      const factor = Math.pow(1 + monthlyRate, numberOfPayments);
      monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
    }
  }

  const totalPayment = Number.isFinite(monthlyPayment)
    ? monthlyPayment * numberOfPayments
    : 0;
  const totalInterest = totalPayment - principal;

  const data = [
    { name: "Principal", value: Math.max(principal, 0) },
    { name: "Interest", value: Math.max(totalInterest, 0) },
  ];

  // formatters
  const fmtCurrency = (n) =>
    Number.isFinite(n)
      ? n.toLocaleString("en-GB", { style: "currency", currency: "GBP" })
      : "£0.00";

  // (fmtNumber removed — use fmtCurrency where appropriate)

  // input change handlers that remove leading zeros (visual) and keep numbers
  const handleAmountChange = (e) => {
    const raw = e.target.value;
    // allow empty to let user clear, but normalize stored value
    const sanitized = raw.replace(/^0+(?=\d)/, "");
  const next = sanitized === "" ? "" : Number(sanitized);
  setAmount(next);
  try { localStorage.setItem('mortgage.amount', String(next)); } catch (err) { console.warn('localStorage not available', err); }
  };

  const handleTermChange = (e) => {
    const raw = e.target.value;
    const sanitized = raw.replace(/^0+(?=\d)/, "");
  const next = sanitized === "" ? "" : Number(sanitized);
  setTerm(next);
  try { localStorage.setItem('mortgage.term', String(next)); } catch (err) { console.warn('localStorage not available', err); }
  };

  const handleRateChange = (e) => {
    const raw = e.target.value;
    const sanitized = raw.replace(/^0+(?=\d)/, "");
  const next = sanitized === "" ? "" : Number(sanitized);
  setRate(next);
  try { localStorage.setItem('mortgage.rate', String(next)); } catch (err) { console.warn('localStorage not available', err); }
  };

  useEffect(() => {
    // keep localStorage in sync if values change externally
    try { localStorage.setItem('mortgage.amount', String(amount)); } catch (err) { console.warn('localStorage not available', err); }
  }, [amount]);

  useEffect(() => { try { localStorage.setItem('mortgage.term', String(term)); } catch (err) { console.warn('localStorage not available', err); } }, [term]);
  useEffect(() => { try { localStorage.setItem('mortgage.rate', String(rate)); } catch (err) { console.warn('localStorage not available', err); } }, [rate]);

  return (
    <div className="flex flex-col min-h-screen bg-brandWhite text-brandBlack">
      {/* Header */}
      <header className="bg-lloyds text-brandWhite py-6 shadow">
        <h1 className="text-center text-3xl font-bold">Lloyds Mortgage Calculator</h1>
      </header>

      <main className="flex-1 max-w-6xl mx-auto p-6">
        {/* determine per-step eligibility to continue */}
        {/**
         * Step 0: require amount>0, term>=1, rate>=0
         * Step 1: mortgage options - allow continue
         * Step 2: results - allow recalculate (no disable)
         */}
        <Wizard canContinue={[
          Number.isFinite(Number(amount)) && Number(amount) > 0 && Number.isFinite(Number(term)) && Number(term) >= 1 && Number.isFinite(Number(rate)) && Number(rate) >= 0,
          true,
          true,
        ]}>
          {/* Step 1 - Your details */}
          <section className="bg-brandWhite rounded-xl shadow-md border p-6">
            <h2 className="text-xl font-semibold text-lloyds mb-4">Your details</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Loan Amount (£)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="e.g. 200000"
                  aria-label="Loan amount in pounds"
                  className="w-full p-2 border rounded placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-lloyds"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Term (Years)</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={term}
                  onChange={handleTermChange}
                  placeholder="e.g. 25"
                  aria-label="Term in years"
                  className="w-full p-2 border rounded placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-lloyds"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={rate}
                  onChange={handleRateChange}
                  placeholder="e.g. 3.5"
                  aria-label="Annual interest rate in percent"
                  className="w-full p-2 border rounded placeholder-gray-400 text-gray-800 focus:ring-2 focus:ring-lloyds"
                />
              </div>
            </div>
          </section>

          {/* Step 2 - Mortgage options */}
          <section className="bg-brandWhite rounded-xl shadow-md border p-6">
            <h2 className="text-xl font-semibold text-lloyds mb-4">Mortgage options</h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Repayment type</label>
                <select className="w-full p-2 border rounded">
                  <option>Capital & interest (repayment)</option>
                  <option>Interest only</option>
                </select>
                <p className="text-sm text-gray-500 mt-2">Repayment clears the balance over time. Interest-only keeps payments lower but doesn’t reduce what you owe.</p>
              </div>

              <div>
                <label className="block font-medium mb-1">Interest rate</label>
                <div className="flex items-center gap-4">
                  <input type="range" min="0" max="10" step="0.01" value={rate} onChange={(e)=>{ setRate(Number(e.target.value)); try{ localStorage.setItem('mortgage.rate', String(e.target.value)) }catch(err){ console.warn('localStorage not available', err); } }} className="flex-1" />
                  <div className="w-20">
                    <input type="number" className="w-full p-2 border rounded" value={rate} onChange={handleRateChange} />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Average fixed rates change over time. This lets you model different scenarios.</p>
              </div>
            </div>
          </section>

          {/* Step 3 - Results */}
          <section className="bg-brandWhite rounded-xl shadow-md border p-6">
            <h2 className="text-xl font-semibold text-lloyds mb-4">Results</h2>
            <div className="space-y-2 text-lg">
              <div>
                <div className="text-sm text-gray-600">Estimated monthly payment</div>
                <div className="text-3xl font-bold text-gray-900">{fmtCurrency(monthlyPayment)}</div>
                <div className="text-sm text-gray-600">Based on a loan of {fmtCurrency(principal)} at {rate}% for {term} years.</div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="p-4 border rounded">
                  <div className="text-sm text-gray-500">Principal (1st month)</div>
                  <div className="font-semibold">{fmtCurrency(principal/numberOfPayments || 0)}</div>
                </div>
                <div className="p-4 border rounded">
                  <div className="text-sm text-gray-500">Interest (1st month)</div>
                  <div className="font-semibold">{fmtCurrency((principal * (Number(rate)/100)/12) || 0)}</div>
                </div>
              </div>

              <div className="w-full h-64 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={80} innerRadius={40} paddingAngle={2} labelLine={false} label={({ name, value }) => `${name}: ${fmtCurrency(value)}`}>
                      <Cell fill="#007A33" />
                      <Cell fill="#000000" />
                    </Pie>
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const p = payload[0];
                      const name = p.name ?? (p.payload && p.payload.name) ?? 'Value';
                      const value = (typeof p.value === 'number') ? p.value : (p.payload && p.payload.value) ?? 0;
                      const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);
                      const percent = total > 0 ? `${((value / total) * 100).toFixed(1)}%` : null;
                      return (<div className="bg-white border rounded shadow-sm p-2 text-sm"><div className="font-medium">{name}</div>{percent ? <div>{percent}</div> : <div>{fmtCurrency(value)}</div>}</div>);
                    }} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>
        </Wizard>
      </main>

      {/* Footer */}
      <footer className="bg-lloyds text-brandWhite text-center py-4 mt-6">
        <p className="text-sm text-white/80">This is a wireframe/prototype. Figures are illustrative and not an offer. Always speak to a qualified adviser.</p>
      </footer>
    </div>
  );
}

export default App;
