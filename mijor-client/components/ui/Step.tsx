interface StepItem {
    label: string;
  }
  
  interface StepProps {
    steps: StepItem[];
    currentStep: number;
  }
  
  export default function Step({ steps, currentStep }: StepProps) {
    return (
      <div className="flex gap-12">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
  
          let status: "finished" | "current" | "default" = "default";
  
          if (stepNumber < currentStep) {
            status = "finished";
          } else if (stepNumber === currentStep) {
            status = "current";
          }
  
          const circleStyle = {
            finished:
              "bg-brand-blue-200 border-brand-blue-200 text-white",
            current:
              "bg-brand-blue-100 border-brand-blue-100 text-white",
            default:
              "bg-transparent border-brand-gray-200 text-brand-gray-300",
          };
  
          return (
            <div
              key={index}
              className="w-[140px] h-[74px] flex flex-col items-center gap-[6px]"
            >
              <div
                className={`
                  w-12 h-12
                  flex items-center justify-center
                  rounded-full
                  border-2
                  text-body-1-bold
                  transition
                  ${circleStyle[status]}
                `}
              >
                {status === "finished" ? "✓" : stepNumber}
              </div>
  
              <p className="text-body-2 text-brand-gray-400">
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    );
  }
  