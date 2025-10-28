import React, { createContext, useContext, useEffect, useState } from 'react';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { privateApi } from '@/lib/api';
import { OnboardingStep } from '@/lib/types/user';

// Re-export the OnboardingStep enum so it can be imported from this file
export { OnboardingStep };

// Define the data structure for each onboarding step
export interface StepData {
  // Username step
  username?: string;
  
  // Profile step
  displayName?: string;
  bio?: string;
  
  // Avatar step
  avatarUrl?: string;
  coverImageUrl?: string;
  
  // Customize step
  tipAmounts?: number[];
  theme?: string;
  additionalSettings?: Record<string, any>;
  customization?: any; // Add direct customization object
}

// Define step sequence for navigation
export const STEP_SEQUENCE: OnboardingStep[] = [
  OnboardingStep.USERNAME,
  OnboardingStep.PROFILE,
  OnboardingStep.AVATAR,
  OnboardingStep.CUSTOMIZE,
  OnboardingStep.COMPLETE
];

// Convert step name to number for progress display
export const getStepNumber = (step: OnboardingStep): number => {
  return STEP_SEQUENCE.indexOf(step) + 1;
};

// Step information for UI rendering
export const STEP_INFO = {
  [OnboardingStep.USERNAME]: { title: 'Username', emoji: '🧑‍💻' },
  [OnboardingStep.PROFILE]: { title: 'Profile', emoji: '📝' },
  [OnboardingStep.AVATAR]: { title: 'Avatar', emoji: '📸' },
  [OnboardingStep.CUSTOMIZE]: { title: 'Customize', emoji: '✨' },
  [OnboardingStep.COMPLETE]: { title: 'Complete', emoji: '🎉' }
};

// Get next step in sequence
export const getNextStep = (currentStep: OnboardingStep): OnboardingStep => {
  const currentIndex = STEP_SEQUENCE.indexOf(currentStep);
  if (currentIndex === -1 || currentIndex === STEP_SEQUENCE.length - 1) {
    return OnboardingStep.COMPLETE;
  }
  return STEP_SEQUENCE[currentIndex + 1];
};

// Get previous step in sequence
export const getPreviousStep = (currentStep: OnboardingStep): OnboardingStep | null => {
  const currentIndex = STEP_SEQUENCE.indexOf(currentStep);
  // If we're at the first step or an invalid step, return null
  if (currentIndex <= 0) {
    return null;
  }
  return STEP_SEQUENCE[currentIndex - 1];
};

// Get step path for navigation
export const getStepPath = (step: OnboardingStep): string => {
    console.log({ step });
//   if (step === OnboardingStep.COMPLETE) {
//     return '/dashboard';
//   }
  return `/onboarding/${step}`;
};

// Define the context state type
interface OnboardingContextType {
  currentStep: OnboardingStep;
  isLoading: boolean;
  canGoBack: boolean;
  saveStepData: (step: OnboardingStep, data: StepData) => Promise<void>;
  completeStep: (step: OnboardingStep, data: StepData) => Promise<void>;
  skipStep: (step: OnboardingStep) => Promise<void>;
  goToPreviousStep: (step: OnboardingStep) => Promise<void>;
  goToStep: (step: OnboardingStep) => void;
  completeOnboarding: () => Promise<void>;
  // New properties for completion modal
  showCompletionModal: boolean;
  closeCompletionModal: () => void;
}

// Create context with initial default values
const OnboardingContext = createContext<OnboardingContextType>({
  currentStep: OnboardingStep.USERNAME,
  isLoading: false,
  canGoBack: true,
  saveStepData: async () => {},
  completeStep: async () => {},
  skipStep: async () => {},
  goToPreviousStep: async () => {},
  goToStep: () => {},
  completeOnboarding: async () => {},
  // New properties for completion modal
  showCompletionModal: false,
  closeCompletionModal: () => {},
});

// Custom hook for easy context consumption
export const useOnboarding = () => useContext(OnboardingContext);

