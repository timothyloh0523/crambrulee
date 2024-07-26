// apiService.mjs
import OpenAI from "openai";
import dotenv from "dotenv";


dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const conversation = [];
async function getEventSuggestions(events, eventTitle) {
  let prompt;

  if (eventTitle) {

    console.log("event title detected", eventTitle);
    prompt = `Based on the following events: ${JSON.stringify(events)}, 
    suggest a date and time for an event titled "${eventTitle}". ensure the suggested event title is "${eventTitle}". 
    Provide your answer in the following format.
    Suggested Event Title: 
    Suggested Event Date: 
    Suggested Event Time: `;
  } else {
   
    prompt = `Based on the following events: ${JSON.stringify(events)}, 
    suggest a new event for the user. 
    Provide your answer in the following format.
    Suggested Event Title: 
    Suggested Event Date: 
    Suggested Event Time: `;
  }
  try {
    console.log(" no event title detected", eventTitle);
    conversation.push({ role: "user", content: prompt });

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: conversation,
    });

    const assistantMessage = response.choices[0].message.content.trim();
    console.log("Assistant:", assistantMessage);

    // Parse the assistant's message to extract title, date, and time
    const [titleLine, dateLine, timeLine] = assistantMessage.split("\n");
    const title = titleLine.replace("Suggested Event Title: ", "").trim();
    const date = dateLine.replace("Suggested Event Date: ", "").trim();
    const time = timeLine.replace("Suggested Event Time: ", "").trim();
    return { title, date, time };

  } catch (error) {
    console.error("Error fetching event suggestions:", error);
    return "Error 3 getting suggestion";
  }
}

export default getEventSuggestions;
