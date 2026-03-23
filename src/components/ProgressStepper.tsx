interface Step {
  label: string
  number: number
}

interface ProgressStepperProps {
  steps: Step[]
  currentStep: number
}

export default function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="flex items-center justify-between max-w-lg mx-auto relative mb-16">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -z-10" />
      {steps.map((step) => {
        const isCompleted = step.number < currentStep
        const isActive = step.number === currentStep
        const isPending = step.number > currentStep

        return (
          <div key={step.number} className={`flex flex-col items-center gap-3 bg-[#161820] px-4 ${isPending ? 'opacity-40' : ''}`}>
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                isCompleted
                  ? 'bg-primary text-[#482900]'
                  : isActive
                  ? 'bg-surface-container-highest border border-primary text-primary'
                  : 'bg-surface-container-highest text-on-surface'
              }`}
            >
              {isCompleted ? (
                <span className="material-symbols-outlined text-sm">check</span>
              ) : (
                step.number
              )}
            </div>
            <span className={`text-[10px] font-mono uppercase tracking-widest ${isActive || isCompleted ? 'text-primary' : 'text-on-surface'}`}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
