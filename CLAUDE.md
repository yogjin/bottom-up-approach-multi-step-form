# Bottom-up Approach Multi-Step Form 학습 자료

## 📚 프로젝트 개요

이 프로젝트는 토스코어 Product Platform Team의 박종호님이 Frontend Diving Club 6th (2025.02.07)에서 발표한 **"Multi Step Form, 중앙 집권에서 자율 조직으로"** 세션의 예시 코드입니다.

React와 TypeScript로 구현된 다단계 폼(Multi-Step Form) 애플리케이션으로, **Bottom-up Approach**를 사용하여 폼 상태 관리의 복잡성을 해결하는 혁신적인 아키텍처를 제시합니다.

## 🎯 핵심 개념: 은유(Metaphor)의 힘

> "Metaphor is a programmer's weapon"

발표자는 조직 구조의 은유를 통해 소프트웨어 아키텍처를 설명합니다:

### 중앙집권형 조직 (Traditional Approach)

- 한 명의 리더가 모든 팀원을 직접 관리
- 조직이 커질수록 관리 복잡도 급증
- 리더에게 모든 책임과 권한이 집중

### 자율조직 (Bottom-up Approach)

- 각 팀이 독립적으로 운영
- 팀의 성과가 조직의 성과로 자연스럽게 조합
- 리더는 예산과 목표만 관리
- "왜 혼자서 모든걸 다 하려고 그래?"

## 🏗️ 아키텍처 설계

### 기술 스택

- **React** 18.2.0 - UI 라이브러리
- **TypeScript** 4.4.4 - 타입 안정성
- **Jotai** 2.11.3 - 원자적 상태 관리 (Atomic State Management)
- **ts-pattern** ^4 - 타입 안전한 패턴 매칭

### 프로젝트 구조

```
src/
├── App.tsx                         # 메인 폼 컴포넌트
├── index.tsx                       # 애플리케이션 엔트리 포인트
│
├── bottom-up-approach/             # 🔥 핵심 아키텍처 구현
│   ├── Step.tsx                   # Step 렌더링 컴포넌트
│   ├── context.tsx                # Form Context Provider
│   ├── factory.ts                 # Step Factory 함수
│   ├── types.ts                   # TypeScript 타입 정의
│   └── index.ts                   # 모듈 exports
│
├── components/                     # UI 프레젠테이션 컴포넌트
│   ├── UserNameStep.tsx          # 사용자 이름 입력 UI
│   ├── AccountStep.tsx           # 계정 정보 입력 UI
│   ├── AdditionalInfoStep.tsx    # 추가 정보 입력 UI
│   └── index.ts
│
└── containers/                     # 🧠 비즈니스 로직 컨테이너
    ├── UserNameStep.ts            # UserName 상태/검증/직렬화
    ├── AccountStep.ts             # Account 상태/검증/직렬화
    ├── AdditionalInfoStep.ts      # AdditionalInfo 상태/검증/직렬화
    ├── types.ts                   # 폼 타입 정의
    └── index.ts
```

## 🔄 Traditional Approach의 문제점

### 1. 중앙집권형 상태 관리

```typescript
// ❌ Form 컴포넌트가 모든 것을 관리
const [payload, setPayload] = useState<FormPayload>({
  email: '',
  password: '',
  name: '',
  age: undefined,
  gender: undefined,
});
```

### 2. 인터페이스 변환 로직의 집중

- Payload와 Step의 인터페이스가 다른 경우
- 모든 변환 로직이 Form 컴포넌트에 집중
- Form 컴포넌트의 복잡도 급증

### 3. 유효성 검사 로직의 중복

- 각 Step의 유효성 검사를 Form이 알아야 함
- Step이 추가될 때마다 Form 수정 필요
- 결합도(Coupling) 증가

### 4. 확장성 문제

- Field, Step이 많아질수록 Form이 복잡해짐
- 비즈니스 로직이 추가될수록 유지보수 어려움
- "Field, Step이 더 많아진다면? Form에 비즈니스 로직이 더 추가된다면? 😰"

## 💡 Bottom-up Approach 솔루션

### 핵심 원칙

