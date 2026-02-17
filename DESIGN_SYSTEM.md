# HealthPilot UI/UX Design System & Component Specification

## Design Philosophy

**Core Principles:**
- **Trust-Centric**: Medical/health context requires clarity and reliability
- **Action-Oriented**: Clear pathways and next steps
- **Explainability**: "Why this?" transparency at every step
- **Progressive Disclosure**: Don't overwhelm with information upfront
- **Accessibility**: WCAG AA compliant, high contrast ratios
- **Mobile-First**: Responsive design prioritizing touch interactions

---

## 1. Design Tokens

### 1.1 Color Palette

```typescript
// Primary Colors (Trust & Medical)
const colors = {
  primary: {
    50: '#EEF4FF',
    100: '#E0EAFF',
    200: '#C7DDFF',
    300: '#A4CAFF',
    400: '#82B4FF',
    500: '#649EFF',  // Main primary
    600: '#4F85F5',
    700: '#426CEC',
    800: '#3A58D9',
    900: '#364BC9',
  },
  
  // Success/Health Status
  success: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    900: '#064E3B',
  },
  
  // Warning/Attention
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
    900: '#78350F',
  },
  
  // Error/Contraindication
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    900: '#7F1D1D',
  },
  
  // Neutral (Text, backgrounds)
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Medical/Health Specific
  medical: {
    light: '#4ADE80',  // Light health green
    medium: '#22C55E', // Standard health green
    dark: '#16A34A',   // Dark health green
  },
};
```

### 1.2 Typography

```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace'],
  },
  
  fontSize: {
    // Display
    'hero-1': '3.5rem',    // 56px - Landing headlines
    'hero-2': '2.5rem',     // 40px - Section headers
    
    // Headings
    'h1': '2rem',           // 32px - Main page titles
    'h2': '1.5rem',         // 24px - Subsection headers
    'h3': '1.25rem',        // 20px - Card titles
    'h4': '1.125rem',       // 18px - Small headings
    
    // Body
    'body-lg': '1.125rem',  // 18px - Important body text
    'body-base': '1rem',    // 16px - Standard body text
    'body-sm': '0.875rem',  // 14px - Secondary text
    
    // UI Elements
    'label': '0.875rem',    // 14px - Form labels
    'caption': '0.75rem',   // 12px - Captions, metadata
    'tiny': '0.625rem',     // 10px - Tags, badges
  },
  
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75',
  },
};
```

### 1.3 Spacing Scale

```typescript
const spacing = {
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
};
```

### 1.4 Border Radius

```typescript
const borderRadius = {
  none: '0',
  sm: '0.25rem',   // 4px - Small elements
  md: '0.5rem',    // 8px - Cards, buttons
  lg: '1rem',      // 16px - Large cards
  xl: '1.5rem',    // 24px - Hero elements
  '2xl': '2rem',   // 32px - Special containers
  full: '9999px',  // Circular elements
};
```

### 1.5 Shadows

```typescript
const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
};
```

---

## 2. Component Library

### 2.1 Button System

```typescript
// Button Variants
type ButtonVariant = 
  | 'primary'      // Main actions, CTAs
  | 'secondary'    // Alternative actions
  | 'outline'      // Secondary, less important
  | 'ghost'        // Minimal, subtle
  | 'link'         // Text-only actions
  | 'danger'       // Destructive actions
  | 'success';     // Confirmation actions

type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Usage Examples
<Button variant="primary" size="lg">
  Start Your Health Journey
</Button>

<Button variant="outline" size="md">
  View Demo
</Button>

<Button variant="success" size="sm">
  ✓ Book Appointment
</Button>
```

### 2.2 Card System

