
export interface Dimention<T> {
  physical: {
    nutrition: {
      dietQuality: T;
      quantityOfFood: T;
      foodKnowledge: T;
      hydration: T;
    };
    physicalActivity: {
      cardiovascularExercise: T;
      strengtheningExercise: T;
      movement: T;
      exerciseDiscipline: T;
    };
    recovery: {
      amountOfSleep: T;
      dailyEnergy: T;
      activeBreaks: T;
      sleepQuality: T;
    }
  };
  mental: {
    stress: {
      workStress: T;
      personalStress: T;
      financialHealth: T;
      stressResponse: T;
    };
    mindfulness: {
      focus: T;
      meditation: T;
      humor: T;
      presence: T;
    };
    productivity: {
      concentration: T;
      multitask: T;
      laborJourneys: T;
      psychologicalSafety: T;
    };
  };
  emotional: {
    purpose: {
      personalPurpose: T;
      socialImpact: T;
      passions: T;
      resilience: T;
    };
    constructiveRelationships: {
      socialization: T;
      laborRelations: T;
      feedback: T;
      relationship: T;
    };
    emotionalIntelligence: {
      attitude: T;
      conflictManagement: T;
      empathy: T;
      gratitude: T;
    };
  };
  professional: {
    professionalHabits: {
      habits: T;
      weather: T;
      meetings: T;
      compliance: T;
    };
    personalDevelopment: {
      careerGoals: T;
      developing: T;
      weather: T;
      selfKnowledge: T;
    };
    distractionManagement: {
      screenTime: T;
      procrastination: T;
      distractorsStrategy: T;
      balance: T;
    };
  };
}
