import express from 'express';
import { Request, Response } from 'express';

const router = express.Router();

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    // Here you would typically integrate with an actual LLM service
    // For now, we'll return a mock response
    const response = {
      response: `I received your message: "${message}". This is a mock response. In a real implementation, this would be connected to an LLM service.`
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 