```typescript
// Card Types
type CardType = 
  | 'default'      // Standard card
  | 'elevated'     // With shadow
  | 'bordered'     // With border only
  | 'interactive'  // Clickable, hover effects
  | 'status'       // Status indicator cards;

// Card Components
interface CardProps {
  type?: CardType;
  status?: 'success' | 'warning' | 'error' | 'info';
  children: React.ReactNode;
  onClick?: () => void;
}

// Usage Example
<Card type="elevated" status="success">
  <CardHeader>
    <CardTitle>Health Score</CardTitle>
    <CardValue>85/100</CardValue>
  </CardHeader>
  <CardContent>
    Your health metrics are within optimal range
  </CardContent>
</Card>
```

### 2.3 Form Components

```typescript
// Input Field
interface InputProps {
  label: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
}

// Select Dropdown
interface SelectProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  helperText?: string;
  error?: string;
}

// Radio Group (for preferences)
interface RadioGroupProps {
  label: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value?: string;
  onChange: (value: string) => void;
}

// Checkbox Group (for multi-select)
interface CheckboxGroupProps {
  label: string;
  options: Array<{ value: string; label: string }>;
  selected: string[];
  onChange: (selected: string[]) => void;
}
```

### 2.4 Status Indicators

```typescript
// Health Status Badge
interface HealthBadgeProps {
  status: 'optimal' | 'attention' | 'concern' | 'unknown';
  label: string;
}

// Progress Indicator
interface ProgressProps {
  current: number;
  total: number;
  label?: string;
  showPercentage?: boolean;
}

// Biomarker Indicator
interface BiomarkerIndicatorProps {
  name: string;
  value: number;
  unit: string;
  referenceMin: number;
  referenceMax: number;
  isAbnormal: boolean;
  severity?: 'mild' | 'moderate' | 'severe';
}
```

### 2.5 Navigation Components

```typescript
// Progress Stepper
interface StepperProps {
  steps: Array<{
    title: string;
    description?: string;
    status: 'completed' | 'current' | 'pending';
  }>;
  currentStep: number;
}

// Breadcrumb
interface BreadcrumbProps {
  items: Array<{ label: string; href?: string }>;
}

// Tab Navigation
interface TabsProps {
  tabs: Array<{ id: string; label: string; count?: number }>;
  activeTab: string;
  onChange: (tabId: string) => void;
}
```

### 2.6 Data Display Components

```typescript
// Health Summary Card
interface HealthSummaryCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    period: string;
  };
  chart?: {
    type: 'line' | 'bar' | 'sparkline';
    data: number[];
  };
}

// Biomarker Table
interface BiomarkerTableProps {
  biomarkers: Array<{
    name: string;
    value: number;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'low' | 'high';
    trend?: 'up' | 'down' | 'stable';
  }>;
  onViewDetails?: (biomarker: Biomarker) => void;
}

// Treatment Recommendation Card
interface RecommendationCardProps {
  treatment: {
    name: string;
    description: string;
    category: string;
    price?: string;
    relevanceScore?: number;
  };
  provider?: {
    name: string;
    logo?: string;
    rating?: number;
    reviews?: number;
  };
  onLearnMore?: () => void;
  onConnect?: () => void;
}
```

### 2.7 Feedback Components

```typescript
// Explanation Modal/Overlay
interface ExplanationModalProps {
  title: string;
  content: {
    signals: string[];
    reasoning: string[];
    limitations: string[];
  };
  isOpen: boolean;
  onClose: () => void;
}

// Confirmation Dialog
interface ConfirmationDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

// Toast Notification
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  onDismiss?: () => void;
}
```

---

## 3. Screen Specifications

### 3.1 Landing / Entry Screen (P0)

