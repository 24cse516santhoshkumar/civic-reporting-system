import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
    async analyzeImage(imageUrl: string): Promise<{ valid: boolean; category: string; confidence: number }> {
        // Mock AI Analysis
        // In real world: Call Python Microservice or TensorFlow.js model
        console.log(`[AI SERVICE] Analyzing image: ${imageUrl}`);

        // Simulate processing delay
        await new Promise(r => setTimeout(r, 500));

        // Randomize result for demo
        const isPothole = Math.random() > 0.3;

        return {
            valid: true,
            category: isPothole ? 'Pothole' : 'Garbage',
            confidence: 0.85 + (Math.random() * 0.1), // 0.85 - 0.95
        };
    }
}
