'use client';

import { Check, Circle, Truck, CreditCard, Package } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface CheckoutStepsProps {
  currentStep: number;
  completed: boolean;
  onStepClick?: (step: number) => void;
}

const steps: Step[] = [
  {
    id: 1,
    name: 'Shipping',
    description: 'Enter shipping information',
    icon: Package
  },
  {
    id: 2,
    name: 'Shipping Method',
    description: 'Choose delivery option',
    icon: Truck
  },
  {
    id: 3,
    name: 'Payment',
    description: 'Enter payment details',
    icon: CreditCard
  },
  {
    id: 4,
    name: 'Review',
    description: 'Review and place order',
    icon: Check
  }
];

export function CheckoutSteps({ currentStep, completed, onStepClick }: CheckoutStepsProps) {
  return (
    <div className="w-full">
      {/* Mobile Steps */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  completed || step.id < currentStep
                    ? 'bg-primary text-primary-foreground'
                    : step.id === currentStep
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {completed || step.id < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 h-0.5 mx-2 ${
                    step.id < currentStep || completed ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-sm font-medium text-foreground">
            {steps[currentStep - 1]?.name}
          </span>
          <p className="text-xs text-muted-foreground">
            {steps[currentStep - 1]?.description}
          </p>
        </div>
      </div>

      {/* Desktop Steps */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = step.id === currentStep;
            const isCompleted = completed || step.id < currentStep;
            const isClickable = onStepClick && (step.id < currentStep || completed);

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <button
                    onClick={() => isClickable && onStepClick(step.id)}
                    disabled={!isClickable}
                    className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-colors ${
                      isCompleted
                        ? 'bg-primary text-primary-foreground'
                        : isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    } ${
                      isClickable
                        ? 'hover:bg-primary/80 cursor-pointer'
                        : 'cursor-default'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                    
                    {/* Step number overlay */}
                    {!isCompleted && (
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </span>
                    )}
                  </button>
                  
                  <div className="ml-4 text-left">
                    <h3 className={`font-medium ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {step.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 mx-8">
                    <div
                      className={`h-0.5 transition-colors ${
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: completed ? '100%' : `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-xs text-muted-foreground">
              {completed ? 'Completed' : `${Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}%`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