**Purpose**: Primary entry point, communicate value proposition, guide users to start.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Navigation: [HealthPilot Logo] [Login] [Get Started]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Hero Section                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │ "Your Personal AI Health Companion"            │   │
│   │ [Subtext explaining value prop]                 │   │
│   │                                                 │   │
│   │ [Start Health Journey] [View Demo]             │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Value Proposition Cards                              │
│   ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
│   │ AI Diag.    │ │ Treatments  │ │ Tracking    │     │
│   └─────────────┘ └─────────────┘ └─────────────┘     │
│                                                         │
│   How It Works Section                                  │
│   [Step 1] → [Step 2] → [Step 3] → [Step 4]            │
│                                                         │
│   Trust & Compliance Section                            │
│   [GDPR Compliant] [Medical Standards] [Secure]         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Elements**:
- Hero with clear value proposition
- Primary CTA: "Start Health Journey" (leads to Guided Intake)
- Secondary CTA: "View Demo" (for exploration)
- Trust signals (compliance, security, medical standards)
- Minimal form entry (email optional)

**Responsive Breakpoints**:
- Mobile (< 640px): Stacked layout, simplified hero
- Tablet (640px - 1024px): Adjusted grid, smaller hero
- Desktop (> 1024px): Full layout as shown

---

### 3.2 Guided Intake Screen (P0)

**Purpose**: Collect health information through progressive, modular questionnaire.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Progress: [████████░░] 4/8 Sections                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Section Header                                        │
│   "Medical History"                                    │
│   "Tell us about any existing conditions"              │
│                                                         │
│   Form Fields                                           │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Do you have any chronic conditions?            │   │
│   │ ○ No  ● Yes  ○ Prefer not to say              │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   [Conditional: If Yes]                                 │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Please specify:                                 │   │
│   │ [Type to search or add...]                     │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Bottom Navigation                                     │
│   [← Back]          [Skip for now]          [Next →]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Intake Sections** (Modular):
1. **Personal Information** (name, age, gender, contact)
2. **Medical History** (conditions, medications, surgeries)
3. **Symptoms & Goals** (current concerns, health objectives)
4. **Risk Tolerance** (treatment preferences, openness)
5. **Lifestyle Factors** (diet, exercise, sleep, stress)
6. **Budget Sensitivity** (price range considerations)
7. **Delivery Preferences** (location, timing, format)
8. **Review & Confirm** (summary, opportunity to edit)

**Key Features**:
- Progress indicator showing completion
- Skip functionality (progressive disclosure)
- Conditional logic (show/hide based on answers)
- Save progress for returning users
- Anonymous mode (email optional)
- Estimated completion time: 5-8 minutes

---

### 3.3 Health Summary Screen (P0)

**Purpose**: Present AI-driven health overview based on intake and optionally blood tests.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [← Back to Intake]              [Save Results]        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Overall Health Status                                 │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 🟢 Overall Health Score: 78/100                 │   │
│   │                                                 │   │
│   │ Key Insights:                                   │   │
│   │ • Metabolic markers within normal range        │   │
│   │ • Vitamin D levels need attention              │   │
│   │ • Inflammation markers slightly elevated       │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Biomarker Overview                                    │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Normal (12) | Attention (3) | Concern (0)       │   │
│   │                                                 │   │
│   │ [Mini visual chart of biomarkers]              │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Areas Requiring Attention                            │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 🔶 Vitamin D: 18 ng/mL (Low)                    │   │
│   │   Reference: 30-100 ng/mL                      │   │
│   │   Impact: Energy levels, immune function       │   │
│   │   [Why this?] [View Details]                    │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Action Buttons                                        │
│   [View Recommendations] [Connect with Provider]      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Clear overall health status
- Visual biomarker overview
- Prioritized attention areas
- "Why this?" explanation triggers
- Direct path to recommendations
- Option to save results (with account creation)

**Health Status Indicators**:
- 🟢 Optimal (80-100): Within healthy range
- 🟡 Attention (60-79): Needs monitoring
- 🟠 Concern (40-59): Requires action
- 🔴 Critical (< 40): Immediate attention needed

---

### 3.4 Pathway / Recommendation Screen (P0)

