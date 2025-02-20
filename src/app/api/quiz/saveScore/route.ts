import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User'; // User model

export async function POST(req: Request) {
    try {
      const { email, score } = await req.json();
  
      if (!email || score === undefined) {
        return NextResponse.json({ error: 'Email and score are required' }, { status: 400 });
      }
  
      // Connect to the database (using your connectToDatabase function)
      await connectDB();
  
      let user = await User.findOne({ email });
  
      if (!user) {
        user = new User({ email, score });
        await user.save();
        return NextResponse.json({ message: 'User created and score saved', user }, { status: 201 });
      }
  
      // If the user exists, update their score
      user.score = score;
  
      await user.save();
      return NextResponse.json({ message: 'Score saved successfully', user }, { status: 200 });
  
    }catch (error: unknown) {  
        if (error instanceof Error) {
          if (error.name === 'ValidationError') {
            console.error('Validation error:', error);
            return NextResponse.json({ error: 'Validation error: ' + error.message }, { status: 400 });
          }
          console.error('Error saving user:', error);
          return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
        }
      
        // If error is not an instance of Error
        console.error('Unknown error:', error);
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
      }
      
  }