1. **폼 Payload = 모든 Step Payload를 조합한 값**
2. **폼이 유효하다 = 모든 Step이 유효하다**

### Step의 3가지 책임

#### 1. StepValue (상태)

```typescript
type StepValue = Record<string, unknown>;
// 각 Step이 관리하는 독립적인 상태
```

#### 2. Serialize (직렬화)

```typescript
type Serialize = (value: StepValue) => Record<string, unknown>;
// Step의 값을 Payload 형태로 변환
// 예: { firstName, lastName } → { name: `${firstName} ${lastName}` }
```

#### 3. Validate (검증)

```typescript
type Validate = (value: StepValue) => boolean;
// Step 값의 유효성 검증
// 예: firstName.length > 0 && lastName.length > 0
```

## 🔧 구현 상세

### 1. Step 정의 (Container Layer)

각 Step은 자신의 상태, 직렬화, 검증 로직을 독립적으로 정의:

```typescript
// containers/UserNameStep.ts
export default step<UserName, FormPayload>({
  stepId: Step.UserName,

  // 원자적 상태 관리
  valueAtom: ({ initialValue }) => {
    const [firstName = '', lastName = ''] = (initialValue?.name ?? '').split(' ');
    return atom<UserName>({ firstName, lastName });
  },

  // Payload 직렬화
  serializeAtom: ({ valueAtom }) =>
    atom((get) => {
      const { firstName, lastName } = get(valueAtom);
      return { name: `${firstName} ${lastName}` };
    }),

  // 유효성 검증
  validateAtom: ({ valueAtom }) =>
    atom((get) => {
      const { firstName, lastName } = get(valueAtom);
      return firstName.length > 0 && lastName.length > 0;
    }),
});
```

### 2. Form Provider (Context Layer)

모든 Step의 Atom을 수집하고 조합:

```typescript
// Form의 전체 Payload는 각 Step의 serializeAtom을 조합
const payloadAtom = useMemo(() => {
  return atom<Payload>((get) => {
    const data = Object.values(valueAtoms).reduce((acc, step) => {
      return { ...acc, ...get(step.serializeAtom) };
    }, {});
    return data;
  });
}, [valueAtoms]);

// Form의 유효성은 모든 Step의 validateAtom을 AND 연산
const validateAtom = useMemo(() => {
  return atom<boolean>((get) => {
    const data = Object.values(valueAtoms).every((step) => {
      return get(step.validateAtom ?? atom(true));
    });
    return data;
  });
}, [valueAtoms]);
```

### 3. Step Component (Presentation Layer)

각 Step은 자신의 valueAtom만 변경:

```typescript
function StepComponent<T>({ stepId, children }) {
  const valueAtom = useStepValueAtom(stepId);
  const [value, setValue] = useAtom(valueAtom);

  return children({ value, onChange: setValue });
}
```

### 4. App Component (Orchestration Layer)

Form 컴포넌트는 Step 간 네비게이션과 제출만 담당:

```typescript
function App() {
  const payload = useFormPayload(); // 조합된 전체 Payload
  const isFormValid = useFormValidation(); // 전체 폼 유효성
  const isStepValid = useFormStepValidation(currentStep); // 현재 Step 유효성

  // Step 렌더링 - Pattern Matching으로 타입 안전성 보장
  {
    match(currentStep)
      .with(Step.UserName, (stepId) => (
        <StepComponent<UserName> stepId={stepId}>
          {({ value, onChange }) => <UserNameStep value={value} onChange={onChange} />}
        </StepComponent>
      ))
      .exhaustive();
  }
}
```

## 🎨 디자인 패턴

### 1. Factory Pattern

- `factory.ts`를 통한 Step 생성 표준화
- 일관된 인터페이스로 새로운 Step 추가 용이아

### 3. Type-safe Pattern Matching (ts-pattern)

- `switch` 문 대신 타입 안전한 패턴 매칭
- Exhaustive Check로 모든 케이스 처리 보장

### 4. Separation of Concerns

- **Components**: UI 렌더링만 담당
- **Containers**: 비즈니스 로직과 상태 관리
- **Context**: 전역 상태 조합과 제공
- **App**: Step 오케스트레이션