**Purpose**: Present treatment options with explainability and provider connections.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [← Back to Summary]    [Filter Options ▾]              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Treatment Pathways                                    │
│   ┌─────────────────────────────────────────────────┐   │
│   │ RECOMMENDED FOR YOU (Based on your profile)    │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Treatment Card 1                                      │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Vitamin D Supplementation                       │   │
│   │ • Address low vitamin D levels                 │   │
│   │ • Improve energy and immune function           │   │
│   │                                                 │   │
│   │ Why recommended:                                │   │
│   │ Your vitamin D levels are 40% below optimal   │   │
│   │                                                 │   │
│   │ [Why this?] [Learn More] [Connect]             │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Treatment Card 2                                      │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Anti-Inflammatory Protocol                      │   │
│   │ • Reduce elevated inflammation markers          │   │
│   │ • Support overall health                        │   │
│   │                                                 │   │
│   │ Why recommended:                                │   │
│   │ Mild inflammation detected in biomarkers       │   │
│   │                                                 │   │
│   │ [Why this?] [Learn More] [Connect]             │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Provider Options                                      │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Available Providers for Vitamin D Treatment    │   │
│   │                                                 │   │
│   │ [Provider Card] [Provider Card] [View All →]    │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Prioritized treatment recommendations
- Clear "Why this?" explanations
- Provider connection options
- Filter by category, price, location
- Comparison functionality
- Save/bookmark options

**Treatment Card Structure**:
- Treatment name and category
- Brief description
- Relevance explanation
- "Why this?" detailed trigger
- "Learn more" expanded view
- "Connect" to provider CTA

---

### 3.5 "Why This?" Explanation Layer (P1)

**Purpose**: Provide transparent, explainable reasoning for recommendations.

