
import React, { useState, useCallback, useEffect } from 'react';
import { ShieldCheck, Copy, RefreshCw, Key, Hash, Type, Binary, Settings2, CheckCircle2 } from 'lucide-react';
import { generatePassword, generateBase64Key, PasswordOptions, calculateStrength } from './utils/cryptoUtils';

const App: React.FC = () => {
  const [options, setOptions] = useState<PasswordOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<'password' | 'base64'>('password');

  const refreshPassword = useCallback(() => {
    if (mode === 'password') {
      setPassword(generatePassword(options));
    } else {
      setPassword(generateBase64Key(32));
    }
    setCopied(false);
  }, [options, mode]);

  useEffect(() => {
    refreshPassword();
  }, [refreshPassword]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  const strength = mode === 'password' ? calculateStrength(password, options) : { score: 4, label: 'Secure Key' };

  return (
    <div className="w-full max-w-lg mx-auto bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-indigo-900/20 to-slate-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">GV Pass</h1>
        </div>
        <p className="text-slate-400 text-sm">Professional grade client-side security utility.</p>
      </div>

      <div className="px-8 pb-8 space-y-6">
        {/* Output Section - Increased height and refined font sizing */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative flex flex-col sm:flex-row items-center bg-slate-800/50 rounded-xl border border-slate-700/50 p-5 min-h-[5rem] transition-all duration-200">
            <div className="flex-1 w-full overflow-hidden mb-4 sm:mb-0">
              <span className="mono text-lg sm:text-xl text-white block break-all select-all leading-tight">
                {password || '••••••••'}
              </span>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center ml-auto sm:ml-2">
              <button
                onClick={refreshPassword}
                className="p-2.5 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-white"
                title="Regenerate"
              >
                <RefreshCw className={`w-5 h-5 ${password ? '' : 'animate-spin'}`} />
              </button>
              <button
                onClick={copyToClipboard}
                className={`p-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  copied ? 'bg-emerald-600/20 text-emerald-400' : 'hover:bg-slate-700 text-slate-400 hover:text-white'
                }`}
                title="Copy to Clipboard"
              >
                {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Strength Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Strength: {strength.label}</span>
            <span>{mode === 'password' ? `${options.length} chars` : '256-bit entropy'}</span>
          </div>
          <div className="flex gap-1 h-1.5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-500 ${
                  i < strength.score
                    ? strength.score <= 1 ? 'bg-rose-500' : strength.score === 2 ? 'bg-amber-500' : strength.score === 3 ? 'bg-blue-500' : 'bg-emerald-500'
                    : 'bg-slate-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setMode('password')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'password' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Key className="w-4 h-4" />
            Password
          </button>
          <button
            onClick={() => setMode('base64')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${
              mode === 'base64' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Binary className="w-4 h-4" />
            Base64 Key
          </button>
        </div>

        {/* Controls */}
        <div className="space-y-6 pt-2">
          {mode === 'password' ? (
            <>
              {/* Length Slider */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Settings2 className="w-4 h-4 text-indigo-400" />
                    Length
                  </label>
                  <span className="mono text-indigo-400 font-bold bg-indigo-400/10 px-3 py-1 rounded-full border border-indigo-400/20">
                    {options.length}
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={options.length}
                  onChange={(e) => setOptions({ ...options, length: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Checkbox Grid */}
              <div className="grid grid-cols-2 gap-3">
                <OptionCheckbox
                  label="Uppercase"
                  checked={options.uppercase}
                  onChange={(checked) => setOptions({ ...options, uppercase: checked })}
                  icon={<Type className="w-4 h-4" />}
                />
                <OptionCheckbox
                  label="Lowercase"
                  checked={options.lowercase}
                  onChange={(checked) => setOptions({ ...options, lowercase: checked })}
                  icon={<Type className="w-4 h-4 italic" />}
                />
                <OptionCheckbox
                  label="Numbers"
                  checked={options.numbers}
                  onChange={(checked) => setOptions({ ...options, numbers: checked })}
                  icon={<Hash className="w-4 h-4" />}
                />
                <OptionCheckbox
                  label="Symbols"
                  checked={options.symbols}
                  onChange={(checked) => setOptions({ ...options, symbols: checked })}
                  icon={<span className="text-sm font-bold">@$!</span>}
                />
              </div>
            </>
          ) : (
            <div className="bg-slate-950/50 border border-slate-800/50 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-400 mb-2">
                <Binary className="w-6 h-6" />
                <h3 className="font-semibold">Cryptographic Key Mode</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Generates a 32-byte (256-bit) high-entropy key encoded in Base64. 
                Perfect for API keys, secret tokens, or salt values.
                Equivalent to <code className="bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">openssl rand -base64 32</code>.
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="px-8 py-4 bg-slate-950 border-t border-slate-800 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-medium">
          Secure • Local • Private
        </p>
      </footer>
    </div>
  );
};

interface OptionCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon: React.ReactNode;
}

const OptionCheckbox: React.FC<OptionCheckboxProps> = ({ label, checked, onChange, icon }) => {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left ${
        checked 
          ? 'bg-indigo-600/10 border-indigo-500/50 text-white shadow-sm shadow-indigo-500/10' 
          : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700'
      }`}
    >
      <div className={`transition-colors ${checked ? 'text-indigo-400' : 'text-slate-600'}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      <div className={`ml-auto w-4 h-4 rounded border flex items-center justify-center transition-all ${
        checked ? 'bg-indigo-500 border-indigo-500' : 'bg-transparent border-slate-700'
      }`}>
        {checked && <div className="w-2 h-2 bg-white rounded-full shadow-lg" />}
      </div>
    </button>
  );
};

export default App;
