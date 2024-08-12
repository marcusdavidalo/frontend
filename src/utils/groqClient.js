import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ,
  dangerouslyAllowBrowser: true,
});

const TIMEOUT_DURATION = 30000; // 30 seconds timeout

export const sendMessageToGroq = async (messages, model) => {
  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out")), TIMEOUT_DURATION)
    );

    const chatCompletionPromise = groq.chat.completions.create({
      messages: messages,
      model: model,
      max_tokens: 1024,
      temperature: 0.6,
      top_p: 1,
    });

    const chatCompletion = await Promise.race([
      chatCompletionPromise,
      timeoutPromise,
    ]);
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error sending message to Groq:", error);
    if (error.message === "Request timed out") {
      throw new Error("The model took too long to respond. Please try again.");
    }
    throw new Error(
      "An error occurred while processing your request. Please try again."
    );
  }
};

const priorityOrder = ["Meta", "Groq", "Google", "Mistral"];

export const getGroqModels = async () => {
  try {
    const models = await groq.models.list();

    // Sort models based on priority
    const sortedModels = models.data.sort((a, b) => {
      const priorityA = priorityOrder.indexOf(a.owned_by);
      const priorityB = priorityOrder.indexOf(b.owned_by);

      if (priorityA === priorityB) {
        if (a.id === "llama-3.1-70b-versatile") return -1;
        if (b.id === "llama-3.1-70b-versatile") return 1;
        return 0;
      }

      return priorityA - priorityB;
    });

    return sortedModels.map((model) => model.id);
  } catch (error) {
    console.error("Error fetching Groq models:", error);
    throw new Error(
      "Failed to fetch available models. Please try again later."
    );
  }
};