**Layout** (Modal/Overlay):
```
┌─────────────────────────────────────────────────────────┐
│ [✕] Why: Vitamin D Supplementation                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Understanding This Recommendation                    │
│                                                         │
│   Signals We Considered                                 │
│   ┌─────────────────────────────────────────────────┐   │
│   │ ✓ Vitamin D level: 18 ng/mL (40% below optimal)│   │
│   │ ✓ Reported fatigue symptoms                     │   │
│   │ ✓ Limited sun exposure (from intake)            │   │
│   │ ✓ Age-related absorption concerns               │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Reasoning                                             │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Your vitamin D levels are significantly below    │   │
│   │ the optimal range (30-100 ng/mL). Low levels    │   │
│   │ are associated with reduced energy, weaker      │   │
│   │ immune function, and other health concerns.     │   │
│   │                                                 │   │
│   │ Supplementation is a safe, evidence-based      │   │
│   │ approach to restore optimal levels.             │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Limitations                                           │
│   ┌─────────────────────────────────────────────────┐   │
│   │ • Individual response varies                   │   │
│   │ • Not a substitute for professional medical     │   │
│   │   advice                                       │   │
│   │ • Consult with a healthcare provider for        │   │
│   │   personalized recommendations                  │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   [Learn More] [Close]                                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Transparent signal display
- Clear reasoning chain
- Acknowledged limitations
- Links to evidence/sources
- Option to discuss with provider

---

### 3.6 Optional Account Creation Screen (P1)

**Purpose**: Allow users to save progress and access dashboard without forcing signup.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [← Skip & Continue as Guest]                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Save Your Progress                                    │
│   ┌─────────────────────────────────────────────────┐   │
│   │                                                 │   │
│   │   ✓ Your health results are ready               │   │
│   │   ✓ Create an account to save them              │   │
│   │   ✓ Track your progress over time              │   │
│   │   ✓ Access personalized updates                │   │
│   │                                                 │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Quick Signup                                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Email Address                                   │   │
│   │ [your@email.com]                               │   │
│   │                                                 │   │
│   │ Create Password                                 │   │
│   │ [••••••••]                                     │   │
│   │                                                 │   │
│   │ [Create Account & Save Results]                 │   │
│   │                                                 │   │
│   │ or continue with: [Google] [Apple]             │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Benefits of Account                                    │
│   • Save and track results over time                   │
│   • Receive personalized health insights               │
│   • Connect with providers easily                      │
│   • Access your dashboard anytime                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Value-driven signup (not forced)
- Social login options
- Minimal required fields
- Clear benefits communication
- Guest mode always available

---

### 3.7 User Dashboard (P1)

**Purpose**: Central hub for logged-in users to access saved results, track progress, and manage health journey.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [HealthPilot] [Health] [Results] [Providers] [Settings] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Welcome Back, John!                                   │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Latest Health Score: 78/100                     │   │
│   │ [+5 from last month]                            │   │
│   │                                                 │   │
│   │ [Mini trend chart showing improvement]           │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Quick Actions                                         │
│   [Start New Intake] [View Latest Results] [Connect]    │
│                                                         │
│   Recent Activity                                       │
│   ┌─────────────────────────────────────────────────┐   │
│   │ • Vitamin D treatment started (3 days ago)     │   │
│   │ • New blood test results available              │   │
│   │ • Follow-up reminder: Dr. Smith                │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Treatment Progress                                    │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Active Treatments (2)                           │   │
│   │                                                 │   │
│   │ [Treatment 1: 65% complete]                    │   │
│   │ [Treatment 2: 30% complete]                    │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Saved Recommendations                                 │
│   [View All Saved →]                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Personalized welcome
- Health score trend tracking
- Quick access to key actions
- Activity timeline
- Treatment progress tracking
- Saved recommendations
- Notification center

---

### 3.8 High-Intent Blood Test Entry Screen (P1)

**Purpose**: Dedicated entry point for users who explicitly want comprehensive blood test analysis.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [← Back to Home]                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Comprehensive Health Analysis                          │
│   ┌─────────────────────────────────────────────────┐   │
│   │                                                 │   │
│   │ Get a complete picture of your health with      │   │
│   │ advanced blood test analysis and personalized   │   │
│   │ treatment recommendations.                       │   │
│   │                                                 │   │
│   │ This pathway includes:                          │   │
│   │ ✓ Comprehensive medical intake                 │   │
│   │ ✓ Blood test panel selection                   │   │
│   │ ✓ Detailed biomarker analysis                 │   │
│   │ ✓ Advanced treatment recommendations           │   │
│   │                                                 │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Choose Your Path                                       │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Panel Options:                                   │   │
│   │                                                 │   │
│   │ ● Basic Panel (50+ biomarkers)                 │   │
│   │   Covers: Essential vitamins, minerals, basic   │   │
│   │   metabolic markers                            │   │
│   │   Price: £49                                   │   │
│   │   Estimated time: 10-15 minutes                 │   │
│   │                                                 │   │
│   │ ○ Comprehensive Panel (100+ biomarkers)        │   │
│   │   Covers: All basic + hormones, advanced       │   │
│   │   metabolic markers, cardiac health           │   │
│   │   Price: £99                                   │   │
│   │   Estimated time: 15-20 minutes                 │   │
│   │                                                 │   │
│   │ ○ Premium Panel (200+ biomarkers)              │   │
│   │   Covers: All comprehensive + detailed         │   │
│   │   hormonal profiles, advanced genetics        │   │
│   │   Price: £199                                  │   │
│   │   Estimated time: 20-25 minutes                 │   │
│   │                                                 │   │
│   │ [Compare Panels] [Continue]                    │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   What to Expect                                         │
│   1. Complete medical intake questionnaire             │
│   2. Choose and book blood test at partner lab         │
│   3. Results delivered to your dashboard              │
│   4. Receive personalized analysis and recommendations  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Clear value proposition for high-intent users
- Panel comparison functionality
- Pricing transparency
- Time expectations
- Process overview
- Lab partner selection

---

### 3.9 Comprehensive Medical Intake (P1)

**Purpose**: Detailed health information collection for high-intent users.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ Progress: [████████████░░░] 12/18 Questions             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Section: Medical History                              │
│   Question 8/12                                          │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Do you have any family history of:              │   │
│   │                                                 │   │
│   │ [ ] Heart disease                               │   │
│   │ [ ] Diabetes                                   │   │
│   │ [ ] Cancer                                     │   │
│   │ [ ] Thyroid conditions                         │   │
│   │ [ ] Autoimmune disorders                       │   │
│   │ [ ] Mental health conditions                   │   │
│   │ [ ] Other (please specify)                     │   │
│   │                                                 │   │
│   │ [Skip this question] [Next]                    │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Bottom Navigation                                     │
│   [← Previous]      [Save Progress]      [Next →]       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Detailed health history collection
- Family history tracking
- Comprehensive symptom assessment
- Medication and supplement review
- Lifestyle factor deep dive
- Save progress functionality
- Estimated completion time display

---

### 3.10 Blood Test Results & Interpretation (P1)

**Purpose**: Detailed presentation of blood test results with AI-driven interpretation.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [← Back to Dashboard]    [Export Results] [Share]       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Blood Test Results                                    │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Test Date: January 15, 2025                    │   │
│   │ Lab Partner: HealthLab UK                       │   │
│   │ Panel: Comprehensive (100+ biomarkers)         │   │
│   │ Status: ✓ All results complete                  │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Overall Assessment                                     │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 🟢 85/100 Overall Health Score                  │   │
│   │                                                 │   │
│   │ Your results show mostly optimal markers.       │   │
│   │ Three areas require attention for optimal       │   │
│   │ health and performance.                         │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Attention Areas (3)                                    │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 1. Vitamin D: 18 ng/mL (LOW)                    │   │
│   │    Reference: 30-100 ng/mL                     │   │
│   │    Severity: Moderate                           │   │
│   │    [View Details] [Why this?]                  │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 2. hs-CRP: 2.5 mg/L (ELEVATED)                 │   │
│   │    Reference: <1.0 mg/L                         │   │
│   │    Severity: Mild                              │   │
│   │    [View Details] [Why this?]                  │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ 3. Ferritin: 15 ng/mL (LOW)                    │   │
│   │    Reference: 30-300 ng/mL                     │   │
│   │    Severity: Moderate                           │   │
│   │    [View Details] [Why this?]                  │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Optimal Markers (97)                                  │
│   [View All Optimal →]                                 │
│                                                         │
│   Detailed Analysis                                      │
│   [View Full Biomarker Table] [Compare with Previous]    │
│                                                         │
│   Treatment Recommendations                              │
│   [View Personalized Recommendations]                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Key Features**:
- Comprehensive biomarker display
- Visual status indicators
- Prioritized attention areas
- Detailed interpretation
- Comparison with previous results
- Export/share functionality
- Direct link to recommendations

---

## 4. Provider/Admin Screens

### 4.1 Provider Management Dashboard

**Purpose**: Central hub for providers to manage their profile, treatments, and matching rules.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [Provider Portal] [Dashboard] [Treatments] [Analytics] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Welcome, Health Clinic London                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Profile Status: ✓ Active                        │   │
│   │ Last Updated: January 10, 2025                 │   │
│   │                                                 │   │
│   │ Quick Stats:                                    │   │
│   │ • 12 Active Treatments                         │   │
│   │ • 3 New Intakes This Week                      │   │
│   │ • 85% Match Rate                               │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Recent Intakes                                        │
│   ┌─────────────────────────────────────────────────┐   │
│   │ John D. - Vitamin D Treatment                  │   │
│   │ Status: Awaiting Review | 2 hours ago          │   │
│   │                                                 │   │
│   │ Sarah M. - Anti-Inflammatory Protocol           │   │
│   │ Status: In Progress | 1 day ago                │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Treatment Performance                                 │
│   [Conversion Rate Chart] [Patient Satisfaction]        │
│                                                         │
│   Actions                                               │
│   [Edit Profile] [Manage Treatments] [View Analytics]    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

### 4.2 Treatment Definition Screen

**Purpose**: Define treatment offerings, eligibility criteria, and pricing.

**Layout**:
```
┌─────────────────────────────────────────────────────────┐
│ [← Back to Treatments]    [Save] [Publish]            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   Treatment Definition                                   │
│                                                         │
│   Basic Information                                     │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Treatment Name: Vitamin D Supplementation       │   │
│   │ Category: Supplements                           │   │
│   │ Description:                                    │   │
│   │ [Comprehensive treatment description...]        │   │
│   │                                                 │   │
│   │ Pricing:                                        │   │
│   │ One-time: £29/month                             │   │
│   │ Subscription: £25/month (12-month minimum)     │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Eligibility Criteria                                  │
│   ┌─────────────────────────────────────────────────┐   │
│   │ Required Biomarkers:                           │   │
│   │ • Vitamin D (must be < 30 ng/mL)               │   │
│   │ • Calcium (must be within normal range)        │   │
│   │                                                 │   │
│   │ Age Requirements: 18-65                         │   │
│   │ Gender Requirements: All                        │   │
│   │                                                 │   │
│   │ Contraindications:                              │   │
│   │ • Hypercalcemia                                 │   │
│   │ • Kidney disease                               │   │
│   │ • Pregnancy (consult physician)               │   │
│   └─────────────────────────────────────────────────┘   │
│                                                         │
│   Matching Rules                                        │
│   [Add New Rule] [Import from Template]                  │
│                                                         │
│   Preview                                               │
│   [Preview how treatment appears to users]              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 5. Responsive Design Strategy

