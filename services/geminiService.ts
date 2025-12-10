
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Course } from "../types";

// Initialize Gemini
// NOTE: In a production app, never expose keys on the client. 
// This is for demonstration purposes using the provided environment variable pattern.
const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API_KEY is missing from environment variables");
    }
    return new GoogleGenAI({ apiKey });
};

// We define the schema to force Gemini to return the exact JSON structure we need for the UI.
const courseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "The name of the course" },
    description: { type: Type.STRING, description: "A comprehensive description of the course" },
    targetAudience: { type: Type.STRING },
    level: { type: Type.STRING, description: "e.g., Undergraduate, Graduate, Professional" },
    totalWeeks: { type: Type.INTEGER },
    modules: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          focus: { type: Type.STRING },
          learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING } },
          keyConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          deliveryMode: { type: Type.STRING, enum: ["Lecture", "Seminar", "Lab", "Project"] },
          lectureSummary: { type: Type.STRING, description: "Detailed 300-500 word summary of the lecture content for this week." },
          lectureOutline: { type: Type.ARRAY, items: { type: Type.STRING } },
          discussionPrompts: { type: Type.ARRAY, items: { type: Type.STRING } },
          readings: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                author: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["Textbook", "Paper", "Video", "Article"] },
                relevance: { type: Type.STRING },
              }
            }
          },
          assignments: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
                estimatedHours: { type: Type.NUMBER },
                difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
                rubric: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      criteriaName: { type: Type.STRING },
                      description: { type: Type.STRING },
                      weight: { type: Type.NUMBER },
                      bands: {
                        type: Type.OBJECT,
                        properties: {
                          excellent: { type: Type.STRING },
                          good: { type: Type.STRING },
                          fair: { type: Type.STRING },
                          poor: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          quiz: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              }
            }
          },
          slides: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                bullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                visualHint: { type: Type.STRING, description: "A suggestion for an image, chart, or diagram." },
                speakerNotes: { type: Type.STRING }
              }
            }
          }
        }
      }
    }
  },
  required: ["title", "description", "modules", "totalWeeks"]
};

export const generateCourse = async (rawText: string, weeksToGenerate: number = 4): Promise<Course> => {
  const client = getClient();
  
  // We strictly control the length to avoid timeouts in this demo environment.
  // In a real app, this would be chunked or streamed.
  const prompt = `
    You are an expert Curriculum Designer and Instructional Designer.
    Analyze the following Syllabus/Text/Topic content and generate a structured course.
    
    Content: "${rawText.slice(0, 10000)}"

    Constraints:
    - Generate exactly ${weeksToGenerate} weeks of content.
    - The output MUST be valid JSON matching the schema.
    - Create a coherent narrative flow from basic to advanced concepts.
    - Ensure 'lectureSummary' is substantial and academic in tone.
    - Ensure 'slides' covers the key lecture points (approx 3-5 slides per week).
    - Ensure 'rubric' is detailed for assignments.
    - Assign an appropriate difficulty level ('Beginner', 'Intermediate', 'Advanced') to each assignment based on the task complexity.
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: courseSchema,
        temperature: 0.2, // Low temp for structured, consistent output
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);
    
    // Add ID and dates locally since the AI doesn't need to generate those
    return {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error("Course generation failed:", error);
    throw error;
  }
};
