import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private generativeAI: GoogleGenerativeAI;

  constructor() {
    this.generativeAI = new GoogleGenerativeAI(
      'AIzaSyD3sr9dj9MhXRI7QaklXF34PRam3g73oTA'
    );
  }

  async generateText(prompt: string){
    const model = this.generativeAI.getGenerativeModel({model: 'gemini-pro'});

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
  }
}
