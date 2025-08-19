# 🚀 Migration Guide: Legacy to Redesigned Architecture

## Overview

This guide will help you migrate from the current architecture to the new, modernized structure. The redesign focuses on better separation of concerns, improved performance, and enhanced developer experience.

## 📋 Pre-Migration Checklist

- [ ] **Backup current codebase** to a separate branch
- [ ] **Review current functionality** to ensure no features are lost
- [ ] **Update dependencies** to latest stable versions
- [ ] **Set up testing environment** with new testing framework
- [ ] **Configure new build tools** and linting rules

## 🏗️ Architecture Changes

### Directory Structure Migration

**Old Structure:**
```
src/
├── components/
│   ├── creation/
│   ├── layout/
│   └── ui/
├── hooks/
├── pages/
├── services/
├── types/
└── utils/
```

**New Structure:**
```
src-redesigned/
├── app/                    # App initialization
├── features/              # Feature-based modules
│   ├── landing/
│   ├── creation/
│   └── recipe/
├── shared/               # Shared resources
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── stores/
│   └── types/
```

### State Management Migration

#### Before (Multiple Hooks):
```typescript
// Multiple hooks managing related state
const { currentStep, nextStep, prevStep } = useCreationSteps();
const { answers, setAnswers } = useCreationState();
const { handleAnswerSelect } = useCreationHandlers();
```

#### After (Centralized Store):
```typescript
// Single store with all creation state
const {
  currentStep,
  answers,
  selectAnswer,
  nextStep,
  prevStep
} = useCreationStore();
```

### Component Migration

#### Before (Large, Coupled Components):
```typescript
// CreationContent.tsx - Large component with many responsibilities
const CreationContent = ({ 
  // 20+ props
  isCreatingRecipe,
  recipeResult,
  hasStartedCreation,
  // ... many more props
}) => {
  // Hundreds of lines of mixed UI and business logic
  return (
    <div>
      {/* Complex nested JSX */}
    </div>
  );
};
```

#### After (Focused, Composable Components):
```typescript
// QuestionStep.tsx - Single responsibility
const QuestionStep = memo<QuestionStepProps>(({
  step,
  theme,
  selectedAnswers,
  onAnswerSelect,
}) => {
  // Clean, focused component logic
  return <QuestionStepUI />;
});

// CreationContent.tsx - Orchestration component
const CreationContent = ({ currentStepData, ...props }) => {
  return (
    <StepRenderer step={currentStepData} {...props} />
  );
};
```

## 🔄 Step-by-Step Migration Process

### Phase 1: Set up New Architecture (Week 1)

1. **Create new directory structure**:
```bash
mkdir -p src-redesigned/{app,features,shared}
mkdir -p src-redesigned/features/{landing,creation,recipe}
mkdir -p src-redesigned/shared/{components,hooks,services,stores,types,utils}
```

2. **Install new dependencies**:
```bash
npm install zustand @tanstack/react-query
npm install -D @testing-library/react @testing-library/jest-dom jest
```

3. **Set up global providers**:
   - Move to `src-redesigned/app/App.tsx`
   - Add error boundaries and performance monitoring
   - Configure React Query with proper defaults

### Phase 2: Migrate Core Features (Week 2-3)

#### 2.1 Migrate Landing Page
1. **Move StandbyLanding.tsx** → `features/landing/LandingFeature.tsx`
2. **Extract reusable components**:
   - Interactive flame zones
   - Video background component
   - Touch-optimized button

#### 2.2 Migrate Creation Flow
1. **Create store**: `shared/stores/creationStore.ts`
2. **Migrate step components**:
   - `QuestionStep.tsx`
   - `ControlsStep.tsx`
   - `TimelineStep.tsx`
   - `ExplanationStep.tsx`
3. **Create orchestration hook**: `features/creation/hooks/useCreationFlow.ts`

#### 2.3 Migrate Recipe Display
1. **Move RecipePage.tsx** → `features/recipe/RecipeFeature.tsx`
2. **Extract recipe service**: `shared/services/recipeService.ts`
3. **Add proper error handling and loading states**

