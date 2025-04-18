import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private generativeAI: GoogleGenerativeAI;

  constructor() {
    this.generativeAI = new GoogleGenerativeAI(
      environment.geminiApiKey
    );
  }

  generateText(prompt: string): Observable<string> {
    return from(this.generateTextAsync(prompt));
  }

  private async generateTextAsync(prompt: string): Promise<string> {
    const model = this.generativeAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      // model: 'gemini-1.5-flash',
      //Change model as there a times GBV requests fail
    });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();
    return text;
  }
}
