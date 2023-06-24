import React, { useState } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";
import art from "./assets/aboriginal-art.png";
import {dictionary} from "./lib/dictionary.ts";

const LanguageForm = () => {
  const [formData, setFormData] = useState({
    message: "",
    language: "",
  });
  const [output, setOutput] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
    const config = new Configuration({
    apiKey: `${process.env.API_KEY}`,
  });
  const openai = new OpenAIApi(config);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsModalOpen(true);
    const langName = formData.language;
    const language = dictionary.find(el => el.language === langName);
    const prompt = `
    Translate the following phrase into ${formData.language}: "${formData.message}" \n,based on this dictionary:${JSON.stringify(language?.translation)}. \nOnly include the text of the translation in your output.
    `;
    console.log(prompt)
    try {
      const res = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 1000,
        n: 1,
        stop: null,
      });
      const data = res.data;
      const translation = data.choices[0].text;
      console.log("translation: " + translation);
      setOutput(translation || "");
      setIsCopied(false);
    } catch (err) {
      console.error("Something is wrong while fetching data");
    }
  };
  const handleCopy = (e: React.MouseEvent): void => {
    e.preventDefault();
    if (output) {
      setIsCopied(true);
      navigator.clipboard.writeText(output);
    }
    setTimeout(() => {
      setIsCopied(false);
    }, 2000)
  };

  return (
    <>
      <div className="appContainer">
        <form onSubmit={handleSubmit}>
          <img src={art} alt="aboriginal art" id="art" />
          <h2>Emergency Warning Translator</h2>
          <div className="inputContainer">
            <label htmlFor="language">Select a language</label>
            <select
              id="language"
              value={formData.language}
              onChange={handleInputChange}
              name="language"
              required
            >
              <option value="">Select</option>
              <option value="Australian Aboriginal Noongar">Australian Aboriginal Noongar</option>
              <option value="Australian Aboriginal Kriol">Australian Aboriginal Kriol</option>
              <option value="Australian Aboriginal Bunuba">Australian Aboriginal Bunuba</option>
              <option value="Australian Aboriginal Walmajarri">Australian Aboriginal Walmajarri</option>
              {/* Add more language options here */}
            </select>
          </div>
          <div className="inputContainer">
            <label htmlFor="message">Enter Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
            <button className="submitBtn" type="submit">
              Translate
            </button>
          </div>
        </form>
      </div>
      {isModalOpen ? (
        <div className="modalContainer">
          <div className="outputWrapper modal">
            <button className="closeBtn" onClick={() => setIsModalOpen(false)}>X</button>
            <h1>{output}</h1>
            <button className="copyBtn" onClick={handleCopy}>
              <span>{isCopied ? "Copied!" : "Copy to clipboard"}</span>
            </button>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default LanguageForm;