### 5.1 Breakpoint System

```typescript
const breakpoints = {
  xs: '0px',        // Mobile first
  sm: '640px',      // Small phones
  md: '768px',      // Tablets
  lg: '1024px',     // Laptops
  xl: '1280px',     // Desktops
  '2xl': '1536px',  // Large desktops
};
```

### 5.2 Mobile-First Approach

- Design for mobile screens first (320px - 640px)
- Progressive enhancement for larger screens
- Touch-friendly target sizes (minimum 44x44px)
- Simplified navigation on mobile
- Stack content vertically on small screens
- Use bottom navigation for mobile where appropriate

### 5.3 Tablet Adaptations

- Two-column layouts (768px - 1024px)
- Adjusted typography sizes
- Side-by-side content where appropriate
- Enhanced navigation options
- Larger touch targets

### 5.4 Desktop Optimizations

- Multi-column layouts (1024px+)
- Hover states and tooltips
- Enhanced data visualization
- Keyboard navigation focus
- Expanded navigation menus

---

## 6. Accessibility Standards

### 6.1 WCAG AA Compliance

- Color contrast ratio: 4.5:1 for normal text, 3:1 for large text
- Keyboard navigable: All interactive elements accessible via keyboard
- Screen reader friendly: Proper ARIA labels and semantic HTML
- Focus indicators: Visible focus states for all interactive elements
- Text alternatives: Alt text for images, descriptions for charts
- Error handling: Clear error messages with suggestions

