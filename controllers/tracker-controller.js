const OpenAI = require("openai");
const dotenv = require("dotenv");
dotenv.config();
const { checkConnection, queryValues } = require("../model/user-model");

let userEmail = null;
let dob = null;
let fullname = null;
let initialPromptSent = false;

const devTracker = async (req, res) => {
  try {
    // Check if userEmail and dob are not set
    if (!userEmail && !fullname && !dob) {
      // Set userEmail and dob from req.body
      userEmail = req.body.userEmail;
      fullname = req.body.fullname;
      dob = req.body.dob;

      const connection = await checkConnection();
      const childData = await queryValues(
        connection,
        "SELECT * FROM childs_BioData WHERE userEmail = ? AND fullname = ? AND dob = ?",
        [userEmail, fullname, dob]
      );

      if (childData.length === 0) {
        // If no child data found, send an appropriate response
        return res
          .status(404)
          .send(
            "No child found for the provided email, fullname and date of birth."
          );
      }
      const child = childData[0];
      // Calculate child's age in weeks
      const childsDOB = new Date(child.dob);
      const currentDate = new Date();
      const ageDiff = currentDate.getTime() - childsDOB.getTime();
      const ageInWeeks = Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 7));

      // Prepare the initial prompt
      const initialPrompt = `Say 'Hi' to me before responding and do not include "Certainly" before responding to my question.
      "My child name is ${child.fullname}, child's gender is ${child.gender} and ${ageInWeeks} weeks old.
       I want you to calculate my child's age based on the following conditions: "If my child's age is  more than 52 weeks, calculate my child's age in "years"
       BUT if my child's age is less than 52 weeks BUT more than 4 weeks old, calculate my child's age  in "months".
       Please do not include the details of the calculation in your response, just give the child's by fulfilling the conditions stated.
       Then Give me the developmental milestones of my child's age in details? End your statement with "Remember that every child develops at their own pace.
       Do you have any other concerns about your ${child.fullname} development`;

      // Send the initial prompt to OpenAI
      const openai = new OpenAI({ apiKey: process.env.API_KEY });
      const initialResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: initialPrompt }],
        max_tokens: 255,
      });

      const initialResponseData = initialResponse.choices[0].message.content;
      res.status(200).send(initialResponseData);

      initialPromptSent = true;
    } else {
      const userMessage = req.body.userMessage;

      const openai = new OpenAI({ apiKey: process.env.API_KEY });
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
        temperature: 1,
        max_tokens: 255,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const responseData = response.choices[0].message.content;
      res.status(200).send(responseData);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { devTracker };
