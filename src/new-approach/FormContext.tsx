import { createContext, useContext, useMemo, ReactNode } from 'react';
import { atom, Atom } from 'jotai';
import { stepCreators, type StepId } from './steps';
import type { FormPayload } from './types';

type StepAtoms = {
  valueAtom: Atom<any>;
  serializeAtom: Atom<any>;
  validateAtom: Atom<boolean>;
};

type FormContextValue = {
  steps: Record<StepId, StepAtoms>;
  payloadAtom: Atom<FormPayload>;
  validateAtom: Atom<boolean>;
};

const FormContext = createContext<FormContextValue | null>(null);

export function FormProvider({ 
  children,
  initialValue 
}: { 
  children: ReactNode;
  initialValue?: FormPayload;
}) {
  // Provider에서 모든 Step의 atom 생성
  const steps = useMemo(() => {
    const result = {} as Record<StepId, StepAtoms>;
    
    // Registry에서 자동으로 Step 생성
    Object.entries(stepCreators).forEach(([stepId, createStep]) => {
      result[stepId as StepId] = createStep(initialValue);
    });
    
    return result;
  }, []); // 최초 1회만 생성 (initialValue 변경 시 재생성하지 않음)
  
  // 전체 Payload = 모든 Step의 serialize 조합
  const payloadAtom = useMemo(() => {
    return atom<FormPayload>((get) => {
      return Object.values(steps).reduce((acc, step) => {
        return { ...acc, ...get(step.serializeAtom) };
      }, {} as FormPayload);
    });
  }, [steps]);
  
  // 전체 유효성 = 모든 Step이 유효해야 true
  const validateAtom = useMemo(() => {
    return atom<boolean>((get) => {
      return Object.values(steps).every((step) => 
        get(step.validateAtom)
      );
    });
  }, [steps]);

  return (
    <FormContext.Provider value={{ 
      steps, 
      payloadAtom, 
      validateAtom 
    }}>
      {children}
    </FormContext.Provider>
  );
}

// === Custom Hooks ===

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext는 FormProvider 내부에서 사용해야 합니다');
  }
  return context;
}

// 특정 Step의 valueAtom 가져오기
export function useStepAtom(stepId: StepId) {
  const { steps } = useFormContext();
  return steps[stepId].valueAtom;
}

// 특정 Step의 유효성 atom 가져오기
export function useStepValidateAtom(stepId: StepId) {
  const { steps } = useFormContext();
  return steps[stepId].validateAtom;
}

// 전체 Payload 가져오기
export function useFormPayloadAtom() {
  const { payloadAtom } = useFormContext();
  return payloadAtom;
}

// 전체 유효성 가져오기
export function useFormValidateAtom() {
  const { validateAtom } = useFormContext();
  return validateAtom;
}