### 6.2 Typography Accessibility

- Base font size: 16px (1rem) minimum
- Line height: 1.5 for body text, 1.2 for headings
- Character spacing: Not condensed
- Font families: Readable sans-serif fonts

### 6.3 Color Accessibility

- Never rely on color alone to convey information
- Use patterns, icons, and text labels alongside colors
- Support high contrast mode
- Respect user's system preferences for reduced motion

---

## 7. Animation & Interaction Design

### 7.1 Micro-interactions

```typescript
// Button hover effects
- Scale: 1.02x
- Color: Slight darkening (5-10%)
- Transition: 200ms ease-in-out

// Card hover effects
- Elevation: Add shadow
- Scale: 1.01x
- Border: Subtle highlight

// Loading states
- Skeleton screens
- Progress indicators
- Optimistic UI updates
```

### 7.2 Page Transitions

- Fade in: 300ms ease-in-out
- Slide transitions: 400ms ease-in-out
- Staggered content reveal: 100ms delay between elements

### 7.3 Motion Principles

- Purposeful: Every animation serves a function
- Performant: Use transforms and opacity (GPU accelerated)
- Accessible: Respect prefers-reduced-motion
- Consistent: Follow established timing and easing

---

## 8. State Management & Data Flow

### 8.1 User Journey States

