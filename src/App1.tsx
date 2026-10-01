import { useState, useRef, type KeyboardEvent } from "react";
import { Trash2, Plus, Play, Edit2, Check, RotateCcw } from "lucide-react";

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

const DEFAULT_OPTIONS: Option[] = [
  { id: "1", text: "Smoke", color: COLORS[0] },
  { id: "2", text: "Burgers", color: COLORS[1] },
  { id: "3", text: "Sushi", color: COLORS[2] },
  { id: "4", text: "Salad", color: COLORS[3] },
  { id: "5", text: "Tacos", color: COLORS[4] },
  { id: "6", text: "Pasta", color: COLORS[5] },
];

export default function App1() {
  const [options, setOptions] = useState<Option[]>(DEFAULT_OPTIONS);
  const [newOptionText, setNewOptionText] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<Option | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const wheelRef = useRef<HTMLDivElement>(null);

  const handleSpin = () => {
    if (options.length < 2 || isSpinning) return;

    setWinner(null);
    setIsSpinning(true);

    // Calculate a random extra rotation between 0 and 360
    const extraDegrees = Math.floor(Math.random() * 360);
    // Base spins (e.g., 5 full rotations)
    const baseSpins = 360 * 5;
    const totalRotation = rotation + baseSpins + extraDegrees;

    setRotation(totalRotation);

    // Calculate which slice will be at the top (0 degrees / pointer position)
    setTimeout(() => {
      // The wheel rotates clockwise. The pointer is at the TOP (0 degrees of our rotated frame).
      // If we rotated by R degrees, the point that is now at the top is (360 - (R % 360)) % 360.
      const normalizedRotation = totalRotation % 360;
      const topPointAngle = (360 - normalizedRotation) % 360;

      const sliceAngle = 360 / options.length;
      const winningIndex = Math.floor(topPointAngle / sliceAngle);

      setWinner(options[winningIndex]);
      setIsSpinning(false);
    }, 5000); // Wait for the 5s transition to finish
  };

  const addOption = () => {
    if (newOptionText.trim() === "") return;
    const nextColor = COLORS[options.length % COLORS.length];
    setOptions([
      ...options,
      {
        id: Date.now().toString(),
        text: newOptionText.trim(),
        color: nextColor,
      },
    ]);
    setNewOptionText("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addOption();
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

      // Convert angles to radians
      const startRad = (Math.PI * startAngle) / 180;
      const endRad = (Math.PI * endAngle) / 180;

      // Calculate path coordinates
      const startX = center + radius * Math.cos(startRad);
      const startY = center + radius * Math.sin(startRad);
      const endX = center + radius * Math.cos(endRad);
      const endY = center + radius * Math.sin(endRad);

      const pathData = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;

      // Text positioning (middle of the slice)
      const midAngle = startAngle + sliceAngle / 2;
      const midRad = (Math.PI * midAngle) / 180;
      // Position text closer to the edge
      const textRadius = radius * 0.65;
      const textX = center + textRadius * Math.cos(midRad);
      const textY = center + textRadius * Math.sin(midRad);

      // Truncate long text
      const displayText =
        opt.text.length > 12 ? opt.text.substring(0, 10) + "..." : opt.text;

      return (
        <g key={opt.id}>
          <path
            d={pathData}
            fill={opt.color}
            stroke="white"
            strokeWidth="0.5"
          />
          <text
            x={textX}
            y={textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="4.5"
            fontWeight="bold"
            // Rotate text to align with the slice slice
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
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-10 w-full max-w-4xl">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl flex items-center justify-center gap-3">
          <RotateCcw className="w-10 h-10 text-indigo-600" />
          Spin The Wheel
        </h1>
        <p className="mt-4 text-lg text-slate-500">
          Add your options, click spin, and let fate decide!
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Side - The Wheel */}
        <div className="flex flex-col items-center justify-center relative bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
          {/* Winner Banner */}
          <div className="h-16 mb-4 w-full flex items-center justify-center">
            {winner ? (
              <div className="animate-bounce bg-indigo-600 text-white px-6 py-3 rounded-full text-xl font-bold shadow-lg flex items-center gap-2">
                Winner: {winner.text}! 🎉
              </div>
            ) : (
              <div className="text-slate-400 font-medium text-lg">
                {isSpinning ? "Spinning..." : "Waiting to spin..."}
              </div>
            )}
          </div>

          <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
            {/* Pointer (Top Center) */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10 w-8 h-12 flex flex-col items-center drop-shadow-md">
              <div className="w-6 h-8 bg-slate-800 rounded-t-md"></div>
              <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[16px] border-t-slate-800 -mt-1"></div>
            </div>

            {/* SVG Wheel Container */}
            <div
              ref={wheelRef}
              className="w-full h-full rounded-full shadow-2xl bg-slate-200 overflow-hidden border-4 border-slate-800"
              style={{
                // We rotate the container by -90deg so that 0 degrees starts at the top instead of the right side.
                // We add the dynamic rotation on top of that.
                transform: `rotate(${-90 + rotation}deg)`,
                // CSS Transition for the realistic physics spin
                transition: isSpinning
                  ? "transform 5s cubic-bezier(0.2, 0.9, 0.1, 1)"
                  : "none",
              }}
            >
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full drop-shadow-sm"
              >
                {renderWheel()}

                {/* Center dot */}
                <circle
                  cx="50"
                  cy="50"
                  r="4"
                  fill="#1e293b"
                  stroke="white"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || options.length < 2}
            className={`mt-10 px-10 py-4 rounded-full text-2xl font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-200 flex items-center gap-3
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
            <p className="mt-3 text-red-500 text-sm font-medium">
              Please add at least 2 options to spin.
            </p>
          )}
        </div>

        {/* Right Side - Controls */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 flex flex-col h-[600px]">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
            Manage Options
          </h2>

          {/* Add Option Input */}
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new option..."
              className="flex-1 bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl px-4 py-3 outline-none transition-all"
              disabled={isSpinning}
            />
            <button
              onClick={addOption}
              disabled={!newOptionText.trim() || isSpinning}
              className="bg-slate-800 text-white px-5 py-3 rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
            {options.map((option, index) => (
              <div
                key={option.id}
                className="group flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all"
              >
                {/* Color Dot indicator */}
                <div
                  className="w-4 h-4 rounded-full shadow-inner flex-shrink-0"
                  style={{ backgroundColor: option.color }}
                />

                {/* Editable Text */}
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
                    <button
                      onClick={saveEdit}
                      className="text-green-600 hover:text-green-700 p-1"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="flex-1 font-medium text-slate-700 truncate">
                    {index + 1}. {option.text}
                  </span>
                )}

                {/* Actions (Edit / Delete) */}
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
              <div className="text-center py-10 text-slate-400 italic">
                No options added. Add some to spin the wheel!
              </div>
            )}
          </div>

          {/* Footer controls */}
          <div className="mt-6 pt-4 border-t flex justify-between items-center text-sm text-slate-500">
            <span>Total Options: {options.length}</span>
            <button
              onClick={() => !isSpinning && setOptions([])}
              disabled={isSpinning || options.length === 0}
              className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:hover:text-red-500"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
      {/* Small inline style for custom scrollbar to keep layout clean */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
