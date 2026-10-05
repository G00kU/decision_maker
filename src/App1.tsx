import { useState, useRef } from "react";
import { Trash2, Play, Edit2, Check, RotateCcw, X, Layers } from "lucide-react";

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

interface Option {
  id: string;
  text: string;
  color: string;
}

const DEFAULT_OPTIONS: Option[] = [];

export default function App1() {
  const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Option | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [errorMsg,setErrorMsg]=useState<String|null>(null);
  // Popup States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");


  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
const COOLDOWN_MS =  30 * 60 * 1000; 
var coolDownTimer = localStorage.getItem("SpinWheelTimer");
var currentTime = Date.now();
if (!coolDownTimer || (currentTime - Number(coolDownTimer)) >= COOLDOWN_MS) {
    console.log("Cooldown finished! You can spin the wheel.");
    localStorage.setItem("SpinWheelTimer", currentTime.toString());
} else {
    var msLeft = COOLDOWN_MS - (currentTime - Number(coolDownTimer));
    var minsLeft = Math.floor(msLeft / (1000 * 60)); 
    var secsLeft = Math.floor((msLeft % (1000 * 60)) / 1000);
    setErrorMsg(`Wheel is locked. Try again in ${minsLeft} Min(s) ${secsLeft} Sec(s).`);
    setTimeout(() => {
      setErrorMsg(null);
    }, 2000);
    return
}

    if (options.length < 2 || isSpinning) return;
    setWinner(null);
    setIsSpinning(true);
    const extraDegrees = Math.floor(Math.random() * 360);
    const baseSpins = 360 * 5;
    const totalRotation = rotation + baseSpins + extraDegrees;
    setRotation(totalRotation);
    setTimeout(() => {
      const normalizedRotation = totalRotation % 360;
      const topPointAngle = (360 - normalizedRotation) % 360;

      const sliceAngle = 360 / options.length;
      const winningIndex = Math.floor(topPointAngle / sliceAngle);

      setWinner(options[winningIndex]);
      setIsSpinning(false);
    }, 5000); 
  };

  const handleBulkAdd = () => {
    const lines = bulkText.split("\n").map(line => line.trim()).filter(line => line !== "");
    if (lines.length === 0) {
      setIsModalOpen(false);
      return;
    }

    const newOptions = lines.map((line, idx) => ({
      id: Date.now().toString() + idx,
      text: line,
      color: COLORS[(options.length + idx) % COLORS.length],
    }));

    setOptions([...options, ...newOptions]);
    setBulkText("");
    setIsModalOpen(false);
  };

  const removeOption = (id: string) => {
    if (isSpinning) return;
    setOptions(options.filter((opt) => opt.id !== id));
  };

  const startEditing = (opt: Option) => {
    if (isSpinning) return;
    setEditingId(opt.id);
    setEditText(opt.text);
  };

  const saveEdit = () => {
    setOptions(
      options.map((opt) =>
        opt.id === editingId
          ? { ...opt, text: editText.trim() || opt.text }
          : opt,
      ),
    );
    setEditingId(null);
    setEditText("");
  };

  const renderWheel = () => {
    const radius = 50;
    const center = 50;

    if (options.length === 0) {
      return <circle cx={center} cy={center} r={radius} fill="#e5e7eb" />;
    }

    if (options.length === 1) {
      return (
        <g>
          <circle cx={center} cy={center} r={radius} fill={options[0].color} />
          <text
            x={center}
            y={center}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="6"
            fontWeight="bold"
          >
            {options[0].text}
          </text>
        </g>
      );
    }

    const sliceAngle = 360 / options.length;

    return options.map((opt, index) => {
      const startAngle = index * sliceAngle;
      const endAngle = (index + 1) * sliceAngle;
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;

      const startRad = (Math.PI * startAngle) / 180;
      const endRad = (Math.PI * endAngle) / 180;

      const startX = center + radius * Math.cos(startRad);
      const startY = center + radius * Math.sin(startRad);
      const endX = center + radius * Math.cos(endRad);
      const endY = center + radius * Math.sin(endRad);

      const pathData = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

      const midAngle = startAngle + sliceAngle / 2;
      const midRad = (Math.PI * midAngle) / 180;
      const textRadius = radius * 0.65;
      const textX = center + textRadius * Math.cos(midRad);
      const textY = center + textRadius * Math.sin(midRad);

      const displayText = opt.text.length > 12 ? opt.text.substring(0, 10) + "..." : opt.text;

      return (
        <g key={opt.id}>
          <path d={pathData} fill={opt.color} stroke="white" strokeWidth="0.5" />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="4.5"
            fontWeight="bold"
            transform={`rotate(${midAngle}, ${textX}, ${textY})`}
            style={{ textShadow: "0px 1px 2px rgba(0,0,0,0.4)" }}
          >
            {displayText}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center py-10 px-4 sm:px-6 relative">
      
      {/* --- ADD OPTIONS POPUP MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Add Options</h3>
            <p className="text-sm text-slate-500 mb-4">Type your options below. Put each option on a new line.</p>
            
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              placeholder={"Pizza\nBurgers\nSushi\nTacos"}
              rows={6}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 outline-none transition-all resize-none custom-scrollbar"
              autoFocus
            />
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleBulkAdd}
                className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Add Options
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ------------------------------- */}

      {/* Header */}
      <div className="text-center mb-8 w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl flex items-center justify-center gap-3">
          <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" />
          Spin The Wheel
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-500">
          {errorMsg ?errorMsg   : 'Add your options, click spin, and let fate decide!'}
        </p>
      </div>

      {/* Single Section Container */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 flex flex-col items-center">
        <div className="flex items-end flex-col w-100 p-3">
           <button
              onClick={() => setIsModalOpen(true)}
              disabled={isSpinning}
              className="flex items-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-xl font-semibold transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              <Layers className="w-4 h-4" />
              Add Options
            </button>
        </div>
        {/* Winner Banner */}
        <div className="h-14 mb-4 w-full flex items-center justify-center">
          {winner ? (
            <div className="animate-bounce bg-indigo-600 text-white px-6 py-2 rounded-full text-lg font-bold shadow-lg flex items-center gap-2">
              Winner: {winner.text}! 🎉
            </div>
          ) : (
            <div className="text-slate-400 font-medium text-base">
              {isSpinning ? "Spinning..." : "Waiting to spin..."}
            </div>
          )}
        </div>

        {/* The Wheel */}
        <div className="relative w-full max-w-[350px] aspect-square flex items-center justify-center mb-8">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-12 flex flex-col items-center drop-shadow-md">
            <div className="w-6 h-8 bg-slate-800 rounded-t-md"></div>
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-slate-800 -mt-1"></div>
          </div>

          <div
            ref={wheelRef}
            className="w-full h-full rounded-full shadow-2xl bg-slate-200 overflow-hidden border-4 border-slate-800"
            style={{
              transform: `rotate(${-90 + rotation}deg)`,
              transition: isSpinning
                ? "transform 5s cubic-bezier(0.2, 0.9, 0.1, 1)"
                : "none",
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
              {renderWheel()}
              <circle cx="50" cy="50" r="4" fill="#1e293b" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={isSpinning || options.length < 2}
          className={`px-10 py-4 rounded-full text-xl font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-200 flex items-center gap-3 mb-2
            ${
              isSpinning || options.length < 2
                ? "bg-slate-400 cursor-not-allowed transform-none shadow-none"
                : "bg-indigo-600 hover:bg-indigo-500 hover:scale-105 hover:shadow-indigo-500/30 active:scale-95"
            }`}
        >
          <Play className="w-6 h-6" fill="currentColor" />
          Spin Now
        </button>

        {options.length < 2 && (
          <p className="mt-2 text-red-500 text-sm font-medium">
            Please add at least 2 options to spin.
          </p>
        )}

        {/* Divider */}
        <div className="w-full h-px bg-slate-200 my-8"></div>

        {/* Options Management Section */}
        <div className="w-full flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-800">
              Options List
            </h2>
           
          </div>

          {/* Options List (Scrollable if too many) */}
          <div className="w-full max-h-[250px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all"
              >
                <div
                  className="w-4 h-4 rounded-full shadow-inner flex-shrink-0"
                  style={{ backgroundColor: option.color }}
                />

                {editingId === option.id ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                      className="flex-1 px-2 py-1 text-sm border-b-2 border-indigo-500 bg-transparent outline-none"
                    />
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="flex-1 font-medium text-slate-700 truncate">
                    {index + 1}. {option.text}
                  </span>
                )}

                {!isSpinning && editingId !== option.id && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => startEditing(option)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeOption(option.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {options.length === 0 && (
              <div className="text-center py-8 text-slate-400 italic bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No options added. Click "Add Options" to get started!
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
            <span>Total Options: {options.length}</span>
            <button
              onClick={() => {if(!isSpinning)
              { 
                setOptions([])
                setWinner(null);  
              }
              }}
              disabled={isSpinning || options.length === 0}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:hover:text-red-500 font-medium"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
      `}</style>
    </div>
  );
}