```typescript
// Anonymous Flow
type AnonymousState = 
  | 'landing'           // On landing page
  | 'intake_started'    // Began intake questionnaire
  | 'intake_completed'  // Finished intake
  | 'health_summary'    // Viewing health summary
  | 'recommendations'   // Viewing recommendations
  | 'provider_handoff'; // Connecting with provider

// Authenticated Flow
type AuthenticatedState = 
  | 'dashboard'         // User dashboard
  | 'results_history'   // Past results
  | 'treatment_active'  // Active treatment
  | 'profile_settings'; // Account settings
```

### 8.2 Data Persistence

```typescript
// Local storage (anonymous users)
interface LocalStorageData {
  intakeProgress: Partial<HealthIntake>;
  savedRecommendations: string[];
  viewedExplanations: string[];
  preferences: UserPreferences;
}

// Server storage (authenticated users)
interface ServerStorageData {
  completeProfile: UserProfile;
  healthIntakes: HealthIntake[];
  bloodTests: BloodTest[];
  recommendations: Recommendation[];
  treatments: ActiveTreatment[];
  providerConnections: ProviderConnection[];
}
```

---

## 9. Implementation Priority

### 9.1 Phase 1: P0 Core Experience

1. Landing/Entry Screen
2. Guided Intake Screen (basic version)
3. Health Summary Screen (without blood tests)
4. Pathway/Recommendation Screen (basic)
5. Basic authentication (login/register)

### 9.2 Phase 2: P1 Trust & Continuity

1. "Why this?" Explanation Layer
2. Optional Account Creation
3. User Dashboard
4. Result saving functionality

### 9.3 Phase 3: P1 Blood Test Integration

1. High-Intent Blood Test Entry
2. Comprehensive Medical Intake
3. Blood Test Results & Interpretation
4. Lab partner integration

### 9.4 Phase 4: Provider/Admin

1. Provider Management Dashboard
2. Treatment Definition Screen
3. Matching Rules Dashboard
4. Rule Builder Screen

---

## 10. Design Handoff & Development Notes

### 10.1 Component Export Structure

```
src/components/
├── ui/                    # Base UI components
│   ├── button/
│   ├── card/
│   ├── input/
│   ├── select/
│   ├── badge/
│   └── progress/
├── features/              # Feature-specific components
│   ├── intake/
│   ├── health-summary/
│   ├── recommendations/
│   ├── explanations/
│   └── dashboard/
└── layouts/               # Layout components
    ├── navigation/
    ├── footer/
    └── containers/
```

### 10.2 Design Tokens Usage

```typescript
// Example component using design tokens
import { colors, spacing, typography } from '@/design-system/tokens';

const Button = ({ variant = 'primary', size = 'md' }) => {
  return (
    <button
      style={{
        backgroundColor: colors.primary[variant],
        padding: `${spacing[size]} ${spacing[size * 2]}`,
        fontSize: typography.fontSize['label'],
        fontWeight: typography.fontWeight['semibold'],
      }}
    >
      {/* ... */}
    </button>
  );
};
```

### 10.3 Testing Requirements

- Visual regression testing for all components
- Accessibility testing (axe-core)
- Responsive testing across all breakpoints
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Performance testing (Lighthouse score > 90)

---

This design system provides a comprehensive foundation for building the HealthPilot application with consistency, accessibility, and user experience excellence at the forefront.