## 📊 아키텍처 비교

| 측면            | Traditional (중앙집권)      | Bottom-up (자율조직)       |
| --------------- | --------------------------- | -------------------------- |
| **상태 관리**   | Form이 모든 상태 관리       | 각 Step이 독립적으로 관리  |
| **변환 로직**   | Form에 집중                 | 각 Step에 분산             |
| **유효성 검사** | Form이 모든 검증 수행       | 각 Step이 자체 검증        |
| **결합도**      | 높음 (Tight Coupling)       | 낮음 (Loose Coupling)      |
| **확장성**      | Step 추가 시 Form 수정 필요 | Step만 추가하면 자동 통합  |
| **복잡도**      | Form에 집중                 | 각 Step에 분산             |
| **테스트**      | Form 테스트가 복잡          | 각 Step 독립적 테스트 가능 |
| **재사용성**    | 낮음                        | 높음                       |

## 🚀 실행 방법

```bash
# 의존성 설치
npm install
# 또는
yarn install

# 개발 서버 실행
npm start
# 또는
yarn start

# 프로덕션 빌드
npm run build
# 또는
yarn build

# 테스트 실행
npm test
# 또는
yarn test
```

## 📝 학습 포인트

### 1. 은유(Metaphor)의 힘

- 복잡한 기술 개념을 친숙한 개념으로 설명
- 조직 구조와 소프트웨어 아키텍처의 유사성
- 문제를 바라보는 새로운 관점 제시

### 2. Bottom-up 사고

- 작은 단위(Step)부터 시작
- 각 단위의 독립성과 자율성 보장
- 전체는 부분의 합으로 자연스럽게 구성

### 3. 관심사의 분리

- 각 Step은 자신의 책임만 수행
- Form은 조합과 오케스트레이션만 담당
- 명확한 책임 경계

### 4. 선언적 프로그래밍

- Atom을 통한 선언적 상태 관리
- 파생 상태의 자동 계산
- 반응형 프로그래밍 패러다임

### 5. 타입 안정성

- TypeScript의 강력한 타입 시스템 활용
- ts-pattern으로 런타임 안정성 보장
- 컴파일 타임에 오류 방지

## 🔍 주요 인사이트

### "There is no silver bullet" 🚫🔫

- 모든 상황에 적합한 완벽한 해결책은 없음
- 상황과 요구사항에 맞는 적절한 접근법 선택
- Trade-off를 이해하고 균형점 찾기

### 확장 가능한 아키텍처

- Step이 증가해도 복잡도가 선형적으로 증가
- 새로운 요구사항에 유연하게 대응
- 기존 코드 수정 없이 기능 추가 가능

### 팀 협업 최적화

- 각 Step을 독립적으로 개발 가능
- 병렬 작업 가능
- 명확한 인터페이스로 의사소통 단순화

## 📚 추가 학습 자료

### 참고 코드

- [Traditional Approach 예시](https://codesandbox.io/p/sandbox/dazzling-leftpad-4wzs3y)
- [Bottom-up Approach 예시](https://codesandbox.io/p/devbox/bottom-up-approach-multi-step-form-xf7kz2) (CodeSandbox 계정 필요)

### 발표 자료

- [발표 슬라이드](https://speakerdeck.com/pumpkiinbell/multi-step-form-decentralized-autonomous-organization)

## 💭 마무리

이 프로젝트는 단순한 Multi-Step Form 구현을 넘어, **소프트웨어 아키텍처에 대한 철학적 접근**을 보여줍니다. 중앙집권형 구조에서 자율조직형 구조로의 전환은 단순히 기술적 개선이 아니라, **복잡성을 다루는 사고의 전환**입니다.

각 Step이 독립적으로 작동하면서도 전체적으로 조화를 이루는 Bottom-up Approach는, 확장 가능하고 유지보수가 쉬운 소프트웨어를 만드는 강력한 패러다임입니다.

---

_"왜 혼자서 모든걸 다 하려고 그래? 각 팀의 성과가 조직의 성과고, 각 팀의 성공이 조직의 성공이잖아."_

이 철학을 코드로 구현한 것이 바로 Bottom-up Approach Multi-Step Form입니다.
