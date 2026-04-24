export default function CircularProgress({ a = 0, b = 1, label }) {
    const safeA = Number.isFinite(a) ? a : 0
    const safeB = Number.isFinite(b) && b > 0 ? b : 1
    const percentage = Math.min(100, Math.max(0, (safeA / safeB) * 100))
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
       <svg className="progress-circle" width={100} height={100} viewBox="0 0 100 100" aria-label={label || `${safeA} of ${safeB}`}>
          <circle
             className="progress-circle-background"
             cx="50" cy="50" r={radius}
             strokeWidth="4"
          />
          <circle
             className="progress-circle-progress"
             cx="50" cy="50" r={radius}
             strokeWidth="4"
             strokeDasharray={circumference}
             strokeDashoffset={strokeDashoffset}
          />
          <text
             x="50%"
             y="50%"
             textAnchor="middle"
             dominantBaseline="middle"
             className="progress-text"
          >
             {safeA}/{safeB}
          </text>
       </svg>
    );
 }