// Provider component
export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(OnboardingStep.USERNAME);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [canGoBack, setCanGoBack] = useState<boolean>(true);
  const [isCompletionInProgress, setIsCompletionInProgress] = useState<boolean>(false);
  const [showCompletionModal, setShowCompletionModal] = useState<boolean>(false);
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();

  // Initialize the current step based on user data
  useEffect(() => {
    // Skip step determination if we're in the process of completing onboarding
    // or if we're showing the completion modal
    if (isCompletionInProgress || showCompletionModal) return;
    
    if (user) {
      if (user.onboardingCompleted) {
        navigate('/dashboard', { replace: true });
      } else if (user.currentOnboardingStep === OnboardingStep.COMPLETE) {
        setShowCompletionModal(true);
        return;
      }
      else {
        determineCurrentStep();
      }
      
      // If user has a username, they shouldn't be able to go back from username step
      if (user.username && currentStep === OnboardingStep.USERNAME) {
        setCanGoBack(false);
      } else {
        setCanGoBack(true);
      }
    }
  }, [user, currentStep, isCompletionInProgress, showCompletionModal]);

  // Determine the current step based on user data
  const determineCurrentStep = () => {
    if (!user) return;
    
    // If the user has completed onboarding
    if (user.onboardingCompleted) {
      setCurrentStep(OnboardingStep.COMPLETE);
      return;
    }
    
    // If we don't have the numeric step, use the step names to determine the current step
    if (user.currentOnboardingStep === undefined) {
      // Determine step based on what info user has already provided
      if (!user.username) {
        setCurrentStep(OnboardingStep.USERNAME);
      } else if (!user.displayName) {
        setCurrentStep(OnboardingStep.PROFILE);
      } else if (!user.avatarUrl) {
        setCurrentStep(OnboardingStep.AVATAR);
      } else {
        setCurrentStep(OnboardingStep.CUSTOMIZE);
      }
      return;
    }
    
    // If current step is USERNAME but user already has a username, skip to next step
    if (
      user.currentOnboardingStep === OnboardingStep.USERNAME && 
      user.username
    ) {
      const nextStep = getNextStep(OnboardingStep.USERNAME);
      setCurrentStep(nextStep);
      navigate(getStepPath(nextStep), { replace: true });
      message.info('You already have a username, moving forward! ⏭️', 2);
      return;
    }
    
    // Use the currentOnboardingStep value from the user object
    const stepName = user.currentOnboardingStep;
    // Find the corresponding step in our sequence
    const matchedStep = STEP_SEQUENCE.find(step => step.toLowerCase() === String(stepName).toLowerCase());
    console.log({ matchedStep });
    if (matchedStep) {
      setCurrentStep(matchedStep);
    } else {
      // Default to the first step if we can't determine the current step
      setCurrentStep(OnboardingStep.USERNAME);
    }
  };

  // Save data for the current step without progressing
  const saveStepData = async (step: OnboardingStep, data: StepData) => {
    try {
      setIsLoading(true);
      
      // Use the appropriate endpoint from AuthController
      switch (step) {
        
        case OnboardingStep.USERNAME:
          await privateApi.post('/auth/onboarding/username', {
            username: data.username
          });
          break;
        case OnboardingStep.PROFILE:
          await privateApi.post('/auth/onboarding/profile', {
            displayName: data.displayName,
            bio: data.bio
          });
          break;
        case OnboardingStep.AVATAR:
          // Only save avatar data if both fields are empty
          if (data.avatarUrl || data.coverImageUrl) {
            await privateApi.post('/auth/onboarding/avatar', {
              avatarUrl: data.avatarUrl,
              coverImageUrl: data.coverImageUrl
            });
            message.success('Profile images saved! 💾');
          } else {
            // If both fields are empty, skip the API call but don't show an error
            console.log('Skipping empty avatar save');
          }
          // Don't show generic "Progress saved" message for this step
          break;
        case OnboardingStep.CUSTOMIZE:
          // If we have direct customization data, use it directly
          if (data.customization) {
            await privateApi.post('/auth/onboarding/customization', data.customization);
          } else {
            // Fall back to the old way for backward compatibility
            await privateApi.post('/auth/onboarding/customization', {
              tipAmounts: data.tipAmounts,
              theme: data.theme,
              additionalSettings: data.additionalSettings
            });
          }
          break;
        default:
          throw new Error(`Invalid onboarding step: ${step}`);
      }
      
      // Only show the success message for steps other than Avatar
      if (step !== OnboardingStep.AVATAR) {
        message.success('Progress saved! 💾');
      }
      
      // Refresh user data to get the updated onboarding state
      await refreshUser();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to save progress 😔');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Force navigation to a specific step regardless of context state
  const forceStepNavigation = (step: OnboardingStep) => {
    // First try React Router navigation
    const stepPath = getStepPath(step);
    navigate(stepPath, { replace: true });
    
    // Set a backup method in case React Router doesn't work
    setTimeout(() => {
      if (window.location.pathname !== stepPath) {
        // Force a hard browser navigation
        window.location.href = stepPath;
      }
    }, 500);
  };

  // Complete the current step and move to the next one
  const completeStep = async (step: OnboardingStep, data: StepData) => {
    try {
      setIsLoading(true);
      
      // Handle empty avatar step specially - always proceed without trying to save
      const isEmptyAvatarStep = step === OnboardingStep.AVATAR && 
                               (!data.avatarUrl || data.avatarUrl === '') && 
                               (!data.coverImageUrl || data.coverImageUrl === '');
      
      // Special case for avatar step - always navigate to next step after attempt
      const isAvatarStep = step === OnboardingStep.AVATAR;
      
      // Only save data if we're not in the empty avatar case
      if (!isEmptyAvatarStep) {
        // Save data for the current step based on what's provided
        // Only attempt to save if we have valid data to save
        if (
          (step === OnboardingStep.USERNAME && data.username) ||
          (step === OnboardingStep.PROFILE && data.displayName) ||
          (step === OnboardingStep.AVATAR && (data.avatarUrl || data.coverImageUrl)) ||
          (step === OnboardingStep.CUSTOMIZE && (data.tipAmounts || data.additionalSettings))
        ) {
          await saveStepData(step, data);
        } else if (step !== OnboardingStep.AVATAR) {
          // If we don't have data and it's not the avatar step, log what we got for debugging
          console.log(`No valid data to save for step ${step}`, data);
        }
      }
      
      // No need to refresh user data if we're skipping the save step
      if (!isEmptyAvatarStep && !isAvatarStep) {
        // Wait for user data to refresh to get latest step info
        await refreshUser();
      }
      
      // Check current user onboarding step after refresh
      // Move to the next step in sequence, unless the backend has already updated it
      const nextStep = getNextStep(step);
      setCurrentStep(nextStep);
      
      // Check if we've reached the final step
      if (step === OnboardingStep.CUSTOMIZE) {
        // Instead of automatically calling completeOnboarding, show the completion modal
        setShowCompletionModal(true);
      } else if (nextStep !== OnboardingStep.COMPLETE) {
        // For avatar step, force navigation to ensure it works
        if (isAvatarStep) {
          forceStepNavigation(nextStep);
        } else {
          navigate(getStepPath(nextStep), { replace: true });
        }
      }
      
      // Show success message for the completed step
      message.success(`${STEP_INFO[step as keyof typeof STEP_INFO].title} step completed successfully! 🎉`);
    } catch (error) {
      // For avatar step, always navigate even on error
      if (step === OnboardingStep.AVATAR) {
        const nextStep = getNextStep(step);
        forceStepNavigation(nextStep);
      }
      
      // Error already handled in saveStepData
      console.error("Error completing step:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Close the completion modal
  const closeCompletionModal = () => {
    setShowCompletionModal(false);
  };

  // Skip the current step
  const skipStep = async (step: OnboardingStep) => {
    try {
      setIsLoading(true);
      
      // Move to the next step without saving data
      const nextStep = getNextStep(step);
      setCurrentStep(nextStep);
      
      // Check if we've reached the final step (CUSTOMIZE)
      if (step === OnboardingStep.COMPLETE) {
        // Show completion modal instead of auto-completing
        setShowCompletionModal(true);
      } else if (nextStep !== OnboardingStep.COMPLETE) {
        navigate(getStepPath(nextStep));
        message.info('Step skipped. You can always come back to it later! ⏭️');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to skip step 😔');
    } finally {
      setIsLoading(false);
    }
  };

  // Go to the previous step
  const goToPreviousStep = async (step: OnboardingStep) => {
    try {
      setIsLoading(true);
      
      // Don't allow going back from username if the user already has a username
      if (step === OnboardingStep.USERNAME && user?.username) {
        message.warning('Your username has already been set and cannot be changed during onboarding 🔒');
        setIsLoading(false);
        return;
      }
      
      // Get the previous step in sequence
      const prevStep = getPreviousStep(step);
      
      // If there's no previous step (we're at the first step), just stay here
      if (!prevStep) {
        setIsLoading(false);
        return;
      }
      
      // Move to the previous step
      setCurrentStep(prevStep);
      
      // Update URL to match the new step
      navigate(getStepPath(prevStep), { replace: true });
      message.info('Going back to previous step 👈');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to navigate to previous step 😔');
    } finally {
      setIsLoading(false);
    }
  };

  // Go to a specific step
  const goToStep = (step: OnboardingStep) => {
    setCurrentStep(step);
    navigate(getStepPath(step));
  };

  // Complete the entire onboarding process
  const completeOnboarding = async () => {
    try {
      setIsLoading(true);
      setIsCompletionInProgress(true);
      
      await privateApi.post('/auth/onboarding/complete');
      
      // Set to completed
      setCurrentStep(OnboardingStep.COMPLETE);
      
      // Refresh user data to get updated status
      await refreshUser();
      
      // Navigate to dashboard
      message.success('Onboarding completed! Welcome to Tiply! 🎉', 3);
      
      // Use replace to prevent back-navigation issues
      navigate('/dashboard', { replace: true });
      
      // Hide the completion modal
      setShowCompletionModal(false);
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Failed to complete onboarding 😔');
      setIsCompletionInProgress(false);
      // Keep the modal open if there was an error
    } finally {
      setIsLoading(false);
      // Keep isCompletionInProgress true if successful - we don't want to re-trigger step determination
    }
  };

  const value = {
    currentStep,
    isLoading,
    canGoBack,
    saveStepData,
    completeStep,
    skipStep,
    goToPreviousStep,
    goToStep,
    completeOnboarding,
    // New properties for completion modal
    showCompletionModal,
    closeCompletionModal,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};