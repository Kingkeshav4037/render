export const KpGauge = ({ value }: { value: number }) => {
  const percentage = (value / 9) * 100;
  
  let color = 'bg-green-500';
  let text = 'Low Activity';
  let borderColor = 'border-green-500';
  
  if (value >= 4 && value < 6) {
    color = 'bg-yellow-400';
    borderColor = 'border-yellow-400';
    text = 'Active (Visible)';
  } else if (value >= 6) {
    color = 'bg-red-500';
    borderColor = 'border-red-500';
    text = 'Storm (Highly Visible)';
  }

  // Calculate rotation angle. -90 is far left, 90 is far right.
  // 0% = -90deg, 100% = 90deg
  const rotation = (percentage * 1.8) - 90;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-24 overflow-hidden mb-4">
        {/* Background Arc */}
        <div className="absolute top-0 left-0 w-full h-[200%] rounded-full border-[16px] border-gray-200" />
        
        {/* Colored Arc overlay */}
        <div 
          className={`absolute top-0 left-0 w-full h-[200%] rounded-full border-[16px] ${borderColor} transition-transform duration-1000`}
          style={{ 
            clipPath: 'polygon(50% 50%, 0% 100%, 0% 0%, 100% 0%, 100% 100%)', // only show top half
            transform: `rotate(${rotation}deg)` 
          }}
        />
        
        {/* Inner text area */}
        <div className="absolute bottom-0 left-0 w-full flex justify-center bg-white h-12 w-32 mx-auto" style={{ borderTopLeftRadius: '100px', borderTopRightRadius: '100px' }}>
          <div className="text-center pt-2">
            <span className="text-3xl font-bold text-navy-900">{value.toFixed(1)}</span>
            <span className="text-sm text-gray-500 block -mt-1">Kp</span>
          </div>
        </div>
      </div>
      <div className={`text-sm font-bold px-4 py-1.5 rounded-full text-white ${color}`}>
        {text}
      </div>
    </div>
  );
};
