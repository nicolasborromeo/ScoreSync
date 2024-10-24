export default function CircularProgress({ a, b }) {
    const percentage = (a / b) * 100
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
       <svg className="progress-circle" width={100} height={100}>
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
             {/* {Math.round(percentage)}% */}
             {a}/{b}
          </text>
       </svg>
    );
 }