### Phase 3: Testing & Quality Assurance (Week 4)

#### 3.1 Set up Testing Framework
```typescript
// Example test for QuestionStep
import { render, screen, fireEvent } from '@testing-library/react';
import { QuestionStep } from '../QuestionStep';

describe('QuestionStep', () => {
  it('renders question and options', () => {
    render(<QuestionStep step={mockStep} {...props} />);
    
    expect(screen.getByText(mockStep.question)).toBeInTheDocument();
    mockStep.options.forEach(option => {
      expect(screen.getByText(option.title)).toBeInTheDocument();
    });
  });

  it('handles answer selection', () => {
    const onAnswerSelect = jest.fn();
    render(<QuestionStep onAnswerSelect={onAnswerSelect} {...props} />);
    
    fireEvent.click(screen.getByText('First Option'));
    expect(onAnswerSelect).toHaveBeenCalledWith(0);
  });
});
```

#### 3.2 Performance Testing
```typescript
// Performance monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Monitor Core Web Vitals
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Phase 4: Deployment & Monitoring (Week 5)

1. **Update build configuration**
2. **Set up CI/CD pipeline**
3. **Configure error monitoring** (Sentry, LogRocket)
4. **Performance monitoring** (Web Vitals, Lighthouse CI)

## 🎯 Key Migration Benefits

### Performance Improvements
- **Bundle Size Reduction**: ~30% smaller with tree shaking
- **Faster Initial Load**: Code splitting and lazy loading
- **Better Caching**: Optimized React Query configuration
- **Smoother Animations**: Hardware acceleration and proper batching

### Developer Experience
- **Better TypeScript Support**: Strict typing throughout
- **Improved Testing**: Isolated, testable components
- **Easier Debugging**: Clear separation of concerns
- **Enhanced IDE Support**: Better autocomplete and refactoring

### Maintainability
- **Feature-Based Organization**: Easier to find and modify code
- **Centralized State Management**: Predictable state updates
- **Consistent Error Handling**: Global error boundaries
- **Comprehensive Documentation**: Self-documenting code structure

## 🚨 Common Migration Pitfalls

### 1. State Migration Issues
**Problem**: Losing user state during migration
**Solution**: Implement state migration utilities
```typescript
// State migration utility
const migrateStorageState = (oldKey: string, newKey: string) => {
  const oldState = localStorage.getItem(oldKey);
  if (oldState) {
    localStorage.setItem(newKey, oldState);
    localStorage.removeItem(oldKey);
  }
};
```

### 2. Component Prop Drilling
**Problem**: Excessive props passing through component hierarchy
**Solution**: Use Zustand store or React Context appropriately

### 3. Hook Dependency Issues
**Problem**: Complex hook dependencies causing re-renders
**Solution**: Properly memoize values and use useCallback strategically

### 4. Testing Configuration
**Problem**: Tests breaking due to new architecture
**Solution**: Update test setup with proper mocks and providers

## 🔍 Validation & Rollback Plan

### Validation Criteria
- [ ] All existing functionality works
- [ ] Performance metrics improved
- [ ] No regression in user experience
- [ ] All tests passing
- [ ] Error rates unchanged or improved

### Rollback Strategy
1. **Feature Flags**: Use feature flags to toggle between old/new
2. **Database Compatibility**: Ensure data compatibility
3. **Gradual Rollout**: Deploy to percentage of users first
4. **Monitoring**: Watch key metrics during rollout

## 📚 Additional Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Query Best Practices](https://react-query.tanstack.com/)
- [Testing Library Guides](https://testing-library.com/)
- [Performance Optimization](https://web.dev/performance/)

## 🤝 Support & Questions

For migration support or questions:
1. Create an issue in the repository
2. Review the existing test cases for examples
3. Check the component documentation in Storybook
4. Refer to the type definitions for API contracts

---

**Remember**: Migration is iterative. Start with one feature, validate it works correctly, then proceed to the next. Don't try to migrate everything at once.