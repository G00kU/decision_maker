import { Trash2, Plus, Play, Edit2, Check, X, RotateCcw } from 'lucide-react';

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
  { id: '1', text: 'Pizza', color: COLORS[0] },
  { id: '2', text: 'Burgers', color: COLORS[1] },
  { id: '3', text: 'Sushi', color: COLORS[2] },
  { id: '4', text: 'Salad', color: COLORS[3] },
  { id: '5', text: 'Tacos', color: COLORS[4] },
  { id: '6', text: 'Pasta', color: COLORS[5] },
];


function App() {
  const radius = 150;
  const center = 150;
  const getSlicePath = (index: number) => {
    const totalOptions = DEFAULT_OPTIONS.length;
    if (totalOptions === 1) {
      return `M ${center},${center} m -${radius},0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${radius * 2},0`;
    }
    const startAngle = (index * 360) / totalOptions;
    const endAngle = ((index + 1) * 360) / totalOptions;
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    console.log("SVG Arc Calculations:", {
      index,
      totalOptions,
      center,
      radius,
      startAngle,
      endAngle,
      startRad,
      endRad,
      x1,
      y1,
      x2,
      y2,
      largeArcFlag,
      path
    });
    return `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };
  return (
    <>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col items-center py-10 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 w-full max-w-4xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl flex items-center justify-center gap-3">
            {/* <RotateCcw className="w-10 h-10 text-indigo-600" /> */}
            {/* Spin The Wheel */}
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            {/* Add your options, click spin, and let fate decide! */}
          </p>
        </div>
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col items-center justify-center relative bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
            <div className="text-slate-300 font-medium text-lg">
              Spin the Wheel
            </div>
            <div className="text-slate-300 font-medium text-lg mt-4">
              <div style={{ position: 'relative', width: '300px', height: '300px' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '0',
                    height: '0',
                    borderLeft: '15px solid transparent',
                    borderRight: '15px solid transparent',
                    borderTop: '25px solid #333',
                    zIndex: 10,
                  }}
                />
                <svg
                  width="300"
                  height="300"
                  viewBox="0 0 300 300"
                  style={{
                    transform: `rotate(${180}deg)`,
                    transition: 'transform 5s cubic-bezier(0.2, 0.9, 0.1, 1)', 
                    borderRadius: '50%',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                    animation: 'spinEndlessly 0.5s linear infinite'
                  }}
                >
                  {[...DEFAULT_OPTIONS].map((option, index) => {
                    const midAngle = (index * 360) / DEFAULT_OPTIONS.length + 360 / DEFAULT_OPTIONS.length / 2;
                    return (
                      <g key={index}>
                        <path
                          d={getSlicePath(index)}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x={center}
                          y={center - radius / 1.5}
                          fill="#000000"
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                          alignmentBaseline="middle"
                          transform={`rotate(${midAngle}, ${center}, ${center})`}
                        >
                          {option.text}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center relative bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50">
            Cards
          </div>
        </div>
      </div>
    </>
  )
}

export default App
