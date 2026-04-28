import { Achievement } from "../types";

export async function analyzeAchievements(achievements: Achievement[]) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ achievements })
    });
    
    if (!response.ok) throw new Error('Analysis failed');
    
    const data = await response.json();
    return data.analysis;
  } catch (error) {
    console.error("AI Service Error:", error);
    return "Error occurred while analyzing achievements. Please try again later.";
  }
}

export async function verifyDocument(fileBase64: string, mimeType: string, achievementTitle: string) {
  try {
    const response = await fetch('/api/verify-document', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        fileData: fileBase64, 
        mimeType: mimeType,
        achievementTitle 
      })
    });
    
    if (!response.ok) throw new Error('Verification failed');
    return await response.json();
  } catch (error) {
    console.error("Verification Service Error:", error);
    return { matches: false, justification: "Failed to connect to AI verification service." };
  }
}

export async function suggestSkillsFromDescription(description: string) {
  // Simplified for now, could be another endpoint
  return ["Critical Thinking", "Problem Solving", "Documentation"];
}
